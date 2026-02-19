const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

require("cors");

app.use(cors({
    origin: "https://caraw-inn.vercel.app",
    credentials: true,
}));

dotenv.config();

connectDB();

const app = express();

// ─── CORS: Manual headers — works even if cors package has issues on Render ───
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow any vercel.app domain + localhost
    if (
        !origin ||
        origin.endsWith('.vercel.app') ||
        origin.startsWith('http://localhost')
    ) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    // Respond immediately to preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/dealers', require('./routes/dealerRoutes'));
app.use('/api/caravans', require('./routes/caravanRoutes'));

app.get('/', (req, res) => {
    res.send('CarawINN API is running...');
});

// 404 Not Found Middleware
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[Error] ${req.method} ${req.url}:`, err.message);
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
