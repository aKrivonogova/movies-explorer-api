const router = require('express').Router();
const { createUser, login } = require('../controllers/users');

const { loginUserValidation, createUserValidation } = require('../middlewares/validation');

router.post('/signin', loginUserValidation, login);
router.post('/signup', createUserValidation, createUser);

module.exports = router;
