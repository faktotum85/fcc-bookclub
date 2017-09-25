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
