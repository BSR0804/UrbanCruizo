const mongoose = require('mongoose');

const carRequestSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    vehicleType: { type: String, enum: ['car', 'bike', 'caravan'], required: true },
    requirements: { type: String, required: true },
    status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('CarRequest', carRequestSchema);
