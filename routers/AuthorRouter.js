const express = require('express');

const { 
    createAuthor, 
    getAuthors, 
    getAuthorById, 
    updateAuthor, 
    deleteAuthor,
    getAuthorsExceedingLimit 
  } = require('../controllers/AuthorController');

const router = express.Router();

// Correct route for getting authors exceeding book limit
router.get('/Limit', getAuthorsExceedingLimit);
// Create a new author
router.post('/', createAuthor);

// Get all authors
router.get('/', getAuthors);

// Get an author by ID
router.get('/:id', getAuthorById);

// Update an author
router.put('/:id', updateAuthor);

// Delete an author
router.delete('/:id', deleteAuthor);





module.exports = router;
