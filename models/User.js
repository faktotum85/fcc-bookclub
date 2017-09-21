const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: 'Invalid email address'
    },
    required: 'Please provide an email address'
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  fullName: String,
  city: String,
  state: String
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

const User = mongoose.model('User', userSchema);
module.exports = User;
