const Author = require('../models/Author');
 

// Create a new author
const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).send(author);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Get all authors
const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    res.send(authors);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Get an author by ID
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate('books');
    if (!author) {
      return res.status(404).send({ error: 'Author not found' });
    }
    res.send(author);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Update an author
const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('books');
    if (!author) {
      return res.status(404).send({ error: 'Author not found' });
    }
    res.send(author);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Delete an author
const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).send({ error: 'Author not found' });
    }
    res.send({ message: 'Author deleted successfully', author });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


const getAuthorsExceedingLimit = async (req, res) => {


    console.log("in limit")
    try {
      // Step 1: Fetch all authors
      const authors = await Author.find();
  
      // Step 2: Filter authors with more than 5 books
      const authorsExceedingLimit = authors.filter(author => author.books.length > 5);
  
      // Step 3: Return the list of authors with more than 5 books
      res.status(200).send(authorsExceedingLimit);
    } catch (err) {
      console.error("Error: ", err);
      res.status(400).send({ error: err.message });
    }
  };
  
  
  

module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getAuthorsExceedingLimit
};
