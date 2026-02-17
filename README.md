# UrbanCruizo - Premier Luxury Vehicle Rental Platform

UrbanCruizo is a sophisticated full-stack MERN application for booking premium Cars, rugged Bikes, and luxury Caravans across India. It features a high-end dark luxury aesthetic, real-time dealer connectivity, and a comprehensive support ecosystem.

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), Google OAuth Integration

## Features

- **Multi-Vehicle Fleet:** Explore premium Cars, Superbikes, and Luxury Caravans.
- **Strategic Dealer Network:** Connect with authorized, top-rated dealers in major Indian cities.
- **Luxury Support Ecosystem:**
  - **Help Center:** Direct personalized support channels.
  - **Robust Policies:** Comprehensive Rental, Privacy, and Terms of Service documentation.
- **Dynamic UX:** Responsive grid layouts, premium animations, and interactive "Coming Soon" notifications.
- **Authentication:** Secure Register/Login with JWT, Bcrypt, and Google Auth.
- **Booking System:** Advanced overlapping date checks and dual-role (User/Admin) management.

## Folder Structure

```
UrbanCruizo/
├── backend/            # Express Server & API
│   ├── config/         # DB Connection
│   ├── controllers/    # Route Logic
│   ├── middleware/     # Auth & Error Middleware
│   ├── models/         # Mongoose Models
│   ├── routes/         # API Routes
│   └── server.js       # Entry Point
├── frontend/           # React App (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── pages/      # Application Pages
│   │   ├── context/    # Global State
│   │   └── App.jsx     # Main Component
└── README.md
```

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
# Configure .env file
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.
The backend API runs on `http://localhost:5000`.

## API Endpoints

- **Auth:**
  - `POST /api/auth/register` - Register new user
  - `POST /api/auth/login` - Login user
- **Caravans:**
  - `GET /api/caravans` - Get all caravans
  - `POST /api/caravans` - Create caravan (Admin)
  - `PUT /api/caravans/:id` - Update caravan (Admin)
  - `DELETE /api/caravans/:id` - Delete caravan (Admin)
- **Bookings:**
  - `POST /api/bookings` - Create booking
  - `GET /api/bookings/mybookings` - Get user bookings
  - `GET /api/bookings` - Get all bookings (Admin)

