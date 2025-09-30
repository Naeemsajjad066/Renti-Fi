# BookingContext Usage Guide

## Overview

The `BookingContext` provides a centralized state management solution for all booking-related functionality in the Rentifi application. It handles booking creation, updates, cancellations, reviews, and provides utility functions for formatting and filtering.

## Setup

The BookingContext is already added to the provider chain in `main.tsx`:

```tsx
<BookingProvider>
  <App />
</BookingProvider>
```

## Usage

### Basic Import

```jsx
import { useBooking } from '../contexts/BookingContext';

const MyComponent = () => {
  const { hostBookings, loading, createBooking } = useBooking();
  // ... rest of component
};
```

## Available State

### Core Data
- `bookings`: Array - All bookings (both host and guest)
- `hostBookings`: Array - Bookings where user is the host
- `guestBookings`: Array - Bookings where user is the guest
- `selectedBooking`: Object - Currently selected booking
- `loading`: Boolean - Loading state for API operations
- `error`: String - Error message if any
- `refreshing`: Boolean - Refresh operation in progress

### Filter States
- `filter`: String - Current filter ('all', 'pending', 'confirmed', etc.)
- `setFilter`: Function - Update filter
- `searchTerm`: String - Current search term
- `setSearchTerm`: Function - Update search term
- `activeTab`: String - Active tab for guest bookings
- `setActiveTab`: Function - Update active tab

### Review States
- `showReviewModal`: Object - Review modal state `{ show: boolean, selectedBooking: object }`
- `setShowReviewModal`: Function - Update review modal state
- `reviewText`: String - Review text content
- `setReviewText`: Function - Update review text
- `rating`: Number - Review rating (1-5)
- `setRating`: Function - Update rating
- `reviewedBookings`: Array - IDs of bookings that have been reviewed
- `setReviewedBookings`: Function - Update reviewed bookings

## Available Functions

### API Functions

#### `fetchAllBookings()`
Fetches both host and guest bookings for the current user.

```jsx
const { fetchAllBookings } = useBooking();

useEffect(() => {
  fetchAllBookings();
}, []);
```

#### `fetchGuestBookings()`
Fetches only guest bookings.

#### `fetchHostBookings()`
Fetches only host bookings.

#### `fetchBookingById(id)`
Fetches a specific booking by ID with caching.

```jsx
const { fetchBookingById } = useBooking();

const loadBooking = async (bookingId) => {
  const booking = await fetchBookingById(bookingId);
  if (booking) {
    console.log('Booking loaded:', booking);
  }
};
```

#### `createBooking(bookingData)`
Creates a new booking.

```jsx
const { createBooking } = useBooking();

const handleBookProperty = async () => {
  const bookingData = {
    propertyId: 'property-id',
    checkIn: '2024-01-01',
    checkOut: '2024-01-05',
    guests: {
      adults: 2,
      children: 1,
      infants: 0
    }
  };

  const result = await createBooking(bookingData);
  if (result.success) {
    console.log('Booking created:', result.booking);
  }
};
```

#### `updateBookingStatus(bookingId, status)`
Updates booking status (for hosts).

```jsx
const { updateBookingStatus } = useBooking();

const acceptBooking = async (bookingId) => {
  await updateBookingStatus(bookingId, 'confirmed');
};

const declineBooking = async (bookingId) => {
  await updateBookingStatus(bookingId, 'cancelled');
};
```

#### `cancelBooking(bookingId, reason)`
Cancels a booking (for guests).

```jsx
const { cancelBooking } = useBooking();

const handleCancel = async (bookingId) => {
  await cancelBooking(bookingId, 'Cancelled by guest');
};
```

#### `submitReview(bookingId, reviewData)`
Submits a review for a completed booking.

```jsx
const { submitReview } = useBooking();

const handleReviewSubmit = async () => {
  const reviewData = {
    rating: 5,
    review: 'Great experience!',
    propertyId: 'property-id',
    hostId: 'host-id'
  };

  await submitReview(bookingId, reviewData);
};
```

#### `refreshBookings(type)`
Refreshes bookings. Type can be 'all', 'guest', or 'host'.

```jsx
const { refreshBookings } = useBooking();

// Refresh all bookings
await refreshBookings();

// Refresh only host bookings
await refreshBookings('host');
```

### Utility Functions

#### `getStatusFromDates(booking)`
Determines booking status based on dates.

```jsx
const { getStatusFromDates } = useBooking();

const status = getStatusFromDates(booking);
// Returns: 'upcoming', 'active', 'completed', or 'cancelled'
```

