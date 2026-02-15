const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Vehicle' },
    city: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rentalType: { type: String, enum: ['Hourly', 'Daily'], default: 'Daily' },
    totalPrice: { type: Number, required: true }, // Base Fare
    securityDeposit: { type: Number, required: true, default: 0 },
    gstAmount: { type: Number, required: true, default: 0 }, // 18%
    finalAmount: { type: Number, required: true }, // Total + Deposit + GST
    status: { type: String, enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paymentId: { type: String }, // Razorpay Payment ID
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
