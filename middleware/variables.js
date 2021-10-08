module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuthenticated ? req.session.isAuthenticated : false;
  res.locals.csrf = req.csrfToken();

  next();
};
