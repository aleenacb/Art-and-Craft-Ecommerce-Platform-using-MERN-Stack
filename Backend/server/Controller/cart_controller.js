const Cart = require('../models/cart_model');

// GET /cart/GetCart/:userId
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(200).json({ cartItems: [] });
    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /cart/AddToCart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, name, price, image, category, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingIndex = cart.items.findIndex(
      item => item.productId?.toString() === productId.toString()
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ productId, name, price, image, category, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Added to cart', cart });
  } catch (err) {
    console.error('addToCart error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /cart/UpdateQuantity
const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const index = cart.items.findIndex(
      i => i.productId?.toString() === productId.toString()
    );
    if (index === -1) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items[index].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (error) {
    console.error('updateQuantity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /cart/Remove/:userId/:productId
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      i => i.productId?.toString() !== productId.toString()
    );
    await cart.save();
    res.status(200).json({ message: 'Item removed', cart });
  } catch (error) {
    console.error('removeFromCart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /cart/ClearCart/:userId
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };
