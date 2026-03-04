const mongoose = require('mongoose');

const caravanSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true, default: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    location: { type: String, required: true },
    availability: { type: Boolean, default: true, required: true },
    packagePrice: { type: Number },
    duration: { type: String },
    city: { type: String },
    description1: { type: String },
    description2: { type: String },
    organizer: {
        name: { type: String },
        phone: { type: String },
        address: { type: String }
    },
}, { timestamps: true });

module.exports = mongoose.model('Caravan', caravanSchema);
