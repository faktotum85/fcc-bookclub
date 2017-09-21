var express = require('express');
var router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');


router.get('/', catchErrors(bookController.allBooks));

router.get('/user/:userId', catchErrors(bookController.userBooks));

router.get('/trade',
  authController.isLoggedIn,
  catchErrors(bookController.trade)
);

router.get('/request/:bookId',
  authController.isLoggedIn,
  catchErrors(bookController.requestTrade)
);

router.get('/register', userController.registerForm);
router.post('/register',
  catchErrors(userController.validateRegistration),
  catchErrors(userController.register),
  authController.login
);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/account',
  authController.isLoggedIn,
  userController.account
);
router.post('/account',
  authController.isLoggedIn,
  catchErrors(userController.updateAccount)
);

router.get('/add',
  authController.isLoggedIn,
  bookController.addBookForm);

router.post('/add',
  authController.isLoggedIn,
  catchErrors(bookController.addBook));

router.get('/cancel/:bookId/:requestId',
  catchErrors(bookController.cancelRequest)
);

router.get('/approve/:bookId/:requestId',
  catchErrors(bookController.approveRequest)
);

router.get('/reject/:bookId/:requestId',
  catchErrors(bookController.rejectRequest)
);

module.exports = router;
