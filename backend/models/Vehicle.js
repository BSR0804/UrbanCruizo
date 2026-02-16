const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ['car', 'bike', 'caravan'] },
    category: { type: String, required: true, enum: ['hatchback', 'sedan', 'suv', 'luxury', 'commuter', 'sports', 'royal-enfield', 'standard', 'premium'] },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    transmission: { type: String, required: true, enum: ['Automatic', 'Manual'] },
    fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'] },
    seats: { type: Number, required: true },
    pricePerHour: { type: Number, default: 0 },
    pricePerDay: { type: Number, required: true },
    securityDeposit: { type: Number, required: true, default: 0 },
    city: { type: String, required: true, index: true }, // 'Delhi', 'Mumbai', etc.
    images: [{ type: String }],
    kmsLimitPerDay: { type: Number, default: 240 }, // Indian standard
    extraKmCharge: { type: Number, default: 0 },
    availability: { type: Boolean, default: true, required: true },
    rating: { type: Number, default: 0 },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
