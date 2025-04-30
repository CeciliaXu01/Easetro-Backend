const { user } = require("../db/models");
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { generateToken } = require("../middleware/authMiddleware");

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if(body.userRole != 'store') {
        throw new AppError('Invalid user role', 400);
    }

    const newUser = await user.create({
        userRole: body.userRole,
        userName: body.userName,
        storeName: body.storeName,
        city: body.city,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        phoneNumber: body.phoneNumber
    });

    if(!newUser) {
        return next(new AppError('Failed to create new user', 400));
    } 

    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id
    });

    return res.status(201).json({
        status: 'success',
        message: 'User has been created successfully',
        data: result
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const result = await user.findOne({where: {email}});

    if(!result || !(await bcrypt.compare(password, result.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = generateToken({
        id: result.id,
    });

    return res.json({
        status: 'success',
        message: 'User logged in successfully',
        token
    });
});

const restrictTo = (...userRole) => {
    const checkPermission = (req, res, next) => {
        if(!userRole.includes(req.user.userRole)) {
            return next(new AppError(`You don't have permission to perform this action`, 403));
        }
        return next();
    };
    
    return checkPermission;
}

module.exports = { signup, login, restrictTo };