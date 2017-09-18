var express = require('express');
var router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegistration,
  catchErrors(userController.register),
  authController.login
);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
