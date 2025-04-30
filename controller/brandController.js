const { brand, Sequelize }= require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createBrand = catchAsync(async (req, res, next) => {
    const body = req.body;
    const checkExistingBrand = await brand.findOne({
        where: {
            brandName: {
                [Sequelize.Op.iLike]: body.brandName
            }
        }
    });

    if(checkExistingBrand) {
        return next(new AppError('Brand already exists', 400));
    }

    const newBrand = await brand.create({
        brandName: body.brandName
    });

    if(!newBrand) {
        return next(new AppError('Failed to create new product brand', 400));
    }

    return res.status(201).json({
        status: 'success',
        message: 'Brand has been created successfully',
        data: newBrand
    });
});

const getAllBrands = catchAsync(async (req, res, next) => {
    const result = await brand.findAll({order: [['brand_name', 'ASC']]});
    
    if(!result) {
        return next(new AppError('No brand has been created', 404));
    }

    return res.json({
        status: 'success',
        message: 'Brand data fetch successfully',
        data: result
    });
});

const getBrandName = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await brand.findOne({where: {id}});

    if(!result) {
        return next(new AppError('Brand not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Brand name fetch successfully',
        data: result
    });
});

const deleteBrandById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await brand.findByPk(id);

    if(!result) {
        return next(new AppError('Brand not found', 404));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Brand deleted successfully'
    });
});

module.exports = { createBrand, getAllBrands, getBrandName, deleteBrandById };