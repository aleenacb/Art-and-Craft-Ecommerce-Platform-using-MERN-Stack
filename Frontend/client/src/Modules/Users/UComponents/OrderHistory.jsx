import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Chip, Divider, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Collapse, Alert, IconButton, Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusColor = {
  Pending: 'warning', Confirmed: 'info',
  Shipped: 'primary', Delivered: 'success', Cancelled: 'error',
};

function OrderRow({ order }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); 
  const allItems = order.cartItems || [];
  const hasMultiple = allItems.length > 1;
  const totalQty = allItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ fontSize: 12, color: 'text.secondary', fontFamily: 'monospace' }}>
          {order._id?.slice(-8).toUpperCase()}
        </TableCell>
        <TableCell>
          {allItems[0]?.name || '—'}
          {hasMultiple && (
            <Typography variant="caption" color="text.secondary" ml={0.5}>
              +{allItems.length - 1} more
            </Typography>
          )}
        </TableCell>
        <TableCell>{totalQty}</TableCell>
        <TableCell>₹{order.totalAmount?.toLocaleString('en-IN')}</TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleDateString('en-IN')}</TableCell>
        <TableCell>
          <Chip label={order.status} color={statusColor[order.status] || 'default'}
            size="small" sx={{ fontWeight: 600 }} />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* ✅ Track button on every row */}
            <Button size="small" variant="outlined" onClick={() => navigate(`/Users/track/${order._id}`)}>
              Track
            </Button>
            {/* expand only for multi-item orders */}
            {hasMultiple && (
              <IconButton size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </Box>
        </TableCell>
      </TableRow>

      {hasMultiple && (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 0 }}>
            <Collapse in={open}>
              <Box sx={{ py: 1, pl: 4 }}>
                {allItems.map((item, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary">
                    — {item.name} × {item.quantity || 1}
                  </Typography>
                ))}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`http://localhost:7000/order/MyOrders/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={1}>
          Order History
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          All your past and current orders.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : orders.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>
            You haven't placed any orders yet.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold', color: '#D4714E' } }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}