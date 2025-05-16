const { category, product, productSupplier, transaction, transactionItem, supplier, Sequelize } = require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const simulateSellingRangePrice = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const body = req.body;
    const productItem = await product.findOne({
        where: {
            id: body.productId,
            sellerId
        }
    });

    if(!productItem) {
        return next(new AppError('Product not found', 404));
    }

    const stocks = await productSupplier.findAll({
        where: {
            sellerId,
            productId: body.productId
        },
        order: [['capital_cost', 'ASC']]
    });

    let qtyToSell = body.quantity;
    const result = [];

    for(const stock of stocks) {
        if(qtyToSell <= 0) break;

        const suppliers = await supplier.findOne({
            where: {
                id: stock.supplierId
            }
        });

        const minPrice = parseFloat(stock.capitalCost) + parseFloat(productItem.minProfit);
        const maxPrice = parseFloat(stock.capitalCost) + parseFloat(productItem.maxProfit);
        const useQty = Math.min(stock.stock, qtyToSell);

        if(useQty > 0) {
            result.push({
                productId: body.productId,
                supplierName: suppliers.supplierName,
                quantity: useQty,
                minPrice,
                maxPrice
            });
            qtyToSell -= useQty;
        }
    }

    if(qtyToSell > 0) {
        return next(new AppError(`Insufficient stock, ${qtyToSell} unit shortage`));
    }

    return res.json({
        status: 'success',
        message: 'Selling price range fetch successfully',
        data: result
    });
});

const createTransaction = catchAsync(async (req, res, next) => {
    const { salesDate, buyerName, buyerPhoneNumber, buyerAddress, paymentMethod, transactionStatus, items } = req.body;
    const userId = req.user.id;

    let totalPrice = 0;
    let totalProfit = 0;
    const transactionItems = [];
    let warnings = [];

    for(const item of items) {
        const { productId, quantitySold, unitPrice } = item;
        const productItem = await product.findOne(
            {
                where: {       
                    id: productId,
                    sellerId: userId
                }
            }
        );

        if(!productItem) {
            return next(new AppError('Product not found', 404));
        }

        const stocks = await productSupplier.findAll({
            where: { 
                productId,
                sellerId: userId,
                stock: { [Sequelize.Op.ne]: '0' }
            },
            order: [['capital_cost', 'ASC']]
        });

        if(stocks.length === 0) {
            return next(new AppError('Product not in stock', 400));
        }

        if(quantitySold <= 0) {
            return next(new AppError('Product quantity cannot be zero. Please enter a valid amount.'));
        } 

        let totalStock = stocks.reduce((acc, item) => acc + item.stock, 0);
        if (quantitySold > totalStock) {
            return next(new AppError('Insufficient stock', 400));
        }

        let remainingQty = quantitySold;

        for(const stock of stocks) {
            if(remainingQty <= 0) break;

            const minPrice = parseFloat(stock.capitalCost) + parseFloat(productItem.minProfit);
            const maxPrice = parseFloat(stock.capitalCost) + parseFloat(productItem.maxProfit);
            
            // //unitPrice > maxPrice (it's okay to gain more profit so no need to check this)
            if(unitPrice < minPrice) {
                if(remainingQty == quantitySold) {
                    return next(new AppError(`The unit price of the product should be within the range Rp.${minPrice} - Rp.${maxPrice}`, 400));
                } else {
                    warnings.push(`The unit price of the product should be within the range Rp.${minPrice} - Rp.${maxPrice}`);
                }
            } 

            else {
                const useQty = Math.min(stock.stock, remainingQty);
                const unitProfit = unitPrice - stock.capitalCost;
                const profitSum = unitProfit * useQty;
                const subtotal = unitPrice * useQty;

                if(useQty > 0) {
                    transactionItems.push({
                        productId,
                        supplierId: stock.supplierId,
                        quantitySold: useQty,
                        unitPrice,
                        subtotal,
                        unitProfit
                    });

                    stock.stock -= useQty;
                    await stock.save();

                    totalPrice += subtotal;
                    totalProfit += profitSum;
                    remainingQty -= useQty;
                }
            }
        }

        if(remainingQty > 0) {
            warnings.push(`The remaining ${remainingQty} stock cannot be sold at this price, it needs a different price`);
        }
    }
    
    if(!['cash', 'e-wallet', 'transfer'].includes(paymentMethod)) {
        throw new AppError('Invalid payment method', 400);
    }
    if(!['canceled', 'completed', 'pending'].includes(transactionStatus)) {
        throw new AppError('Invalid transaction status', 400);
    }

    const lastTransaction = await transaction.findOne({
        where: { userId },
        order: [['invoice', 'DESC']]
    });

    const invoiceNum = lastTransaction ? lastTransaction.invoice + 1 : 1;

    const newTransaction = await transaction.create({
        userId,
        invoice: invoiceNum,
        salesDate,
        buyerName,
        buyerPhoneNumber,
        buyerAddress,
        totalPrice: totalPrice,
        totalProfit: totalProfit,
        paymentMethod,
        transactionStatus
    });

    for(const item of transactionItems) {
        await transactionItem.create({
            ...item,
            transactionId: newTransaction.id
        });
    }

    if(!newTransaction) {
        return next(new AppError('Failed to create new transaction', 400));
    }
    
    return res.status(201).json({
        status: 'success',
        message: 'Successful transaction',
        data: newTransaction,
        notes: warnings.length > 0 ? warnings: null 
    });
});

