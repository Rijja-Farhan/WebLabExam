const express = require('express');
const mongoose = require('mongoose');
const BookRouter = require('./routers/BookRouter')
const AuthorRouter = require('./routers/AuthorRouter');
const BorrowerRouter = require('./routers/BorrowRouter');


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Library API!');
});


app.use('/Book',BookRouter)
app.use('/Author', AuthorRouter);

app.use('/Borrower', BorrowerRouter);








// Start the server
app.listen(3001, () => {
  console.log(`Server is running on http://localhost:3001`);
});

module.exports = app;
