const dotenv = require('dotenv');
const User = require('./models/User');
const Dealer = require('./models/Dealer');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const TourPackage = require('./models/TourPackage');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// ─── DEALERS ────────────────────────────────────────────────────────────────
const DEALERS = [
    // Delhi
    { name: 'Delhi Luxury Motors',        email: 'delhi.luxury@urbancruizo.in',   city: 'Delhi',     location: 'Karol Bagh',           phone: '+91-98765-43210' },
    { name: 'Capital City Wheels',        email: 'capital.wheels@urbancruizo.in', city: 'Delhi',     location: 'Dwarka Sector 10',     phone: '+91-99887-76655' },
    { name: 'Metro Auto House',           email: 'metro.auto@urbancruizo.in',     city: 'Delhi',     location: 'Saket District Centre', phone: '+91-95544-33221' },
    // Mumbai
    { name: 'Mumbai Wheels Express',      email: 'hello@mumbaiweels.in',          city: 'Mumbai',    location: 'Juhu Beach',            phone: '+91-98765-54321' },
    { name: 'Gateway Premium Rides',      email: 'gateway@premiumrides.in',       city: 'Mumbai',    location: 'Bandra West',           phone: '+91-98200-11223' },
    // Bangalore
    { name: 'Tech City Rentals Bangalore',email: 'info@techcityrentals.com',      city: 'Bangalore', location: 'Indiranagar',           phone: '+91-98765-65432' },
    { name: 'Namma Bengaluru Cars',       email: 'namma@bengalurucars.in',        city: 'Bangalore', location: 'Koramangala',           phone: '+91-98450-11223' },
    { name: 'Silicon Valley Wheels',      email: 'sv@siliconvalleywheels.in',     city: 'Bangalore', location: 'Whitefield',            phone: '+91-98450-22334' },
    // Hyderabad
    { name: 'Hyderabad Luxury Fleet',     email: 'rentals@hdfleet.in',            city: 'Hyderabad', location: 'Hitech City',           phone: '+91-98765-76543' },
    { name: 'Deccan Wheels',              email: 'info@deccanwheels.in',           city: 'Hyderabad', location: 'Banjara Hills',         phone: '+91-99490-11223' },
    // Chennai
    { name: 'Chennai Coastal Rentals',    email: 'rental@chennaicostal.in',       city: 'Chennai',   location: 'Marina Beach',          phone: '+91-98765-87654' },
    // Pune
    { name: 'Pune Adventure Motors',      email: 'adventure@punomotors.in',       city: 'Pune',      location: 'Koregaon Park',         phone: '+91-98765-98765' },
    { name: 'Western Ghats Rides',        email: 'rides@westernghats.in',         city: 'Pune',      location: 'Hinjewadi',             phone: '+91-98230-22334' },
    // Kolkata
    { name: 'Kolkata Heritage Rides',     email: 'heritage@kokolcars.in',         city: 'Kolkata',   location: 'Park Street',           phone: '+91-98765-11111' },
    // Jaipur
    { name: 'Jaipur Royal Cars',          email: 'royal@jaipurcars.in',           city: 'Jaipur',    location: 'City Palace',           phone: '+91-98765-22222' },
    { name: 'Desert Safari Motors',       email: 'desert@safarimotors.in',        city: 'Jaipur',    location: 'Tonk Road',             phone: '+91-98290-33445' },
];

