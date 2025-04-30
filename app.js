require('dotenv').config({path: `${process.cwd()}/.env`});

const express = require('express');
const catchAsync = require('./utils/catchAsync');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const router = require('./route/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/easetro', router);
app.use(
    '*', 
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on port', PORT);
});