#### `getStatusBadge(status)`
Returns status badge configuration.

```jsx
const { getStatusBadge } = useBooking();

const config = getStatusBadge('confirmed');
// Returns: { variant, className, label }
```

#### `formatCurrency(amount)`
Formats amount as Pakistani Rupees.

```jsx
const { formatCurrency } = useBooking();

const formatted = formatCurrency(50000);
// Returns: "Rs 50,000"
```

#### `formatDate(dateString)`
Formats date string to readable format.

```jsx
const { formatDate } = useBooking();

const formatted = formatDate('2024-01-01');
// Returns: "Jan 1, 2024"
```

#### `getTotalGuests(guests)`
Calculates total number of guests.

```jsx
const { getTotalGuests } = useBooking();

const total = getTotalGuests({ adults: 2, children: 1, infants: 0 });
// Returns: 3
```

#### `getBookingStats(bookingsList)`
Calculates statistics for a list of bookings.

```jsx
const { getBookingStats, hostBookings } = useBooking();

const stats = getBookingStats(hostBookings);
// Returns: { total, confirmed, pending, cancelled, completed, totalRevenue }
```

#### `getFilteredBookings(bookingsList, filterType, search)`
Filters bookings based on status and search term.

```jsx
const { getFilteredBookings, hostBookings, filter, searchTerm } = useBooking();

const filtered = getFilteredBookings(hostBookings, filter, searchTerm);
```

#### `getBookingsByTab(tab)`
Gets guest bookings filtered by tab with computed status.

```jsx
const { getBookingsByTab } = useBooking();

const upcomingBookings = getBookingsByTab('upcoming');
```

## Example Components

### Host Bookings Component

```jsx
import React from 'react';
import { useBooking } from '../contexts/BookingContext';

const HostBookings = () => {
  const {
    hostBookings,
    loading,
    error,
    updateBookingStatus,
    getFilteredBookings,
    getBookingStats,
    formatCurrency,
    formatDate
  } = useBooking();

  const stats = getBookingStats(hostBookings);
  const filteredBookings = getFilteredBookings(hostBookings);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="stats">
        <div>Total: {stats.total}</div>
        <div>Revenue: {formatCurrency(stats.totalRevenue)}</div>
      </div>
      
      {filteredBookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.property.title}</h3>
          <p>Guest: {booking.guest.fullName}</p>
          <p>Dates: {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
          
          {booking.status === 'pending' && (
            <div>
              <button onClick={() => updateBookingStatus(booking._id, 'confirmed')}>
                Accept
              </button>
              <button onClick={() => updateBookingStatus(booking._id, 'cancelled')}>
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

### Guest Bookings Component

```jsx
import React from 'react';
import { useBooking } from '../contexts/BookingContext';

const GuestBookings = () => {
  const {
    activeTab,
    setActiveTab,
    getBookingsByTab,
    cancelBooking,
    setShowReviewModal,
    reviewedBookings
  } = useBooking();

  const filteredBookings = getBookingsByTab(activeTab);

  return (
    <div>
      <div className="tabs">
        {['all', 'upcoming', 'active', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredBookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.property.title}</h3>
          
          {booking.status === 'upcoming' && (
            <button onClick={() => cancelBooking(booking._id)}>
              Cancel Booking
            </button>
          )}
          
          {booking.status === 'completed' && !reviewedBookings.includes(booking._id) && (
            <button onClick={() => setShowReviewModal({ show: true, selectedBooking: booking })}>
              Leave Review
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

## Features

- ✅ Centralized booking state management
- ✅ Automatic token handling via axios interceptors
- ✅ Caching for individual bookings
- ✅ Toast notifications for all operations
- ✅ Loading states for better UX
- ✅ Error handling and recovery
- ✅ Utility functions for common operations
- ✅ Filter and search functionality
- ✅ Review system integration
- ✅ Automatic cleanup on user logout

## Benefits

1. **Clean Components**: Components are now focused on UI logic, not data fetching
2. **Consistent API**: All booking operations use the same patterns
3. **Centralized State**: No need to manage booking state in multiple places
4. **Error Handling**: Consistent error handling across all booking operations
5. **Performance**: Caching reduces unnecessary API calls
6. **Maintainability**: Easy to update booking logic in one place

## Migration

The existing `HostBookings.jsx` and `Bookings.jsx` components have been refactored to use this context, making them much cleaner and more maintainable.