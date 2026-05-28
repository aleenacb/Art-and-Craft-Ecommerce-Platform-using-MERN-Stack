import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Tooltip, TextField, InputAdornment,
  Button, Avatar, Stack, Menu, MenuItem, Divider, CircularProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, Grid
} from '@mui/material';
import SearchIcon        from '@mui/icons-material/Search';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import CancelIcon        from '@mui/icons-material/Cancel';
import EditIcon          from '@mui/icons-material/Edit';
import FilterListIcon    from '@mui/icons-material/FilterList';
import MoreVertIcon      from '@mui/icons-material/MoreVert';
import ReceiptLongIcon   from '@mui/icons-material/ReceiptLong';
import VisibilityIcon    from '@mui/icons-material/Visibility';
import RefreshIcon       from '@mui/icons-material/Refresh';
import axios from 'axios';

const STATUS_CONFIG = {
  Pending:   { color: '#EF9F27', bg: '#FFF8EC' },
  Confirmed: { color: '#378ADD', bg: '#EAF3FB' },
  Shipped:   { color: '#9B59B6', bg: '#F5EEF8' },
  Delivered: { color: '#1D9E75', bg: '#E8F8F2' },
  Cancelled: { color: '#E53935', bg: '#FEECEC' },
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

export default function ManageOrder() {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [menuAnchor, setMenuAnchor]     = useState(null);
  const [activeOrder, setActiveOrder]   = useState(null);
  const [selected, setSelected]         = useState(null);
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [statusSelect, setStatusSelect] = useState('');
  const [updating, setUpdating]         = useState(null);
  const [snack, setSnack]               = useState({ open: false, msg: '', severity: 'success' });

  const showSnack = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:7000/order/getAllOrders');
      setOrders(res.data.orders || []);
    } catch {
      showSnack('Failed to fetch orders', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Map DB fields to display fields
  const mapOrder = (o) => ({
    _id:          o._id,
    customerName: o.userId?.name || 'Unknown',
    email:        o.userId?.email || '—',
    product: o.cartItems?.map(i =>
  i.name || i.productId?.pname || i.productId?.name || i.productId?.title || '—'
).join(', ') || '—',
    quantity:     o.cartItems?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0,
    price:        o.totalAmount,
    status:       o.status,
    address:      o.deliveryAddress,
    bookingDate:  new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    cartItems:    o.cartItems,
    raw:          o,
  });

  const mapped = orders.map(mapOrder);

  const filtered = mapped.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.customerName.toLowerCase().includes(q)
      || o._id.toString().toLowerCase().includes(q)
      || o.product.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await // This is what frontend sends:
      axios.put(`http://localhost:7000/order/updateStatus/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
      showSnack(`Status updated to "${status}"`);
    } catch {
      showSnack('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleViewOpen = (order) => {
    setSelected(order);
    setStatusSelect(order.status);
    setDialogOpen(true);
  };

  const handleDialogSave = async () => {
    if (statusSelect !== selected.status) await updateStatus(selected._id, statusSelect);
    setDialogOpen(false);
  };

  const handleMenuOpen  = (e, order) => { setMenuAnchor(e.currentTarget); setActiveOrder(order); };
  const handleMenuClose = () => { setMenuAnchor(null); setActiveOrder(null); };

  const stats = STATUS_OPTIONS.map(s => ({
    label: s, count: mapped.filter(o => o.status === s).length, ...STATUS_CONFIG[s]
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2,
            background: 'linear-gradient(135deg,#D4714E,#EF9F27)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReceiptLongIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary"
              sx={{ fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>Manage Orders</Typography>
            <Typography variant="caption" color="text.secondary">{orders.length} total orders</Typography>
          </Box>
        </Stack>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchOrders}
            sx={{ bgcolor: '#D4714E', color: '#fff', '&:hover': { bgcolor: '#b85535' } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Stat chips */}
      <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
        {stats.map(s => (
          <Box key={s.label}
            onClick={() => setStatusFilter(statusFilter === s.label ? 'All' : s.label)}
            sx={{ px: 2, py: 1, borderRadius: 2,
              background: statusFilter === s.label ? s.bg : 'transparent',
              border: `1.5px solid ${statusFilter === s.label ? s.color : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer', transition: 'all .2s', '&:hover': { background: s.bg } }}>
            <Typography variant="caption" fontWeight={600} sx={{ color: s.color }}>{s.label}</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: s.color, lineHeight: 1 }}>{s.count}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Search & Filter */}
      <Stack direction="row" gap={1.5} mb={2.5}>
        <TextField size="small" placeholder="Search by name, ID or product…"
          value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        <Button variant="outlined" startIcon={<FilterListIcon />}
          onClick={e => setFilterAnchor(e.currentTarget)}
          sx={{ borderRadius: 2, borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary', minWidth: 110 }}>
          {statusFilter === 'All' ? 'Filter' : statusFilter}
        </Button>
        <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
          {['All', ...STATUS_OPTIONS].map(s => (
            <MenuItem key={s} selected={statusFilter === s}
              onClick={() => { setStatusFilter(s); setFilterAnchor(null); }}>{s}</MenuItem>
          ))}
        </Menu>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} elevation={0}
        sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#D4714E' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ReceiptLongIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography color="text.secondary" mt={1}>No orders found</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: 12, color: 'text.secondary',
                letterSpacing: 0.5, textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.02)', py: 1.5 } }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Product(s)</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Delivery Address</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((order, i) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                return (
                  <TableRow key={order._id}
                    sx={{ '&:hover': { background: 'rgba(212,113,78,0.03)' }, transition: 'background .15s' }}>
                    <TableCell>
                      <Typography variant="caption" fontWeight={700}
                        sx={{ color: '#D4714E', fontFamily: 'monospace' }}>
                        #{order._id?.toString().slice(-6).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 12,
                          background: `hsl(${i * 47},55%,55%)` }}>
                          {order.customerName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{order.customerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 180,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.product}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>{order.quantity}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        ₹{Number(order.price || 0).toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">{order.bookingDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary"
                        sx={{ maxWidth: 140, display: 'block',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.address}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={order.status} size="small"
                        sx={{ background: sc.bg, color: sc.color, fontWeight: 700,
                          fontSize: 11, border: `1px solid ${sc.color}30` }} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center" gap={0.5}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewOpen(order)}
                            sx={{ color: '#378ADD' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {order.status === 'Pending' && (
                          <>
                            <Tooltip title="Confirm">
                              <IconButton size="small" disabled={updating === order._id}
                                onClick={() => updateStatus(order._id, 'Confirmed')}
                                sx={{ color: '#1D9E75' }}>
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton size="small" disabled={updating === order._id}
                                onClick={() => updateStatus(order._id, 'Cancelled')}
                                sx={{ color: '#E53935' }}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {order.status === 'Confirmed' && (
                          <Tooltip title="Mark Shipped">
                            <IconButton size="small" disabled={updating === order._id}
                              onClick={() => updateStatus(order._id, 'Shipped')}
                              sx={{ color: '#9B59B6' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {order.status === 'Shipped' && (
                          <Tooltip title="Mark Delivered">
                            <IconButton size="small" disabled={updating === order._id}
                              onClick={() => updateStatus(order._id, 'Delivered')}
                              sx={{ color: '#1D9E75' }}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {updating === order._id &&
                          <CircularProgress size={16} sx={{ color: '#D4714E' }} />}
                        <Tooltip title="More">
                          <IconButton size="small" onClick={e => handleMenuOpen(e, order)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Context menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleViewOpen(activeOrder); handleMenuClose(); }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1, color: '#378ADD' }} /> View Details
        </MenuItem>
        <Divider />
        {STATUS_OPTIONS.map(s => (
          <MenuItem key={s} onClick={() => { updateStatus(activeOrder._id, s); handleMenuClose(); }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%',
              bgcolor: STATUS_CONFIG[s].color, mr: 1.5, flexShrink: 0 }} />
            Set as {s}
          </MenuItem>
        ))}
      </Menu>

      {/* Detail + Status Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ bgcolor: '#fff5f0', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="overline"
            sx={{ color: '#D4714E', fontWeight: 700, letterSpacing: 2, display: 'block' }}>
            Order Details
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Georgia, serif' }}>
            {selected?.customerName}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selected && (
            <Grid container spacing={2}>
              {[
                ['Order ID',   `#${selected._id?.toString().slice(-6).toUpperCase()}`],
                ['Email',      selected.email],
                ['Product(s)', selected.product],
                ['Quantity',   selected.quantity],
                ['Total',      `₹${Number(selected.price || 0).toLocaleString('en-IN')}`],
                ['Date',       selected.bookingDate],
              ].map(([label, val]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="caption" color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: 1,
                      fontWeight: 700, display: 'block', mb: 0.3 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>{val}</Typography>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, display: 'block', mb: 0.3 }}>
                  Delivery Address
                </Typography>
                <Typography variant="body2" fontWeight={500}>{selected.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <FormControl fullWidth size="small">
                  <InputLabel>Update Status</InputLabel>
                  <Select value={statusSelect} label="Update Status"
                    onChange={e => setStatusSelect(e.target.value)}>
                    {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined"
            sx={{ borderRadius: 3, textTransform: 'none',
              borderColor: 'divider', color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleDialogSave} variant="contained"
            sx={{ borderRadius: 3, textTransform: 'none',
              bgcolor: '#D4714E', '&:hover': { bgcolor: '#b85535' } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} variant="filled"
          onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 3 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}