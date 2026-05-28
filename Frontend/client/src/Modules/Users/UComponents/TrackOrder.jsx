<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Paper, Typography, Chip, Divider, CircularProgress, Alert,
  Stepper, Step, StepLabel, StepConnector
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const STEPS = ['Ordered', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusColor = {
  Pending: 'warning', Confirmed: 'info', Shipped: 'primary',
  'Out for Delivery': 'warning', Delivered: 'success', Cancelled: 'error',
};

const ColorConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3,
  },
  '&.Mui-completed .MuiStepConnector-line': { borderColor: '#1D9E75' },
  '&.Mui-active .MuiStepConnector-line':    { borderColor: '#D85A30' },
}));

function StepIcon({ active, completed }) {
  if (completed) return (
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#1D9E75',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
    </Box>
  );
  if (active) return (
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #D85A30',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#D85A30' }} />
    </Box>
  );
  return (
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #e0e0e0',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#e0e0e0' }} />
    </Box>
  );
}

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:7000/order/TrackOrder/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.log(err)
        setError('Could not load tracking info. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  const activeStep = order ? STEPS.indexOf(order.status) : 0;

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {order.cartItems?.[0]?.name || 'Your Order'}
                  {order.cartItems?.length > 1 && (
                    <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                      +{order.cartItems.length - 1} more items
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Chip label={order.status} color={statusColor[order.status] || 'default'}
                size="small" sx={{ fontWeight: 600 }} />
            </Box>

            {/* ETA */}
            {order.estimatedDelivery && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
              <Box sx={{ bgcolor: '#EAF3DE', borderRadius: 2, px: 2, py: 1.5, mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#3B6D11' }}>Estimated delivery</Typography>
                <Typography variant="body1" fontWeight={500} sx={{ color: '#0F6E56' }}>
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                  {' · by '}
                  {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </Typography>
              </Box>
            )}

            {order.status === 'Delivered' && (
              <Box sx={{ bgcolor: '#EAF3DE', borderRadius: 2, px: 2, py: 1.5, mb: 3 }}>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#0F6E56' }}>
                  Delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </Typography>
              </Box>
            )}

            {/* Stepper */}
            {order.status !== 'Cancelled' && (
              <Stepper activeStep={activeStep} connector={<ColorConnector />} sx={{ mb: 3 }}>
                {STEPS.map((label, idx) => (
                  <Step key={label} completed={idx < activeStep}>
                    <StepLabel StepIconComponent={StepIcon}
                      sx={{ '& .MuiStepLabel-label': { fontSize: 11, mt: 0.5 } }}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            <Divider sx={{ mb: 2.5 }} />

            {/* Tracking timeline */}
            {order.trackingUpdates?.length > 0 && (
              <>
                <Typography variant="caption" fontWeight={500} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Package updates
                </Typography>
                <Box sx={{ mt: 1.5, mb: 2.5 }}>
                  {[...order.trackingUpdates].reverse().map((update, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FiberManualRecordIcon sx={{ fontSize: 10, color: '#1D9E75', mt: 0.4 }} />
                        {idx < order.trackingUpdates.length - 1 && (
                          <Box sx={{ width: '1px', flex: 1, bgcolor: '#e0e0e0', mt: 0.5 }} />
                        )}
                      </Box>
                      <Box sx={{ pb: 1 }}>
                        <Typography variant="body2">{update.message}</Typography>
                        {update.location && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <LocationOnIcon sx={{ fontSize: 12 }} />{update.location}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(update.timestamp).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ mb: 2.5 }} />
              </>
            )}

            {/* Delivery address */}
            <Typography variant="caption" fontWeight={500} color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HomeIcon sx={{ fontSize: 14 }} /> Delivery address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.8 }}>
              {order.deliveryAddress}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
=======
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Paper, Typography, Chip, Divider, CircularProgress, Alert,
  Stepper, Step, StepLabel, StepConnector
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const STEPS = ['Ordered', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusColor = {
  Pending: 'warning', Confirmed: 'info', Shipped: 'primary',
  'Out for Delivery': 'warning', Delivered: 'success', Cancelled: 'error',
};

const ColorConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3,
  },
  '&.Mui-completed .MuiStepConnector-line': { borderColor: '#1D9E75' },
  '&.Mui-active .MuiStepConnector-line':    { borderColor: '#D85A30' },
}));

function StepIcon({ active, completed }) {
  if (completed) return (
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#1D9E75',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
    </Box>
  );
  if (active) return (
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #D85A30',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#D85A30' }} />
    </Box>
  );
  return (
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #e0e0e0',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#e0e0e0' }} />
    </Box>
  );
}

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:7000/order/TrackOrder/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.log(err)
        setError('Could not load tracking info. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  const activeStep = order ? STEPS.indexOf(order.status) : 0;

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {order.cartItems?.[0]?.name || 'Your Order'}
                  {order.cartItems?.length > 1 && (
                    <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                      +{order.cartItems.length - 1} more items
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Chip label={order.status} color={statusColor[order.status] || 'default'}
                size="small" sx={{ fontWeight: 600 }} />
            </Box>

            {/* ETA */}
            {order.estimatedDelivery && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
              <Box sx={{ bgcolor: '#EAF3DE', borderRadius: 2, px: 2, py: 1.5, mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#3B6D11' }}>Estimated delivery</Typography>
                <Typography variant="body1" fontWeight={500} sx={{ color: '#0F6E56' }}>
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                  {' · by '}
                  {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </Typography>
              </Box>
            )}

            {order.status === 'Delivered' && (
              <Box sx={{ bgcolor: '#EAF3DE', borderRadius: 2, px: 2, py: 1.5, mb: 3 }}>
                <Typography variant="body2" fontWeight={500} sx={{ color: '#0F6E56' }}>
                  Delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </Typography>
              </Box>
            )}

            {/* Stepper */}
            {order.status !== 'Cancelled' && (
              <Stepper activeStep={activeStep} connector={<ColorConnector />} sx={{ mb: 3 }}>
                {STEPS.map((label, idx) => (
                  <Step key={label} completed={idx < activeStep}>
                    <StepLabel StepIconComponent={StepIcon}
                      sx={{ '& .MuiStepLabel-label': { fontSize: 11, mt: 0.5 } }}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            <Divider sx={{ mb: 2.5 }} />

            {/* Tracking timeline */}
            {order.trackingUpdates?.length > 0 && (
              <>
                <Typography variant="caption" fontWeight={500} color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Package updates
                </Typography>
                <Box sx={{ mt: 1.5, mb: 2.5 }}>
                  {[...order.trackingUpdates].reverse().map((update, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FiberManualRecordIcon sx={{ fontSize: 10, color: '#1D9E75', mt: 0.4 }} />
                        {idx < order.trackingUpdates.length - 1 && (
                          <Box sx={{ width: '1px', flex: 1, bgcolor: '#e0e0e0', mt: 0.5 }} />
                        )}
                      </Box>
                      <Box sx={{ pb: 1 }}>
                        <Typography variant="body2">{update.message}</Typography>
                        {update.location && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <LocationOnIcon sx={{ fontSize: 12 }} />{update.location}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(update.timestamp).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ mb: 2.5 }} />
              </>
            )}

            {/* Delivery address */}
            <Typography variant="caption" fontWeight={500} color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HomeIcon sx={{ fontSize: 14 }} /> Delivery address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.8 }}>
              {order.deliveryAddress}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
}