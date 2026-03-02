# UrbanCruizo - Premium Vehicle & Luxury Caravan Marketplace 🚗💎

UrbanCruizo (formerly CarawINN) is a high-performance, full-stack ecosystem designed for the adventurous elite. Built with a focus on security, role-based orchestration, and premium UX, it provides a seamless bridge between local dealers and luxury travelers across India.

## 🚀 Live Ecosystem
- **Main Platform:** [https://caraw-inn.vercel.app/](https://caraw-inn.vercel.app/)
- **Partner Portal:** [https://caraw-inn.vercel.app/partner](https://caraw-inn.vercel.app/partner)
- **GitHub Repository:** [BSR0804/CarawINN](https://github.com/BSR0804/CarawINN)

---

## 🛠️ Tech Stack

### Backend (State-of-the-art Logic)
- **Runtime:** Node.js (Express.js)
- **Database:** MongoDB with Mongoose ODM
- **Security:** JWT (JSON Web Tokens) with strictly enforced role-based middleware
- **Encryption:** Bcrypt.js for military-grade password hashing
- **Payments:** End-to-end Razorpay integration with signature verification

### Frontend (Premium UI/UX)
- **Framework:** React.js (Vite)
- **Styling:** Vanilla CSS & Tailwind with **Framer Motion** for liquid animations
- **Icons:** Lucide-React for a modern aesthetic
- **Auth Flow:** Google OAuth 2.0 & Custom JWT integration

---

## ✅ Advanced Features

### 🛡️ Authorization Hard-Gate (No Bypass Allowed)
Implemented a mandatory **interstitial gateway**. Unauthenticated users attempting to access premium features like **Destinations** or **Luxury Caravans** are strictly redirected to a "Choose Your Journey" choice screen. Access is only granted once the user identifies as either a **Traveler** or a **Partner**.

### 🚪 Global Logout Enforcement
A centralized session management system ensures that every "Logout" action across all sub-platforms (Main App, Dealer Dashboard, Partner Portal) triggers a mandatory and immediate hardware-level redirect back to the primary landing page at `https://caraw-inn.vercel.app/`.

### 🏢 Standalone Partner Portal
A dedicated sub-project for fleet owners that includes:
- **First-time Profile Sync:** Mandatory profile completion flow for new dealers.
- **Fleet Management:** Full CRUD for vehicles (Cars, Bikes, Caravans).
- **Booking Orchestration:** Real-time approval/denial of rental requests.
- **Earnings Analytics:** Automated commission calculations and payout history.

---

## 📂 Project Architecture

```text
UrbanCruizo/
├── backend/                # Core API & Business Logic
│   ├── controllers/        # Route logic (Auth, Dealer, Vehicle, Booking)
│   ├── middleware/         # RBAC (Admin/Dealer/User) & Security
│   ├── models/             # Mongoose Schemas (User, Vehicle, Booking)
│   └── server.js           # Production-ready entry point
├── frontend/               # Primary Consumer Marketplace
│   ├── src/pages/          # DestinationGateway, HomePage, VehicleListing
│   └── src/context/        # Global Auth & Authorization Gate
├── partner/                # Standalone Dealer/Fleet Owner Platform
│   ├── src/pages/          # Landing, Dashboard, ProfileSync
│   └── src/utils/          # Portal-specific API configuration
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Cluster
- Razorpay API Keys

### 2. Environment Configuration
Create a `.env` in the `backend` folder:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Quick Start
```bash
# Start Backend
cd backend && npm install && npm run dev

# Start Marketplace
cd frontend && npm install && npm run dev

# Start Partner Portal (Optional)
cd partner && npm install && npm run dev
```

---

## 📖 API Documentation (V1)

| Method | Endpoint | Description | Role Required |
| :--- | :---- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Secure JWT Authentication | Public |
| `PUT` | `/api/v1/dealers/profile` | Sync Dealer Profile Details | Dealer |
| `GET` | `/api/v1/vehicles` | Filtered Fleet Discovery | Public |
| `POST` | `/api/v1/bookings` | Initiate Premium Rental | User |
| `PUT` | `/api/v1/bookings/:id/review` | Approve/Deny Booking | Dealer |

---

**Built for the high-end mobility market.**  
**Developed by Bhaskar Shamo Ray**
