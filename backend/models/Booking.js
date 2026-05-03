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

    // User Details for Booking Verification
    bookingName: { type: String },
    bookingEmail: { type: String },
    bookingPhone: { type: String },
    bookingAddress: { type: String },
    bookingAge: { type: String },
    drivingLicenseNumber: { type: String },
    aadhaarNumber: { type: String },
    country: { type: String },
    isForeigner: { type: Boolean, default: false },
    aadhaarImage: { type: String }, // URL/data-URL to stored image
    licenseImage: { type: String }, // license front
    licenseBackImage: { type: String }, // license back
    selfieImage: { type: String },
    passportImage: { type: String },

    status: {
        type: String,
        enum: ['pending_approval', 'approved', 'rejected', 'confirmed', 'ongoing', 'completed', 'cancelled'],
        default: 'pending_approval'
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paymentId: { type: String }, // Razorpay Payment ID
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
