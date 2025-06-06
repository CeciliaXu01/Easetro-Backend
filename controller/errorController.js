const AppError = require('../utils/appError');

const sendErrorDevelopment = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack
    });
};

const sendErrorProduction = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;

    if(error.isOperational) {
        return res.status(statusCode).json({
            status,
            message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.'
    });
};

const globalErrorHandler = (err, req, res, next) => {
    if(err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token', 401);
    }
    if(err.name === 'SequelizeValidationError') {
        err = new AppError(err.errors[0].message, 400);
    }
    if(err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError(err.errors[0].message, 400);
    }
    if(process.env.NODE_ENV === 'development') {
        return sendErrorDevelopment(err, res);
    }
    sendErrorProduction(err, res);
};

module.exports = globalErrorHandler;