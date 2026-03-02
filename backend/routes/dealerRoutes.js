const express = require('express');
const router = express.Router();
const { protect, dealer } = require('../middleware/authMiddleware');
const { getDealers, getDealerById } = require('../controllers/dealerController');
const {
    getDashboardStats,
    getDealerVehicles,
    getDealerBookings,
    updateDealerProfile
} = require('../controllers/dealerDashboardController');
const {
    createCarRequest,
    getCarRequests
} = require('../controllers/CarRequestController');

// Dealer Profile Routes (Prioritize these)
router.put('/profile', protect, dealer, updateDealerProfile);
router.put('/dashboard/profile', protect, dealer, updateDealerProfile);

// Dealer Dashboard Routes
router.get('/dashboard/stats', protect, dealer, getDashboardStats);
router.get('/dashboard/vehicles', protect, dealer, getDealerVehicles);
router.get('/dashboard/bookings', protect, dealer, getDealerBookings);

// Car Request Lead Routes
router.post('/dashboard/car-requests', createCarRequest); // Public
router.get('/dashboard/car-requests', protect, dealer, getCarRequests); // Protected for dealers

router.get('/', getDealers);
router.get('/:id', getDealerById); // Protected for dealers

module.exports = router;
