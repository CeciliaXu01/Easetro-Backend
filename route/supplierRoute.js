const { restrictTo } = require('../controller/authenticationController');
const { createSupplier, getAllSuppliers, getSupplierById, editSupplier, deleteSupplierById, getSupplierByName, searchSupplierByName } = require('../controller/supplierController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(authentication, createSupplier);
router.route('/edit/:id').patch(authentication, editSupplier);
router.route('/').get(authentication, getAllSuppliers);
router.route('/search').get(authentication, searchSupplierByName);
router.route('/get').get(authentication, getSupplierByName);
router
    .route('/:id')
    .get(authentication, getSupplierById)
    .delete(authentication, restrictTo('admin'), deleteSupplierById);

module.exports = router;