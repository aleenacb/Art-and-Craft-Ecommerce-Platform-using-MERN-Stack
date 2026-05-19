const Order = require('../models/order_model');
const Cart  = require('../models/cart_model');
const mongoose = require('mongoose');
// POST /order/PlaceOrder
const placeOrder = async (req, res) => {
  try {
    const { userId, cartItems, deliveryAddress, totalAmount } = req.body;
    if (!userId || !cartItems?.length || !deliveryAddress)
      return res.status(400).json({ message: 'userId, cartItems and deliveryAddress are required' });
    const order = new Order({ userId, cartItems, deliveryAddress, totalAmount });
    await order.save();
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /order/MyOrders/:userId
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /order/TrackOrder/:orderId
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // ✅ validate before hitting DB
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /order/getAllOrders  ← NEW (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')           // pulls user name & email
      .populate('cartItems.productId', 'pname name title')   // pulls product name
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /order/updateStatus/:orderId  ← NEW (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const valid = ['Pending','Confirmed','Shipped','Out for Delivery','Delivered','Cancelled'];
    if (!valid.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const messages = {
      Confirmed:         'Order confirmed by seller',
      Shipped:           'Order picked up by courier',
      'Out for Delivery':'Out for delivery — arriving today',
      Delivered:         'Package delivered successfully',
      Cancelled:         'Order cancelled',
    };

    const now = new Date();
    const eta = status === 'Shipped' ? new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)  // +3 days
              : status === 'Out for Delivery' ? new Date(now.setHours(21, 0, 0, 0))        // today 9 PM
              : undefined;

    const update = {
      status,
      ...(eta && { estimatedDelivery: eta }),
      $push: {
        trackingUpdates: {
          message: messages[status] || status,
          location: location || '',
          timestamp: new Date(),
        }
      }
    };

    const updated = await Order.findByIdAndUpdate(req.params.orderId, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Status updated', order: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, trackOrder, getAllOrders, updateOrderStatus };