// scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('Connected to MongoDB');

    // Admin credentials
    const adminEmail = 'naeem9924066@gmail.com';
    const adminPassword = 'Naeem@253352';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;

      // Update password if needed
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash(adminPassword, salt);

      await existingAdmin.save();
      console.log('✅ Existing user updated to admin:', adminEmail);
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = await User.create({
        email: adminEmail,
        fullName: 'Admin',
        idCard: '0000000000000',
        phoneNumber: '00000000000',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });

      console.log('✅ Admin user created successfully:', admin.email);
    }

    console.log('\nAdmin Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nYou can now login as admin!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
