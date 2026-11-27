import React, { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw, AlertCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingStatsBar, BookingSearchFilters, HostBookingRow } from '@/components/booking';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBooking } from '../contexts/BookingContext';

const HostBookings = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    hostBookings,
    loading,
    error,
    refreshing,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    updateBookingStatus,
    refreshBookings,
    fetchHostBookings,
    formatDate,
    formatCurrency,
    getTotalGuests,
    getBookingStats,
    getFilteredBookings,
  } = useBooking();

  useEffect(() => {
    fetchHostBookings();
  }, [fetchHostBookings]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const filteredBookings = getFilteredBookings(hostBookings);
  const stats = getBookingStats(hostBookings);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex">
        <HostSidebar isMobile={isMobile} isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Host Bookings</h1>
                <p className="text-gray-600 mt-1">
                  Manage and monitor all bookings for your properties
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshBookings('host')}
                  disabled={refreshing}
                  className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5"
                >
                  <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats */}
              <BookingStatsBar stats={stats} formatCurrency={formatCurrency} />

              {/* Search + filters */}
              <BookingSearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filter={filter}
                onFilterChange={setFilter}
              />

              {/* Bookings list */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} className="text-earth-brown" />
                    Booking Requests ({filteredBookings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-earth-brown border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-gray-600">Loading bookings...</p>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={() => refreshBookings('host')} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        {hostBookings.length === 0
                          ? 'No bookings found'
                          : 'No bookings match your search criteria'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hostBookings.length === 0
                          ? 'Bookings will appear here when guests book your properties.'
                          : 'Try adjusting your filters or search terms.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredBookings.map((booking, index) => (
                        <HostBookingRow
                          key={booking._id}
                          booking={booking}
                          index={index}
                          updateBookingStatus={updateBookingStatus}
                          formatDate={formatDate}
                          formatCurrency={formatCurrency}
                          getTotalGuests={getTotalGuests}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostBookings;
