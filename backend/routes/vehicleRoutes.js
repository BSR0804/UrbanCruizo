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
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getVehicles).post(protect, admin, createVehicle);
router.route('/stats/dashboard').get(protect, admin, getStats);
router
    .route('/:id')
    .get(getVehicleById)
    .put(protect, admin, updateVehicle)
    .delete(protect, admin, deleteVehicle);

module.exports = router;
