const { validationResult } = require('express-validator/check');
const AuthService = require('../service/authService');

class AuthControllers {
  getLoginPage(req, res) {
    res.render('auth/login', {
      isLoginPage: true,
      title: 'Авторизация',
    });
  }

  getRegisterPage(req, res) {
    res.render('auth/register', {
      isRegisterPage: true,
      title: 'Авторизация',
    });
  }

  getResetPasswordPage(req, res) {
    res.render('auth/resetpassword', {
      title: 'Востановление акаунта',
      invalid: '',
      helper: '',
    });
  }

  async postLoginUser(req, res) {
    try {
      const errors = validationResult(req);

      const validationFail = await AuthService.postLoginUserService(req.body, req.session, errors);

      if (validationFail) {
        return res.status(422).json(validationFail);
      }

      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  }

  async postRegisterUser(req, res) {
    try {
      const errors = validationResult(req);
      const validationFail = await AuthService.postRegisterUserService(req.body, errors);

      if (validationFail) {
        return res.status(422).json(validationFail);
      }

      res.redirect('/auth/login');
    } catch (e) {
      console.log(e);
    }
  }

  async logout(req, res) {
    try {
      await AuthService.logoutService(req.session);
      res.redirect('/auth/login');
    } catch (e) {
      console.log(e);
    }
  }

  async postResetPassword(req, res) {
    try {
      const validationFail = await AuthService.postResetPasswordService(req.body.resetemail);

      if (validationFail) {
        const massage = {
          title: 'Востановление акаунта',
          invalid: ' invalid',
          helper: null,
        };
        if (validationFail.error === 'error') massage.helper = 'Что-то пошло не так попробуйте снова позже';
        if (validationFail.error === 'email invalid') massage.helper = 'Пользователя с таким email нету';

        return res.render('auth/resetpassword', massage);
      }

      res.render('auth/infoPage', {
        title: 'Востановление акаунта',
        text: 'Вам на почту было направленно письмо для востановление пароля. Время действия кода 1 час',
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getResetPasswordTokenValide(req, res) {
    try {
      const resetToken = req.params.token;
      const validationTrue = await AuthService.getResetPasswordTokenValideService(resetToken);

      if (validationTrue) return res.redirect('/*');

      res.render('auth/resetPassPage', {
        title: 'Востановление акаунта',
        token: resetToken,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async postResetPasswordTokenValide(req, res) {
    try {
      const errors = validationResult(req);

      const validationFalse = await AuthService.postResetPasswordTokenValideService(req.params.token, req.body.password, errors);

      if (validationFalse) {
        return res.render('auth/infoPage', {
          title: 'Что-то пошло не так',
          text: 'Что-то пошло не так попробуйте снова позже',
        });
      }

      res.render('auth/infoPage', {
        title: 'Востановление акаунта',
        text: 'Пароль успешно востановлен!',
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AuthControllers();
