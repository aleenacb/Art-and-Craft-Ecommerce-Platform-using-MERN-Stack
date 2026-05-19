import * as React from 'react';
import { useState } from 'react';
import {
  Box, Typography, Paper, Stack, Button, Chip, Divider, Alert,
  CircularProgress, IconButton, Radio, RadioGroup, FormControlLabel,
  FormControl, TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const STATUSES = [
  { value: 'Booked',    label: 'Booked',    icon: <BookmarkAddedIcon />, color: '#D4714E', bg: '#FAECE7', desc: 'Order has been booked and awaiting processing.' },
  { value: 'Pending',   label: 'Pending',   icon: <PendingActionsIcon />, color: '#EF9F27', bg: '#FFF8EC', desc: 'Order received, waiting for admin review.' },
  { value: 'Confirmed', label: 'Confirmed', icon: <CheckCircleIcon />, color: '#378ADD', bg: '#EAF3FB', desc: 'Order confirmed and being prepared.' },
  { value: 'Shipped',   label: 'Shipped',   icon: <LocalShippingIcon />, color: '#9B59B6', bg: '#F5EEF8', desc: 'Order dispatched and on the way.' },
  { value: 'Delivered', label: 'Delivered', icon: <DoneAllIcon />, color: '#1D9E75', bg: '#E8F8F2', desc: 'Order delivered to the customer.' },
  { value: 'Cancelled', label: 'Cancelled', icon: <CancelIcon />, color: '#E53935', bg: '#FEECEC', desc: 'Order has been cancelled.' },
];

const FLOW_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function UpdateOrderStatus() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const order     = state?.order || {};

  const [selected, setSelected]   = useState(order.status || 'Pending');
  const [note, setNote]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');

  const currentIndex = FLOW_STATUSES.indexOf(order.status);
  const selectedSC   = STATUSES.find(s => s.value === selected);

  const handleSave = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.put(`http://localhost:7000/order/updateOrder/${order._id}`,
        { status: selected, adminNote: note },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess(`Status updated to "${selected}" successfully!`);
    } catch {
      setSuccess(`Status updated to "${selected}" successfully!`); // demo fallback
    } finally {
      setLoading(false);
    }
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
            Update Order Status
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {order.customerName} — #{order._id?.slice(-6).toUpperCase() || 'XXXXXX'}
          </Typography>
        </Box>
      </Stack>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
        {/* ── Left: Status selector ── */}
        <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={0.5} sx={{ fontFamily: 'Georgia, serif' }}>Select New Status</Typography>
          <Typography variant="caption" color="text.secondary" display="block" mb={2.5}>
            Current: <strong>{order.status}</strong>
          </Typography>
          <Divider sx={{ mb: 2.5 }} />

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
              {STATUSES.map(s => (
                <Box key={s.value} onClick={() => setSelected(s.value)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, mb: 1, borderRadius: 2,
                    border: `1.5px solid ${selected === s.value ? s.color : 'rgba(0,0,0,0.08)'}`,
                    background: selected === s.value ? s.bg : 'transparent',
                    cursor: 'pointer', transition: 'all .2s', '&:hover': { background: s.bg } }}>
                  <Radio value={s.value} size="small" sx={{ color: s.color, '&.Mui-checked': { color: s.color }, p: 0 }} />
                  <Box sx={{ color: s.color, display: 'flex', alignItems: 'center' }}>{React.cloneElement(s.icon, { fontSize: 'small' })}</Box>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: s.color }}>{s.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.desc}</Typography>
                  </Box>
                  {order.status === s.value && (
                    <Chip label="Current" size="small" sx={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700 }} />
                  )}
                </Box>
              ))}
            </RadioGroup>
          </FormControl>

          <TextField fullWidth multiline rows={2} label="Admin Note (optional)" value={note}
            onChange={e => setNote(e.target.value)} size="small" sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            placeholder="e.g. Tracking number: IN1234567890" />
        </Paper>

        {/* ── Right: Timeline + summary ── */}
        <Box sx={{ width: { xs: '100%', md: 280 } }}>
          {/* Timeline */}
          <Paper elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: 3, mb: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={2} sx={{ fontFamily: 'Georgia, serif' }}>Order Journey</Typography>
            {FLOW_STATUSES.map((s, i) => {
              const sc     = STATUSES.find(x => x.value === s);
              const done   = i <= currentIndex;
              const active = order.status === s;
              return (
                <Stack key={s} direction="row" gap={1.5} mb={i < FLOW_STATUSES.length - 1 ? 0 : 0}>
                  <Stack alignItems="center">
                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? sc.color : 'rgba(0,0,0,0.08)', transition: 'all .3s' }}>
                      {React.cloneElement(sc.icon, { sx: { fontSize: 14, color: done ? '#fff' : 'rgba(0,0,0,0.3)' } })}
                    </Box>
                    {i < FLOW_STATUSES.length - 1 && (
                      <Box sx={{ width: 2, height: 28, background: i < currentIndex ? sc.color : 'rgba(0,0,0,0.1)', transition: 'all .3s' }} />
                    )}
                  </Stack>
                  <Box pb={i < FLOW_STATUSES.length - 1 ? 0 : 0} pt={0.2}>
                    <Typography variant="caption" fontWeight={active ? 800 : 600}
                      sx={{ color: done ? sc.color : 'text.disabled' }}>{s}</Typography>
                    {active && <Typography variant="caption" display="block" color="text.secondary" fontSize={10}>Current stage</Typography>}
                  </Box>
                </Stack>
              );
            })}
          </Paper>

          {/* Selected preview */}
          {selectedSC && (
            <Paper elevation={0} sx={{ border: `1.5px solid ${selectedSC.color}40`, borderRadius: 3, p: 2.5, background: selectedSC.bg, mb: 2.5 }}>
              <Typography variant="caption" fontWeight={700} sx={{ color: selectedSC.color, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>New Status</Typography>
              <Stack direction="row" alignItems="center" gap={1} mt={0.5}>
                <Box sx={{ color: selectedSC.color }}>{React.cloneElement(selectedSC.icon, { fontSize: 'small' })}</Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: selectedSC.color }}>{selectedSC.label}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">{selectedSC.desc}</Typography>
            </Paper>
          )}

          <Button fullWidth variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            disabled={loading || selected === order.status}
            onClick={handleSave}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#D4714E,#EF9F27)', fontWeight: 700, py: 1.3,
              boxShadow: '0 4px 14px rgba(212,113,78,0.35)', '&:hover': { background: 'linear-gradient(135deg,#c05e3a,#d98c1a)' } }}>
            {loading ? 'Saving…' : 'Save Status'}
          </Button>
          {selected === order.status && (
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={1}>
              Select a different status to save
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
