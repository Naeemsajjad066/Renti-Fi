import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
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

/* ── Loading skeleton ─────────────────────────────────────────────────────── */
const LoadingState = () => (
  <PageTransition>
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-earth-brown/20 border-t-earth-brown animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading your booking…</p>
        </div>
      </main>
      <Footer />
    </div>
  </PageTransition>
);

/* ── Not-found state ──────────────────────────────────────────────────────── */
const NotFoundState = ({ onBack }) => (
  <PageTransition>
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Booking not found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This booking doesn't exist or you don't have access to it.
          </p>
          <Button onClick={onBack}>Go to My Bookings</Button>
        </div>
      </main>
      <Footer />
    </div>
  </PageTransition>
);

/* ── Main page ────────────────────────────────────────────────────────────── */
const BookingDetails = () => {
  const { booking, loading, cancelling, isHost, navigate, handleCancelBooking } =
    useBookingDetails();

  // Guest booking details always navigates back to /bookings
  const goBack = () => navigate('/bookings');

  if (loading) return <LoadingState />;
  if (!booking) return <NotFoundState onBack={goBack} />;

  const checkInDate = new Date(booking.checkIn);
  const now = new Date();
  const canCancel =
    booking.status !== 'cancelled' &&
    booking.status !== 'completed' &&
    booking.status !== 'expired' &&
    checkInDate > now;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />

        <main className="flex-grow pt-20 pb-16">
          <div className="page-container max-w-6xl py-8">
            {/* Back link */}
            <button
              onClick={goBack}
              className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-earth-brown dark:hover:text-cream-beige transition-colors"
            >
              <ArrowLeft size={15} />
              Back to My Bookings
            </button>

            <BookingDetailHeader booking={booking} variant="guest" dark />

            {/* Cancellation warning */}
            <AnimatePresence>
              {canCancel &&
                booking.paymentOption === 'early' &&
                booking.paymentBreakdown?.upfrontPaid && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl px-5 py-4"
                  >
                    <AlertCircle
                      size={17}
                      className="text-amber-500 dark:text-amber-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-0.5">
                        Cancellation Policy
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Cancelling will forfeit your upfront payment of{' '}
                        <strong>
                          Rs {booking.paymentBreakdown.upfrontAmount.toLocaleString()}
                        </strong>
                        . The remaining arrival payment will be cancelled.
                      </p>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Main column ── */}
              <div className="lg:col-span-2 space-y-5">
                <PropertyInfoCard booking={booking} />
                <StayDetailsCard booking={booking} />
                <BookingMapCard property={booking.property} dark showDirections mapHeight="h-72" />
              </div>

              {/* ── Sidebar ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-5">
                  <PaymentSummaryCard booking={booking} />
                  <ContactCard booking={booking} variant={isHost ? 'guest' : 'host'} />

                  {/* Cancel button — guest only, cancellable bookings only */}
                  {!isHost && canCancel && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        variant="destructive"
                        className="w-full rounded-xl"
                        onClick={handleCancelBooking}
                        disabled={cancelling}
                      >
                        {cancelling ? 'Cancelling…' : 'Cancel Booking'}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default BookingDetails;
