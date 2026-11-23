import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ReviewForm from '../components/ReviewForm';
import {
  BookingSkeleton,
  BookingEmptyState,
  StripeSuccessBanner,
  BookingCard,
  BookingTabs,
  BookingStatusBanners,
} from '@/components/booking';
import useBookingsPage from '@/hooks/useBookingsPage';

const Bookings = () => {
  const {
    filteredBookings,
    loading,
    error,
    activeTab,
    setActiveTab,
    formatDate,
    selectedBookingForReview,
    setSelectedBookingForReview,
    reviewedBookingIds,
    handleReviewSuccess,
    stripeSuccess,
    stripeChecking,
    dismissStripeSuccess,
    handleCancelBooking,
  } = useBookingsPage();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />

        <main className="flex-grow pt-20 pb-16">
          <div className="page-container py-8">
            <div className="max-w-5xl mx-auto">
              {/* Page header */}
              <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  My Bookings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  All your past and upcoming stays in one place
                </p>
              </div>

              {/* Stripe success banner */}
              <AnimatePresence>
                {stripeSuccess && <StripeSuccessBanner onDismiss={dismissStripeSuccess} />}
              </AnimatePresence>

              {/* Syncing + error banners */}
              <BookingStatusBanners stripeChecking={stripeChecking} error={error} />

              {/* Main card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {loading ? (
                  <BookingSkeleton />
                ) : filteredBookings.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredBookings.map((booking, idx) => (
                      <BookingCard
                        key={booking._id || booking.id}
                        booking={booking}
                        index={idx}
                        formatDate={formatDate}
                        reviewedBookingIds={reviewedBookingIds}
                        onCancel={handleCancelBooking}
                        onWriteReview={setSelectedBookingForReview}
                      />
                    ))}
                  </div>
                ) : (
                  <BookingEmptyState tab={activeTab} />
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {selectedBookingForReview && (
          <ReviewForm
            booking={selectedBookingForReview}
            onClose={() => setSelectedBookingForReview(null)}
            onSuccess={handleReviewSuccess}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Bookings;
