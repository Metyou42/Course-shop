const { Router } = require('express');
const { registerValidator, loginValidator, resetPasswordValidator } = require('../utils/validator');
const AuthControllers = require('../controllers/authControllers');

const router = Router();

router.get('/login', AuthControllers.getLoginPage);

router.get('/register', AuthControllers.getRegisterPage);

router.post('/login', loginValidator, AuthControllers.postLoginUser);

router.post('/register', registerValidator, AuthControllers.postRegisterUser);

router.get('/logOut', AuthControllers.logout);

router.get('/resetpassword', AuthControllers.getResetPasswordPage);

router.post('/resetpassword', AuthControllers.postResetPassword);

router.get('/resetpassword/:token', AuthControllers.getResetPasswordTokenValide);

router.post('/resetpassword/:token', resetPasswordValidator, AuthControllers.postResetPasswordTokenValide);

module.exports = router;
