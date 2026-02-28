const express = require('express');
const router = express.Router();

// Mount individual routes
router.use('/auth', require('./authRoutes'));
router.use('/vehicles', require('./vehicleRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/dealers', require('./dealerRoutes'));
router.use('/caravans', require('./caravanRoutes'));
router.use('/payment', require('./paymentRoutes'));

module.exports = router;
