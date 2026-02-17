// Constants and Static Data for Backend

export const CITIES = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Jaipur'
];

export const VEHICLE_TYPES = {
    CAR: 'car',
    BIKE: 'bike',
    CARAVAN: 'caravan'
};

export const CAR_CATEGORIES = {
    HATCHBACK: 'hatchback',
    SEDAN: 'sedan',
    SUV: 'suv',
    LUXURY: 'luxury',
    COMMUTER: 'commuter'
};

export const BIKE_CATEGORIES = {
    ROYAL_ENFIELD: 'royal-enfield',
    STANDARD: 'standard',
    PREMIUM: 'premium'
};

export const CARAVAN_CATEGORIES = {
    STANDARD: 'standard',
    PREMIUM: 'premium'
};

export const FUEL_TYPES = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    ELECTRIC: 'Electric',
    CNG: 'CNG',
    HYBRID: 'Hybrid'
};

export const TRANSMISSION_TYPES = {
    AUTOMATIC: 'Automatic',
    MANUAL: 'Manual'
};

export const USER_ROLES = {
    USER: 'user',
    DEALER: 'dealer',
    ADMIN: 'admin'
};

export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const DEFAULT_SETTINGS = {
    KMS_LIMIT_PER_DAY: 240,
    MIN_AGE_REQUIREMENT: 18,
    MIN_LICENSE_TENURE_YEARS: 2,
    SECURITY_DEPOSIT_PERCENTAGE: 20,
    CANCELLATION_HOURS: 24
};

export const PRICE_CONFIG = {
    EXTRA_KM_CHARGE_BASE: 10,
    HOURLY_TO_DAILY_RATIO: 24,
    MINIMUM_BOOKING_HOURS: 1
};

export const AMENITIES = [
    'Air Conditioning',
    'Heating',
    'WiFi',
    'Power Outlets',
    'Kitchenette',
    'Bathroom',
    'Premium Bedding',
    'Entertainment System',
    'Storage',
    'Solar Power',
    'Bluetooth',
    'USB Charging',
    'Luggage Rack',
    'Child Seat',
    'Airbags',
    'ABS',
    'Parking Sensors',
    'Cruise Control'
];

export const POPULAR_VEHICLES = [
    {
        brand: 'Maruti Suzuki',
        models: ['Swift', 'Dzire', 'Vitara Brezza', 'Wagon R']
    },
    {
        brand: 'Hyundai',
        models: ['i20', 'Creta', 'Verna', 'Venue']
    },
    {
        brand: 'Tata',
        models: ['Nexon', 'Nexon EV', 'Harrier', 'Tigor']
    },
    {
        brand: 'Mahindra',
        models: ['Thar', 'KUV100', 'XUV300', 'XUV700']
    },
    {
        brand: 'Honda',
        models: ['City', 'Civic', 'CR-V', 'Jazz']
    },
    {
        brand: 'Toyota',
        models: ['Innova', 'Fortuner', 'Corolla', 'Camry']
    },
    {
        brand: 'Kia',
        models: ['Seltos', 'Sonet', 'Niro', 'Carens']
    },
    {
        brand: 'BMW',
        models: ['X5', '3 Series', '5 Series', 'X3']
    },
    {
        brand: 'Mercedes-Benz',
        models: ['C-Class', 'E-Class', 'GLC', 'GLE']
    },
    {
        brand: 'Royal Enfield',
        models: ['Classic 350', 'Bullet 350', 'Hunter 350', 'Interceptor']
    },
    {
        brand: 'Honda',
        models: ['CB350H', 'CB Shine', 'CB Hornet', 'CB Unicorn']
    }
];

export const CITY_COORDINATES = {
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 }
};

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    NOT_FOUND: 'Resource not found',
    INVALID_INPUT: 'Invalid input provided',
    DATABASE_ERROR: 'Database error occurred',
    SERVER_ERROR: 'Internal server error'
};

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    BOOKING_CREATED: 'Booking created successfully',
    BOOKING_CANCELLED: 'Booking cancelled successfully',
    UPDATE_SUCCESS: 'Update successful',
    DELETE_SUCCESS: 'Delete successful'
};

export const EMAIL_TEMPLATES = {
    WELCOME: 'welcome',
    VERIFICATION: 'verification',
    BOOKING_CONFIRMATION: 'booking_confirmation',
    BOOKING_REMINDER: 'booking_reminder',
    CANCELLATION: 'cancellation',
    PASSWORD_RESET: 'password_reset'
};

// Rating and Reviews
export const RATING_SCALES = {
    POOR: 1,
    FAIR: 2,
    GOOD: 3,
    VERY_GOOD: 4,
    EXCELLENT: 5
};

// API Response Codes
export const RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500
};
