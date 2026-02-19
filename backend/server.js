const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables FIRST
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// ================= CORS CONFIG =================
const allowedOrigins = [
    "https://caraw-inn.vercel.app",
    "http://localhost:3000",
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow non-browser requests (like Postman)
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Use SAME corsOptions everywhere
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// ===============================================

// Body parser
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/dealers", require("./routes/dealerRoutes"));
app.use("/api/caravans", require("./routes/caravanRoutes"));

app.get("/", (req, res) => {
    res.send("CarawINN API is running...");
});

// 404 Middleware
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
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
