const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../model/user');
const keys = require('../keys');
const registrationEmailSend_config = require('../emails/registration');
const resetpassword = require('../emails/resetpassword');

class AuthService {
    static transporter = nodemailer.createTransport(sendgrid({ auth: { api_key: keys.SENDGRID_API_KEY } }));

    async postLoginUserService(body, session, errors) {
        if (!errors.isEmpty()) {
            console.log(errors.array()[0].msg);
            return { error: errors.array()[0].msg };
        }

        const { email, password } = body;
        const userID = await User.findOne({ email });

        if (userID) {
            const validatePassword = await bcrypt.compare(password, userID.password);

            if (validatePassword) {
                session.userID = { _id: userID._id, name: userID.name };
                session.isAuthenticated = true;

                await session.save(err => {
                    if (err) throw err;
                });
            } else {
                return { error: 'incorect' };
            }
        } else {
            return { error: 'incorect' };
        }
    }

    async postRegisterUserService(body, errors) {
        const { email, name, password } = body;
        const candidate = await User.findOne({ email });

        if (!errors.isEmpty()) {
            console.log(errors.array()[0].msg);
            return { error: errors.array() };
        } else if (candidate) {
            return { error: 'email has' };
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, name, password: hashPassword, card: { items: [] } });

        await user.save();
        await AuthService.transporter.sendMail(registrationEmailSend_config(email));
    }

    async logoutService(session) {
        await session.destroy();
    }

    async postResetPasswordService(email) {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return { error: 'error' };
            }

            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email });

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;

                await candidate.save();
                await AuthService.transporter.sendMail(resetpassword(candidate.email, token));
            } else {
                return { error: 'email invalid' };
            }
        });
    }

    async getResetPasswordTokenValideService(resetToken) {
        const candidate = await User.findOne({ resetToken });

        if (!candidate && candidate.resetTokenExp.valueOf() < Date.now().valueOf()) {
            return { error: true };
        }
    }

    async postResetPasswordTokenValideService(resetToken, password, errors) {
        if (!errors.isEmpty()) {
            console.log(errors.array()[0].msg);
            return { error: true };
        }

        const candidate = await User.findOne({ resetToken });
        const hashPassword = await bcrypt.hash(password, 10);
        candidate.password = hashPassword;
        await candidate.save();
    }
}

module.exports = new AuthService();
