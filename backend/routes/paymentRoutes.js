const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/razorpay/order', protect, createOrder);
router.post('/razorpay/verify', protect, verifyPayment);

module.exports = router;