// ─── VEHICLES ────────────────────────────────────────────────────────────────
// dealerName must match one of the names above (or city fallback is used)
const VEHICLES = [
    // ── Delhi Luxury Motors ──
    {
        title: 'Maruti Suzuki Swift', type: 'car', category: 'hatchback',
        brand: 'Maruti Suzuki', model: 'Swift ZXI+', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 5,
        pricePerHour: 150, pricePerDay: 1800, securityDeposit: 3000,
        city: 'Delhi', dealerName: 'Delhi Luxury Motors',
        images: ['/images/maruti-suzuki-swift.jfif', '/images/maruti-suzuki-swift-interior-1.jfif', '/images/maruti-suzuki-swift-interior-2.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 12, mileage: 20.5, availability: true, rating: 4.5,
        description1: 'The Maruti Swift 2023 offers a nimble, light-footed driving experience that is perfect for city navigation.',
        description2: 'Equipped with a 5-star build and 6 SRS airbags, this hatchback ensures you are protected on every turn.',
    },
    {
        title: 'Hyundai i20', type: 'car', category: 'hatchback',
        brand: 'Hyundai', model: 'i20 Asta', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 130, pricePerDay: 1600, securityDeposit: 2500,
        city: 'Delhi', dealerName: 'Delhi Luxury Motors',
        images: ['/images/i20.jpg', '/images/i20-interior-1.avif', '/images/i20-interior-3.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 10, mileage: 20.5, availability: true, rating: 4.3,
        description1: 'Step into sophistication with the Hyundai i20, featuring sharp aesthetic lines and a tech-rich interior.',
        description2: 'Safety is paramount with 6 standard airbags and a suite of advanced features.',
    },
    {
        title: 'Mahindra Thar 4x4', type: 'car', category: 'suv',
        brand: 'Mahindra', model: 'Thar LX Hard Top', year: 2024,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 4,
        pricePerHour: 400, pricePerDay: 4500, securityDeposit: 5000,
        city: 'Delhi', dealerName: 'Delhi Luxury Motors',
        images: ['/images/thar.jpg', '/images/thar-interior-1.jpg', '/images/thar-interior-2.jpeg'],
        kmsLimitPerDay: 200, extraKmCharge: 18, mileage: 14.8, availability: true, rating: 4.7,
        description1: 'The Mahindra Thar 4x4 is a rugged icon built for those who seek adventure beyond the pavement.',
        description2: 'Experience the raw power of the mStallion engine paired with an advanced 4WD system.',
    },
    // ── Capital City Wheels ──
    {
        title: 'Kia Seltos', type: 'car', category: 'suv',
        brand: 'Kia', model: 'Seltos Tech Line', year: 2023,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 5,
        pricePerHour: 350, pricePerDay: 4000, securityDeposit: 5000,
        city: 'Delhi', dealerName: 'Capital City Wheels',
        images: ['/images/seltos.avif', '/images/seltos-interior-1.avif', '/images/seltos-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 16, mileage: 14.8, availability: true, rating: 4.4,
        description1: 'The Kia Seltos offers an engaging driving experience with sharp handling and composed stability across all speeds.',
        description2: 'Equipped with 6 standard airbags and advanced driver-assistance systems.',
    },
    {
        title: 'Honda City', type: 'car', category: 'sedan',
        brand: 'Honda', model: 'City ZX', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 200, pricePerDay: 2500, securityDeposit: 3000,
        city: 'Delhi', dealerName: 'Capital City Wheels',
        images: ['/images/honda-city.avif', '/images/honda-city-interior-1.avif', '/images/honda-city-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 12, mileage: 18.2, availability: true, rating: 4.6,
        description1: 'The Honda City 2023 continues its legacy as the ultimate sedan, blending sportier styling with effortless performance.',
        description2: 'Pioneering safety with Honda Sensing (ADAS) and 6 standard airbags.',
    },
    {
        title: 'Toyota Fortuner', type: 'car', category: 'suv',
        brand: 'Toyota', model: 'Fortuner Legender', year: 2024,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 7,
        pricePerHour: 500, pricePerDay: 5500, securityDeposit: 10000,
        city: 'Delhi', dealerName: 'Capital City Wheels',
        images: ['/images/toyota-fortuner.jpg', '/images/toyota-fortuner-interior-1.jpg', '/images/toyota-fortuner-interior-2.jpg'],
        kmsLimitPerDay: 200, extraKmCharge: 25, mileage: 14.8, availability: true, rating: 4.8,
        description1: 'The Toyota Fortuner 2024 is the ultimate expression of power and reliability.',
        description2: 'Equipped with 7 SRS airbags and a robust chassis, it provides top-tier protection for all 7 occupants.',
    },
    {
        title: 'Mercedes-Benz A-Class', type: 'car', category: 'luxury',
        brand: 'Mercedes-Benz', model: 'A-Class Limousine', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 450, pricePerDay: 5000, securityDeposit: 8000,
        city: 'Delhi', dealerName: 'Capital City Wheels',
        images: ['/images/mercedies-benz-a-class-5.jpg', '/images/mercedes-a-class-interior-1.avif', '/images/mercedes-a-class-interior-2.jfif', '/images/mercedes-a-class-interior-4.avif'],
        kmsLimitPerDay: 200, extraKmCharge: 20, mileage: 10.5, availability: true, rating: 4.7,
        description1: 'Step into the world of premium luxury with the Mercedes-Benz A-Class.',
        description2: 'Featuring 7 airbags as standard, this 2023 edition prioritizes advanced occupant safety.',
    },
    {
        title: 'RE Interceptor 650', type: 'bike', category: 'royal-enfield',
        brand: 'Royal Enfield', model: 'Interceptor 650', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 150, pricePerDay: 1800, securityDeposit: 3000,
        city: 'Delhi', dealerName: 'Capital City Wheels',
        images: ['/images/interceptor-650.avif', '/images/interceptor-650-interior-1.avif', '/images/interceptor-650-interior-2.jpg'],
        kmsLimitPerDay: 150, extraKmCharge: 10, mileage: 45, availability: true, rating: 4.9,
        description1: 'The Royal Enfield Interceptor 650 is a modern classic that delivers a thrilling parallel-twin experience.',
        description2: 'With its smooth gearbox and refined mechanicals, this 2023 edition offers a pure, vibration-free ride.',
    },
    {
        title: 'Audi A6', type: 'car', category: 'luxury',
        brand: 'Audi', model: 'A6 Technology', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 600, pricePerDay: 6500, securityDeposit: 12000,
        city: 'Delhi', dealerName: 'Capital City Wheels',
        images: ['/images/audi-a6.jpg', '/images/audi-a6-interior-1.jpg', '/images/audi-a6-interior-2.jpg'],
        kmsLimitPerDay: 200, extraKmCharge: 22, mileage: 14.1, availability: true, rating: 4.7,
        description1: 'The Audi A6 is a masterpiece of technological luxury.',
        description2: 'Boasting 8 standard airbags and a suite of advanced safety features.',
    },
    // ── Metro Auto House ──
    {
        title: 'Maruti Suzuki Ertiga', type: 'car', category: 'commuter',
        brand: 'Maruti Suzuki', model: 'Ertiga ZXI+', year: 2023,
        transmission: 'Manual', fuelType: 'CNG', seats: 7,
        pricePerHour: 160, pricePerDay: 1900, securityDeposit: 2500,
        city: 'Delhi', dealerName: 'Metro Auto House',
        images: ['/images/maruti-ertiga.jpg', '/images/maruti-ertiga-interior-1.jpg', '/images/maruti-ertiga-interior-2.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 10, mileage: 26.1, availability: true, rating: 4.4,
        description1: 'The Maruti Ertiga is the ideal family MPV, offering generous space and great fuel efficiency on CNG.',
        description2: 'With 7 seats and comfortable interiors, it is perfect for group outings and airport transfers.',
    },
    {
        title: 'Mahindra XUV700', type: 'car', category: 'suv',
        brand: 'Mahindra', model: 'XUV700 AX7 L', year: 2024,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 7,
        pricePerHour: 450, pricePerDay: 5000, securityDeposit: 8000,
        city: 'Delhi', dealerName: 'Metro Auto House',
        images: ['/images/mahindra_xuv700.jpg', '/images/mahindra_xuv700_interior_1.avif', '/images/mahindra_xuv700_interior_2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 20, mileage: 16.0, availability: true, rating: 4.8,
        description1: 'The Mahindra XUV700 redefines the SUV segment with its bold design and class-leading features.',
        description2: 'ADAS level 2 safety suite and panoramic sunroof make every drive an event.',
    },
    // ── Mumbai Wheels Express ──
    {
        title: 'Tata Nexon EV', type: 'car', category: 'suv',
        brand: 'Tata', model: 'Nexon EV Max', year: 2023,
        transmission: 'Automatic', fuelType: 'Electric', seats: 5,
        pricePerHour: 250, pricePerDay: 3000, securityDeposit: 4000,
        city: 'Mumbai', dealerName: 'Mumbai Wheels Express',
        images: ['/images/tata-nexon-ev.avif', '/images/tata-nexon-interior.webp', '/images/tata-nexon-interior2.jpg'],
        kmsLimitPerDay: 200, extraKmCharge: 15, mileage: 180, availability: true, rating: 4.6,
        description1: 'Embrace the future with the Tata Nexon EV, offering a silent yet thrilling electric performance.',
        description2: 'Boasting a 5-star GNCAP rating and 6 airbags, this electric SUV is as safe as it is efficient.',
    },
    {
        title: 'Maruti Suzuki Dzire', type: 'car', category: 'sedan',
        brand: 'Maruti Suzuki', model: 'Dzire VXI', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 5,
        pricePerHour: 120, pricePerDay: 1500, securityDeposit: 2500,
        city: 'Mumbai', dealerName: 'Mumbai Wheels Express',
        images: ['/images/dzire.webp', '/images/dzire-interior-1.avif', '/images/dzire-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 8, mileage: 18.2, availability: true, rating: 4.2,
        description1: 'The Maruti Dzire is India\'s favorite compact sedan, blending elegant design with unmatched fuel economy.',
        description2: 'Featuring a 5-star safety rating and 6 SRS airbags as standard.',
    },
    {
        title: 'Royal Enfield Classic 350', type: 'bike', category: 'royal-enfield',
        brand: 'Royal Enfield', model: 'Classic 350', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 80, pricePerDay: 1200, securityDeposit: 2000,
        city: 'Mumbai', dealerName: 'Mumbai Wheels Express',
        images: ['/images/classic-350.avif', '/images/classic-350-interior-1.webp', '/images/classic-350-interior-2.jpg'],
        kmsLimitPerDay: 150, extraKmCharge: 5, mileage: 45, availability: true, rating: 4.4,
        description1: 'The Royal Enfield Classic 350 embodies timeless design and a legendary thump.',
        description2: 'With its upright stance and plush seating, this 2023 edition offers a comfortable gateway to the open road.',
    },
    {
        title: 'Honda CB350H', type: 'bike', category: 'standard',
        brand: 'Honda', model: 'CB350H', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 70, pricePerDay: 1000, securityDeposit: 1500,
        city: 'Mumbai', dealerName: 'Mumbai Wheels Express',
        images: ['/images/cb350h.avif', '/images/cb350h-interior-1.jpg', '/images/cb350h-interior-2.webp'],
        kmsLimitPerDay: 150, extraKmCharge: 4, mileage: 45, availability: true, rating: 4.3,
        description1: 'Experience the peak of refinement with the Honda CB350 H\'ness.',
        description2: 'Designed for the sophisticated rider, this bike offers minimal vibrations even at high speeds.',
    },
    {
        title: 'Mercedes Sprinter Caravan', type: 'caravan', category: 'premium',
        brand: 'Mercedes-Benz', model: 'Sprinter Modified', year: 2023,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 4,
        pricePerHour: 700, pricePerDay: 8000, securityDeposit: 12000,
        city: 'Mumbai', dealerName: 'Mumbai Wheels Express',
        images: ['/images/sprinter-caravan.jpg', '/images/sprinter-interior-1.png', '/images/sprinter-interior-2.jpg', '/images/sprinter-interior-3.jpg'],
        kmsLimitPerDay: 300, extraKmCharge: 25, mileage: 8.5, availability: true, rating: 4.8,
        description1: 'The Mercedes Sprinter Caravan is the ultimate foundation for your home on wheels.',
        description2: 'Inside, expect a sanctuary of comfort with ergonomic designs and high-quality finishes.',
    },
    // ── Tech City Rentals Bangalore ──
    {
        title: 'Hyundai Creta', type: 'car', category: 'suv',
        brand: 'Hyundai', model: 'Creta SX(O)', year: 2023,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 5,
        pricePerHour: 300, pricePerDay: 3500, securityDeposit: 5000,
        city: 'Bangalore', dealerName: 'Tech City Rentals Bangalore',
        images: ['/images/creta.jpg', '/images/creta-interior-1.jfif', '/images/creta-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 14, mileage: 14.8, availability: true, rating: 4.5,
        description1: 'The Hyundai Creta stands as the benchmark for mid-size SUVs.',
        description2: 'Safety and technology go hand-in-hand with 6 standard airbags and an intuitive infotainment suite.',
    },
    {
        title: 'Volkswagen Polo', type: 'car', category: 'hatchback',
        brand: 'Volkswagen', model: 'Polo Highline', year: 2022,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 200, pricePerDay: 2400, securityDeposit: 3500,
        city: 'Bangalore', dealerName: 'Tech City Rentals Bangalore',
        images: ['/images/polo.avif', '/images/polo-interior-1.avif', '/images/polo-interior-2.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 12, mileage: 20.5, availability: true, rating: 4.6,
        description1: 'The Volkswagen Polo is a driver-focused hatchback that brings German engineering to the city streets.',
        description2: 'With a 5-star safety rating and 7 airbags, your safety is never in doubt.',
    },
    {
        title: 'BMW X5', type: 'car', category: 'luxury',
        brand: 'BMW', model: 'X5 40i', year: 2024,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 800, pricePerDay: 8000, securityDeposit: 15000,
        city: 'Bangalore', dealerName: 'Tech City Rentals Bangalore',
        images: ['/images/x5.avif', '/images/x5-interior-1.jfif', '/images/x5-interior-2.avif'],
        kmsLimitPerDay: 300, extraKmCharge: 25, mileage: 10.5, availability: true, rating: 4.8,
        description1: 'The BMW X5 is a masterclass in luxury performance.',
        description2: 'This 2024 edition features a cutting-edge digital cockpit and premium leather interiors.',
    },
    {
        title: 'Mercedes-Benz C-Class', type: 'car', category: 'luxury',
        brand: 'Mercedes-Benz', model: 'C-Class C200', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 750, pricePerDay: 7500, securityDeposit: 12000,
        city: 'Bangalore', dealerName: 'Tech City Rentals Bangalore',
        images: ['/images/c-class.avif', '/images/c-class-interior-1.webp', '/images/c-class-interior-2.avif'],
        kmsLimitPerDay: 300, extraKmCharge: 24, mileage: 10.5, availability: true, rating: 4.7,
        description1: 'Experience the Pinnacle of Luxury with the Mercedes-Benz C-Class.',
        description2: 'Equipped with 7 standard airbags and the PRE-SAFE system.',
    },
    {
        title: 'Force Traveler Caravan', type: 'caravan', category: 'standard',
        brand: 'Force Motors', model: 'Traveler Modified', year: 2022,
        transmission: 'Manual', fuelType: 'Diesel', seats: 6,
        pricePerHour: 500, pricePerDay: 6000, securityDeposit: 10000,
        city: 'Bangalore', dealerName: 'Tech City Rentals Bangalore',
        images: ['/images/force-traveller-caravan.jpg', '/images/force-traveller-interior-1.webp', '/images/force-traveller-interior-2.jpg', '/images/force-traveller-interior-4.jpg'],
        kmsLimitPerDay: 300, extraKmCharge: 20, mileage: 8.5, availability: true, rating: 4.5,
        description1: 'The Force Traveler Caravan is a versatile home on wheels.',
        description2: 'Custom-built with modern amenities including climate control and comfortable sleeping quarters.',
    },
    // ── Hyderabad Luxury Fleet ──
    {
        title: 'Toyota Innova Crysta', type: 'car', category: 'suv',
        brand: 'Toyota', model: 'Innova Crysta', year: 2023,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 8,
        pricePerHour: 350, pricePerDay: 4000, securityDeposit: 6000,
        city: 'Hyderabad', dealerName: 'Hyderabad Luxury Fleet',
        images: ['/images/innova-crysta.jpg', '/images/innova-crysta-interior-1.webp', '/images/innova-crysta-interior-2.jfif'],
        kmsLimitPerDay: 280, extraKmCharge: 16, mileage: 14.8, availability: true, rating: 4.6,
        description1: 'The Toyota Innova Crysta is renowned for its unmatched power, comfort, and reliability.',
        description2: 'Featuring a luxurious cabin with premium finishes and 7 SRS airbags.',
    },
    {
        title: 'Maruti Suzuki Ciaz', type: 'car', category: 'sedan',
        brand: 'Maruti Suzuki', model: 'Ciaz Alpha', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 180, pricePerDay: 2200, securityDeposit: 3000,
        city: 'Hyderabad', dealerName: 'Hyderabad Luxury Fleet',
        images: ['/images/skoda-slavia.webp', '/images/skoda-slavia-interior-1.avif', '/images/skoda-slavia-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 11, mileage: 20.3, availability: true, rating: 4.3,
        description1: 'The Ciaz is Maruti\'s flagship sedan, offering premium comfort at an accessible price.',
        description2: 'Spacious cabin, smooth mild-hybrid engine, and a refined ride make it perfect for long drives.',
    },
    // ── Chennai Coastal Rentals ──
    {
        title: 'Hyundai Venue', type: 'car', category: 'suv',
        brand: 'Hyundai', model: 'Venue SX(O)', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 220, pricePerDay: 2600, securityDeposit: 3500,
        city: 'Chennai', dealerName: 'Chennai Coastal Rentals',
        images: ['/images/creta.jpg', '/images/creta-interior-1.jfif', '/images/creta-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 12, mileage: 17.5, availability: true, rating: 4.4,
        description1: 'The Hyundai Venue punches above its weight with features normally found in larger SUVs.',
        description2: 'Enjoy connected car tech, BlueLink connectivity, and a feature-rich cabin.',
    },
    {
        title: 'Toyota Glanza', type: 'car', category: 'hatchback',
        brand: 'Toyota', model: 'Glanza G', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 140, pricePerDay: 1700, securityDeposit: 2500,
        city: 'Chennai', dealerName: 'Chennai Coastal Rentals',
        images: ['/images/maruti-suzuki-swift.jfif', '/images/maruti-suzuki-swift-interior-1.jfif', '/images/maruti-suzuki-swift-interior-2.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 9, mileage: 22.4, availability: true, rating: 4.3,
        description1: 'The Toyota Glanza is a refined urban hatchback with class-leading fuel efficiency.',
        description2: 'Built on Toyota reliability, it comes with dual airbags and ABS as standard.',
    },
    {
        title: 'Force Traveler Caravan', type: 'caravan', category: 'standard',
        brand: 'Force Motors', model: 'Traveler Modified', year: 2024,
        transmission: 'Manual', fuelType: 'Diesel', seats: 6,
        pricePerHour: 500, pricePerDay: 5800, securityDeposit: 9000,
        city: 'Chennai', dealerName: 'Chennai Coastal Rentals',
        images: ['/images/force-traveller-caravan.jpg', '/images/force-traveller-interior-1.webp', '/images/force-traveller-interior-2.jpg', '/images/force-traveller-interior-4.jpg'],
        kmsLimitPerDay: 300, extraKmCharge: 20, mileage: 8.5, availability: true, rating: 4.5,
        description1: 'Explore the coastal roads of Tamil Nadu in this well-equipped caravan.',
        description2: 'Climate control, sleeping quarters and modern amenities for the coastal road tripper.',
    },
    {
        title: 'Suzuki Access 125', type: 'bike', category: 'commuter',
        brand: 'Suzuki', model: 'Access 125 SE', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 2,
        pricePerHour: 40, pricePerDay: 500, securityDeposit: 800,
        city: 'Chennai', dealerName: 'Chennai Coastal Rentals',
        images: ['/images/meteor-350.avif', '/images/meteor-350-interior-1.avif'],
        kmsLimitPerDay: 100, extraKmCharge: 3, mileage: 47, availability: true, rating: 4.1,
        description1: 'The Suzuki Access 125 is Chennai\'s favourite scooter for quick, breezy commutes.',
        description2: 'Fuel injected engine, LED headlamp, and a spacious underseat compartment.',
    },
    // ── Pune Adventure Motors ──
    {
        title: 'Jeep Compass', type: 'car', category: 'suv',
        brand: 'Jeep', model: 'Compass Model S', year: 2023,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 5,
        pricePerHour: 450, pricePerDay: 5000, securityDeposit: 8000,
        city: 'Pune', dealerName: 'Pune Adventure Motors',
        images: ['/images/mahindra-xuv300.avif', '/images/mahindra-xuv300-interior-1.jpg', '/images/mahindra-xuv300-interior-2.jpg'],
        kmsLimitPerDay: 250, extraKmCharge: 20, mileage: 16.5, availability: true, rating: 4.6,
        description1: 'The Jeep Compass offers genuine 4x4 capability wrapped in a premium package.',
        description2: 'With 6 airbags and a sophisticated all-terrain system, adventure starts the moment you turn the key.',
    },
    {
        title: 'Royal Enfield Himalayan', type: 'bike', category: 'royal-enfield',
        brand: 'Royal Enfield', model: 'Himalayan 411', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 100, pricePerDay: 1400, securityDeposit: 2500,
        city: 'Pune', dealerName: 'Pune Adventure Motors',
        images: ['/images/classic-350.avif', '/images/classic-350-interior-1.webp', '/images/classic-350-interior-2.jpg'],
        kmsLimitPerDay: 200, extraKmCharge: 7, mileage: 35, availability: true, rating: 4.5,
        description1: 'The Royal Enfield Himalayan is purpose-built for adventure across every terrain.',
        description2: 'Dual-channel ABS, a long-travel suspension setup, and large fuel tank make it the ultimate adventure tourer.',
    },
    {
        title: 'Honda Activa 6G', type: 'bike', category: 'commuter',
        brand: 'Honda', model: 'Activa 6G Dlx', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 2,
        pricePerHour: 35, pricePerDay: 450, securityDeposit: 700,
        city: 'Pune', dealerName: 'Pune Adventure Motors',
        images: ['/images/cb350h.avif', '/images/cb350h-interior-1.jpg', '/images/cb350h-interior-2.webp'],
        kmsLimitPerDay: 100, extraKmCharge: 3, mileage: 60, availability: true, rating: 4.2,
        description1: 'India\'s best-selling scooter, the Honda Activa 6G is perfect for Pune\'s city commutes.',
        description2: 'Reliable OBD2-compliant engine, external fuel filler, and a comfortable seat.',
    },
    {
        title: 'Tata Tiago', type: 'car', category: 'hatchback',
        brand: 'Tata', model: 'Tiago XZA+', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 130, pricePerDay: 1600, securityDeposit: 2200,
        city: 'Pune', dealerName: 'Pune Adventure Motors',
        images: ['/images/tata-nexon.avif', '/images/tata-nexon-interior-1.avif', '/images/tata-nexon-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 9, mileage: 19.8, availability: true, rating: 4.2,
        description1: 'The Tata Tiago is a punchy and practical hatchback with a youthful design.',
        description2: 'Backed by Tata\'s 5-star safety rating and a feature-rich cabin.',
    },
    // ── Western Ghats Rides ──
    {
        title: 'Renault Kwid', type: 'car', category: 'hatchback',
        brand: 'Renault', model: 'Kwid RXL', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 5,
        pricePerHour: 100, pricePerDay: 1200, securityDeposit: 1500,
        city: 'Pune', dealerName: 'Western Ghats Rides',
        images: ['/images/renault-kwid.avif', '/images/renault-kwid-interior-1.webp', '/images/renault-kwid-interior-2.jpg'],
        kmsLimitPerDay: 200, extraKmCharge: 7, mileage: 22.3, availability: true, rating: 4.0,
        description1: 'The Renault Kwid is a budget-friendly hatchback perfect for short city trips.',
        description2: 'Digital instrument cluster, touchscreen infotainment, and good ground clearance.',
    },
    {
        title: 'Bajaj Pulsar 150', type: 'bike', category: 'standard',
        brand: 'Bajaj', model: 'Pulsar 150 Twin Disc', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 50, pricePerDay: 700, securityDeposit: 1200,
        city: 'Pune', dealerName: 'Western Ghats Rides',
        images: ['/images/interceptor-650.avif', '/images/interceptor-650-interior-1.avif', '/images/interceptor-650-interior-2.jpg'],
        kmsLimitPerDay: 150, extraKmCharge: 4, mileage: 48, availability: true, rating: 4.1,
        description1: 'The Bajaj Pulsar 150 is a sporty commuter with a strong engine and confident road presence.',
        description2: 'Twin disc setup and a sporty exhaust note make it the fun choice for weekend rides.',
    },
    // ── Kolkata Heritage Rides ──
    {
        title: 'Ambassador Classic', type: 'car', category: 'sedan',
        brand: 'Hindustan Motors', model: 'Ambassador Classic 1500 ISZ', year: 2014,
        transmission: 'Manual', fuelType: 'Diesel', seats: 5,
        pricePerHour: 200, pricePerDay: 2500, securityDeposit: 3000,
        city: 'Kolkata', dealerName: 'Kolkata Heritage Rides',
        images: ['/images/audi_a4_max.jpeg', '/images/audi_a4_max_interior_1.webp', '/images/audi_a4_max_interior_2.webp'],
        kmsLimitPerDay: 200, extraKmCharge: 12, mileage: 13, availability: true, rating: 4.5,
        description1: 'Experience Kolkata\'s iconic Ambassador — a timeless symbol of India\'s automotive heritage.',
        description2: 'Spacious, vintage, and characterful, this is the only way to explore the City of Joy in true style.',
    },
    {
        title: 'Tata Nexon', type: 'car', category: 'suv',
        brand: 'Tata', model: 'Nexon XZA+', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 230, pricePerDay: 2800, securityDeposit: 4000,
        city: 'Kolkata', dealerName: 'Kolkata Heritage Rides',
        images: ['/images/tata-nexon.avif', '/images/tata-nexon-interior-1.avif', '/images/tata-nexon-interior-2.avif'],
        kmsLimitPerDay: 240, extraKmCharge: 13, mileage: 17.0, availability: true, rating: 4.4,
        description1: 'The Tata Nexon is a subcompact SUV with India\'s first 5-star GNCAP safety rating.',
        description2: '6 airbags and a sporty turbocharged engine make it the smart choice for Kolkata\'s roads.',
    },
    {
        title: 'Hyundai Grand i10 Nios', type: 'car', category: 'hatchback',
        brand: 'Hyundai', model: 'Grand i10 Nios Asta', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 120, pricePerDay: 1500, securityDeposit: 2000,
        city: 'Kolkata', dealerName: 'Kolkata Heritage Rides',
        images: ['/images/i20.jpg', '/images/i20-interior-1.avif', '/images/i20-interior-3.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 8, mileage: 20.7, availability: true, rating: 4.1,
        description1: 'The Grand i10 Nios is Hyundai\'s feature-rich city hatchback for modern urban travelers.',
        description2: 'Dual airbags, ABS, and a smooth CVT transmission for effortless city driving.',
    },
    {
        title: 'Royal Enfield Bullet 350', type: 'bike', category: 'royal-enfield',
        brand: 'Royal Enfield', model: 'Bullet 350 Standard', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 75, pricePerDay: 1100, securityDeposit: 1800,
        city: 'Kolkata', dealerName: 'Kolkata Heritage Rides',
        images: ['/images/classic-350.avif', '/images/classic-350-interior-1.webp', '/images/classic-350-interior-2.jpg'],
        kmsLimitPerDay: 150, extraKmCharge: 5, mileage: 40, availability: true, rating: 4.3,
        description1: 'The Royal Enfield Bullet 350 is the original icon of Indian motorcycling.',
        description2: 'Its thumping exhaust note and upright riding position make every ride through Kolkata\'s streets memorable.',
    },
    // ── Jaipur Royal Cars ──
    {
        title: 'Toyota Fortuner', type: 'car', category: 'suv',
        brand: 'Toyota', model: 'Fortuner Legender 4x4', year: 2024,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 7,
        pricePerHour: 600, pricePerDay: 6500, securityDeposit: 12000,
        city: 'Jaipur', dealerName: 'Jaipur Royal Cars',
        images: ['/images/toyota-fortuner.jpg', '/images/toyota-fortuner-interior-1.jpg', '/images/toyota-fortuner-interior-2.jpg'],
        kmsLimitPerDay: 250, extraKmCharge: 25, mileage: 14.0, availability: true, rating: 4.8,
        description1: 'Command the Pink City\'s royal roads in the Toyota Fortuner.',
        description2: 'The perfect chariot for Rajasthan road trips — powerful, dependable and luxurious.',
    },
    {
        title: 'Mahindra Thar 4x4', type: 'car', category: 'suv',
        brand: 'Mahindra', model: 'Thar RWD', year: 2024,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 4,
        pricePerHour: 380, pricePerDay: 4200, securityDeposit: 6000,
        city: 'Jaipur', dealerName: 'Jaipur Royal Cars',
        images: ['/images/thar.jpg', '/images/thar-interior-1.jpg', '/images/thar-interior-2.jpeg'],
        kmsLimitPerDay: 200, extraKmCharge: 18, mileage: 15.2, availability: true, rating: 4.7,
        description1: 'Take on Rajasthan\'s desert tracks and mountain passes in the iconic Mahindra Thar.',
        description2: 'Rugged off-road capability combined with modern comfort and 6 airbags.',
    },
    {
        title: 'Royal Enfield Meteor 350', type: 'bike', category: 'royal-enfield',
        brand: 'Royal Enfield', model: 'Meteor 350 Supernova', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 90, pricePerDay: 1300, securityDeposit: 2200,
        city: 'Jaipur', dealerName: 'Jaipur Royal Cars',
        images: ['/images/meteor-350.avif', '/images/meteor-350-interior-1.avif'],
        kmsLimitPerDay: 150, extraKmCharge: 6, mileage: 36, availability: true, rating: 4.6,
        description1: 'Cruise through Jaipur\'s golden streets on the Royal Enfield Meteor 350.',
        description2: 'A cruiser built for relaxed touring — comfortable seat, long fuel range, and an iconic exhaust note.',
    },
    {
        title: 'Maruti Suzuki Vitara Brezza', type: 'car', category: 'suv',
        brand: 'Maruti Suzuki', model: 'Brezza ZXI+ Dual Tone', year: 2023,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 260, pricePerDay: 3100, securityDeposit: 4500,
        city: 'Jaipur', dealerName: 'Jaipur Royal Cars',
        images: ['/images/swift-sport.jpg', '/images/swift-sport-interior-1.avif', '/images/swift-sport-interior-2.jpg'],
        kmsLimitPerDay: 240, extraKmCharge: 13, mileage: 17.4, availability: true, rating: 4.4,
        description1: 'The Maruti Brezza is the most trusted compact SUV for city and highway runs in Rajasthan.',
        description2: 'HUD display, panoramic sunroof and mild-hybrid engine make it efficient and fun.',
    },
    {
        title: 'Honda Shine', type: 'bike', category: 'standard',
        brand: 'Honda', model: 'Shine SP 125', year: 2023,
        transmission: 'Manual', fuelType: 'Petrol', seats: 2,
        pricePerHour: 45, pricePerDay: 600, securityDeposit: 900,
        city: 'Jaipur', dealerName: 'Jaipur Royal Cars',
        images: ['/images/cb350h.avif', '/images/cb350h-interior-1.jpg', '/images/cb350h-interior-2.webp'],
        kmsLimitPerDay: 120, extraKmCharge: 3, mileage: 60, availability: true, rating: 4.0,
        description1: 'The Honda SP 125 is the ideal everyday commuter for exploring Jaipur\'s bazaars.',
        description2: 'Fuel-injected engine, disc brake option, and Honda\'s legendary reliability.',
    },
    // ── Desert Safari Motors ──
    {
        title: 'Land Rover Defender', type: 'car', category: 'luxury',
        brand: 'Land Rover', model: 'Defender 110 SE', year: 2024,
        transmission: 'Automatic', fuelType: 'Diesel', seats: 5,
        pricePerHour: 1200, pricePerDay: 12000, securityDeposit: 25000,
        city: 'Jaipur', dealerName: 'Desert Safari Motors',
        images: ['/images/audi-a6.jpg', '/images/audi-a6-interior-1.jpg', '/images/audi-a6-interior-2.jpg'],
        kmsLimitPerDay: 300, extraKmCharge: 35, mileage: 9.5, availability: true, rating: 4.9,
        description1: 'Conquer Rajasthan\'s sand dunes and rocky trails in the iconic Land Rover Defender.',
        description2: 'Air suspension, Terrain Response 2, and a luxurious cabin — the ultimate desert explorer.',
    },
    {
        title: 'Jeep Wrangler', type: 'car', category: 'suv',
        brand: 'Jeep', model: 'Wrangler Unlimited', year: 2024,
        transmission: 'Automatic', fuelType: 'Petrol', seats: 5,
        pricePerHour: 900, pricePerDay: 9500, securityDeposit: 18000,
        city: 'Jaipur', dealerName: 'Desert Safari Motors',
        images: ['/images/thar.jpg', '/images/thar-interior-1.jpg', '/images/thar-interior-2.jpeg'],
        kmsLimitPerDay: 250, extraKmCharge: 28, mileage: 11.5, availability: true, rating: 4.8,
        description1: 'The Jeep Wrangler is the world\'s most capable off-roader, now available in Jaipur.',
        description2: 'Removable doors and roof, Command-Trac 4WD, and a legendary heritage — born for desert adventures.',
    },
    // ── Eco-Friendly Delhi ──
    {
        title: 'Eco-Friendly Solar Caravan', type: 'caravan', category: 'standard',
        brand: 'Solar Innovations', model: 'Green Explorer', year: 2023,
        transmission: 'Manual', fuelType: 'Diesel', seats: 5,
        pricePerHour: 400, pricePerDay: 5500, securityDeposit: 8000,
        city: 'Delhi', dealerName: 'Delhi Luxury Motors',
        images: ['/images/sprinter-caravan.jpg', '/images/sprinter-interior-1.png', '/images/sprinter-interior-2.jpg', '/images/sprinter-interior-3.jpg'],
        kmsLimitPerDay: 300, extraKmCharge: 18, mileage: 8.5, availability: true, rating: 4.6,
        description1: 'The Eco-Friendly Solar Caravan pairs sustainable energy with the freedom of the road.',
        description2: 'Integrated solar panels provide off-grid power — perfect for eco-conscious travelers.',
    },
];

// ─── CARAVANS (Tour Packages) ─────────────────────────────────────────────────
const CARAVANS = [
    {
        title: 'Kolkata Heritage & Culture Experience',
        description: 'Step into a living tapestry of art, faith, and faded grandeur as Kolkata unfolds not just as a destination, but as an emotion. From the marble brilliance of Victoria Memorial to the soul-stirring chants along the Hooghly at dusk, every moment is carefully curated to awaken your senses.',
        packagePrice: 12500,
        pricePerDay: 12500,
        duration: '2 Nights / 3 Days',
        amenities: ['Private Heritage Guide', 'Premium AC SUV', 'Ganga Sunset Cruise', 'Traditional Bengali Cuisine', 'All Premium Entry Fees', 'Luxury Boutique Stay'],
        images: ['/images/tour_package_kolkata.png', '/images/kolkata_interior_1.png', '/images/kolkata_interior_2.png'],
        location: 'Kolkata, West Bengal',
        city: 'Kolkata',
        availability: true,
        description1: '',
        description2: '',
        organizer: { name: 'UrbanCruizo Luxury Travels', phone: '+91 98765 43210', address: '12/A, Park Street, Kolkata, WB 700016' }
    },
    {
        title: 'Rajasthan Royal Legacy Tour',
        description: 'Surrender to the grandeur of Rajasthan as Jaipur reveals itself in layers of royalty, romance, and raw desert beauty. From sunrise balloon rides above the Pink City to twilight moments in the dunes, every experience is designed to feel intimate yet epic.',
        packagePrice: 45000,
        pricePerDay: 45000,
        duration: '4 Nights / 5 Days',
        amenities: ['Palace Stays', 'Toyota Fortuner with Chauffeur', 'Exclusive Desert Safari', 'Private Elephant Ride', 'Traditional Folk Gala', 'Hot Air Balloon Experience'],
        images: ['/images/rajasthan_royal.png', '/images/rajasthan_interior_1.png', '/images/rajasthan_interior_2.png'],
        location: 'Jaipur, Rajasthan',
        city: 'Jaipur',
        availability: true,
        description1: '',
        description2: '',
        organizer: { name: 'UrbanCruizo Luxury Travels', phone: '+91 91234 56789', address: 'Palace Road, Near City Palace, Jaipur, Rajasthan 302002' }
    },
    {
        title: 'Mumbai Glamour & Coastal Escape',
        description: 'Step into the dazzling rhythm of Mumbai, where timeless heritage and modern glamour blend effortlessly against the backdrop of the Arabian Sea. Cruise past the iconic skyline in a luxury sedan and watch the sunset paint the waters near the Gateway of India.',
        packagePrice: 22000,
        pricePerDay: 22000,
        duration: '2 Nights / 3 Days',
        amenities: ['Mercedes-Benz City Drive', 'Private Yacht Sunset Cruise', 'Bandra-Worli Luxury Stays', 'VIP Club Access', 'Gourmet Dining Experience', 'Colaba Heritage Walk'],
        images: ['/images/mumbai_glamour.png', '/images/mumbai_interior_1.png', '/images/mumbai_interior_2.png', '/images/mumbai_interior_3.png'],
        location: 'Mumbai, Maharashtra',
        city: 'Mumbai',
        availability: true,
        description1: '',
        description2: '',
        organizer: { name: 'UrbanCruizo Luxury Travels', phone: '+91 99887 76655', address: 'Hiranandani Gardens, Powai, Mumbai, MH 400076' }
    },
];

// ─── SEED ────────────────────────────────────────────────────────────────────
const seedData = async () => {
    try {
        console.log('🗑️  Clearing existing data...');
        await Booking.deleteMany();
        await Vehicle.deleteMany();
        await TourPackage.deleteMany();
        await Dealer.deleteMany();
        await User.deleteMany();

        // Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@urbancruizo.in',
            password: 'adminpassword',
            role: 'admin',
            verified: true,
            isProfileComplete: true,
        });

        // Sample users
        await User.insertMany([
            { name: 'Ravi Kumar',   email: 'ravi@example.com',   password: 'password123', role: 'user', verified: true, licenseNumber: 'DL-12-2023-1234567' },
            { name: 'Priya Singh',  email: 'priya@example.com',  password: 'password123', role: 'user', verified: true, licenseNumber: 'MH-05-2022-7654321' },
            { name: 'Akshay Patel', email: 'akshay@example.com', password: 'password123', role: 'user', verified: true, licenseNumber: 'KA-08-2024-1357924' },
        ]);

        // Dealers — stored in their own 'dealers' collection
        const dealerDocs = await Dealer.insertMany(DEALERS);
        console.log(`✅ Created ${dealerDocs.length} dealers`);

        // Vehicles — resolve owner from dealerName → Dealer._id
        const vehicleDocs = VEHICLES.map(v => {
            const { dealerName, ...rest } = v;
            const owner = dealerDocs.find(d => d.name === dealerName) ||
                          dealerDocs.find(d => d.city === v.city);
            return { ...rest, owner: owner._id };
        });

        const createdVehicles = await Vehicle.insertMany(vehicleDocs);
        console.log(`✅ Created ${createdVehicles.length} vehicles`);

        // Tour Packages — stored in their own 'tourpackages' collection
        const createdTours = await TourPackage.insertMany(CARAVANS);
        console.log(`✅ Created ${createdTours.length} tour packages`);

        console.log('\n🎉 Database Seeded Successfully!');
        console.log(`   Dealers       : ${dealerDocs.length}`);
        console.log(`   Vehicles      : ${createdVehicles.length}`);
        console.log(`   Tour Packages : ${createdTours.length}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error.message);
        process.exit(1);
    }
};

seedData();