const editTransaction = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;
    const body = req.body;
    const result = await transaction.findOne({where: {id, userId}});
    
    if(!result) {
        return next(new AppError('Transaction not found', 404));
    }

    const wasCanceled = result.transactionStatus === 'canceled';
    const willBeCanceled = body.transactionStatus === 'canceled';

    if(!wasCanceled && willBeCanceled) {
        const items = await transactionItem.findAll({where: {transactionId: id}});
        for(const item of items) {
            const stock = await productSupplier.findOne({
                where: {
                    productId: item.productId,
                    supplierId: item.supplierId
                } 
            });

            if(stock) {
                stock.stock += item.quantitySold;
                await stock.save();
            }
        }
    }

    result.paymentMethod = body.paymentMethod;
    result.transactionStatus = body.transactionStatus;

    const editedResult = await result.save();

    return res.json({
        status: 'success',
        message: 'Transaction has been updated successfully',
        data: editedResult
    });
});

const getAllTransactions = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await transaction.findAll({ 
        where: {userId},
        include: [
            {
                model: transactionItem,
                as: 'items' ,
                include: [{model: product}]
            }
        ],
        order: [['id', 'DESC']]
    });

    return res.json({
        status: 'success',
        message: 'Transaction data fetch successfully',
        data: result
    });
});

const getNewestTransaction = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const dataAvailable = await transaction.findAll({where: {userId}});

    if(!dataAvailable) {
        return next(new AppError('No transaction has been created', 404));
    }

    const result = await transaction.findOne({ 
        where: {userId},
        include: [
            {
                model: transactionItem,
                as: 'items',
                limit: 1,
                include: [{model: product}],
                order: [['id', 'DESC']]
            }
        ],
        order: [['id', 'DESC']]
    });

    return res.json({
        status: 'success',
        message: 'Newest transaction data fetch successfully',
        data: result
    });
});

const getTransactionById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await transaction.findOne({
        where: {
            id,
            userId
        }, 
        include: [
            {
                model: transactionItem,
                as: 'items',
                include: [
                    {model: product},
                    {
                        model: supplier,
                        attributes: ['supplier_name']
                    }
                ]
            }
        ]
    });

    if(!result) {
        return next(new AppError('Transaction not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        message: 'Transaction data fetch successfully',
        data: result
    });
});

const getSoldProductQty = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const dataAvailable = await product.findOne({
        where: {
            id, 
            sellerId
        }
    });

    if(!dataAvailable) {
        return next(new AppError('Product not found', 404));
    }

    const transactions = await transaction.findAll({
        where: {
            userId: sellerId,
            transactionStatus: { [Sequelize.Op.ne]: 'canceled' }
        },
        attributes: ['id']
    });

    const transactionIds = transactions.map(tx => tx.id);
    const sum = await transactionItem.findAll({
        where: {
            transactionId: transactionIds,
            productId: id
        },
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('quantity_sold')), 'total_sold_qty']
        ]
    });

    const result = sum[0]?.get('total_sold_qty') ?? '0';

    return res.json({
        status: 'success',
        message: 'Sold product fetch successfully',
        data: result
    });
});

