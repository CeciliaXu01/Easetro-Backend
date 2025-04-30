const { user } = require("../db/models");
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

const authentication = catchAsync(async (req, res, next) => {
    let idToken = '';
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        idToken = req.headers.authorization.split(' ')[1];
    }
    if(!idToken) {
        return next(new AppError('Please login to get access', 401));
    }

    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    const currentUser = await user.findByPk(tokenDetail.id)

    if(!currentUser) {
        return next(new AppError('User no longer exists', 401));
    }

    if(currentUser.passwordChangedAt && tokenDetail.iat * 1000 < currentUser.passwordChangedAt.getTime()) {
        return next(new AppError('Password recently changed. Please log in again.', 401));
    }

    req.user = currentUser;
    return next();
});

module.exports = { generateToken, authentication };