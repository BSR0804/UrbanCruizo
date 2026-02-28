const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('👉 Tip: This is likely a DNS/Whitelisting issue.');
      console.error('1. Whitelist your current IP in MongoDB Atlas (Network Access).');
      console.error('2. Try changing your DNS to Google DNS (8.8.8.8).');
    }
    if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('👉 Tip: Wrong password! Check your MONGO_URI in .env.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;

