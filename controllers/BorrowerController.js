// controllers/borrowerController.js
const Borrower = require('../models/Borrower');
const Book = require('../models/Book');

// Create a new borrower
const createBorrower = async (req, res) => {
    try {
      const { name, borrowedBooks, membershipType } = req.body;
  
      // Check if the membership type is valid
      const validMembershipTypes = ['standard', 'premium'];
      if (!validMembershipTypes.includes(membershipType)) {
        return res.status(400).send({ error: 'Invalid membership type' });
      }
  
      // Check borrowing limit based on membership type
      const borrowingLimit = membershipType === 'premium' ? 10 : 5;
      if (borrowedBooks.length > borrowingLimit) {
        return res.status(400).send({ error: `A ${membershipType} member can only borrow up to ${borrowingLimit} books at a time.` });
      }
  
      // Check if the books exist and if there are enough available copies
      for (let bookId of borrowedBooks) {
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(400).send({ error: `Book with ID ${bookId} not found.` });
        }
  
        if (book.availableCopies <= 0) {
          return res.status(400).send({ error: `Book with ID ${bookId} is out of stock.` });
        }
      }
  
      // Create the borrower and save it
      const borrower = new Borrower(req.body);
      await borrower.save();
  
      // Update the books after the borrower is created
      for (let bookId of borrowedBooks) {
        const book = await Book.findById(bookId);
  
        // Decrement the available copies and increment the borrow count
        book.availableCopies -= 1;
        book.borrowCount += 1;  // Increment the borrow count
        await book.save();
      }
  
      res.status(201).send(borrower);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };
  

// Get all borrowers
const getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find().populate('borrowedBooks');
    res.send(borrowers);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get a borrower by ID
const getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findById(req.params.id).populate('borrowedBooks');
    if (!borrower) {
      return res.status(404).send({ error: 'Borrower not found' });
    }
    res.send(borrower);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update a borrower
const updateBorrower = async (req, res) => {
    try {
      const { borrowedBooks } = req.body;
  
      // Find the borrower by ID
      const borrower = await Borrower.findById(req.params.id);
      if (!borrower) {
        return res.status(404).send({ error: 'Borrower not found' });
      }
  
      // If borrowedBooks are provided, process them
      if (borrowedBooks) {
        // Check borrowing limit
        const limit = borrower.membershipType === 'premium' ? 10 : 5;
        if (borrowedBooks.length + borrower.borrowedBooks.length > limit) {
          return res.status(400).send({
            error: `A ${borrower.membershipType} member can only borrow up to ${limit} books.`,
          });
        }
  
        // Filter out books that the borrower has already borrowed
        const newBooks = borrowedBooks.filter(bookId => !borrower.borrowedBooks.includes(bookId));
  
        // Process the new books being borrowed
        for (let bookId of newBooks) {
          const book = await Book.findById(bookId);
          if (!book) {
            return res.status(400).send({ error: `Book with ID ${bookId} not found.` });
          }
  
          // Check if there are available copies for the book
          if (book.availableCopies <= 0) {
            return res.status(400).send({ error: `Book with ID ${bookId} is out of stock.` });
          }
  
          // Decrement available copies and increment borrow count
          book.availableCopies -= 1;
          book.borrowCount += 1;
          await book.save();
        }
  
        // Add the new books to the borrower's list of borrowed books
        borrower.borrowedBooks.push(...newBooks);
      }
  
      // Update the borrower details and save
      Object.assign(borrower, req.body);
      await borrower.save();
  
      res.send(borrower);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };
  

// Delete a borrower
const deleteBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByIdAndDelete(req.params.id);
    if (!borrower) {
      return res.status(404).send({ error: 'Borrower not found' });
    }
    res.send({ message: 'Borrower deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Return a borrowed book
const returnBook = async (req, res) => {
    try {
      const { borrowerId, bookId } = req.body;
  
      // Check if borrower exists
      const borrower = await Borrower.findById(borrowerId);
      if (!borrower) {
        return res.status(400).send({ error: 'Borrower not found.' });
      }
  
      // Check if book exists in borrower's borrowedBooks array
      if (!borrower.borrowedBooks.includes(bookId)) {
        return res.status(400).send({ error: 'This book was not borrowed by the borrower.' });
      }
  
      // Find the book
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(400).send({ error: 'Book not found.' });
      }
  
      // Remove the book from the borrower's borrowedBooks array
      borrower.borrowedBooks = borrower.borrowedBooks.filter(id => id.toString() !== bookId.toString());
      await borrower.save();
  
      // Update the availableCopies of the book
      book.availableCopies += 1;
      // Decrease the borrowCount of the book
      book.borrowCount -= 1;
  
      await book.save();
  
      res.status(200).send({ message: 'Book returned successfully.', borrower, book });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };
  

module.exports = {
  createBorrower,
  getAllBorrowers,
  getBorrowerById,
  updateBorrower,
  deleteBorrower,
  returnBook,
};
