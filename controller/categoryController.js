const { category, Sequelize } = require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createCategory = catchAsync(async (req, res, next) => {
    const body = req.body;
    const checkExistingCategory = await category.findOne({
        where: {
            categoryName: {
                [Sequelize.Op.iLike]: body.categoryName
            }
        }
    });

    if(checkExistingCategory) {
        return next(new AppError('Category already exists', 400));
    }

    const newCategory = await category.create({
        categoryName: body.categoryName
    });

    if(!newCategory) {
        return next(new AppError('Failed to create new product category', 400));
    }

    return res.status(201).json({
        status: 'success',
        message: 'Category has been created successfully',
        data: newCategory
    });
});

const getAllCategories = catchAsync(async (req, res, next) => {
    const result = await category.findAll({order: [['category_name', 'ASC']]});

    if(!result) {
        return next(new AppError('No category has been created', 404));
    }

    return res.json({
        status: 'success',
        message: 'Category data fetch successfully',
        data: result
    });
});

const getCategoryName = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await category.findOne({where: {id}});

    if(!result) {
        return next(new AppError('Category not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Category name fetch successfully',
        data: result
    });
});

const deleteCategoryById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await category.findByPk(id);

    if(!result) {
        return next(new AppError('Category not found', 404));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Category deleted successfully'
    });
});

module.exports = { createCategory, getAllCategories, getCategoryName, deleteCategoryById };