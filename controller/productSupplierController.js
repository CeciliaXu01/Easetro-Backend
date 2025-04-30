const { Model } = require("sequelize");
const { product, productSupplier, supplier, Sequelize } = require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const addProductStock = catchAsync(async (req, res, next) => {
    const body = req.body;
    const sellerId = req.user.id;
    const productAvail = await product.findByPk(body.productId);
    if(!productAvail) {
        return next(new AppError('Product not found', 404));
    }

    const supplierProductAvail = await supplier.findOne(
        {
            where: {supplierName: body.supplierName},
            attributes: ['id']
        }
    );

    if(!supplierProductAvail) {
        return next(new AppError('Supplier not found', 404));
    }

    const supplierData = supplierProductAvail.toJSON();

    const newStock = await productSupplier.create({
        sellerId,
        productId: body.productId,
        supplierId: supplierData.id,
        capitalCost: body.capitalCost,
        stock: body.stock
    });

    if(!newStock) {
        return next(new AppError('Failed to create new product stock', 400));
    }

    return res.status(201).json({
        status: 'success',
        message: 'Stock has been added successfully',
        data: newStock
    });
});

const getProductSupplierById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const dataAvailable = await product.findOne({where: {id, sellerId}});

    if(!dataAvailable) {
        return next(new AppError('Product not found', 404));
    }

    const result = await productSupplier.findAll({
        where: {
            productId: id,
            sellerId,
            stock: { [Sequelize.Op.ne]: '0' }
        },
        include: [{
            model: supplier,
            attributes: ['supplier_name']
        }]
    });

    if(!result) {
        return next(new AppError('Stock not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Stock data fetch successfully',
        data: result
    });
});

const getTotalStock = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const totalStock = await productSupplier.sum('stock', {
        where: { sellerId }
    });

    return res.json({ 
        status: 'success',
        message: 'Product stock total fetch successfully',
        data: totalStock ?? 0
    });
});

module.exports = { addProductStock, getProductSupplierById, getTotalStock };