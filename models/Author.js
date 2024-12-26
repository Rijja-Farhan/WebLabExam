const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /\S+@\S+\.\S+/
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/
  },
  books: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Book',
    validate: {
      validator: function (value) {
        return value.length <= 5;
      },
      message: 'An author can only be linked to up to 5 books at a time.'
    }
  }
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
