# Review & Rating System Fix

## Issue
Properties were showing ratings even though they had no completed bookings or reviews.

## Root Causes Identified

1. **Mock/Hardcoded Ratings**: Frontend files had hardcoded ratings for demo properties
2. **Fallback Values**: Some components used fallback ratings (e.g., `|| 4.5`) which showed fake ratings
3. **No Database Validation**: Properties might have had invalid ratings in database

## Fixes Applied

### Backend
1. **Created Cleanup Script** (`server/scripts/cleanInvalidRatings.js`)
   - Scans all properties in database
   - Removes ratings from properties without actual reviews
   - Recalculates ratings based on actual Review documents
   - Run with: `npm run clean-ratings`

2. **Review System Validation** (Already in place, verified):
   - Users can only review after checkout date or when booking is completed
   - One review per booking (enforced by unique index)
   - Reviews must be linked to valid bookings
   - User must own the booking to review it

### Frontend
1. **PropertyCard.jsx**: Now checks both `rating > 0 AND totalReviews > 0` before displaying
2. **PropertyDetails.jsx**: 
   - Removed fallback ratings (`|| 4.5`)
   - Shows "No ratings yet" for properties without reviews
   - Only displays rating section when actual reviews exist
3. **All Components**: Updated to show ratings only when backed by actual reviews

## How to Clean Existing Database

Run this command in the server directory:
```bash
cd server
npm run clean-ratings
```

This will:
- Connect to MongoDB
- Scan all properties
- Count actual reviews for each
- Fix any properties with incorrect ratings
- Show summary of changes

## Review System Flow

### For Guests
1. Book a property
2. Complete stay (checkout date must pass OR booking status = completed)
3. System automatically allows review after checkout
4. Can write one review per booking
5. Review includes:
   - Overall rating (1-5 stars)
   - Comment (10-1000 characters)
   - Optional category ratings (cleanliness, accuracy, etc.)

### Rating Calculation
- Property rating = average of all review ratings
- Automatically updates when:
  - New review is submitted
  - Review is deleted
  - Review is updated
- Stored in Property model: `rating` and `totalReviews` fields

## API Endpoints

### Create Review
```
POST /api/reviews
Authorization: Bearer <token>
Body: {
  property: propertyId,
  booking: bookingId,
  rating: 4,
  comment: "Great place!",
  cleanliness: 5,
  accuracy: 4,
  communication: 5,
  location: 4,
  checkIn: 5,
  value: 4
}
```

### Check If User Can Review
```
GET /api/reviews/can-review/:propertyId
Authorization: Bearer <token>
Returns: {
  canReview: true/false,
  bookings: [array of unreviewed completed bookings]
}
```

### Get Property Reviews
```
GET /api/reviews/property/:propertyId
Returns all reviews for a property
```

## Validation Rules

1. ✅ User must be authenticated
2. ✅ Booking must exist and belong to user
3. ✅ Booking must be completed OR checkout date must have passed
4. ✅ User cannot review same booking twice
5. ✅ Rating must be between 1-5
6. ✅ Comment must be 10-1000 characters
7. ✅ Property rating only shown when totalReviews > 0

## Database Indexes

```javascript
// Review Model
- { booking: 1 } - unique index (prevents duplicate reviews)
- { property: 1, createdAt: -1 } - efficient property review queries
- { user: 1 } - user's reviews lookup
```

## Future Enhancements (Optional)

1. Add verified purchase badge for reviews
2. Allow hosts to respond to reviews
3. Add review helpful/unhelpful voting
4. Add review photos
5. Add review moderation for inappropriate content
