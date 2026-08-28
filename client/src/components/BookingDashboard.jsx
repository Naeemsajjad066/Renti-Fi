// Example component showing how to use the BookingContext
import { useBooking } from '../contexts/BookingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, RefreshCw } from 'lucide-react';

const BookingDashboard = () => {
  const {
    // State
    hostBookings,
    guestBookings,
    loading,
    error,
    refreshing,

    // Functions
    refreshBookings,
    updateBookingStatus,
    cancelBooking,

    // Utilities
    getBookingStats,
    getStatusBadge,
    formatCurrency,
    formatDate,
    getTotalGuests,
  } = useBooking();

  // Get statistics for host bookings
  const stats = getBookingStats(hostBookings);

  const handleAcceptBooking = async (bookingId) => {
    await updateBookingStatus(bookingId, 'confirmed');
  };

  const handleDeclineBooking = async (bookingId) => {
    await updateBookingStatus(bookingId, 'cancelled');
  };

  const handleCancelGuestBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(bookingId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => refreshBookings()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <Button variant="outline" onClick={() => refreshBookings()} disabled={refreshing}>
          <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Host Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>As Host ({hostBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {hostBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No host bookings found</p>
          ) : (
            <div className="space-y-4">
              {hostBookings.slice(0, 5).map((booking) => {
                const statusConfig = getStatusBadge(booking.status);

                return (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{booking.property?.title}</h3>
                        <p className="text-sm text-gray-600">Guest: {booking.guest?.fullName}</p>
                      </div>
                      <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Check-in: {formatDate(booking.checkIn)}</p>
                      <p>Check-out: {formatDate(booking.checkOut)}</p>
                      <p>Guests: {getTotalGuests(booking.guests)}</p>
                      <p className="font-medium text-gray-900">
                        Total: {formatCurrency(booking.totalAmount || booking.totalPrice || 0)}
                      </p>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptBooking(booking._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineBooking(booking._id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>As Guest ({guestBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {guestBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No guest bookings found</p>
          ) : (
            <div className="space-y-4">
              {guestBookings.slice(0, 5).map((booking) => {
                const statusConfig = getStatusBadge(booking.status);

                return (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{booking.property?.title}</h3>
                        <p className="text-sm text-gray-600">Host: {booking.host?.fullName}</p>
                      </div>
                      <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Check-in: {formatDate(booking.checkIn)}</p>
                      <p>Check-out: {formatDate(booking.checkOut)}</p>
                      <p>Guests: {getTotalGuests(booking.guests)}</p>
                      <p className="font-medium text-gray-900">
                        Total: {formatCurrency(booking.totalAmount || booking.totalPrice || 0)}
                      </p>
                    </div>

                    {booking.status === 'upcoming' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelGuestBooking(booking._id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDashboard;
