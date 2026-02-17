const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await Booking.deleteMany();
        await Vehicle.deleteMany();
        await User.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@urbancruizo.in',
            password: 'adminpassword',
            role: 'admin',
            verified: true
        });

        const standardUser = await User.create({
            name: 'Ravi Kumar',
            email: 'ravi@example.com',
            password: 'password123',
            role: 'user',
            verified: true,
            licenseNumber: 'DL-12-2023-1234567'
        });

        const vehicles = [
            // Delhi Fleet
            {
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
                images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/48542/swift-exterior-right-front-three-quarter-3.jpeg?q=75'],
                location: 'Connaught Place, Delhi',
                kmsLimitPerDay: 240,
                extraKmCharge: 12
            },
            {
                title: 'Mahindra Thar 4x4',
                type: 'car',
                category: 'suv',
                brand: 'Mahindra',
                model: 'Thar LX Hard Top',
                year: 2024,
                transmission: 'Automatic',
                fuelType: 'Diesel',
                seats: 4,
                pricePerHour: 400,
                pricePerDay: 4500,
                securityDeposit: 5000,
                city: 'Delhi',
                images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=75'],
                location: 'Aerocity, Delhi',
                kmsLimitPerDay: 200,
                extraKmCharge: 18
            },
            // Mumbai Fleet
            {
                title: 'Tata Nexon EV',
                type: 'car',
                category: 'suv',
                brand: 'Tata',
                model: 'Nexon EV Max',
                year: 2023,
                transmission: 'Automatic',
                fuelType: 'Electric',
                seats: 5,
                pricePerHour: 250,
                pricePerDay: 3000,
                securityDeposit: 4000,
                city: 'Mumbai',
                images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/121479/nexon-ev-max-exterior-right-front-three-quarter-3.jpeg?q=75'],
                location: 'Juhu Beach, Mumbai',
                kmsLimitPerDay: 200,
                extraKmCharge: 15
            },
            {
                title: 'Royal Enfield Classic 350',
                type: 'bike',
                category: 'royal-enfield',
                brand: 'Royal Enfield',
                model: 'Classic 350',
                year: 2023,
                transmission: 'Manual',
                fuelType: 'Petrol',
                seats: 2,
                pricePerHour: 80,
                pricePerDay: 1200,
                securityDeposit: 2000,
                city: 'Mumbai',
                images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/101487/classic-350-Right-Front-Three-Quarter.jpeg?q=75'],
                location: 'Colaba, Mumbai',
                kmsLimitPerDay: 150,
                extraKmCharge: 5
            },
            // Bangalore Fleet
            {
                title: 'Hyundai Creta',
                type: 'car',
                category: 'suv',
                brand: 'Hyundai',
                model: 'Creta SX(O)',
                year: 2023,
                transmission: 'Automatic',
                fuelType: 'Diesel',
                seats: 5,
                pricePerHour: 300,
                pricePerDay: 3500,
                securityDeposit: 5000,
                city: 'Bangalore',
                images: ['https://imgd.aeplcdn.com/1056x594/n/cw/ec/141115/creta-exterior-right-front-three-quarter-2.jpeg?q=75'],
                location: 'Indiranagar, Bangalore',
                kmsLimitPerDay: 240,
                extraKmCharge: 14
            },
            // Caravans (Pan-India available mostly)
            {
                title: 'Force Traveler Caravan',
                type: 'caravan',
                category: 'standard',
                brand: 'Force Motors',
                model: 'Traveler Modified',
                year: 2022,
                transmission: 'Manual',
                fuelType: 'Diesel',
                seats: 6,
                pricePerHour: 500,
                pricePerDay: 6000,
                securityDeposit: 10000,
                city: 'Bangalore', // Base location
                images: ['https://trucks.cardekho.com/trucks/force/traveller-3350/force-traveller-3350.jpg'],
                location: 'Whitefield, Bangalore',
                kmsLimitPerDay: 300,
                extraKmCharge: 20
            }
        ];

        await Vehicle.insertMany(vehicles);
        console.log('Indian Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
