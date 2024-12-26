# WebLabExam
Library Management System
A Library Management System built with Node.js, Express, and MongoDB. It handles book borrowing, returning, and borrower management with membership-based borrowing limits.

Key Features
Borrower Management:
Create and update borrowers with standard (5 books) or premium (10 books) membership.
Borrow Books:
Borrow books with limits based on membership type; available copies decrease when a book is borrowed.
Return Books:
Return borrowed books and update the available copies of books.
Limit Enforcement:
Automatic borrowing limit checks based on membership type (standard or premium).
Author Management:
Create, update, and delete authors in the library system.
Authors can be linked to multiple books.
Ensures books are correctly associated with their respective authors.
Book Management:
Create, update, and delete books in the library catalog.
Each book is linked to an author and can be borrowed by borrowers.
Book Borrowing Limits:
Books have a limit for how many times they can be borrowed.
Updates the availableCopies and borrowCount when books are borrowed or returned.
following are the apis to test:
http://localhost:3001/Author/
http://localhost:3001/Author/:id
http://localhost:3001/Author/:id
http://localhost:3001/Book/:id
http://localhost:3001/Book/
http://localhost:3001/Book/:id
http://localhost:3001/Borrower/
http://localhost:3001/Borrower/:id
http://localhost:3001/Author/Limit
http://localhost:3001/Borrower/return
