const mongoose = require('mongoose');

const tourPackageSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    description1: { type: String },
    description2: { type: String },
    packagePrice: { type: Number, required: true },
    duration: { type: String },
    city: { type: String },
    location: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    availability: { type: Boolean, default: true },
    organizer: {
        name: { type: String },
        phone: { type: String },
        address: { type: String }
    },
}, { timestamps: true });

module.exports = mongoose.model('TourPackage', tourPackageSchema);
