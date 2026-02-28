/**
 * CarawINN - Backend Server
 * Optimized for Render & Vercel deployment
 */
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// ================= CORS =================
// Simple and reliable setup for Render + Vercel
app.use(cors({
    origin: true,        // Reflects request origin automatically
    credentials: true    // Allow cookies / auth headers
}));

// Body parser
app.use(express.json());

// ================= ROUTES (V1) =================
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/v1/bookings", require("./routes/bookingRoutes"));
app.use("/api/v1/dealers", require("./routes/dealerRoutes"));
app.use("/api/v1/caravans", require("./routes/caravanRoutes"));
app.use("/api/v1/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
    res.send("CarawINN API is running...");
});

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    console.error(`[Error] ${req.method} ${req.url}:`, err.message);

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
});

module.exports = app;
