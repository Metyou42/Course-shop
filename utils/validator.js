const { body } = require('express-validator/check');

// prettier-ignore
exports.registerValidator = [
  body('email', 'email incorect').isEmail().normalizeEmail(),
  body('name', 'name min').isLength({ min: 3, max: 56 }).isAlphanumeric(),
  body('password', 'pass min').isLength({ min: 6, max: 56 }).isAlphanumeric(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password not equel confirm');
    } else {
      return true;
    }
  }),
];

// prettier-ignore
exports.loginValidator = [
  body('email', 'email incorect').isEmail().normalizeEmail(),
  body('password', 'pass min').isLength({ min: 6, max: 56 }).isAlphanumeric(),
];

// prettier-ignore
exports.add_editCourse = [
  body('title', 'title incorect').isLength({ min: 3, max: 128 }).trim(),
  body('price', 'price incorect').isNumeric(),
];

exports.resetPasswordValidator = [
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password not equel confirm');
    } else {
      return true;
    }
  }),
];
