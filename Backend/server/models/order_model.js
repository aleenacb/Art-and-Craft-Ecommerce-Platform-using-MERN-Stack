<<<<<<< HEAD
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
  name:      { type: String },
  price:     { type: Number },
  image:     { type: String },
  category:  { type: String },
  quantity:  { type: Number, default: 1 }
});

const trackingUpdateSchema = new mongoose.Schema({
  message:   { type: String, required: true },
  location:  { type: String },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  cartItems:         [orderItemSchema],
  deliveryAddress:   { type: String, required: true },
  totalAmount:       { type: Number, required: true },
  status:            { type: String, default: 'Pending',
                       enum: ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] },
  estimatedDelivery: { type: Date },
  trackingUpdates:   [trackingUpdateSchema],
}, { timestamps: true });

=======
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
  name:      { type: String },
  price:     { type: Number },
  image:     { type: String },
  category:  { type: String },
  quantity:  { type: Number, default: 1 }
});

const trackingUpdateSchema = new mongoose.Schema({
  message:   { type: String, required: true },
  location:  { type: String },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  cartItems:         [orderItemSchema],
  deliveryAddress:   { type: String, required: true },
  totalAmount:       { type: Number, required: true },
  status:            { type: String, default: 'Pending',
                       enum: ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] },
  estimatedDelivery: { type: Date },
  trackingUpdates:   [trackingUpdateSchema],
}, { timestamps: true });

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = mongoose.model('Order', orderSchema);