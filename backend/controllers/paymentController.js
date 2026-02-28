const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay placeholder - keys are picked up from env inside methods


// @desc    Create Razorpay Order
// @route   POST /api/v1/payment/razorpay/order
const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        res.status(400);
        throw new Error('Amount is required to create a payment order');
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id === 'rzp_test_your_id') {
        console.error('CRITICAL: Razorpay keys missing or using dummy values.');
        res.status(500).json({
            message: 'Razorpay keys not configured correctly on server',
            tip: 'Check Render/Backend environment variables for RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET'
        });
        return;
    }

    // Diagnostic logging (Safely)
    console.log(`[Diagnostic] Attempting Razorpay order. KeyID starts with: ${String(key_id).substring(0, 8)}...`);
    console.log(`[Diagnostic] KeySecret length: ${String(key_secret).length}. First 3 chars: ${String(key_secret).substring(0, 3)}...`);

    // Initialize Razorpay instance inside or ensure it's updated
    const instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
    });

    const options = {
        amount: Math.round(Number(amount) * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await instance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Razorpay API Error:', error);
        res.status(500).json({
            message: 'Error creating Razorpay order',
            details: error.description || error.message || 'Check your Razorpay credentials',
            error: error // Send full error object for debugging in dev
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
