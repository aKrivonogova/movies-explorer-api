const router = require('express').Router();
const { getCurrentUser, updateUserInfo } = require('../controllers/users')
const { updateUserInfoValidation } = require('../middlewares/validation')
//  получить информацию о текущем пользователе
router.get('/users/me', getCurrentUser);
//  обновить информацию о пользователе
router.patch('/users/me', updateUserInfoValidation, updateUserInfo);

module.exports = router;