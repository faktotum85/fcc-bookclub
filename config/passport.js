const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy()); //convenience method from passport-local-mongoose

passport.serializeUser(User.serializeUser()); //convenience method from passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); //convenience method from passport-local-mongoose
