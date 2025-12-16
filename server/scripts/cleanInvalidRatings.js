// scripts/cleanInvalidRatings.js
// This script cleans up properties that have ratings but no actual reviews

import mongoose from 'mongoose';
import Property from '../models/Property.js';
import Review from '../models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanInvalidRatings = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all properties
    const properties = await Property.find({});
    console.log(`📊 Found ${properties.length} properties\n`);

    let fixedCount = 0;
    let alreadyCorrectCount = 0;

    for (const property of properties) {
      // Count actual reviews for this property
      const reviewCount = await Review.countDocuments({ property: property._id });
      
      // Calculate actual rating from reviews
      const stats = await Review.calculatePropertyRating(property._id);
      const actualRating = stats.averageRating || 0;
      const actualReviewCount = stats.totalReviews || 0;

      // Check if property has incorrect data
      const hasIncorrectRating = property.rating > 0 && reviewCount === 0;
      const hasIncorrectCount = property.totalReviews !== reviewCount;
      const hasIncorrectRatingValue = Math.abs(property.rating - actualRating) > 0.1;

      if (hasIncorrectRating || hasIncorrectCount || hasIncorrectRatingValue) {
        console.log(`🔧 Fixing property: ${property.title}`);
        console.log(`   Old rating: ${property.rating}, Old reviews: ${property.totalReviews}`);
        console.log(`   New rating: ${actualRating}, New reviews: ${actualReviewCount}`);
        console.log(`   Actual review count in DB: ${reviewCount}\n`);

        // Update property with correct values
        property.rating = Math.round(actualRating * 10) / 10;
        property.totalReviews = actualReviewCount;
        await property.save();
        
        fixedCount++;
      } else {
        alreadyCorrectCount++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`✅ Already correct: ${alreadyCorrectCount} properties`);
    console.log(`🔧 Fixed: ${fixedCount} properties`);
    console.log(`📊 Total processed: ${properties.length} properties`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanInvalidRatings();
