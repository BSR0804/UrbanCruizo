# UrbanCruizo — Premium Vehicle Rental & Luxury Tour Marketplace

UrbanCruizo is a full-stack vehicle rental platform connecting premium fleet owners (dealers) with travelers across India. It features a customer-facing marketplace, an embedded dealer dashboard, a Node.js/MongoDB backend with role-based access control, Razorpay payment integration, and a per-tab dual-session authentication model that lets a customer and a dealer be logged into the same browser without conflict.

---

## Live Deployments

| App | URL |
| :--- | :--- |
| Customer Marketplace + Dealer Dashboard | [caraw-inn.vercel.app](https://caraw-inn.vercel.app/) |
| Partner Portal (legacy standalone app) | [carawinn-partner.vercel.app](https://carawinn-partner.vercel.app/) |
| Backend API | [carawinn.onrender.com/api/v1](https://carawinn.onrender.com/api/v1) |
| GitHub | [BSR0804/UrbanCruizo](https://github.com/BSR0804/UrbanCruizo) |

---

## Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Auth:** JWT (30-day tokens) + Google OAuth 2.0 via access-token verification (`googleapis.com/oauth2/v3/userinfo`)
- **Passwords:** Bcrypt.js
- **Payments:** Razorpay (order creation + signature verification + sandbox mode for mock vehicle IDs)
- **File handling:** Base64 data-URL ingestion for verification documents (driving license, Aadhaar front + back, passport, selfie). Body parser limit raised to **20 MB** to accommodate inline document payloads.
- **CORS:** Reflective `origin: true` with credentials enabled for cross-Vercel-deploy access

### Frontend (Customer Marketplace + embedded Dealer Dashboard)
- **Framework:** React 19 + Vite 7
- **Routing:** React Router v6 with route-aware authentication context
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Auth:** `@react-oauth/google` + custom dual-session JWT context
- **Per-tab session model:** Sessions live in `sessionStorage` (tab-scoped) with a `localStorage` fallback for cross-tab resume — logging out of one tab does **not** sign you out of other tabs
- **Dashboard cache:** `sessionStorage` snapshot of the user's bookings so the dashboard renders instantly while the live API fetch happens in the background (mitigates Render free-tier cold starts)

### Partner Portal (legacy standalone app)
- Standalone React + Vite app retained as `partner/` workspace with isolated `uc_partner` storage
- Marketing pages (Landing, Features, Benefits, Performance), Login, Register, Dashboard
- Production traffic is now served from the main frontend at `caraw-inn.vercel.app/dealer/dashboard`; the standalone partner app is preserved for reference and as a fallback deployment

---

## Project Structure

```
UrbanCruizo/
├── backend/
│   ├── config/
│   │   └── db.js                       # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js           # Login, register, Google OAuth (no role mutation on login)
│   │   ├── CarRequestController.js     # Customer vehicle requests (lead gen)
│   │   ├── dealerController.js         # Public dealer listing & profiles
│   │   ├── dealerDashboardController.js # Dealer-auth: profile, fleet, bookings, earnings (Dealer-resolved by email)
│   │   ├── vehicleController.js        # Vehicle CRUD (owner check resolves Dealer via user email)
│   │   ├── bookingController.js        # Booking lifecycle (Dealer-scoped review/list, base64 doc fields)
│   │   ├── caravanController.js        # Tour packages (TourPackage model, /caravans alias retained)
│   │   └── paymentController.js        # Razorpay order + signature verification + mock-vehicle sandbox
│   ├── middleware/
│   │   └── authMiddleware.js           # protect, dealer, admin guards
│   ├── models/
│   │   ├── User.js                     # Customers + dealer user accounts
│   │   ├── Dealer.js                   # Public dealer listing (separate collection — Vehicle.owner refs this)
│   │   ├── Vehicle.js                  # Fleet — title, brand, model, year, type, category, transmission, fuelType, seats, capacity, mileage, pricing, images, availability, kmsLimitPerDay, extraKmCharge
│   │   ├── Booking.js                  # Rental bookings — bookingName/Email/Phone/Address/Age, drivingLicenseNumber, aadhaarNumber, country, isForeigner, licenseImage, aadhaarImage, aadhaarBackImage, selfieImage, passportImage, status, paymentStatus, paymentId
│   │   ├── TourPackage.js              # Curated tour packages
│   │   ├── Caravan.js                  # Legacy caravan model (retained for backwards compatibility)
│   │   └── CarRequest.js               # Customer vehicle requests
│   ├── routes/
│   │   ├── v1.js                       # API v1 router (mounts all sub-routers)
│   │   ├── authRoutes.js               # /auth/* endpoints
│   │   ├── bookingRoutes.js            # /bookings/* endpoints
│   │   ├── caravanRoutes.js            # /caravans/* endpoints (tour packages)
│   │   ├── dealerRoutes.js             # /dealers/* endpoints (public + dashboard + car-requests)
│   │   ├── paymentRoutes.js            # /payment/razorpay/* endpoints
│   │   └── vehicleRoutes.js            # /vehicles/* endpoints
│   ├── seeder.js                       # Seed 16 dealers, 45 vehicles, 3 tour packages
│   ├── server.js                       # Express bootstrap (express.json limit: 20mb)
│   └── vercel.json                     # Vercel function config (also deployable to Render)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx, HomePage.jsx, DestinationGateway.jsx
│   │   │   ├── LoginPage.jsx, RegisterPage.jsx
│   │   │   ├── VehicleListingPage.jsx, VehicleDetailsPage.jsx, DealerVehiclesPage.jsx
│   │   │   ├── CaravanListingPage.jsx, CaravanDetailsPage.jsx
│   │   │   ├── DashboardPage.jsx       # Customer bookings — instant render from sessionStorage cache
│   │   │   ├── DealerDashboard.jsx     # Embedded dealer dashboard at /dealer/dashboard
│   │   │   ├── AdminPage.jsx, PartnerLanding.jsx
│   │   │   ├── BenefitsPage.jsx, FeaturesPage.jsx, PerformancePage.jsx
│   │   │   ├── HelpCenterPage.jsx, PrivacyPolicyPage.jsx, RentalPolicyPage.jsx, TermsOfServicePage.jsx
│   │   ├── components/
│   │   │   ├── BookingFormModal.jsx    # File→base64 upload, license + Aadhaar (front+back) + selfie + passport
│   │   │   ├── PaymentModal.jsx        # Razorpay checkout integration
│   │   │   ├── BookingDetailsModal.jsx, EditDatesModal.jsx, ConfirmActionModal.jsx
│   │   │   ├── TripPlanner.jsx, TourBookingFormModal.jsx
│   │   │   ├── CarRequestModal.jsx     # Customer-side car request (lead gen)
│   │   │   ├── Header.jsx, Footer.jsx, ScrollToTop.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Per-tab dual-session: uc_user (customer) + uc_partner (dealer/admin)
│   │   │   └── CityContext.jsx         # Selected city for marketplace filtering
│   │   ├── utils/api.js                # Axios — picks token from uc_partner on /dealer|/partner|/admin routes, uc_user elsewhere; sessionStorage first, localStorage fallback
│   │   ├── data/staticData.js          # Mock fallback data for offline/demo mode
│   │   ├── assets/                     # Static SVG/asset imports
│   │   ├── App.jsx, App.css, index.css # Root component & global styles
│   │   └── main.jsx                    # Vite entry
│   ├── public/images/                  # Vehicle & tour imagery
│   └── vercel.json                     # SPA rewrite to index.html
├── partner/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx             # Partner landing page
│   │   │   ├── BenefitsPage.jsx        # Partner benefits showcase
│   │   │   ├── FeaturesPage.jsx        # Partner features showcase
│   │   │   ├── PerformancePage.jsx     # Partner performance/metrics page
│   │   │   ├── Login.jsx, Register.jsx
│   │   │   └── Dashboard.jsx           # Standalone dealer dashboard (legacy)
│   │   ├── context/AuthContext.jsx     # uc_partner localStorage key
│   │   ├── utils/api.js                # Axios instance with uc_partner token
│   │   ├── App.jsx, index.css, main.jsx
│   └── vercel.json
├── STATIC_DATA_GUIDE.md                # Documentation for mock/seed data
└── README.md
```

---

## Key Features

### Dealer Flow
1. Partner opens `/destination-gateway` → "Partner With Us" → `/login?role=dealer`
2. Logs in or registers via `/register?role=dealer`
3. Completes business profile → `Dealer` document is auto-created/upserted via the dealer's email
4. Dealer card immediately appears on the customer marketplace under their selected city
5. Dealer adds vehicles via the **Add Vehicle** modal (full spec form with conditional fields)
6. Customer submits booking with verification documents → request lands in **Booking Requests → Requests** with full document review (lightbox modal)
7. Dealer Approves or Rejects → status moves to **Approved** (awaiting customer payment) or **Rejected**
8. Customer pays via Razorpay → status moves to **Confirmed** → appears in **Earnings History** as Disbursed
9. Booking auto-completes after `endDate` passes (cron-on-read)

### Customer Flow
1. User lands on `/destination-gateway` → "Join UrbanCruizo" → `/login?role=user`
2. Browses marketplace by city, vehicle category (hatchback/sedan/suv/luxury/commuter/sports/royal-enfield/standard/premium), or fuel type
3. Selects a vehicle → fills booking form with personal details (name, email, phone, age, license number, Aadhaar number or country)
4. Uploads verification documents:
   - **Driving License** (single image)
   - **Aadhaar (Front + Back)** for Indian nationals
   - **Passport** for foreign nationals
   - **Selfie** (always required)
5. Submits booking → toast confirms "Application Submitted! Your request is pending dealer approval."
6. Tracks bookings on `/dashboard` (instant render from cache, live data refreshes in background)
7. After dealer approval, pays via Razorpay → booking is Confirmed
8. Can view details, reschedule dates, or cancel from the customer dashboard

### Auth System
- **Per-tab dual-session model:** Sessions are scoped to each browser tab using `sessionStorage`, with a `localStorage` fallback so opening a brand-new tab still resumes the session. Logging out from one tab does **not** affect other tabs.
- **Two coexisting roles in one browser:** `uc_user` holds the customer session, `uc_partner` holds the dealer/admin session. Both can be active simultaneously without overwrites.
- **Route-aware context:** `useAuth()` returns the customer session on `/`, `/home`, `/dashboard`, `/vehicles/*`, `/caravans/*`; the partner session on `/dealer/*`, `/partner/*`, `/admin/*`.
- **Intent-driven persistence:** the login type chosen on the login page (Customer vs Partner) determines which storage key the session lands in. Even if a DB record's role was corrupted by a legacy bug, the user can still log into the correct portal.
- **API token routing:** the Axios interceptor reads the right token (`uc_partner` token on partner routes, `uc_user` token elsewhere) so each tab calls the API with its own credentials.
- **Email/password** login with Bcrypt comparison; backend never mutates `user.role` on login (the legacy auto-upgrade behavior was removed).
- **Google OAuth** via access token. Accounts created via Google cannot use email/password login (explicit error message).
- **Vehicle/Booking ownership:** dealer authorization resolves the `Dealer` profile via the logged-in user's email and compares against `Vehicle.owner` (which references `Dealer._id`, not `User._id`). This applies to vehicle CRUD AND booking review/list endpoints.

### Partner Dashboard (`/dealer/dashboard`)
- **Fleet management:** add, edit, remove vehicles with full spec forms
  - Vehicle category dropdown matched to backend enum (hatchback / sedan / suv / luxury / commuter / sports / royal-enfield / standard / premium)
  - Fuel type dropdown (Petrol / Diesel / CNG / Electric / Hybrid)
  - Conditional fuel tank capacity field — automatically hidden when fuel type is Electric
  - Mileage (km/ltr) and seat-count inputs
  - Existing images render as thumbnails on edit with hover-to-delete; new uploads append to the set (base64 data URLs)
  - Availability status dropdown (Available / Booked-or-Maintenance) — change syncs to customer side immediately
- **Booking requests:** approve, reject, and inspect customer-submitted documents
  - Three sections: **Requests** (pending), **Approved** (awaiting payment / confirmed / ongoing / completed), **Rejected** (rejected / cancelled)
  - Verification details panel shows age, driving license number, Aadhaar number, country
  - Documents panel renders thumbnail buttons for Driving License, Aadhaar (Front), Aadhaar (Back), Passport, Selfie
  - Clicking a document opens an **in-page lightbox modal** (works with base64 data URLs, which browsers block in `window.open`)
- **Earnings history:** only shows bookings where `paymentStatus === 'paid'` OR `status === 'confirmed'` OR `status === 'completed'`. Approved-but-unpaid bookings are excluded.
- **Live notification bell:** shows pending booking count with pulsing indicator
- **Smart location display:** card view filters empty values so listings never show stray commas

### Customer-Side Vehicle Discovery
- **VehicleListingPage** — dealer cards filtered by city, with vehicle counts
- **DealerVehiclesPage** — individual vehicles for a chosen dealer
  - Unavailable vehicles render with grayscale image, "Currently Unavailable" red banner, and the View Details link is replaced with a "Booked / Maintenance" status label
- **VehicleDetailsPage** — full specs, gallery, dynamic pricing, embedded Google Map of dealer city
  - Reserve Now button is replaced with a "Currently Unavailable — Booked or Under Maintenance" message when `availability === false`
  - Get Directions on Google Maps link uses the vehicle's city
  - Dealer location map auto-zooms to the saved city

### Booking Verification Documents
- Customer-side `BookingFormModal` collects driving license, Aadhaar front + back (Indian) or Passport (foreign), and a selfie
- Files are converted to base64 data URLs in the browser and sent inline as JSON — no separate upload endpoint or storage bucket needed
- Backend persists each as a string field on the `Booking` document
- Dealer dashboard renders documents in an in-page lightbox modal so the dealer can review without opening a new tab
- Body parser raised to **20 MB** so all four documents fit comfortably in a single JSON request

### Tour Packages
- Stored in `TourPackage` collection (replaces legacy `Caravan` model)
- Served via `/api/v1/caravans` routes (backwards-compatible alias)
- Includes: pricing, duration, city, amenities, images, organizer contact

### Payments
- Razorpay order created on backend, verified by signature on completion
- Sandbox mode auto-triggers for mock vehicle IDs (length < 10 or non-ObjectId) so demo bookings work without real Razorpay setup
- Security deposit captured separately from rental cost
- 18% GST line item, 10% platform commission deducted from dealer earnings

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new account | Public |
| `POST` | `/auth/login` | Email/password login (no role mutation) | Public |
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
| `GET` | `/dealers/dashboard/stats` | Dealer KPIs (vehicles, bookings, earnings — earnings filtered to confirmed/ongoing/completed) | Dealer |
| `GET` | `/dealers/dashboard/vehicles` | Dealer's own fleet | Dealer |
| `GET` | `/dealers/dashboard/bookings` | Dealer's incoming bookings | Dealer |
| `POST` | `/dealers/dashboard/car-requests` | Submit a customer car request lead | Public |
| `GET` | `/dealers/dashboard/car-requests` | Read incoming car request leads | Dealer |

### Bookings
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | Create booking. Body: `vehicleId`, `startDate`, `endDate`, `rentalType`, `bookingName`, `bookingEmail`, `bookingPhone`, `bookingAddress`, `bookingAge`, `drivingLicenseNumber`, `aadhaarNumber`, `country`, `isForeigner`, plus base64 doc URLs `licenseImage`, `aadhaarImage`, `aadhaarBackImage`, `selfieImage`, `passportImage`. Backend rejects on date overlap with approved/confirmed/ongoing bookings. | User |
| `GET` | `/bookings` | All bookings on dealer's fleet (dealer-scoped via `Dealer` profile) | Dealer |
| `GET` | `/bookings/mybookings` | Logged-in user's bookings (auto-completes past confirmed bookings) | User |
| `PUT` | `/bookings/:id/review` | Approve or deny booking (owner-scoped via `Dealer` profile) | Dealer |
| `PUT` | `/bookings/:id/cancel` | Cancel a booking | User |
| `PUT` | `/bookings/:id/dates` | Modify booking dates (resets to pending_approval) | User |

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
| `POST` | `/payment/razorpay/order` | Create Razorpay order (auto-sandboxes for mock vehicle IDs) | User |
| `POST` | `/payment/razorpay/verify` | Verify payment signature; if `bookingId` is provided, marks booking as `confirmed` + `paid` | User |

---

## Booking Status Lifecycle

```
pending_approval  ──Dealer Reject──►  rejected
       │
       └──Dealer Approve──►  approved
                                │
                                └──Customer Pay──►  confirmed
                                                       │
                                                       └──endDate passes──►  completed

User Cancel from any state (own bookings only)  ──►  cancelled
```

- **pending_approval** — booking created, awaiting dealer review
- **approved** — dealer approved, awaiting customer payment (NOT counted in earnings)
- **rejected** — dealer rejected
- **confirmed** — payment received and verified
- **ongoing** — booking is currently in progress (between startDate and endDate)
- **completed** — endDate passed (auto-set on read)
- **cancelled** — user cancelled

---

## Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
NODE_ENV=production
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://carawinn.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
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

# Customer Marketplace + Dealer Dashboard
cd frontend
npm install
npm run dev        # runs on :5173

# Partner Portal (legacy standalone)
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

## Deployment Notes

- **Backend on Render:** free tier spins down after inactivity. The first request after a cold start can take 30–60 s. The customer dashboard mitigates this with a `sessionStorage` cache so the user sees their bookings instantly while the live fetch happens in the background.
- **Frontend on Vercel:** automatic deploys from `main`. Three Vercel projects exist — one for `frontend/`, one for `partner/`, and one for `backend/` (mirror).
- **MongoDB Atlas:** all collections live in a single cluster. The `Dealer` collection is separate from `User` to keep public dealer profiles independent of authentication records.
- **Body size limits:** if you fork and add more upload fields, increase `express.json({ limit: '20mb' })` in `backend/server.js` accordingly.

---

## Recent Architectural Decisions

- **Removed legacy role auto-upgrade** in `authController` — login no longer mutates `user.role` based on the requested portal. Role corruption that caused customer lockouts is now impossible at the source.
- **Dealer ownership check** uses email-based `Dealer` lookup instead of `req.user._id` comparison, since `Vehicle.owner` references `Dealer._id` (not `User._id`).
- **Per-tab session storage** replaces the original cross-tab `localStorage` model, eliminating the multi-tab logout cascade bug.
- **Driving license collection simplified** to a single image (no front+back); Aadhaar collection requires both front and back images.
- **Document review uses an in-page lightbox modal** instead of `window.open` because browsers block direct navigation to `data:image/...` URLs.
- **Earnings history filter** excludes `approved` bookings — only `confirmed`, `ongoing`, and `completed` count, preventing inflation of dealer revenue from approved-but-unpaid requests.

---

**Built by Bhaskar Shamo Ray**
