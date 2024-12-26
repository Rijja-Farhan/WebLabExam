const express = require('express');

const { 
    createBook, 
    getBooks, 
    getBookById, 
    updateBook, 
    deleteBook, 
     
  } = require('../controllers/BookController');

const router = express.Router();
// Create a new book
router.post('/', createBook);

// Get all books
router.get('/', getBooks);

// Get a book by ID
router.get('/:id', getBookById);

// Update a book
router.put('/:id', updateBook);

// Delete a book
router.delete('/:id', deleteBook);

module.exports = router;
