const { restrictTo } = require('../controller/authenticationController');
const { createCategory, getAllCategories, deleteCategoryById, getCategoryName } = require('../controller/categoryController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(authentication, createCategory);
router.route('/').get(authentication, getAllCategories);
router.route('/:id')
    .get(authentication, getCategoryName)
    .delete(authentication, restrictTo('admin'), deleteCategoryById);

module.exports = router;