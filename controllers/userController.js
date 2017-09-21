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
  try {
    await register(user, req.body.password);
  } catch(err) {
    req.flash('danger', err.message);
    return res.redirect('back');
  }
  next();
};

exports.validateRegistration = async (req, res, next) => {
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = await req.getValidationResult();
  if (errors.array().length) {
    req.flash('danger', errors.array().map(err => err.msg));
    return res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
  }
  next();
};

exports.account = (req, res) => {
  res.render('account', {
    title: 'Update your account details',
    fullName: req.user.fullName,
    city: req.user.city,
    state: req.user.state
  });
};

exports.updateAccount = async (req, res) => {
  const update = req.body;
  const user = await User.findOneAndUpdate({
    _id: req.user._id
  },{
    $set: update
  },{
    new: true
  });
  req.flash('success', 'Your details have been updated');
  res.redirect('back');
}
