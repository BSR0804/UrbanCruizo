const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookings,
} = require('../controllers/bookingController');
const { protect, admin, dealer } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, dealer, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/review').put(protect, dealer, updateBookingStatus);

module.exports = router;
