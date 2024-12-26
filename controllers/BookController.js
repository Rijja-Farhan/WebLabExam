const Book = require('../models/Book');
const Author = require('../models/Author');
const mongoose = require('mongoose');

// Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, availableCopies, borrowCount } = req.body;
    
    // Convert the author string into an ObjectId using 'new'
    const authorObjectId = new mongoose.Types.ObjectId(author);

    // Check if the author is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(authorObjectId)) {
      return res.status(400).send({ error: 'Invalid author ID.' });
    }

    // Validate that the author exists
    const existingAuthor = await Author.findById(authorObjectId);
    if (!existingAuthor) {
      return res.status(400).send({ error: 'Author not found' });
    }

    // Create and save the book
    const book = new Book({
      title,
      author: authorObjectId,  // Use the ObjectId here
      isbn,
      availableCopies,
      borrowCount
    });

    await book.save();

    // Optionally update the author's books array
    existingAuthor.books.push(book._id);
    await existingAuthor.save();

    res.status(201).send(book);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.send(books);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get a book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.send(book);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update a book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author');
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.send(book);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.send({ message: 'Book deleted successfully', book });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update available copies manually
const updateAvailableCopies = async (req, res) => {
  const { availableCopies } = req.body;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }

    if (book.borrowCount > 10 && availableCopies > 100) {
      return res.status(400).send({
        error: 'Available copies cannot exceed 100 if the book has been borrowed more than 10 times.'
      });
    }

    book.availableCopies = availableCopies;
    await book.save();
    res.send(book);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateAvailableCopies
};
