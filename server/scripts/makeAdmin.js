import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config';

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    user.role = 'admin';
    user.isHost = true; // Admins can also list properties
    await user.save();

    console.log(`✅ Successfully updated ${user.fullName} (${user.email}) to admin role`);
    console.log(`User details:`, {
      name: user.fullName,
      email: user.email,
      role: user.role,
      isHost: user.isHost
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js admin@example.com');
  process.exit(1);
}

makeAdmin(email);
