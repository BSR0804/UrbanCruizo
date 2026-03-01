const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// @desc    Fetch all vehicles with filters (Including City)
const getVehicles = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const city = req.query.city;

    const keyword = req.query.keyword
        ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { brand: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    const filter = { ...keyword };
    if (city) filter.city = city;
    if (req.query.owner) {
        if (mongoose.Types.ObjectId.isValid(req.query.owner)) {
            filter.owner = req.query.owner;
        } else {
            // If owner is not a valid ObjectId, we return empty vehicles safely
            return res.json({ vehicles: [], page, pages: 0 });
        }
    }
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.fuelType) filter.fuelType = req.query.fuelType;
    if (req.query.transmission) filter.transmission = req.query.transmission;

    if (req.query.maxPrice) {
        filter.pricePerDay = { $lte: Number(req.query.maxPrice) };
    }

    const count = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ vehicles, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single vehicle details
const getVehicleById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Vehicle not found (Invalid ID)');
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
});

// @desc    Create Vehicle (Admin/Dealer)
const createVehicle = asyncHandler(async (req, res) => {
    const vehicle = new Vehicle({
        ...req.body,
        owner: req.body.owner || req.user._id // Assign owner
    });
    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
});

// @desc    Update Vehicle
const updateVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    // Authorization: Owner or Admin
    if (req.user.role !== 'admin' && vehicle.owner?.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this vehicle');
    }

    Object.assign(vehicle, req.body);
    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
});

// @desc    Delete Vehicle
const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    // Authorization: Owner or Admin
    if (req.user.role !== 'admin' && vehicle.owner?.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to remove this vehicle');
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
});

// @desc    Get Stats
const getStats = asyncHandler(async (req, res) => {
    const totalVehicles = await Vehicle.countDocuments();
    res.json({ totalVehicles });
});

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getStats
};
