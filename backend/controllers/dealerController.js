const asyncHandler = require('express-async-handler');
const Dealer = require('../models/Dealer');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// @desc    Get all dealers or filter by city
// @route   GET /api/dealers
// @access  Public
const getDealers = asyncHandler(async (req, res) => {
    const { city } = req.query;
    let query = {};

    if (city && city !== 'All') {
        query.city = city;
    }

    const dealers = await Dealer.find(query);

    const dealersWithCounts = await Promise.all(dealers.map(async (dealer) => {
        const vehicleCount = await Vehicle.countDocuments({ owner: dealer._id });
        return {
            ...dealer._doc,
            vehicleCount
        };
    }));

    res.json(dealersWithCounts);
});

// @desc    Get dealer by ID
// @route   GET /api/dealers/:id
// @access  Public
const getDealerById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Dealer not found (Invalid ID)');
    }
    const dealer = await Dealer.findById(req.params.id);

    if (dealer) {
        const vehicleCount = await Vehicle.countDocuments({ owner: dealer._id });
        res.json({
            ...dealer._doc,
            vehicleCount
        });
    } else {
        res.status(404);
        throw new Error('Dealer not found');
    }
});

module.exports = {
    getDealers,
    getDealerById
};
