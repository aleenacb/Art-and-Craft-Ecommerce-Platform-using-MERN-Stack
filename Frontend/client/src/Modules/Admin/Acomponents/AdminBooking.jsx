import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Tooltip, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Card, CardContent, CircularProgress, Snackbar, Alert,
  Select, MenuItem, FormControl, InputLabel, Tabs, Tab, Avatar, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

const STATUS_CONFIG = {
  Pending:   { color: 'warning', icon: <PendingActionsIcon fontSize="small" /> },
  Approved:  { color: 'success', icon: <ThumbUpAltOutlinedIcon fontSize="small" /> },
  Rejected:  { color: 'error',   icon: <BlockOutlinedIcon fontSize="small" /> },
  Completed: { color: 'info',    icon: <TaskAltIcon fontSize="small" /> },
};

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected', 'Completed'];
const TABS = ['All', ...STATUS_OPTIONS];

export default function AdminBooking() {
  const [bookings, setBookings]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [tabValue, setTabValue]         = useState(0);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(null);
  const [selected, setSelected]         = useState(null);
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [statusSelect, setStatusSelect] = useState('');
  const [snack, setSnack]               = useState({ open: false, msg: '', severity: 'success' });

  const showSnack = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:7000/booking/getAll');
      setBookings(res.data.bdata);
    } catch {
      showSnack('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    let data = [...bookings];
    const activeStatus = TABS[tabValue];
    if (activeStatus !== 'All') data = data.filter(b => b.bookingstatus === activeStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(b =>
        b.fullname?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.productID?.pname?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [bookings, tabValue, search]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(`http://localhost:7000/booking/updateStatus/${id}`, { bookingstatus: status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingstatus: status } : b));
      if (selected?._id === id) setSelected(prev => ({ ...prev, bookingstatus: status }));
      showSnack(`Status updated to "${status}"`);
    } catch {
      showSnack('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleViewOpen = (booking) => {
    setSelected(booking);
    setStatusSelect(booking.bookingstatus);
    setDialogOpen(true);
  };

  const handleDialogUpdate = async () => {
    if (statusSelect !== selected.bookingstatus) await updateStatus(selected._id, statusSelect);
    setDialogOpen(false);
  };

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.bookingstatus === s).length;
    return acc;
  }, {});

  const statCards = [
    { label: 'Total Bookings', value: bookings.length, color: '#D4714E', bg: '#fff5f0' },
    { label: 'Pending',        value: counts.Pending,  color: '#EF9F27', bg: '#fffbf0' },
    { label: 'Approved',       value: counts.Approved, color: '#1D9E75', bg: '#f0fdf8' },
    { label: 'Completed',      value: counts.Completed,color: '#378ADD', bg: '#f0f7ff' },
    { label: 'Rejected',       value: counts.Rejected, color: '#D4537E', bg: '#fff0f4' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#D4714E', fontWeight: 700, letterSpacing: 2 }}>
            Admin Panel
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Georgia, serif' }}>
            Booking <Box component="em" sx={{ color: '#D4714E', fontStyle: 'italic' }}>Management</Box>
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchBookings} sx={{ bgcolor: '#D4714E', color: '#fff', '&:hover': { bgcolor: '#b85535' } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(card => (
          <Grid item xs={6} sm={4} md={2.4} key={card.label}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: card.bg }}>
              <CardContent sx={{ p: '16px !important' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: card.color, fontFamily: 'Georgia, serif' }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs + Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto"
          TabIndicatorProps={{ style: { backgroundColor: '#D4714E' } }}
          sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' }, '& .Mui-selected': { color: '#D4714E !important' } }}>
          {TABS.map((tab, i) => (
            <Tab key={tab} label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                {tab}
                {tab !== 'All' && (
                  <Chip label={counts[tab]} size="small" sx={{
                    height: 18, fontSize: 10, fontWeight: 700,
                    bgcolor: tabValue === i ? '#D4714E' : 'action.selected',
                    color: tabValue === i ? '#fff' : 'text.secondary',
                  }} />
                )}
              </Box>
            } />
          ))}
        </Tabs>
        <TextField size="small" placeholder="Search name, email, product..." value={search}
          onChange={e => setSearch(e.target.value)} sx={{ width: 260 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            sx: { borderRadius: 3 },
          }} />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#D4714E' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BookOnlineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No bookings found</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                {['#', 'Customer', 'Product', 'Qty', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((b, i) => {
                const sc = STATUS_CONFIG[b.bookingstatus] || STATUS_CONFIG.Pending;
                return (
                  <TableRow key={b._id} hover>
                    <TableCell sx={{ color: 'text.disabled', fontWeight: 600, fontSize: 12 }}>{i + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#D4714E', fontSize: 14 }}>
                          {b.fullname?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{b.fullname}</Typography>
                          <Typography variant="caption" color="text.secondary">{b.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" fontWeight={500}>{b.productID?.pname || '—'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={b.quantity} size="small" sx={{ bgcolor: '#fff5f0', color: '#D4714E', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} sx={{ fontFamily: 'Georgia, serif', fontSize: 15 }}>
                        ₹{Number(b.totalamount || 0).toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip icon={sc.icon} label={b.bookingstatus} color={sc.color} size="small" variant="outlined"
                        sx={{ fontWeight: 600, fontSize: 11 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewOpen(b)} sx={{ color: '#378ADD' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {b.bookingstatus === 'Pending' && (<>
                          <Tooltip title="Approve">
                            <IconButton size="small" disabled={updating === b._id}
                              onClick={() => updateStatus(b._id, 'Approved')} sx={{ color: '#1D9E75' }}>
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton size="small" disabled={updating === b._id}
                              onClick={() => updateStatus(b._id, 'Rejected')} sx={{ color: '#D4537E' }}>
                              <CancelOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>)}
                        {b.bookingstatus === 'Approved' && (
                          <Tooltip title="Mark as Completed">
                            <IconButton size="small" disabled={updating === b._id}
                              onClick={() => updateStatus(b._id, 'Completed')} sx={{ color: '#378ADD' }}>
                              <TaskAltIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {updating === b._id && <CircularProgress size={16} sx={{ color: '#D4714E' }} />}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ bgcolor: '#fff5f0', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="overline" sx={{ color: '#D4714E', fontWeight: 700, letterSpacing: 2, display: 'block' }}>
            Booking Details
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'Georgia, serif' }}>
            {selected?.fullname}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selected && (
            <Grid container spacing={2}>
              {[
                ['Email',        selected.email],
                ['Phone',        selected.phone],
                ['Product',      selected.productID?.pname || '—'],
                ['Quantity',     selected.quantity],
                ['Total Amount', `₹${Number(selected.totalamount || 0).toLocaleString('en-IN')}`],
                ['Booking Date', new Date(selected.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
              ].map(([label, val]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="caption" color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, display: 'block', mb: 0.3 }}>
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
                  <Select value={statusSelect} label="Update Status" onChange={e => setStatusSelect(e.target.value)}>
                    {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined"
            sx={{ borderRadius: 3, textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleDialogUpdate} variant="contained"
            sx={{ borderRadius: 3, textTransform: 'none', bgcolor: '#D4714E', '&:hover': { bgcolor: '#b85535' } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}
          sx={{ borderRadius: 3 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}