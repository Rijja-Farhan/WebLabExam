const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  borrowedBooks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Book',
    default: [],
    validate: {
      validator: function (value) {
        if (this.membershipType === 'premium' && value.length > 10) {
          return false;
        } else if (this.membershipType === 'standard' && value.length > 5) {
          return false;
        }
        return true;
      },
      message: function (props) {
        return `A ${this.membershipType} member can only borrow up to ${this.membershipType === 'premium' ? 10 : 5} books at a time.`;
      }
    }
  },
  membershipActive: {
    type: Boolean,
    required: true,
    default: true
  },
  membershipType: {
    type: String,
    required: true,
    enum: ['standard', 'premium'],
    default: 'standard'
  }
});

const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
