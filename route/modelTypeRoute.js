const { restrictTo } = require('../controller/authenticationController');
const { createModelType, getAllModelType, deleteModelTypeById, getModelTypeName } = require('../controller/modelTypeController');
const { authentication } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(authentication, createModelType);
router.route('/').get(authentication, getAllModelType);
router.route('/:id')
    .get(authentication, getModelTypeName)
    .delete(authentication, restrictTo('admin'), deleteModelTypeById);

module.exports = router;