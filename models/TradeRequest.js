const mongoose = require('mongoose');

const tradeRequestSchema = new mongoose.Schema({
  requestBy: {
    type: mongoose.Schema.ObjectId,
    required: 'The request needs to be made by someone',
    ref: 'User'
  },
  requestTo: {
    type: mongoose.Schema.ObjectId,
    required: 'The request needs to be made to someone',
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.ObjectId,
    required: 'The request needs to specify a book',
    ref: 'Book'
  },
  created: {
    type: Date,
    default: Date.now
  },
  approved: {
    type: Boolean,
    default: false
  },
  rejected: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('TradeRequest', tradeRequestSchema);
