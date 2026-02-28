const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/v1/payment/razorpay/order
const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500);
        throw new Error(error.message || 'Error creating Razorpay order');
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payment/razorpay/verify
const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid signature, payment verification failed');
    }
});

module.exports = {
    createOrder,
    verifyPayment
};
