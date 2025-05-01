function calculateProductSellingPriceRangeNStock(product, plainProduct) {
    const productStock = plainProduct.stocks.map(stock => stock['stock']);

    //.reduce -> to sum all element inside the array
    //acc as accumulator to hold temporary summary result and the initial value is 0
    const stockTotal = productStock.reduce((acc, pStock) => acc + pStock, 0);

    if (stockTotal === 0) {
        return {
            id: product.id,
            productImage: product.productImage,
            productName: product.productName,
            productCategory: product.productCategoryId,
            brandId: product.brandId,
            modelTypeId: product.modelTypeId,
            minProfit: product.minProfit,
            maxProfit: product.maxProfit,
            specification: product.specification,
            description: product.description,
            stockTotal: 0,
            minSellPrice: 0,
            maxSellPrice: 0,
        };
    }

    const costs = plainProduct.stocks
                .filter(stock => stock.stock != '0')
                .map(stock => parseFloat(stock['capital_cost']));

    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const minSellPrice = minCost + parseFloat(product.minProfit);
    const maxSellPrice = maxCost + parseFloat(product.maxProfit);

    return {
        id: product.id,
        productImage: product.productImage,
        productName: product.productName,
        productCategory: product.productCategoryId,
        brandId: product.brandId,
        modelTypeId: product.modelTypeId,
        minProfit: product.minProfit,
        maxProfit: product.maxProfit,
        specification: product.specification,
        description: product.description,
        stockTotal: stockTotal,
        minSellPrice: minSellPrice,
        maxSellPrice: maxSellPrice,
    };
}

function groupTheSameCapitalCostSupplier(data) {
    const grouped = {};

    data.forEach(item => {
        const key = `${item.supplierId}-${item.capitalCost}`;
        const supplier = item.supplier.toJSON();

        if (!grouped[key]) {
            grouped[key] = { 
                capitalCost: item.capitalCost,
                stock: item.stock,
                supplier
            };
        } else {
            grouped[key].stock += item.stock;
        }
    });

    return Object.values(grouped);
}

module.exports = { calculateProductSellingPriceRangeNStock, groupTheSameCapitalCostSupplier };