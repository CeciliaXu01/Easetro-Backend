const express = require('express');
const router = express.Router();

const authRouter = require('./authenticationRoute');
const brandRouter = require('./brandRoute');
const categoryRouter = require('./categoryRoute');
const modelTypeRouter = require('./modelTypeRoute');
const supplierRouter = require('./supplierRoute');
const productRouter = require('./productRoute');
const productSupplierRouter = require('./productSupplierRoute');
const transactionRouter = require('./transactionRoute');
const userRouter = require('./userRoute');

router.use('/auth', authRouter);
router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/modelType', modelTypeRouter);
router.use('/supplier', supplierRouter);
router.use('/product', productRouter);
router.use('/productStock', productSupplierRouter);
router.use('/transaction', transactionRouter);
router.use('/user', userRouter);

module.exports = router;