import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Divider, Button, TextField,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Snackbar, Alert, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import axios from 'axios';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:7000/cart/GetCart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data.cartItems || [];
      // Debug: log first item to verify productId exists
      if (items.length > 0) console.log('Cart item sample:', items[0]);
      setCart(items);
    } catch (err) {
      console.error('fetchCart error:', err.response?.data || err.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    if (!productId) return console.error('updateQuantity: productId is undefined');
    try {
      await axios.put('http://localhost:7000/cart/UpdateQuantity',
        { userId, productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error('updateQuantity error:', err.response?.data || err.message);
      setSnack({ open: true, msg: 'Failed to update quantity.', severity: 'error' });
    }
  };

  const removeItem = async (productId) => {
    if (!productId) return console.error('removeItem: productId is undefined');
    try {
      await axios.delete(`http://localhost:7000/cart/Remove/${userId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error('removeItem error:', err.response?.data || err.message);
      setSnack({ open: true, msg: 'Failed to remove item.', severity: 'error' });
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setSnack({ open: true, msg: 'Please enter a delivery address.', severity: 'warning' });
      return;
    }
    setPlacing(true);
    try {
      await axios.post('http://localhost:7000/order/PlaceOrder',
        { userId, cartItems: cart, deliveryAddress: address, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderPlaced(true);
      setSnack({ open: true, msg: 'Order placed successfully! 🎉', severity: 'success' });
      setCart([]);
    } catch (err) {
      console.error('placeOrder error:', err.response?.data || err.message);
      setSnack({ open: true, msg: 'Failed to place order. Try again.', severity: 'error' });
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, textAlign: 'center' }}>
        <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
          <Typography fontSize={60}>🎉</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary" mt={1}>Order Placed!</Typography>
          <Typography color="text.secondary" mt={1}>
            Thank you for your purchase. You can track your order status.
          </Typography>
          <Button variant="contained" sx={{ mt: 3, borderRadius: 2 }}>
            Order Placed
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={1}>My Cart</Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : cart.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>
            Your cart is empty. Browse categories to add items!
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 'bold', color: '#D4714E' } }}>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => {
                    // item._id = MongoDB subdocument id (always exists)
                    // item.productId = the product reference we added to schema
                    const itemKey = item._id || item.productId || Math.random();
                    const pid = item.productId;

                    return (
                      <TableRow key={itemKey} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img
                              src={item.image
                                ? `http://localhost:7000/uploads/${item.image}`
                                : '/images/placeholder.jpg'}
                              alt={item.name}
                              style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                            />
                            <Box>
                              <Typography fontWeight={600}>{item.name}</Typography>
                              {item.category && <Chip label={item.category} size="small" />}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => updateQuantity(pid, item.quantity - 1)}>
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton size="small" onClick={() => updateQuantity(pid, item.quantity + 1)}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton color="error" size="small" onClick={() => removeItem(pid)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Delivery Address</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter your full delivery address (Street, City, State, PIN)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Total Amount:</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                ₹{totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingBagIcon />}
              onClick={handlePlaceOrder}
              disabled={placing}
              sx={{ borderRadius: 2, py: 1.4 }}
            >
              {placing ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
