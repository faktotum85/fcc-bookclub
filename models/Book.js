const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Please provide a title'
  },
  authors: [String],
  thumbnail: String,
  selfLink: {
    type: String,
    required: 'The book needs to have a reference URL (selfLink)'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  requests: [
    {
      requestor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      approved: {
        type: Boolean,
        default: false
      },
      rejected: {
        type: Boolean,
        default: false
      }
    }
  ]
});

module.exports = mongoose.model('Book', bookSchema);
