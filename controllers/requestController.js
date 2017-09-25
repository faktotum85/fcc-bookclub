const mongoose = require('mongoose');
const TradeRequest = mongoose.model('TradeRequest');
const User = mongoose.model('User');
const Book = mongoose.model('Book');

exports.trade = async (req, res) => {
  const requestsToUserPromise = TradeRequest.find({
    requestTo: req.user._id,
    approved: false,
    rejected: false
  }).populate("requestBy requestTo book");
  const requestsByUserPromise = TradeRequest.find({
    requestBy: req.user._id,
    approved: false,
    rejected: false
  }).populate("requestBy requestTo book");
  const finalizedPromise = TradeRequest.find({
    $and: [
      {$or: [
        {requestBy: req.user._id},
        {requestTo: req.user._id}
      ]},
      {$or: [
        {approved: true},
        {rejected: true}
      ]}
    ]
  }).populate("requestBy requestTo book");

  const [requestsToUser, requestsByUser, finalized] =
    await Promise.all([requestsToUserPromise, requestsByUserPromise, finalizedPromise]);

  res.render('trade', {
    title: 'Manage Your Trades',
    requestsToUser,
    requestsByUser,
    finalized
  });
};

exports.requestTrade = async (req, res) => {

  const book = await Book.findById(req.params.bookId);

  const newRequest = new TradeRequest({
    requestBy: req.user._id,
    requestTo: book.owner,
    book: req.params.bookId,
  });

  await newRequest.save();

  req.flash('success', 'Your trade request has been added');
  res.redirect('/trade');
};

exports.cancelRequest = async (req, res) => {

  const request = await TradeRequest.findOneAndRemove({
    _id: req.params.requestId,
    requestBy: req.user._id
  });

  if (!request) {
    req.flash('danger', 'The request was not found or belongs to another user');
    return res.redirect('back');
  }

  req.flash('info', 'Your trade request has been cancelled');
  res.redirect('back');
};

exports.approveRequest = async (req, res) => {
  const request = await TradeRequest.findOneAndUpdate({
    _id: req.params.requestId,
    requestTo: req.user._id
  }, {
    $set: {
      approved: true
    }
  });

  if (!request) {
    req.flash('danger', 'The request was not found or belongs to another user');
    return res.redirect('back');
  }

  req.flash('success', 'You have approved this trade');
  res.redirect('back');
};

exports.rejectRequest = async (req, res) => {
  const request = await TradeRequest.findOneAndUpdate({
    _id: req.params.requestId,
    requestTo: req.user._id
  }, {
    $set: {
      rejected: true
    }
  });

  if (!request) {
    req.flash('danger', 'The request was not found or belongs to another user');
    return res.redirect('back');
  }

  req.flash('success', 'You have rejected this trade');
  res.redirect('back');
};
