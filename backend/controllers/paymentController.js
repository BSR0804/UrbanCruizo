const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay placeholder - keys are picked up from env inside methods


// @desc    Create Razorpay Order
// @route   POST /api/v1/payment/razorpay/order
const createOrder = asyncHandler(async (req, res) => {
    const { amount, vehicleId } = req.body;

    // Log for debugging
    console.log(`[Payment] Order Request: amount=${amount}, vehicleId=${vehicleId} (type: ${typeof vehicleId}, length: ${String(vehicleId).length})`);

    if (!amount) {
        res.status(400);
        throw new Error('Amount is required to create a payment order');
    }

    // --- SANDBOX MODE FOR MOCK VEHICLES ---
    // If the ID is a mock ID (e.g. "1") or NOT a valid MongoDB ObjectID, we simulate success.
    const isMockId = !vehicleId || String(vehicleId).length < 10 || !mongoose.Types.ObjectId.isValid(vehicleId);

    if (isMockId) {
        console.log(`[Sandbox] Simulating SUCCESS for ID: ${vehicleId}`);
        return res.status(200).json({
            id: `order_mock_${Date.now()}`,
            amount: Math.round(Number(amount) * 100),
            currency: 'INR',
            status: 'created',
            mock: true
        });
    }

    const key_id = String(process.env.RAZORPAY_KEY_ID || '').trim();
    const key_secret = String(process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!key_id || !key_id.startsWith('rzp_test_')) {
        console.error('CRITICAL: Razorpay keys missing or invalid in production environment.');
        return res.status(500).json({
            message: 'Razorpay keys not configured correctly on server',
            tip: 'Check Render Dashboard for RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET',
            debug: { keyIdUsed: key_id.substring(0, 10) + '...' }
        });
    }

    const instance = new Razorpay({
        key_id,
        key_secret,
    });

    const options = {
        amount: Math.round(Number(amount) * 100), // paise
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
            debug: {
                receivedVehicleId: vehicleId,
                sandboxTriggered: false,
                keyIdUsed: key_id.substring(0, 10) + '...'
            }
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
