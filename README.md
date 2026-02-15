# CarawINN - Luxury Caravan Booking Platform

CarawINN is a full-stack MERN application for booking luxury caravans. It allows tourists to explore and book premium rides with integrated amenities and provides an admin dashboard for managing caravans and bookings.

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)

## Features

- **User Roles:** Tourist, Admin
- **Authentication:** Secure Register/Login with JWT & Bcrypt
- **Caravan Management:** Admin can Add, Edit, Delete caravans
- **Booking System:** Prevent double bookings, overlapping date checks
- **Luxury UI:** Dark & Gold aesthetic, fully responsive

## Folder Structure

```
CarawINN/
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

