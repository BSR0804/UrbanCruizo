const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get dealer dashboard statistics
// @route   GET /api/dealers/dashboard/stats
// @access  Private/Dealer
const getDashboardStats = asyncHandler(async (req, res) => {
    const dealerId = req.user._id;

    // Get all vehicles owned by this dealer
    const vehicles = await Vehicle.find({ owner: dealerId });
    const vehicleIds = vehicles.map(v => v._id);

    // Get all bookings for these vehicles
    const bookings = await Booking.find({ vehicle: { $in: vehicleIds } });

    // Calculate stats
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.availability).length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending_approval' || b.status === 'approved').length;

    // Calculate total earnings (confirmed/completed bookings)
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'ongoing' || b.status === 'completed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalEarnings = totalRevenue * 0.9; // 10% platform fee

    // Recent bookings for notifications/updates
    const recentActivity = await Booking.find({ vehicle: { $in: vehicleIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('vehicle', 'title')
        .populate('user', 'name');

    res.json({
        totalVehicles,
        activeVehicles,
        bookedVehicles: totalVehicles - activeVehicles,
        totalBookings,
        pendingBookings,
        totalEarnings,
        recentActivity
    });
});

// @desc    Get dealer's vehicles
// @route   GET /api/dealers/dashboard/vehicles
// @access  Private/Dealer
const getDealerVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
});

// @desc    Get dealer's bookings/requests
// @route   GET /api/dealers/dashboard/bookings
// @access  Private/Dealer
const getDealerBookings = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    const vehicleIds = vehicles.map(v => v._id);

    const bookings = await Booking.find({ vehicle: { $in: vehicleIds } })
        .populate('vehicle')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

    res.json(bookings);
});

// @desc    Update dealer profile (initial or regular)
// @route   PUT /api/dealers/profile
// @access  Private/Dealer
const updateDealerProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.phone = req.body.phone || user.phone;
        user.businessName = req.body.businessName || user.businessName;
        user.city = req.body.city || user.city;
        user.location = req.body.location || user.location;
        user.aadhaarNumber = req.body.aadhaarNumber || user.aadhaarNumber;
        user.licenseNumber = req.body.licenseNumber || user.licenseNumber;

        // Mark profile as complete if required fields are provided
        if (req.body.phone && req.body.city && req.body.location && req.body.businessName) {
            user.isProfileComplete = true;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isProfileComplete: updatedUser.isProfileComplete,
            phone: updatedUser.phone,
            city: updatedUser.city,
            location: updatedUser.location
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getDashboardStats,
    getDealerVehicles,
    getDealerBookings,
    updateDealerProfile
};
