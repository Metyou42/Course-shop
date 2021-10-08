const keys = require('../keys');

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Востоновление аккаунта',
    html: `
                <h1>Ссылка для востановления пароля</h1>
                <p><b>Пожалуйста не сообщайте никому данную сылку</b></p>
                <p>Данная ссылка дествует 1 час, после она будет не активна</p>
                <hr/>
                <h3><a href='${keys.BASE_URL}auth/resetpassword/${token}'>Ссылка для востановления</a></h3>
            `,
  };
};
