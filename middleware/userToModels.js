const User = require('../model/user');

module.exports = async function (req, res, next) {
  if (!req.session.isAuthenticated) {
    return next();
  }
  req.userID = await User.findById(req.session.userID._id);

  next();
};
