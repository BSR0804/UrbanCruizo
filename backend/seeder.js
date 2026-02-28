const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');
const { CITIES, MOCK_VEHICLES_DATA } = require('./data/staticData');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Booking.deleteMany();
        await Vehicle.deleteMany();
        await User.deleteMany();

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@urbancruizo.in',
            password: 'adminpassword',
            role: 'admin',
            verified: true
        });

        const users = await User.insertMany([
            {
                name: 'Ravi Kumar',
                email: 'ravi@example.com',
                password: 'password123',
                role: 'user',
                verified: true,
                licenseNumber: 'DL-12-2023-1234567'
            },
            {
                name: 'Priya Singh',
                email: 'priya@example.com',
                password: 'password123',
                role: 'user',
                verified: true,
                licenseNumber: 'MH-05-2022-7654321'
            },
            {
                name: 'Akshay Patel',
                email: 'akshay@example.com',
                password: 'password123',
                role: 'user',
                verified: true,
                licenseNumber: 'KA-08-2024-1357924'
            },
            {
                name: 'Ananya Dixit',
                email: 'ananya@example.com',
                password: 'password123',
                role: 'user',
                verified: true,
                licenseNumber: 'TG-11-2023-2468135'
            },
            {
                name: 'Delhi Luxury Motors',
                email: 'delhi.luxury@urbancruizo.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Delhi',
                location: 'Karol Bagh'
            },
            {
                name: 'Capital City Wheels',
                email: 'capital.wheels@urbancruizo.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Delhi',
                location: 'Dwarka Sector 10'
            },
            {
                name: 'Metro Auto House',
                email: 'metro.auto@urbancruizo.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Delhi',
                location: 'Saket District Centre'
            },
            {
                name: 'Mumbai Elite Wheels',
                email: 'mumbai.elite@urbancruizo.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Mumbai'
            },
            {
                name: 'Gateway Premium Rides',
                email: 'gateway@premiumrides.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Mumbai',
                location: 'Bandra West'
            },
            {
                name: 'Namma Bengaluru Cars',
                email: 'namma@bengalurucars.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Bangalore',
                location: 'Koramangala'
            },
            {
                name: 'Silicon Valley Wheels',
                email: 'sv@siliconvalleywheels.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Bangalore',
                location: 'Whitefield'
            },
            {
                name: 'Garden City Motors',
                email: 'info@gardencitymotors.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Bangalore',
                location: 'Jayanagar'
            },
            {
                name: 'MG Road Premium Autos',
                email: 'premium@mgroadautos.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Bangalore',
                location: 'MG Road'
            },
            {
                name: 'Deccan Wheels',
                email: 'info@deccanwheels.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Hyderabad',
                location: 'Banjara Hills'
            },
            {
                name: 'Western Ghats Rides',
                email: 'rides@westernghats.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Pune',
                location: 'Hinjewadi'
            },
            {
                name: 'Howrah Bridge Motors',
                email: 'howrah@bridgemotors.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Kolkata',
                location: 'Howrah'
            },
            {
                name: 'Salt Lake City Cars',
                email: 'saltlake@citycars.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Kolkata',
                location: 'Salt Lake, Sector V'
            },
            {
                name: 'Rajputana Wheels',
                email: 'info@rajputanawheels.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Jaipur',
                location: 'MI Road'
            },
            {
                name: 'Amber Fort Rides',
                email: 'rides@amberfort.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Jaipur',
                location: 'Amer Road'
            },
            {
                name: 'Desert Safari Motors',
                email: 'desert@safarimotors.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Jaipur',
                location: 'Tonk Road'
            },
            {
                name: 'Hawa Mahal Car Rentals',
                email: 'info@hawamahalcars.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Jaipur',
                location: 'Badi Chaupar'
            },
            {
                name: 'Nahargarh Drive Co',
                email: 'drive@nahargarhco.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true,
                city: 'Jaipur',
                location: 'Vaishali Nagar'
            }
        ]);

        const dealers = users.filter(user => user.role === 'dealer');
        const vehicles = MOCK_VEHICLES_DATA.map((vehicleData) => {
            // First try to match by specific dealer name if provided in data
            let ownerDealer = null;
            if (vehicleData.dealerName) {
                ownerDealer = dealers.find(d => d.name === vehicleData.dealerName);
            }

            // Fallback to first dealer in that city if no specific dealer name
            if (!ownerDealer) {
                ownerDealer = dealers.find(d => d.city === vehicleData.city);
            }

            return {
                ...vehicleData,
                owner: ownerDealer ? ownerDealer._id : admin._id
            };
        });

        const createdVehicles = await Vehicle.insertMany(vehicles);

        // Create Sample Bookings
        const bookings = [
            {
                vehicle: createdVehicles[0]._id,
                user: users[0]._id,
                city: 'Delhi',
                startDate: new Date('2024-02-20'),
                endDate: new Date('2024-02-23'),
                totalPrice: 5400,
                securityDeposit: 3000,
                gstAmount: 972,
                finalAmount: 9372,
                status: 'confirmed'
            },
            {
                vehicle: createdVehicles[4]._id,
                user: users[1]._id,
                city: 'Mumbai',
                startDate: new Date('2024-02-25'),
                endDate: new Date('2024-02-27'),
                totalPrice: 6000,
                securityDeposit: 4000,
                gstAmount: 1080,
                finalAmount: 11080,
                status: 'pending'
            },
            {
                vehicle: createdVehicles[8]._id,
                user: users[2]._id,
                city: 'Bangalore',
                startDate: new Date('2024-02-22'),
                endDate: new Date('2024-02-24'),
                totalPrice: 7000,
                securityDeposit: 5000,
                gstAmount: 1260,
                finalAmount: 13260,
                status: 'completed'
            }
        ];

        await Booking.insertMany(bookings);

        console.log('✅ Database Seeded Successfully!');
        console.log(`📊 Created: ${vehicles.length} vehicles, ${users.length} users, ${bookings.length} bookings`);
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
