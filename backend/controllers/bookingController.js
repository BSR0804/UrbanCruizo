const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// @desc    Create new booking (With GST and Deposit Logic)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    const { vehicleId, startDate, endDate, rentalType } = req.body; // rentalType: 'Hourly' | 'Daily'
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle Not Found');
    }

    // Overlap check
    const overlapping = await Booking.findOne({
        vehicle: vehicleId,
        status: { $in: ['confirmed', 'ongoing'] },
        $or: [
            { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
        ]
    });

    if (overlapping) {
        res.status(400);
        throw new Error('Selected dates are not available.');
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

    const gstAmount = baseFare * 0.18; // 18% GST standard in India
    const deposit = vehicle.securityDeposit || 0;
    const finalAmount = baseFare + gstAmount + deposit;

    const booking = new Booking({
        user: req.user._id,
        vehicle: vehicleId,
        city: vehicle.city,
        startDate,
        endDate,
        rentalType,
        totalPrice: baseFare, // Store base separately for invoice
        gstAmount,
        securityDeposit: deposit,
        finalAmount, // Pay this amount
        status: 'confirmed', // Auto-confirm for MVP (Usually 'pending' payment)
        paymentStatus: 'pending' // Integrate payment gateway here
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
};

// @desc    Get My Bookings
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('vehicle').sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Get All Bookings (Admin)
const getBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'name email licenseNumber').populate('vehicle');
    res.json(bookings);
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookings
};
