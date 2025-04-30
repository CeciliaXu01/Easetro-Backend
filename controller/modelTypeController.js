const { modelType, Sequelize } = require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createModelType = catchAsync(async (req, res, next) => {
    const body = req.body;
    const checkExistingModelType = await modelType.findOne({
        where: {
            modelTypeName: {
                [Sequelize.Op.iLike]: body.modelTypeName
            }
        }
    });

    if(checkExistingModelType) {
        return next(new AppError('Model/type already exists', 400));
    }

    const newModelType = await modelType.create({
        modelTypeName: body.modelTypeName
    });

    if(!newModelType) {
        return next(new AppError('Failed to create new product model/type', 400));
    }

    return res.status(201).json({
        status: 'success',
        message: 'Product model/type has been created successfully',
        data: newModelType
    });
});

const getAllModelType = catchAsync(async (req, res, next) => {
    const result = await modelType.findAll({order: [['model_type_name', 'ASC']]});

    if(!result) {
        return next(new AppError('No product model/type has been created', 404));
    }

    return res.json({
        status: 'success',
        message: 'Product model/type data fetch successfully',
        data: result
    });
});

const getModelTypeName = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await modelType.findOne({where: {id}});

    if(!result) {
        return next(new AppError('Product model/type not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Product model/type fetch successfully',
        data: result
    });
});

const deleteModelTypeById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await modelType.findByPk(id);

    if(!result) {
        return next(new AppError('Model/type not found', 404));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Product model/type deleted successfully'
    });
});

module.exports = { createModelType, getAllModelType, getModelTypeName, deleteModelTypeById };