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

    if (!amount) {
        res.status(400);
        throw new Error('Amount is required to create a payment order');
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('CRITICAL: Razorpay keys missing from environment.');
        res.status(500).json({
            message: 'Razorpay keys not configured on server',
            tip: 'Check Render/Backend environment variables for RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET'
        });
        return;
    }

    const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Razorpay API Error:', error);
        res.status(500).json({
            message: 'Error creating Razorpay order',
            details: error.description || error.message || 'Check your Razorpay credentials'
        });
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