const getBestCategory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const transactions = await transaction.findAll({
        where: { 
            userId,
            transactionStatus: { [Sequelize.Op.ne]: 'canceled' }
        },
        attributes: ['id']
    });

    const transactionIds = transactions.map(tx => tx.id);
    const bestCategory = await transactionItem.findAll({
        where: {transactionId: transactionIds},
        include: [{
            model: product,
            attributes: ['id'],
            include: [{
                model: category,
                attributes: ['id', 'category_name']
            }]
        }],
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('quantity_sold')), 'total_sold_qty']
        ],
        group: ['product.id', 'product->category.id','product->category.category_name'],
        order: [[Sequelize.fn('SUM', Sequelize.col('quantity_sold')), 'DESC']],
        limit: 1,
        raw: true
    });
    
    const best = bestCategory[0]?.['product.category.category_name'] || null;

    return res.json({
        status: 'success',
        message: 'Top product category fetch successfully',
        data: best
    });
});

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
const lastDay = new Date(year, month, 0).getDate();
const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;  

const getTotalSales = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const totalSales = await transaction.sum('total_price', {
        where: {
            userId,
            transactionStatus: { [Sequelize.Op.ne]: 'canceled' },
            salesDate: {
                [Sequelize.Op.between]: [startOfMonth, endOfMonth]
            }
        }
    });

    return res.json({
        status: 'success',
        message: 'Total sales for this month fetch successfully',
        data: totalSales
    })
});

const getTotalProfit = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const totalProfit = await transaction.sum('total_profit', {
        where: {
            userId,
            transactionStatus: { [Sequelize.Op.ne]: 'canceled' },
            salesDate: {
                [Sequelize.Op.between]: [startOfMonth, endOfMonth]
            }
        }
    });

    return res.json({
        status: 'success',
        message: 'Total profit for this month fetch successfully',
        data: totalProfit
    });
});

const getSalesPerMonth = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const salesPerMonth = await transaction.findAll({
        attributes: [
            [Sequelize.literal('EXTRACT(MONTH FROM "sales_date")'), 'month'],
            [Sequelize.fn('SUM', Sequelize.col('total_price')), 'monthly_sales']
        ],
        where: {
            userId,
            transactionStatus: { [Sequelize.Op.ne]: 'canceled' },
            salesDate: {
                [Sequelize.Op.gte]: new Date(new Date().getFullYear(), 0, 1)
            }
        },
        group: [Sequelize.literal('EXTRACT(MONTH FROM "sales_date")')],
        order: [[Sequelize.literal('EXTRACT(MONTH FROM "sales_date")'), 'ASC']],
        raw: true
    });

    const months = Array.from({length: 12}, (_, i) => ({
        month: i + 1,
        monthly_sales: '0'
    }));

    salesPerMonth.forEach(entry => {
        const idx = months.findIndex(m => m.month === parseInt(entry.month));
        if(idx !== -1) {
            months[idx].monthly_sales = entry.monthly_sales;
        }
    });

    return res.json({
        status: 'success',
        message: 'Sales for this year fetch successfully',
        data: months
    });
});

const deleteTransactionById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await transaction.findOne({
        where: {
            id,
            userId
        }, 
        include: [
            {
                model: transactionItem,
                as: 'items',
                include: [{model: product}]
            }
        ]
    });

    if(!result) {
        return next(new AppError('Transaction not found', 404));
    }

    await result.destroy();

    return res.status(200).json({
        status: 'success',
        message: 'Transaction data delete successfully'
    });
});

module.exports = { simulateSellingRangePrice, createTransaction, editTransaction, getAllTransactions, getNewestTransaction, getTransactionById, getSoldProductQty, getBestCategory, getTotalSales, getTotalProfit, getSalesPerMonth, deleteTransactionById };