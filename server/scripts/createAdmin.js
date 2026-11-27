// scripts/createAdmin.js
//
// Usage:
//   node scripts/createAdmin.js <email> <password>
//
// Example:
//   node scripts/createAdmin.js admin@example.com MySecurePass123
//
// The script reads MONGODB_URI and DB_NAME from your .env file.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  const adminEmail = process.argv[2];
  const adminPassword = process.argv[3];

  if (!adminEmail || !adminPassword) {
    console.error('❌ Missing arguments.');
    console.error('   Usage: node scripts/createAdmin.js <email> <password>');
    process.exit(1);
  }

  if (adminPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters.');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.isEmailVerified = true;

      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash(adminPassword, salt);

      await existingAdmin.save();
      console.log('✅ Existing user updated to admin:', adminEmail);
    } else {
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

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
