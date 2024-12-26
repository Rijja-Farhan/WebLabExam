// routes/borrowerRoutes.js
const express = require('express');
const {
  createBorrower,
  getAllBorrowers,
  getBorrowerById,
  updateBorrower,
  deleteBorrower,
  returnBook,
} = require('../controllers/BorrowerController');

const router = express.Router();

// Create a new borrower
router.post('/', createBorrower);

// Get all borrowers
router.get('/', getAllBorrowers);

// Get a borrower by ID
router.get('/:id', getBorrowerById);

// Update a borrower
router.put('/:id', updateBorrower);

// Delete a borrower
router.delete('/:id', deleteBorrower);

// Return a borrowed book
router.post('/return', returnBook);

module.exports = router;
