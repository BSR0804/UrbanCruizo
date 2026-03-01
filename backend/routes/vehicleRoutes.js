const express = require('express');
const router = express.Router();
const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getStats,
} = require('../controllers/vehicleController');
const { protect, admin, dealer } = require('../middleware/authMiddleware');

router.route('/').get(getVehicles).post(protect, dealer, createVehicle);
router.route('/stats/dashboard').get(protect, admin, getStats);
router
    .route('/:id')
    .get(getVehicleById)
    .put(protect, dealer, updateVehicle)
    .delete(protect, dealer, deleteVehicle);

module.exports = router;
