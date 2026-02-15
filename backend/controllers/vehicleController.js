const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Fetch all vehicles with filters (Including City)
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    // City is MANDATORY for meaningful results, default to 'Delhi' if missing
    const city = req.query.city;

    const keyword = req.query.keyword
        ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { brand: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    // Build Filter
    const filter = { ...keyword };
    if (city) filter.city = city;
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
};

// @desc    Get single vehicle details
const getVehicleById = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

// @desc    Create Vehicle (Admin)
const createVehicle = async (req, res) => {
    // Use spread to capture all new fields
    const vehicle = new Vehicle({ ...req.body });
    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
};

// @desc    Update Vehicle
const updateVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        Object.assign(vehicle, req.body); // Updated logic
        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

// @desc    Delete Vehicle
const deleteVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } else {
        res.status(404);
        throw new Error('Vehicle not found');
    }
};

// @desc    Get Stats
const getStats = async (req, res) => {
    const totalVehicles = await Vehicle.countDocuments();
    // Revenue logic would connect here...
    res.json({ totalVehicles });
};

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getStats
};
