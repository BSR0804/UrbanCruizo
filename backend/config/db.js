const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('👉 Tip: Ensure your local MongoDB service is running (net start MongoDB)');
    }
    if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('👉 Tip: Check your MONGO_URI password in the .env file — the <db_password> placeholder must be replaced with your real Atlas password.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;

