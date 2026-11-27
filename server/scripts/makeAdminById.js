// scripts/makeAdminById.js
//
// Usage:
//   node scripts/makeAdminById.js <userId>
//
// Example:
//   node scripts/makeAdminById.js 64a1b2c3d4e5f6a7b8c9d0e1

import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config';

const makeAdminById = async (userId) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findById(userId);

    if (!user) {
      console.log(`❌ User with ID ${userId} not found`);
      process.exit(1);
    }

    console.log('\n=== BEFORE UPDATE ===');
    console.log('Name:', user.fullName);
    console.log('Email:', user.email);
    console.log('Role:', user.role || 'NO ROLE');
    console.log('IsHost:', user.isHost || false);

    user.role = 'admin';
    user.isHost = true;
    await user.save();

    console.log('\n=== AFTER UPDATE ===');
    console.log('✅ Successfully updated to admin role');
    console.log('Name:', user.fullName);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('IsHost:', user.isHost);
    console.log('\n⚠️  Log out and log back in for changes to take effect.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const userId = process.argv[2];

if (!userId) {
  console.error('❌ Missing user ID.');
  console.error('   Usage: node scripts/makeAdminById.js <userId>');
  process.exit(1);
}

makeAdminById(userId);
