const express = require('express');
const router = express.Router();
const {
    getCaravans,
    getCaravanById,
    createCaravan,
    updateCaravan,
    deleteCaravan,
} = require('../controllers/caravanController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCaravans).post(protect, admin, createCaravan);
router
    .route('/:id')
    .get(getCaravanById)
    .put(protect, admin, updateCaravan)
    .delete(protect, admin, deleteCaravan);

module.exports = router;
