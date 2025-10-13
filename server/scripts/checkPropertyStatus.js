import mongoose from 'mongoose';
import Property from '../models/Property.js';
import 'dotenv/config';

const checkPropertyStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Get all properties
    const allProperties = await Property.find().populate('host', 'fullName email');
    
    console.log('=== ALL PROPERTIES IN DATABASE ===\n');
    
    allProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title}`);
      console.log(`   ID: ${prop._id}`);
      console.log(`   Host: ${prop.host?.fullName || 'Unknown'}`);
      console.log(`   Verification Status: ${prop.verificationStatus || 'NOT SET'}`);
      console.log(`   Is Active: ${prop.isActive}`);
      console.log(`   Is Verified: ${prop.isVerified}`);
      console.log(`   Created: ${prop.createdAt}`);
      console.log('');
    });

    console.log('\n=== APPROVED PROPERTIES (Should Show in Listings) ===\n');
    const approvedProperties = await Property.find({ 
      isActive: true, 
      verificationStatus: 'approved' 
    });
    
    if (approvedProperties.length === 0) {
      console.log('❌ NO approved properties found!');
      console.log('\nPossible issues:');
      console.log('1. isActive is not set to true');
      console.log('2. verificationStatus is not set to "approved"');
      console.log('3. Both fields need to be true/approved');
    } else {
      approvedProperties.forEach((prop, index) => {
        console.log(`${index + 1}. ${prop.title} ✅`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkPropertyStatus();
