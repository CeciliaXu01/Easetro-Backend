const { restrictTo } = require('../controller/authenticationController');
const { createProduct, getAllProducts, getProductById, editProduct, deleteProductById, searchProductByName, getProductByModel, getProductByName } = require('../controller/productController');
const { authentication } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.route('/create').post(authentication, upload.single('productImage'), createProduct);
router.route('/edit/:id').patch(authentication, upload.single('productImage'), editProduct);
router.route('/').get(authentication, getAllProducts);
router.route('/search').get(authentication, searchProductByName);
router.route('/get').get(authentication, getProductByName);
router.route('/scan').get(authentication, getProductByModel);
router
    .route('/:id')
    .get(authentication, getProductById)
    .delete(authentication, restrictTo('admin'), deleteProductById);

module.exports = router;