# Static Data Documentation

This document explains the static/mock data available in the UrbanCruizo project for development, testing, and UI demonstrations.

## 📁 Available Static Data Files

### Frontend Static Data
**Location:** `frontend/src/data/staticData.js`

This file contains all mock data for frontend development and testing.

#### Exports:

1. **CITIES** - Array of major Indian cities with images and coordinates
   - Usage: City selection, landing page, filters
   - Fields: name, image, description, coordinates

2. **MOCK_VEHICLES** - Sample vehicles across different cities
   - Usage: Testing listing pages, vehicle details, search functionality
   - Includes: Cars, bikes, luxury vehicles in Delhi, Mumbai, Bangalore
   - Fields: title, type, category, brand, model, year, etc.

3. **MOCK_CARAVANS** - Sample caravan listings
   - Usage: Caravan listing page, caravan details
   - Includes: Different caravan types with amenities

4. **MOCK_DEALERS** - Sample dealer information
   - Usage: Dealer listing, dealer details pages
   - Fields: name, city, contact, rating, vehicle count

5. **MOCK_BOOKINGS** - Sample booking records
   - Usage: User dashboard, booking history, admin dashboard
   - Includes: Different booking statuses (pending, confirmed, completed)

6. **MOCK_TESTIMONIALS** - Customer reviews and ratings
   - Usage: Homepage testimonials section
   - Fields: userName, rating, text, userImage

7. **MOCK_USERS** - Sample user accounts
   - Usage: Authentication testing, user management
   - Includes: Regular users and admin accounts

8. **Other Constants:**
   - `AMENITIES` - Feature list for vehicles
   - `CAR_CATEGORIES` - Car types
   - `BIKE_CATEGORIES` - Bike types
   - `FUEL_TYPES` - Fuel options
   - `TRANSMISSION_TYPES` - Transmission options
   - `FAQ_DATA` - Common questions and answers
   - `FEATURES` - Platform features for homepage

### Backend Constants
**Location:** `backend/constants/index.js`

This file contains backend configuration constants and enums.

#### Exports:

1. **CITIES** - Array of supported cities
2. **Vehicle Type Enums** - VEHICLE_TYPES, CAR_CATEGORIES, BIKE_CATEGORIES
3. **Settings** - DEFAULT_SETTINGS with KMS_LIMIT, MIN_AGE, etc.
4. **Status Enums** - BOOKING_STATUS, USER_ROLES
5. **Error/Success Messages** - Predefined message templates
6. **CITY_COORDINATES** - GPS coordinates for geolocation
7. **POPULAR_VEHICLES** - Data for vehicle search/filtering

## 🚀 How to Use

### Frontend Usage

#### Import static data:
```javascript
import { CITIES, MOCK_VEHICLES, MOCK_DEALERS } from '../data/staticData.js';
```

#### Use for initial UI:
```javascript
// Without API connection
const [vehicles, setVehicles] = useState(MOCK_VEHICLES);

// Or as fallback when API fails
try {
  const data = await fetchFromAPI();
  setVehicles(data);
} catch (error) {
  setVehicles(MOCK_VEHICLES); // Fallback to mock data
}
```

#### Use in components:
```javascript
const HomePage = () => {
  const [cities] = useState(CITIES);
  
  return (
    <div>
      {cities.map(city => (
        <CityCard key={city.name} city={city} />
      ))}
    </div>
  );
};
```

### Backend Usage

#### Import constants:
```javascript
const {
  VEHICLE_TYPES,
  CAR_CATEGORIES,
  BOOKING_STATUS,
  DEFAULT_SETTINGS
} = require('./constants/index.js');
```

#### Use in validation:
```javascript
if (![VEHICLE_TYPES.CAR, VEHICLE_TYPES.BIKE].includes(type)) {
  throw new Error('Invalid vehicle type');
}
```

#### Use in enums and defaults:
```javascript
const vehicle = {
  type: VEHICLE_TYPES.CAR,
  category: CAR_CATEGORIES.SUV,
  kmsLimitPerDay: DEFAULT_SETTINGS.KMS_LIMIT_PER_DAY
};
```

## 🗄️ Database Seeding

### Seed Database with Mock Data
Run the seeder to populate the database with sample data:

```bash
cd backend
npm run seed
# or
node seeder.js
```

This will create:
- 4 sample users (including admin and dealers)
- 15+ sample vehicles across multiple cities
- 3 sample bookings
- Various caravan listings

## 📊 Mock Data Structure

### Vehicle Object:
```javascript
{
  _id: 'vehicle1',
  title: 'Maruti Suzuki Swift',
  type: 'car',
  category: 'hatchback',
  brand: 'Maruti Suzuki',
  model: 'Swift ZXI+',
  year: 2023,
  transmission: 'Manual',
  fuelType: 'Petrol',
  seats: 5,
  pricePerHour: 150,
  pricePerDay: 1800,
  securityDeposit: 3000,
  city: 'Delhi',
  images: ['url'],
  location: 'Connaught Place, Delhi',
  kmsLimitPerDay: 240,
  extraKmCharge: 12,
  availability: true,
  rating: 4.5,
  owner: 'admin@urbancruizo.in'
}
```

### Booking Object:
```javascript
{
  _id: 'booking1',
  vehicleId: '1',
  vehicleTitle: 'Maruti Suzuki Swift',
  userId: 'user1',
  userName: 'Ravi Kumar',
  startDate: '2024-02-20',
  endDate: '2024-02-23',
  days: 3,
  totalPrice: 5400,
  status: 'confirmed',
  pickupLocation: 'Delhi Airport',
  dropLocation: 'Connaught Place'
}
```

## ⚙️ Using Static Data for Testing

### Component Testing:
```javascript
import { render } from '@testing-library/react';
import { MOCK_VEHICLES } from '../data/staticData';
import VehicleCard from './VehicleCard';

test('renders vehicle card', () => {
  render(<VehicleCard vehicle={MOCK_VEHICLES[0]} />);
  // Test assertions...
});
```

### API Response Mocking:
```javascript
// In your API mock setup
jest.mock('../utils/api', () => ({
  get: jest.fn((url) => {
    if (url === '/vehicles') {
      return Promise.resolve({ data: MOCK_VEHICLES });
    }
  })
}));
```

## 🔄 Updating Static Data

When adding new features or vehicle types:

1. Update `frontend/src/data/staticData.js` with new mock entries
2. Update `backend/constants/index.js` with new constants
3. Update `backend/seeder.js` to create new database entries
4. Update this documentation

## 🎯 Key Features of Static Data

✅ **Complete vehicle details** - All necessary vehicle information
✅ **Multiple cities** - Coverage across 8+ Indian cities
✅ **Real images** - External image URLs for realistic preview
✅ **Price variations** - Different price points for testing
✅ **Various categories** - Hatchback, sedan, SUV, luxury, bikes
✅ **Sample bookings** - Different booking statuses for testing
✅ **User testimonials** - Reviews for social proof sections
✅ **Dealer information** - Multi-dealer setup simulation

## 📝 Notes

- All URLs point to external sources and work in production
- Coordinates are accurate for real city locations
- Prices are realistic for Indian market
- Mock data is suitable for frontend development, testing, and demos
- For production, always use actual database data

## 🔗 Related Files

- Backend Models: `backend/models/`
- Frontend Pages: `frontend/src/pages/`
- API Endpoints: `backend/routes/`
- Context Providers: `frontend/src/context/`

---

**Last Updated:** February 2024
**Status:** Production Ready
