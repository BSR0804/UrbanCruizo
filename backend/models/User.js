const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String }, // For India +91
    password: { type: String }, // Optional for Google Auth users
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    licenseNumber: { type: String },
    aadhaarNumber: { type: String },
    licenseImage: { type: String },
    verified: { type: Boolean, default: false }, // KYC Status
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        next();
        return; // Ensure we don't proceed to hash undefined
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
