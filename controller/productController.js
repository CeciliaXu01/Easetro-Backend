const { brand, category, modelType, product, productSupplier, Sequelize } = require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const uploadImageToCloudinary = require("../utils/cloudinaryUpload");
const { calculateProductSellingPriceRangeNStock } = require("../utils/util");

const createProduct = catchAsync(async (req, res, next) => {
    const body = req.body;
    const sellerId = req.user.id;
    let imageUrl = null;
    const productName = await product.findOne({
        where: {
            sellerId,
            productName: {
                [Sequelize.Op.iLike]: body.productName
            }
        }
    });
    const productCategory = await category.findOne({
        where: {
            categoryName: {
                [Sequelize.Op.iLike]: body.categoryName
            }
        }
    });
    const productBrand = await brand.findOne({
        where: {
            brandName: {
                [Sequelize.Op.iLike]: body.brandName
            }
        }
    });
    const productModelType = await modelType.findOne({
        where: {
            modelTypeName: {
                [Sequelize.Op.iLike]: body.modelTypeName
            }
        }
    });

    if(req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer);
        imageUrl = uploaded.secure_url;
    }
    if(productName) {
        return next(new AppError('Product name already exists', 409));
    }
    if(!productCategory) {
        return next(new AppError('Category not found', 404));
    }
    if(!productBrand) {
        return next(new AppError('Brand not found', 404));
    }
    if(!productModelType) {
        return next(new AppError('Model/type not found', 404));
    }

    const productExist = await product.findOne({
        where: {
            sellerId,
            productCategoryId: productCategory.id,
            brandId: productBrand.id,
            modelTypeId: productModelType.id
        }
    });

    if(productExist) {
        return next(new AppError('A product with the same category, brand, and model/type already exists', 409));
    }

    const productExists = await product.findOne({
        where: {
            sellerId,
            productName: body.productName,
            productCategoryId: productCategory.id,
            brandId: productBrand.id,
            modelTypeId: productModelType.id
        }
    });

    if(productExists) {
        return next(new AppError('A product with the same name, category, brand, and model/type already exists', 409));
    }

    const newProduct = await product.create({
        sellerId,
        productImage: imageUrl,
        productName: body.productName,
        productCategoryId: productCategory.id,
        brandId: productBrand.id,
        modelTypeId: productModelType.id,
        minProfit: body.minProfit,
        maxProfit: body.maxProfit,
        specification: body.specification,
        description: body.description
    });

    if(!newProduct) {
        return next(new AppError('Failed to create new product', 400));
    }
    
    return res.status(201).json({
        status: 'success',
        message: 'Product has been created successfully',
        data: newProduct
    });
});

const editProduct = catchAsync(async (req, res, next) => {
    const body = req.body;
    const { id } = req.params;
    const sellerId = req.user.id;
    const result = await product.findOne({where: {id, sellerId}});

    if(!result) {
        return next(new AppError('Product not found', 404));
    }

    if(req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer);
        result.productImage = uploaded.secure_url;
    }

    result.minProfit = body.minProfit;
    result.maxProfit = body.maxProfit;
    result.specification = body.specification;
    result.description = body.description;

    const editedResult = await result.save();

    return res.json({
        status: 'success',
        message: 'Product has been updated successfully',
        data: editedResult
    });
});

const searchProductByName = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const { productName } = req.query;
    const products = await product.findAll({
        where: {
            sellerId, 
            productName: {[Sequelize.Op.iLike]: `%${productName}%`}
        }, 
        order: [['product_name', 'ASC']],
        include: [
            {
                model: productSupplier,
                as: 'stocks',
                attributes: [
                    'stock',
                    'capital_cost'
                ]
            }
        ]
    });

    const result = products.map(product => {
        const plainProduct = product.toJSON();
        return calculateProductSellingPriceRangeNStock(product, plainProduct);
    });

    return res.json({
        status: 'success',
        message: 'Product found',
        data: result
    });
});

const getAllProducts = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const products = await product.findAll({
        where: {sellerId},
        order: [['product_name', 'ASC']],
        include: [
            {
                model: productSupplier,
                as: 'stocks',
                attributes: [
                    'stock',
                    'capital_cost'
                ]
            }
        ]
    });

    const result = products.map(product => {
        const plainProduct = product.toJSON();
        return calculateProductSellingPriceRangeNStock(product, plainProduct);
    });

    return res.json({
        status: 'success',
        message: 'Product data fetch successfully',
        data: result
    });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const dataAvailable = await product.findOne({
        where: {
            id,
            sellerId
        },
        order: [['product_name', 'ASC']],
        include: [
            {
                model: productSupplier,
                as: 'stocks',
                attributes: [
                    'stock',
                    'capital_cost'
                ]
            }
        ]
    });

    if(!dataAvailable) {
        return next(new AppError('Product not found', 404));
    }

    const plainProduct = dataAvailable.toJSON();
    const result = calculateProductSellingPriceRangeNStock(dataAvailable, plainProduct);
    
    return res.json({
        status: 'success',
        message: 'Product data fetch successfully',
        data: result
    });
});

const getProductByName = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const { productName } = req.query;
    const dataAvailable = await product.findOne({
        where: {
            sellerId,
            productName
        },
        order: [['product_name', 'ASC']],
        include: [
            {
                model: productSupplier,
                as: 'stocks',
                attributes: [
                    'stock',
                    'capital_cost'
                ]
            }
        ]
    });

    if(!dataAvailable) {
        return next(new AppError('Product not found', 404));
    }

    const plainProduct = dataAvailable.toJSON();
    const result = calculateProductSellingPriceRangeNStock(dataAvailable, plainProduct);
    
    return res.json({
        status: 'success',
        message: 'Product data fetch successfully',
        data: result
    });
});


const getProductByModel = catchAsync(async (req, res, next) => {
    const { modelTypeName } = req.query;
    const sellerId = req.user.id;
    const modelAvailable = await modelType.findOne({where: {modelTypeName}});

    if(!modelAvailable) {
        return next(new AppError('No product match the model/type', 404));
    }

    const result = await product.findOne({
        where: {
            sellerId,
            modelTypeId: modelAvailable.id
        }
    });

    if(!result) {
        return next(new AppError('Product not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Product data fetch successfully',
        data: result
    });
});

const deleteProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const result = await product.findOne({where: {id, sellerId}});

    if(!result) {
        return next(new AppError('Product not found', 404));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Product deleted successfully'
    });
});

module.exports = { createProduct, editProduct, searchProductByName, getAllProducts, getProductById, getProductByName, getProductByModel, deleteProductById };