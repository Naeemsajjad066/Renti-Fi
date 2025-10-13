import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config';

const makeAdminById = async (userId) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      process.exit(1);
    }

    console.log('\n=== BEFORE UPDATE ===');
    console.log('Name:', user.fullName);
    console.log('Email:', user.email);
    console.log('Role:', user.role || 'NO ROLE');
    console.log('IsHost:', user.isHost || 'NO isHost');

    user.role = 'admin';
    user.isHost = true;
    await user.save();

    console.log('\n=== AFTER UPDATE ===');
    console.log('✅ Successfully updated to admin role');
    console.log('Name:', user.fullName);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('IsHost:', user.isHost);
    
    console.log('\n⚠️  IMPORTANT: Log out and log back in for changes to take effect!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Your user ID from the property
const userId = '68dacd141616ceb5c7a1676f';

makeAdminById(userId);
