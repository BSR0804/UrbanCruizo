const asyncHandler = require('express-async-handler');
const CarRequest = require('../models/CarRequest');

// @desc    Create a new car request
// @route   POST /api/dealers/dashboard/car-requests
// @access  Public
const createCarRequest = asyncHandler(async (req, res) => {
    const { name, email, phone, city, vehicleType, requirements } = req.body;

    const carRequest = await CarRequest.create({
        user: req.user ? req.user._id : null,
        name,
        email,
        phone,
        city,
        vehicleType,
        requirements
    });

    if (carRequest) {
        res.status(201).json(carRequest);
    } else {
        res.status(400);
        throw new Error('Invalid request data');
    }
});

// @desc    Get all car requests for a city (for dealers)
// @route   GET /api/dealers/dashboard/car-requests
// @access  Private/Dealer
const getCarRequests = asyncHandler(async (req, res) => {
    // Dealers see requests for their city or all if not restricted
    // For now, let's show all requests so they can pick leads from anywhere or based on their city
    const city = req.user.city;

    // If dealer has a city, prioritize those, otherwise show all
    const requests = await CarRequest.find({
        $or: [
            { city: { $regex: city || '', $options: 'i' } },
            {} // Fallback to all if needed, but usually filtered
        ]
    }).sort({ createdAt: -1 });

    res.json(requests);
});

module.exports = {
    createCarRequest,
    getCarRequests
};
