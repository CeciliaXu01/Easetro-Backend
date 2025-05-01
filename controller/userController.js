const { user, Sequelize } = require("../db/models");
const bcrypt = require('bcrypt');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const uploadImageToCloudinary = require("../utils/cloudinaryUpload");

const getAllUser = catchAsync(async (req, res, next) => {
    const dataAvailable = await user.findOne({where: {userRole: 'store'}});
    
    if(!dataAvailable) {
        return next(new AppError('There are no users(stores) found', 404));    
    }

    const result = await user.findAll({
        where: {userRole: {[Sequelize.Op.ne]: 'admin'}}, 
        attributes: {exclude: ['password']},
        order: [['id', 'ASC']]
    });

    if(!result) {
        return next(new AppError('Users not found', 404));
    }

    return res.json({
        status: 'success',
        message: 'Users fetch successfully',
        data: result
    });
});

const getUserData = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const result = await user.findByPk(
        id, 
        {attributes: {exclude: ['password']}}
    );

    if(!result) {
        return next(new AppError('User not found', 404));
    }
    
    return res.json({
        status: 'success',
        message: 'User data fetch successfully',
        data: result
    });
});

const editUser = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const body = req.body;
    const result = await user.findByPk(id);

    if(!result) {
        return next(new AppError('User not found', 404));
    }

    if(req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer);
        result.image = uploaded.secure_url;
    }

    result.userName = body.userName;
    result.storeName = body.storeName;
    result.phoneNumber = body.phoneNumber;

    const editedResult = await result.save();
    //convert from sequelize instance to object to manipulate it
    const plainResult = editedResult.get({ plain: true });
    delete plainResult.password;

    return res.json({
        status: 'success',
        message: 'User data updated successfully',
        data: plainResult
    });
});

const changePassword = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const body = req.body;
    const result = await user.findByPk(id);

    if(!result) {
        return next(new AppError('User not found', 404));
    }

    console.log("pasword:", body.currentPassword);
    console.log("compare:", await bcrypt.compare(body.currentPassword, result.password));

    if(!(await bcrypt.compare(body.currentPassword, result.password))) {
        return next(new AppError('Incorrect current password', 400));
    }

    if(body.password === body.currentPassword) {
        return next(new AppError('The new password cannot be the same as the current password', 400));
    }

    result.password = body.password;
    result.confirmPassword = body.confirmPassword;
    result.passwordChangedAt = new Date();
    await result.save();

    return res.json({
        status: 'success',
        message: 'Password changed successfully'
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const result = await user.findByPk(id);

    if(!result) {
        return next(new AppError('User not found', 404));
    }

    //YYYYMMDD
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    await result.update({email: `deleted_${dateStr}_${result.email}`});
    await result.destroy();

    return res.json({
        status: 'success',
        message: 'User account deleted successfully'
    });
});

const deleteUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await user.findByPk(id);

    if(!result) {
        return next(new AppError('User not found', 404));
    }

    //YYYYMMDD
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    await result.update({email: `deleted_${dateStr}_${result.email}`});
    await result.destroy();

    return res.json({
        status: 'success',
        message: 'User account deleted successfully'
    });
});

module.exports = { getAllUser, getUserData, editUser, changePassword, deleteUser, deleteUserById };