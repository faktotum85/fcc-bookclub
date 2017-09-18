const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureFlash: 'Login Failed!',
  failureRedirect: '/login',
  successFlash: 'You are now logged in!',
  successRedirect: '/'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('info', 'You are now logged out');
  res.redirect('/');
};
