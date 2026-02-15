const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Caravan = require('./models/Caravan');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Booking.deleteMany();
        await Caravan.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'tourist',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'tourist',
            },
        ]);

        const adminUser = createdUsers[0]._id;

        const sampleCaravans = [
            {
                title: 'The Golden Voyager',
                description: 'Experience the pinnacle of luxury travel. This 40ft caravan features a king-size master suite, full gourmet kitchen with marble countertops, and a spacious lounge with a 4K home theater system. Perfect for coast-to-coast adventures in style.',
                pricePerDay: 450,
                amenities: ['King Bed', 'Gourmet Kitchen', '4K TV', 'WiFi', 'Washer/Dryer'],
                images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80', 'https://images.unsplash.com/photo-1512918760532-3ad860030eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'],
                location: 'Los Angeles, CA',
                availability: true,
            },
            {
                title: 'Nomad’s Retreat',
                description: 'A cozy yet modern caravan designed for couples. Includes a queen bed, solar power capabilities for off-grid living, and a panoramic sunroof for stargazing.',
                pricePerDay: 200,
                amenities: ['Queen Bed', 'Solar Power', 'Sunroof', 'Kitchenette'],
                images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1721&q=80'],
                location: 'Denver, CO',
                availability: true,
            },
            {
                title: 'Family Adventure Hub',
                description: 'Spacious 6-berth caravan perfect for family getaways. Features bunk beds, a large dining area, and plenty of storage for bikes and gear.',
                pricePerDay: 300,
                amenities: ['6 Bunks', 'Dining Area', 'Bike Rack', 'Large Fridge'],
                images: ['https://images.unsplash.com/photo-1533282960533-51328aa49826?ixlib=rb-4.0.3&auto=format&fit=crop&w=1742&q=80'],
                location: 'Miami, FL',
                availability: true,
            },
            {
                title: 'Eco-Stream Deluxe',
                description: 'Sustainable luxury. This eco-friendly caravan runs on 100% renewable energy while providing all modern comforts including AC and a smart home system.',
                pricePerDay: 250,
                amenities: ['Solar Panels', 'Smart Home', 'Eco Materials', 'AC'],
                images: ['https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80'],
                location: 'Seattle, WA',
                availability: true,
            },
            {
                title: 'Desert Drifter',
                description: 'Rugged exterior, luxurious interior. Built for the desert but styled for a king. Features enhanced AC, dust-proof sealing, and a premium sound system.',
                pricePerDay: 350,
                amenities: ['Enhanced AC', 'Premium Sound', 'Outdoor Awning', 'BBQ Grill'],
                images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'],
                location: 'Phoenix, AZ',
                availability: true,
            },
        ];

        await Caravan.insertMany(sampleCaravans);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Booking.deleteMany();
        await Caravan.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
