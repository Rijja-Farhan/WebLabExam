const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',  // Referring to the Author model
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  availableCopies: {
    type: Number,
    required: true,
    min: [0, 'Available copies cannot be negative.'],
    validate: {
      validator: function (value) {
        if (this.borrowCount > 10 && value > 100) {
          return false;
        }
        return true;
      },
      message: 'Available copies cannot exceed 100 if the book has been borrowed more than 10 times.'
    }
  },
  
  borrowCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
