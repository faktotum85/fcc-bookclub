const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register',
    body: req.body
  });
};

exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'Log in'
  });
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    username: req.body.username
  });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.validateRegistration = (req, res, next) => {
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    return res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
  }
  next();
}
