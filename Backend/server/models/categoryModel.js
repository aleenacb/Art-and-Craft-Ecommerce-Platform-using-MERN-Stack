<<<<<<< HEAD
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

=======
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = mongoose.model('category', categorySchema);