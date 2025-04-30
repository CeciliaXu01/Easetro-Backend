const { restrictTo } = require('../controller/authenticationController');
const { getAllUser, getUserData, editUser, deleteUser, changePassword, deleteUserById } = require('../controller/userController');
const { authentication } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.route('/get').get(authentication, restrictTo('admin'), getAllUser);
router.route('/edit').patch(authentication, upload.single('image'),editUser);
router.route('/:id').delete(authentication, restrictTo('admin'), deleteUserById);
router.route('/')
    .get(authentication, getUserData)
    .patch(authentication, changePassword)
    .delete(authentication, deleteUser);

module.exports = router;