const Booking = require('../models/Booking');
const Caravan = require('../models/Caravan');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { caravanId, startDate, endDate } = req.body;

    const caravan = await Caravan.findById(caravanId);

    if (!caravan) {
        res.status(404);
        throw new Error('Caravan not found');
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
        caravan: caravanId,
        status: 'confirmed',
        $or: [
            {
                startDate: { $lt: new Date(endDate) },
                endDate: { $gt: new Date(startDate) },
            },
        ],
    });

    if (overlappingBooking) {
        res.status(400);
        throw new Error('Caravan is already booked for these dates');
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * caravan.pricePerDay;

    const booking = new Booking({
        user: req.user._id,
        caravan: caravanId,
        startDate,
        endDate,
        totalPrice,
        status: 'confirmed',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('caravan');
    res.json(bookings);
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'id name').populate('caravan');
    res.json(bookings);
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookings,
};
