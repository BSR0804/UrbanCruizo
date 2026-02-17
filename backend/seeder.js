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
                name: 'Dealer Premium Motors',
                email: 'dealer@premiummotors.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true
            },
            {
                name: 'Dealer Mumbai Wheels',
                email: 'dealer@mumbaiweels.in',
                password: 'dealer123',
                role: 'dealer',
                verified: true
            }
        ]);

        const vehicles = MOCK_VEHICLES_DATA.map((vehicleData, index) => ({
            ...vehicleData,
            owner: index < 4 ? admin._id : (index < 8 ? users[4]._id : (index < 12 ? admin._id : users[5]._id))
        }));

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
