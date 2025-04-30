const { restrictTo } = require('../controller/authenticationController');
const { createTransaction, getAllTransactions, getTransactionById, editTransaction, getBestCategory, getTotalSales, getTotalProfit, getSalesPerMonth, getNewestTransaction, getSoldProductQty, deleteTransactionById, simulateSellingRangePrice } = require('../controller/transactionController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(authentication, createTransaction);
router.route('/edit/:id').patch(authentication, editTransaction);
router.route('/').get(authentication, getAllTransactions);
router.route('/selling-range').post(authentication, simulateSellingRangePrice);
router.route('/total-sold-qty/:id').get(authentication, getSoldProductQty);
router.route('/newest').get(authentication, getNewestTransaction);
router.route('/top-category').get(authentication, getBestCategory);
router.route('/total-sales').get(authentication, getTotalSales);
router.route('/total-profit').get(authentication, getTotalProfit);
router.route('/monthly-sales').get(authentication, getSalesPerMonth);
router.route('/:id')
    .get(authentication, getTransactionById)
    .delete(authentication, restrictTo('admin'), deleteTransactionById);

module.exports = router;