const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, trackOrder, getAllOrders, updateOrderStatus } = require('../controller/order_controller');

router.post('/PlaceOrder',                placeOrder);
router.get('/MyOrders/:userId',           getMyOrders);
router.get('/TrackOrder/:orderId',        trackOrder);
router.get('/getAllOrders',               getAllOrders);        // ← NEW
router.put('/updateStatus/:orderId',      updateOrderStatus);  // ← NEW

module.exports = router;