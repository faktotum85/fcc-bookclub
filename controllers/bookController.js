const mongoose = require('mongoose');
const Book = mongoose.model('Book');
const User = mongoose.model('User');


exports.allBooks = async (req, res) => {
  const books = await Book.find().limit(20).populate('owner');
  res.render('bookList', {
    title: 'All books',
    books
  });
};

exports.userBooks = async (req, res) => {
  const booksPromise = Book.find({
    owner: req.params.userId
  }).limit(20);
  const userPromise = User.findById(req.params.userId);
  const [books, user] = await Promise.all([booksPromise, userPromise]);

  res.render('bookList', {
    title: `${user.username}'s bookshelf`,
    books
  });
};

exports.addBookForm = (req, res) => {
  res.render('addBook')
};

exports.addBook = async (req, res) => {
  // Add the book here;
  req.body.owner = req.user._id;
  const book = new Book(req.body);
  await book.save();

  req.flash('success', 'Your book has been added');
  res.json({
    "id": req.user._id
  });
};

exports.trade = async (req, res) => {
  const requestsToYouPromise = Book.aggregate([
    { $unwind: "$requests" },
    { $match: {
       owner: req.user._id,
       "requests.approved": false,
       "requests.rejected": false
     } }
  ]);
  const requestsByYouPromise = Book.aggregate([
    { $unwind: "$requests" },
    { $match: {
        "requests.requestor": req.user._id,
        "requests.approved": false,
        "requests.rejected": false
    }}
  ]);

  const finalizedPromise = await Book.aggregate([
    { $unwind: "$requests" },
    { $match: {
        $or: [
          {
            "requests.requestor": req.user._id,
            $or: [
              {"requests.approved": true},
              {"requests.rejected": true}
            ]
          },
          {
            owner: req.user._id,
            $or: [
              {"requests.approved": true},
              {"requests.rejected": true}
            ]
          }
        ]
    }}
  ]);

  const finalizedPopulatedPromise = User.populate(finalizedPromise, {path: "owner"});

  const [requestsToYou, requestsByYou, finalized] =
    await Promise.all([requestsToYouPromise, requestsByYouPromise, finalizedPopulatedPromise]);

  res.render('trade', {
    title: 'Manage Your Trades',
    requestsToYou,
    requestsByYou,
    finalized
  });
};

exports.requestTrade = async (req, res) => {
  const book = await Book.findOneAndUpdate({
    _id: req.params.bookId
  }, {
    $push: {
      requests: {
        requestor: req.user._id
      }
    }
  }, {
    new: true
  });
  req.flash('success', 'Your trade request has been added');
  res.redirect('/trade');
};

exports.cancelRequest = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  const request = book.requests.id(req.params.requestId);
  // Check this is the user who actually made that request...
  if (!(req.user && request.requestor.equals(req.user._id))) {
    req.flash('danger', 'You cannot cancel other people\'s requests');
    return res.redirect('/');
  }
  request.remove();
  await book.save();
  req.flash('info', 'Your trade request has been cancelled');
  res.redirect('back');
};

exports.approveRequest = async (req, res) => {
  // TODO: See if there is a way to avoid the series of async requests, same for rejectRequest
  const book = await Book.findById(req.params.bookId);
  // Check if this is the user who owns the book...
  if (!(req.user && book.owner.equals(req.user._id))) {
    req.flash('danger', 'You cannot approve requests for other people\'s books');
    return res.redirect('/');
  }
  await Book.update({
    _id: req.params.bookId,
    "requests._id": req.params.requestId
  }, {
    "$set": {
      "requests.$.approved": true
    }
  });
  req.flash('success', 'You have approved this trade');
  res.redirect('back');
}

exports.rejectRequest = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  // Check if this is the user who owns the book...
  if (!(req.user && book.owner.equals(req.user._id))) {
    req.flash('danger', 'You cannot reject requests for other people\'s books');
    return res.redirect('/');
  }
  await Book.update({
    _id: req.params.bookId,
    "requests._id": req.params.requestId
  }, {
    "$set": {
      "requests.$.rejected": true
    }
  });
  req.flash('info', 'You have rejected this trade');
  res.redirect('back');
}
