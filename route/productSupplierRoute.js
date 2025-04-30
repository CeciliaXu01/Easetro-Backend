const { addProductStock, getTotalStock, getProductSupplierById } = require('../controller/productSupplierController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/add').post(authentication, addProductStock);
router.route('/supplier-stock/:id').get(authentication, getProductSupplierById);
router.route('/total-stock').get(authentication, getTotalStock)

module.exports = router;