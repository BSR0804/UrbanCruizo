# CarawINN - Premium Vehicle & Caravan Rental Platform

CarawINN is a high-performance, scalable MERN (MongoDB, Express.js, React.js, Node.js) application designed for seamless vehicle and luxury caravan rentals. Built with a focus on security, scalability, and robust API design, it meets all requirements for a modern backend-focused internship assignment.

## 🚀 Live Demo & Repository
- **GitHub Repository:** [BSR0804/CarawINN](https://github.com/BSR0804/CarawINN)
- **Backend API:** [Hosted on Render]
- **Frontend UI:** [Hosted on Vercel]
- **Live Link:** https://caraw-inn.vercel.app/

---

## 🛠️ Tech Stack

### Backend (Primary Focus)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with custom middleware
- **Security:** Bcrypt.js for password hashing, CORS protection, Input sanitization
- **Documentation:** Postman API Collection (Included)

### Frontend (Supportive UI)
- **Library:** React.js (Vite)
- **Styling:** Tailwind CSS & Framer Motion for premium UI/UX
- **State Management:** React Context API (Auth & City contexts)
- **Icons:** Lucide-React

---

## ✅ Core Features

### 🔐 Authentication & Role-Based Access
- **User Registration & Login:** Secure authentication flow with password hashing.
- **JWT Authentication:** Protected routes using Bearer tokens.
- **Role-Based Access Control (RBAC):** Distinct permissions for `User`, `Admin`, and `Dealer`.
- **Google OAuth:** Integrated Google login for seamless user experience.

### 🚗 Vehicle & CRUD Management (Secondary Entity)
- **Full CRUD Operations:** Admins/Dealers can Create, Read, Update, and Delete vehicle listings.
- **Advanced Filtering:** Search vehicles by city, type, fuel type, price, and more.
- **Booking System:** Users can book vehicles with real-time availability checks.

### 🛡️ Security & Scalability
- **Secure Token Handling:** JWT stored securely and verified via middleware.
- **Input Validation:** Error handling for all API endpoints with descriptive status codes.
- **Global Error Handler:** Centralized middleware to manage exceptions and provide clean responses.

---

## 📈 Scalability Note (Architectural Overview)

To ensure this system can scale to millions of users, the following strategies can be implemented:

1.  **Microservices Architecture:** Decoupling the Auth, Booking, and Vehicle services into independent microservices communicating via message brokers like **RabbitMQ** or **Kafka**.
2.  **Caching with Redis:** Implement Redis for frequently accessed data (e.g., vehicle listings) to reduce database load and improve response times.
3.  **Load Balancing:** Deploying across multiple instances with an **NGINX** or **AWS ELB** load balancer to distribute traffic evenly.
4.  **Database Indexing & Sharding:** Using MongoDB indexes for search-intensive fields and sharding for large-scale data distribution across multiple clusters.
5.  **Dockerization:** Containerizing services with Docker for consistent environments and orchestration with **Kubernetes** for auto-scaling.

---

## 📂 Project Structure

```text
CarawINN/
├── backend/                # Express Server & API
│   ├── config/             # DB & Config files
│   ├── controllers/        # Logic for each route (Auth, Vehicles, Bookings)
│   ├── middleware/         # Auth & Admin authorization
│   ├── models/             # Mongoose Schemas (User, Vehicle, Booking)
│   ├── routes/             # API Route definitions
│   └── server.js           # Server Entry Point
├── frontend/               # React App (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Cards, etc.)
│   │   ├── pages/          # Full pages (Home, Dashboard, Login)
│   │   ├── context/        # Auth & UI Global State
│   │   └── utils/          # API Axios configuration
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env with VITE_API_URL
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📖 API Documentation (V1)

| Method | Endpoint | Description | Access |
| :--- | :---- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | Public |
| `POST` | `/api/v1/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/v1/vehicles` | List all vehicles with filters | Public |
| `POST` | `/api/v1/vehicles` | Add a new vehicle | Admin/Dealer |
| `PUT` | `/api/v1/vehicles/:id` | Update vehicle details | Admin/Dealer |
| `DELETE` | `/api/v1/vehicles/:id` | Delete a vehicle listing | Admin/Dealer |
| `POST` | `/api/v1/bookings` | Create a new booking | User |
| `GET` | `/api/v1/bookings/my` | Get current user's bookings | User |

---

## 📜 Evaluation Criteria Checklist
- [x] **API Design:** RESTful principles, clean routes, and proper status codes.
- [x] **Database:** Mongoose models with rigorous schema validation.
- [x] **Security:** Bcrypt hashing and JWT middleware protection.
- [x] **Scalability:** Modular structure ready for microservices migration.

---

**Backend Developer Internship Assignment.**  
**Submitted by Bhaskar Shamo Ray**
