const { supplier, Sequelize } = require("../db/models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createSupplier = catchAsync(async (req, res, next) => {
    const body = req.body;
    const sellerId = req.user.id;
    const checkExistingSupplier = await supplier.findOne({
        where: {
            sellerId,
            supplierName: {
                [Sequelize.Op.iLike]: body.supplierName
            }
        }
    });

    if(checkExistingSupplier) {
        return next(new AppError('Supplier name already exists', 400));
    }

    const newSupplier = await supplier.create({
        sellerId,
        supplierName: body.supplierName,
        pic: body.pic,
        phoneNumber: body.phoneNumber
    });

    if(!newSupplier) {
        return next(new AppError('Failed to create new supplier', 400));
    }

    return res.status(201).json({
        status: 'success',
        message: 'Supplier has been created successfully',
        data: newSupplier
    });
});

const editSupplier = catchAsync(async (req, res, next) => {
    const body = req.body;
    const { id } = req.params;
    const sellerId = req.user.id;
    const result = await supplier.findOne({where: {id, sellerId}});

    if(!result) {
        return next(new AppError('Supplier not found', 404));
    }

    result.pic = body.pic;
    result.phoneNumber = body.phoneNumber;

    const editedResult = await result.save();

    return res.json({
        status: 'success',
        message: 'Supplier has been updated successfully',
        data: editedResult
    });
});

const searchSupplierByName = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const { supplierName } = req.query;
    const result = await supplier.findAll({
        where: {
            sellerId,
            supplierName: {[Sequelize.Op.iLike]: `%${supplierName}%`}
        }
    });

    if(!result) {
        return next(new AppError('Supplier not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Supplier data fetch successfully',
        data: result
    });
});

const getAllSuppliers = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const result = await supplier.findAll({
        where: {sellerId},
        order: [['supplier_name','ASC']]
    });

    return res.json({
        status: 'success',
        message: 'Supplier data fetch successfully',
        data: result
    });
});

const getSupplierById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const result = await supplier.findOne({where: {id, sellerId}});

    if(!result) {
        return next(new AppError('Supplier not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Supplier data fetch successfully',
        data: result
    });
});

const getSupplierByName = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;
    const { supplierName } = req.query;
    const result = await supplier.findOne({
        where: {
            sellerId,
            supplierName
        }
    });

    if(!result) {
        return next(new AppError('Supplier not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Supplier data fetch successfully',
        data: result
    });
});

const deleteSupplierById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const result = await supplier.findOne({where: {id, sellerId}});

    if(!result) {
        return next(new AppError('Supplier not found', 404));
    }

    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Supplier deleted successfully'
    });
});

module.exports = { createSupplier, editSupplier, searchSupplierByName, getAllSuppliers, getSupplierById, getSupplierByName, deleteSupplierById };