// config/database.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};