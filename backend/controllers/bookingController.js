const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// @desc    Create new booking (With GST and Deposit Logic)
// @route   POST /api/bookings
// @desc    Create new booking (Approval workflow)
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
    const {
        vehicleId,
        startDate,
        endDate,
        rentalType,
        bookingName,
        bookingEmail,
        bookingPhone,
        bookingAddress,
        aadhaarImage,
        licenseImage
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        res.status(400);
        throw new Error('Invalid Vehicle ID');
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle Not Found');
    }

    // Overlap check (only for confirmed/ongoing/approved)
    const overlapping = await Booking.findOne({
        vehicle: vehicleId,
        status: { $in: ['approved', 'confirmed', 'ongoing'] },
        $or: [
            { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
        ]
    });

    if (overlapping) {
        res.status(400);
        throw new Error('Vehicle already booked for selected dates.');
    }

    // Pricing Logic
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = Math.abs(end - start);
    let baseFare = 0;

    if (rentalType === 'Hourly') {
        const hours = Math.ceil(diffMs / (1000 * 60 * 60));
        baseFare = hours * vehicle.pricePerHour;
    } else {
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        baseFare = days * vehicle.pricePerDay;
    }

    const gstAmount = baseFare * 0.18;
    const deposit = vehicle.securityDeposit || 0;
    const finalAmount = baseFare + gstAmount + deposit;

    const booking = new Booking({
        user: req.user._id,
        vehicle: vehicleId,
        city: vehicle.city,
        startDate,
        endDate,
        rentalType,
        totalPrice: baseFare,
        gstAmount,
        securityDeposit: deposit,
        finalAmount,
        bookingName,
        bookingEmail,
        bookingPhone,
        bookingAddress,
        aadhaarImage,
        licenseImage,
        status: 'pending_approval',
        paymentStatus: 'pending'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
});

// @desc    Update Booking Status (Dealer/Admin Review)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const booking = await Booking.findById(req.params.id).populate('vehicle');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Authorization: only dealer of the vehicle or Admin
    if (req.user.role !== 'admin' && booking.vehicle.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to review this booking');
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status} successfully`, booking });
});

// @desc    Get My Bookings
const getMyBookings = asyncHandler(async (req, res) => {
    const now = new Date();

    // Auto-complete finished bookings
    await Booking.updateMany(
        {
            user: req.user._id,
            status: { $in: ['confirmed', 'ongoing'] },
            endDate: { $lt: now }
        },
        { $set: { status: 'completed' } }
    );

    const bookings = await Booking.find({ user: req.user._id })
        .populate({
            path: 'vehicle',
            populate: {
                path: 'owner',
                select: 'name email phone address'
            }
        })
        .sort({ createdAt: -1 });
    res.json(bookings);
});

// @desc    Cancel Booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Only user who made the booking or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
});

// @desc    Update Booking Dates
// @route   PUT /api/bookings/:id/dates
const updateBookingDates = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicle');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (booking.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Check for overlaps with NEW dates (excluding this booking itself)
    const overlapping = await Booking.findOne({
        _id: { $ne: booking._id },
        vehicle: booking.vehicle._id,
        status: { $in: ['approved', 'confirmed', 'ongoing'] },
        $or: [
            { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
        ]
    });

    if (overlapping) {
        res.status(400);
        throw new Error('Vehicle already booked for selected dates.');
    }

    booking.startDate = startDate;
    booking.endDate = endDate;

    // Status reverts to pending_approval if it was previously confirmed/approved
    if (booking.status !== 'pending_approval') {
        booking.status = 'pending_approval';
    }

    await booking.save();
    res.json(booking);
});

// @desc    Get All Bookings (Admin/Dealer View)
const getBookings = asyncHandler(async (req, res) => {
    let query = {};
    const now = new Date();

    // If dealer, only show bookings for their vehicles
    if (req.user.role === 'dealer') {
        const vehicles = await Vehicle.find({ owner: req.user._id });
        const vehicleIds = vehicles.map(v => v._id);
        query.vehicle = { $in: vehicleIds };
    }

    // Auto-complete finished bookings for the relevant query
    await Booking.updateMany(
        {
            ...query,
            status: { $in: ['confirmed', 'ongoing'] },
            endDate: { $lt: now }
        },
        { $set: { status: 'completed' } }
    );

    const bookings = await Booking.find(query)
        .populate('user', 'name email')
        .populate('vehicle')
        .sort({ createdAt: -1 });
    res.json(bookings);
});

module.exports = {
    createBooking,
    updateBookingStatus,
    getMyBookings,
    cancelBooking,
    updateBookingDates,
    getBookings
};
