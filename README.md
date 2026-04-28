# UrbanCruizo — Premium Vehicle Rental & Luxury Tour Marketplace

UrbanCruizo is a full-stack vehicle rental platform connecting premium fleet owners (dealers) with travelers across India. It features a customer-facing marketplace, a dedicated partner portal for dealers, and a Node.js/MongoDB backend with role-based access control.

---

## Live Deployments

| App | URL |
| :--- | :--- |
| Customer Marketplace | [caraw-inn.vercel.app](https://caraw-inn.vercel.app/) |
| Partner Portal | [carawinn-partner.vercel.app](https://carawinn-partner.vercel.app/) |
| Backend API | [carawinn.onrender.com/api/v1](https://carawinn.onrender.com/api/v1) |
| GitHub | [BSR0804/UrbanCruizo](https://github.com/BSR0804/UrbanCruizo) |

---

## Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Auth:** JWT (30-day tokens) + Google OAuth 2.0 via access token verification
- **Passwords:** Bcrypt.js
- **Payments:** Razorpay (order creation + signature verification)

### Frontend (Customer Marketplace)
- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Auth:** `@react-oauth/google` + custom JWT context

### Partner Portal
- Standalone React + Vite app (separate Vercel deployment)
- Isolated session storage (`uc_partner` key, separate from `uc_user`)
- Same backend API, dealer-scoped endpoints

---

## Project Structure

```
UrbanCruizo/
├── backend/
│   ├── controllers/
│   │   ├── authController.js           # Login, register, Google OAuth
│   │   ├── CarRequestController.js     # Customer vehicle requests
│   │   ├── dealerController.js         # Public dealer listing & profiles
│   │   ├── dealerDashboardController.js # Dealer-auth: profile, fleet, bookings, earnings
│   │   ├── vehicleController.js        # Vehicle CRUD (owner check resolves Dealer via user email)
│   │   ├── bookingController.js        # Booking lifecycle
│   │   ├── caravanController.js        # Tour packages (TourPackage model)
│   │   └── paymentController.js        # Razorpay integration
│   ├── middleware/
│   │   └── authMiddleware.js           # protect, dealer, admin guards
│   ├── models/
│   │   ├── User.js                     # Customers + dealer user accounts
│   │   ├── Dealer.js                   # Public dealer listing (separate collection)
│   │   ├── Vehicle.js                  # Fleet (owner → Dealer._id) — title, brand, model, year, type, category, transmission, fuelType, seats, capacity, mileage, pricing, images
│   │   ├── Booking.js                  # Rental bookings
│   │   ├── TourPackage.js              # Curated tour packages
│   │   ├── Caravan.js                  # Legacy caravan model (retained for backwards compatibility)
│   │   └── CarRequest.js               # Customer vehicle requests
│   ├── routes/
│   │   ├── v1.js                       # API v1 router (mounts all sub-routers)
│   │   ├── authRoutes.js               # /auth/* endpoints
│   │   ├── bookingRoutes.js            # /bookings/* endpoints
│   │   ├── caravanRoutes.js            # /caravans/* endpoints (tour packages)
│   │   ├── dealerRoutes.js             # /dealers/* endpoints (public + dashboard)
│   │   ├── paymentRoutes.js            # /payment/* endpoints
│   │   └── vehicleRoutes.js            # /vehicles/* endpoints
│   ├── seeder.js                       # Seed 16 dealers, 45 vehicles, 3 tour packages
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/                      # Full marketplace page set
│   │   ├── components/                 # BookingFormModal, PaymentModal, TripPlanner, etc.
│   │   ├── context/AuthContext.jsx     # uc_user localStorage key
│   │   ├── utils/api.js                # Axios instance with uc_user token
│   │   ├── data/staticData.js          # Mock fallback data
│   │   ├── assets/                     # Static SVG/asset imports
│   │   ├── App.jsx, App.css, index.css # Root component & global styles
│   │   └── main.jsx                    # Vite entry
│   └── public/images/                  # Vehicle & tour imagery
├── partner/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # Partner landing page
│   │   │   ├── BenefitsPage.jsx        # Partner benefits showcase
│   │   │   ├── FeaturesPage.jsx        # Partner features showcase
│   │   │   ├── PerformancePage.jsx     # Partner performance/metrics page
│   │   │   ├── Login.jsx               # Dealer login
│   │   │   ├── Register.jsx            # Dealer registration
│   │   │   └── Dashboard.jsx           # Fleet, bookings, earnings, notifications
│   │   ├── context/AuthContext.jsx     # uc_partner localStorage key
│   │   ├── utils/api.js                # Axios instance with uc_partner token
│   │   ├── App.jsx, index.css          # Root component & global styles
│   │   └── main.jsx                    # Vite entry
│   └── vercel.json
├── STATIC_DATA_GUIDE.md                # Documentation for mock/seed data
└── README.md
```

---

## Key Features

### Dealer Flow
1. Partner registers via `/register?role=dealer`
2. Completes business profile → `Dealer` document auto-created (upsert)
3. Dealer card appears live on customer marketplace under their city
4. Dealer lists vehicles → immediately visible on dealer's fleet page
5. Customers book → dealer approves/denies from dashboard

### Auth System
- **Email/password** login with Bcrypt comparison
- **Google OAuth** via access token (`googleapis.com/oauth2/v3/userinfo`)
- Accounts created via Google cannot use email/password login (explicit error message)
- Role-based routing: `admin → /admin`, `dealer → /partner`, `user → /dashboard`
- Separate localStorage keys prevent customer/partner session conflicts
- Vehicle update/delete authorization resolves the dealer profile via the logged-in user's email and compares against `Vehicle.owner` (which references `Dealer._id`, not `User._id`)

### Partner Dashboard
- Fleet management: add, edit, remove vehicles with full spec forms
  - Vehicle category dropdown matched to backend enum (hatchback, sedan, suv, luxury, commuter, sports, royal-enfield, standard, premium)
  - Fuel type dropdown (Petrol / Diesel / CNG / Electric / Hybrid)
  - Conditional fuel tank capacity field — automatically hidden when fuel type is Electric
  - Mileage (km/ltr) and seat-count inputs
  - Existing images render as thumbnails on edit with hover-to-delete; new uploads append to the set
- Booking requests: approve or deny with one click
- Earnings overview with commission tracking
- Live notification bell: shows pending booking count, pulsing indicator
- Smart location display: card view filters empty values so listings never show stray commas

### Tour Packages
- Stored in `TourPackage` collection (replaces legacy `Caravan` model)
- Served via `/api/v1/caravans` routes (backwards-compatible)
- Includes: pricing, duration, city, amenities, images, organizer contact

### Payments
- Razorpay order created on backend, verified by signature on completion
- Security deposit captured separately from rental cost

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new account | Public |
| `POST` | `/auth/login` | Email/password login | Public |
| `POST` | `/auth/google` | Google OAuth login (access token) | Public |

### Vehicles
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/vehicles` | Browse all vehicles (city/category/type filters, paginated) | Public |
| `GET` | `/vehicles/:id` | Vehicle details | Public |
| `POST` | `/vehicles` | List a new vehicle | Dealer |
| `PUT` | `/vehicles/:id` | Edit vehicle (owner-scoped via Dealer profile) | Dealer |
| `DELETE` | `/vehicles/:id` | Remove vehicle (owner-scoped via Dealer profile) | Dealer |
| `GET` | `/vehicles/stats/dashboard` | Vehicle count stats | Admin |

### Dealers (Public + Dashboard)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/dealers` | List all dealers (filterable by city) | Public |
| `GET` | `/dealers/:id` | Dealer public profile | Public |
| `PUT` | `/dealers/profile` | Update dealer profile + sync Dealer doc | Dealer |
| `PUT` | `/dealers/dashboard/profile` | Alias for profile update | Dealer |
| `GET` | `/dealers/dashboard/stats` | Dealer KPIs (vehicles, bookings, earnings) | Dealer |
| `GET` | `/dealers/dashboard/vehicles` | Dealer's own fleet | Dealer |
| `GET` | `/dealers/dashboard/bookings` | Dealer's incoming bookings | Dealer |
| `POST` | `/dealers/dashboard/car-requests` | Submit a customer car request lead | Public |
| `GET` | `/dealers/dashboard/car-requests` | Read incoming car request leads | Dealer |

### Bookings
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | Create booking | User |
| `GET` | `/bookings` | All bookings on dealer's fleet | Dealer |
| `GET` | `/bookings/mybookings` | Logged-in user's bookings | User |
| `PUT` | `/bookings/:id/review` | Approve or deny booking | Dealer |
| `PUT` | `/bookings/:id/cancel` | Cancel a booking | User |
| `PUT` | `/bookings/:id/dates` | Modify booking dates | User |

### Tour Packages (Caravans)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/caravans` | List tour packages | Public |
| `GET` | `/caravans/:id` | Tour package details | Public |
| `POST` | `/caravans` | Create tour package | Admin |
| `PUT` | `/caravans/:id` | Update tour package | Admin |
| `DELETE` | `/caravans/:id` | Delete tour package | Admin |

### Payments
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/payment/razorpay/order` | Create Razorpay order | User |
| `POST` | `/payment/razorpay/verify` | Verify payment signature | User |

---

## Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://carawinn.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Partner Portal (`partner/.env`)
```env
VITE_API_URL=https://carawinn.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Local Development

```bash
# Backend
cd backend
npm install
npm run dev        # runs on :5000

# Customer Marketplace
cd frontend
npm install
npm run dev        # runs on :5173

# Partner Portal
cd partner
npm install
npm run dev        # runs on :5174
```

To seed the database with demo dealers, vehicles, and tour packages:
```bash
cd backend
node seeder.js
```

---

**Built by Bhaskar Shamo Ray**
