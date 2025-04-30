const { restrictTo } = require('../controller/authenticationController');
const { createBrand, getAllBrands, deleteBrandById, getBrandName } = require('../controller/brandController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(authentication, createBrand);
router.route('/').get(authentication, getAllBrands);
router.route('/:id')
    .get(authentication, getBrandName)
    .delete(authentication, restrictTo('admin'), deleteBrandById);

module.exports = router;