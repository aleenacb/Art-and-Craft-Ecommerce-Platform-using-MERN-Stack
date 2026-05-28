const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');

const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require('../controller/cart_controller');  // ✅ make sure this path is correct

router.get('/GetCart/:userId',              auth, getCart);
router.post('/AddToCart',                   auth, addToCart);
router.put('/UpdateQuantity',               auth, updateQuantity);
router.delete('/Remove/:userId/:productId', auth, removeFromCart);
router.delete('/ClearCart/:userId',         auth, clearCart);

module.exports = router;