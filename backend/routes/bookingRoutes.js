const express = require('express');
const router = express.Router();
const {
    createBooking,
    updateBookingStatus,
    getMyBookings,
    getBookings,
    cancelBooking,
    updateBookingDates,
} = require('../controllers/bookingController');
const { protect, admin, dealer } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, dealer, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/review').put(protect, dealer, updateBookingStatus);
router.route('/:id/cancel').put(protect, cancelBooking);
router.route('/:id/dates').put(protect, updateBookingDates);

module.exports = router;
