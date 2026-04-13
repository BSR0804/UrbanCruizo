const mongoose = require('mongoose');

const dealerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    city: { type: String, required: true },
    location: { type: String },
    verified: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to partner portal User
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);
