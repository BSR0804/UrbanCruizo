const mongoose = require('mongoose');

const caravanSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true, default: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    location: { type: String, required: true },
    availability: { type: Boolean, default: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Caravan', caravanSchema);
