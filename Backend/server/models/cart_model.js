<<<<<<< HEAD
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }, // ← ADD THIS
      name:      { type: String, required: true },
      price:     { type: Number, required: true },
      image:     { type: String },
      category:  { type: String },
      quantity:  { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

=======
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }, // ← ADD THIS
      name:      { type: String, required: true },
      price:     { type: Number, required: true },
      image:     { type: String },
      category:  { type: String },
      quantity:  { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = mongoose.model('cart', cartSchema);