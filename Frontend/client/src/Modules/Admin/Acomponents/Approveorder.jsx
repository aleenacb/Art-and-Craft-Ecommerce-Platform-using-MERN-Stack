import * as React from 'react';
import { useState } from 'react';
import {
  Box, Typography, Paper, Stack, Button, Chip, Divider, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Avatar, IconButton, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NoteIcon from '@mui/icons-material/Note';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  Pending:   { color: '#EF9F27', bg: '#FFF8EC' },
  Confirmed: { color: '#378ADD', bg: '#EAF3FB' },
  Shipped:   { color: '#9B59B6', bg: '#F5EEF8' },
  Delivered: { color: '#1D9E75', bg: '#E8F8F2' },
  Cancelled: { color: '#E53935', bg: '#FEECEC' },
  Booked:    { color: '#D4714E', bg: '#FAECE7' },
};

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" alignItems="flex-start" gap={1.5} py={1.2}
    sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', '&:last-child': { borderBottom: 'none' } }}>
    <Box sx={{ color: '#D4714E', mt: 0.2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 10 }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>
    </Box>
  </Stack>
);

export default function ApproveOrder() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const order     = state?.order || {};

  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState('');
  const [error, setError]               = useState('');
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [shipDialog, setShipDialog]     = useState(false);
  const [trackingNo, setTrackingNo]     = useState('');
  const [currentStatus, setCurrentStatus] = useState(order.status || 'Pending');

  const sc = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Pending;

  const callAPI = async (payload, successMsg) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.put(`http://localhost:7000/order/updateOrder/${order._id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(successMsg);
      setCurrentStatus(payload.status);
    } catch {
      setSuccess(successMsg); // remove this line when API is ready; just for demo
      setCurrentStatus(payload.status);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => callAPI({ status: 'Confirmed' }, 'Order approved and confirmed successfully!');

  const handleShip = async () => {
    await callAPI({ status: 'Shipped', trackingNumber: trackingNo }, 'Order marked as shipped!');
    setShipDialog(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { setError('Please provide a reason for rejection.'); return; }
    await callAPI({ status: 'Cancelled', cancelReason: rejectReason }, 'Order rejected and cancelled.');
    setRejectDialog(false);
    setRejectReason('');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" gap={1.5} mb={3}>
        <IconButton onClick={() => navigate('/Admin/ManageOrder')} sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary" sx={{ fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
            Approve / Reject Order
          </Typography>
          <Typography variant="caption" color="text.secondary">Order #{order._id?.slice(-6).toUpperCase() || 'XXXXXX'}</Typography>
        </Box>
      </Stack>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
        {/* ── Left: Order details ── */}
        <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Georgia, serif' }}>Order Details</Typography>
            <Chip label={currentStatus} size="small"
              sx={{ background: sc.bg, color: sc.color, fontWeight: 700, border: `1px solid ${sc.color}30` }} />
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <InfoRow icon={<ReceiptLongIcon fontSize="small" />} label="Order ID"       value={`#${order._id?.slice(-6).toUpperCase()}`} />
          <InfoRow icon={<PersonIcon fontSize="small" />}      label="Customer"       value={order.customerName} />
          <InfoRow icon={<ReceiptLongIcon fontSize="small" />} label="Product"        value={order.product} />
          <InfoRow icon={<ReceiptLongIcon fontSize="small" />} label="Quantity"       value={order.quantity} />
          <InfoRow icon={<ReceiptLongIcon fontSize="small" />} label="Amount"         value={`₹${order.price?.toLocaleString()}`} />
          <InfoRow icon={<ReceiptLongIcon fontSize="small" />} label="Payment Method" value={order.paymentMethod} />
          <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Booking Date"  value={order.bookingDate} />
          <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Delivery Date" value={order.deliveryDate} />
          <InfoRow icon={<NoteIcon fontSize="small" />}        label="Notes"          value={order.notes} />
        </Paper>

        {/* ── Right: Action panel ── */}
        <Paper elevation={0} sx={{ width: { xs: '100%', md: 300 }, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: 3, alignSelf: 'flex-start' }}>
          <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontFamily: 'Georgia, serif' }}>Take Action</Typography>
          <Typography variant="caption" color="text.secondary" mb={3} display="block">
            Current status: <strong>{currentStatus}</strong>
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* ── Approve → Confirm ── */}
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight={700} mb={1} sx={{ color: '#1D9E75' }}>✓ Approve Order</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              Confirm the order and notify the customer.
            </Typography>
            <Button fullWidth variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
              disabled={loading || currentStatus === 'Confirmed' || currentStatus === 'Shipped' || currentStatus === 'Delivered' || currentStatus === 'Cancelled'}
              onClick={handleApprove}
              sx={{ borderRadius: 2, background: '#1D9E75', '&:hover': { background: '#178a63' }, fontWeight: 600 }}>
              Confirm Order
            </Button>
          </Box>

          {/* ── Ship ── */}
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight={700} mb={1} sx={{ color: '#9B59B6' }}>📦 Ship Order</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              Mark order as shipped with tracking info.
            </Typography>
            <Button fullWidth variant="contained" startIcon={<LocalShippingIcon />}
              disabled={currentStatus !== 'Confirmed'}
              onClick={() => setShipDialog(true)}
              sx={{ borderRadius: 2, background: '#9B59B6', '&:hover': { background: '#8e44ad' }, fontWeight: 600 }}>
              Confirm & Ship
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* ── Reject ── */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1} sx={{ color: '#E53935' }}>✕ Reject Order</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
              Cancel the order and inform the customer with a reason.
            </Typography>
            <Button fullWidth variant="outlined" startIcon={<CancelIcon />}
              disabled={currentStatus === 'Delivered' || currentStatus === 'Cancelled'}
              onClick={() => setRejectDialog(true)}
              sx={{ borderRadius: 2, borderColor: '#E53935', color: '#E53935', fontWeight: 600, '&:hover': { background: '#FEECEC', borderColor: '#E53935' } }}>
              Reject & Cancel
            </Button>
          </Box>
        </Paper>
      </Stack>

      {/* ── Ship Dialog ── */}
      <Dialog open={shipDialog} onClose={() => setShipDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}>Confirm & Ship Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Add a tracking number before marking as shipped (optional).
          </Typography>
          <TextField fullWidth label="Tracking Number (optional)" value={trackingNo}
            onChange={e => setTrackingNo(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShipDialog(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleShip} disabled={loading}
            sx={{ borderRadius: 2, background: '#9B59B6', '&:hover': { background: '#8e44ad' } }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Ship Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#E53935' }}>Reject & Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please provide a reason. This will be sent to the customer.
          </Typography>
          <TextField fullWidth multiline rows={3} label="Cancellation Reason *" value={rejectReason}
            onChange={e => { setRejectReason(e.target.value); setError(''); }}
            error={!!error} helperText={error}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setRejectDialog(false); setRejectReason(''); setError(''); }} sx={{ borderRadius: 2 }}>Back</Button>
          <Button variant="contained" onClick={handleReject} disabled={loading}
            sx={{ borderRadius: 2, background: '#E53935', '&:hover': { background: '#c62828' } }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
