import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import {
  PropertyInfoCard,
  StayDetailsCard,
  PaymentSummaryCard,
  ContactCard,
  BookingDetailHeader,
  BookingMapCard,
} from '@/components/booking';
import useBookingDetails from '@/hooks/useBookingDetails';

const BookingDetails = () => {
  const { booking, loading, cancelling, isHost, navigate, handleCancelBooking } =
    useBookingDetails();

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!booking) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Booking not found</p>
              <Button onClick={() => navigate('/bookings')} className="mt-4">
                Back to Bookings
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const checkInDate = new Date(booking.checkIn);
  const now = new Date();
  const canCancel =
    booking.status !== 'cancelled' &&
    booking.status !== 'completed' &&
    booking.status !== 'expired' &&
    checkInDate > now;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow pt-20 pb-12">
          <div className="page-container max-w-6xl">
            <BookingDetailHeader booking={booking} variant="guest" dark />

            {/* Cancellation warning */}
            {canCancel &&
              booking.paymentOption === 'early' &&
              booking.paymentBreakdown?.upfrontPaid && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <AlertCircle
                      className="text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Cancellation Policy
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        If you cancel this booking, the upfront amount of{' '}
                        <strong>
                          Rs {booking.paymentBreakdown.upfrontAmount.toLocaleString()}
                        </strong>{' '}
                        will NOT be refunded. Only the remaining payment on arrival will be
                        cancelled.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <PropertyInfoCard booking={booking} />
                <BookingMapCard property={booking.property} dark showDirections mapHeight="h-80" />
                <StayDetailsCard booking={booking} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <PaymentSummaryCard booking={booking} />
                  <ContactCard booking={booking} variant={isHost ? 'guest' : 'host'} />

                  {/* Cancel action (guest only) */}
                  {!isHost && canCancel && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleCancelBooking}
                        disabled={cancelling}
                      >
                        {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Back to bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <Button
                variant="outline"
                onClick={() => navigate(isHost ? '/host/bookings' : '/bookings')}
              >
                Back to All Bookings
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default BookingDetails;
