import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  User,
  MapPin,
  X,
  Check,
  Clock,
  Star,
  ExternalLink,
  Phone,
  CheckCircle,
  Loader2,
  CreditCard,
  Home,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { useBooking } from '../contexts/BookingContext';
import { useReview } from '../contexts/ReviewContext';
import ReviewForm from '../components/ReviewForm';

/* ─── status badge ────────────────────────────────────────────────────────── */

const StatusBadge = ({ status, getStatusBadge }) => {
  const cfg = getStatusBadge(status);
  const icons = {
    upcoming: <Clock size={12} className="mr-1" />,
    active: <Check size={12} className="mr-1" />,
    completed: <Check size={12} className="mr-1" />,
    cancelled: <X size={12} className="mr-1" />,
    confirmed: <Check size={12} className="mr-1" />,
    reserved: <Check size={12} className="mr-1" />,
    pending: <Clock size={12} className="mr-1" />,
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
    >
      {icons[status] ?? null}
      {cfg.label}
    </span>
  );
};

/* ─── stripe success banner ───────────────────────────────────────────────── */

const StripeSuccessBanner = ({ onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    className="mb-6 flex items-start gap-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-2xl px-5 py-4"
  >
    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-green-800 dark:text-green-300">
        Payment successful — booking confirmed!
      </p>
      <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
        Your advance payment was received. Check the details below and watch for a confirmation
        email.
      </p>
    </div>
    <button
      onClick={onDismiss}
      className="text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-colors shrink-0 mt-0.5"
      aria-label="Dismiss"
    >
      <X size={16} />
    </button>
  </motion.div>
);

/* ─── loading skeleton ────────────────────────────────────────────────────── */

const BookingSkeleton = () => (
  <div className="divide-y divide-gray-100 dark:divide-gray-700/60 animate-pulse">
    {[0, 1, 2].map((i) => (
      <div key={i} className="p-6 flex gap-5">
        <div className="w-40 h-28 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── empty state ─────────────────────────────────────────────────────────── */

const EmptyState = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <Home size={26} className="text-gray-400" />
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
      {tab === 'all' ? 'No bookings yet' : `No ${tab} bookings`}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
      {tab === 'all'
        ? "Once you book a property it'll appear here."
        : `You don't have any ${tab} bookings right now.`}
    </p>
    <Link
      to="/properties"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl text-sm font-medium transition-colors"
    >
      Browse Properties
    </Link>
  </div>
);

/* ─── tabs ────────────────────────────────────────────────────────────────── */

const TABS = ['all', 'upcoming', 'active', 'completed', 'cancelled'];

/* ─── main component ──────────────────────────────────────────────────────── */

const Bookings = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    loading: isLoading,
    error,
    activeTab,
    setActiveTab,
    cancelBooking,
    fetchGuestBookings,
    fetchAllBookings,
    formatDate,
    getStatusBadge,
    getBookingsByTab,
  } = useBooking();

  const { getUserReviews } = useReview();

  /* ── state ── */
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [stripeChecking, setStripeChecking] = useState(false);

  /* ── fetch fresh bookings every time this page mounts ── */
  useEffect(() => {
    fetchAllBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── load reviews ── */
  const loadReviews = useCallback(async () => {
    const result = await getUserReviews();
    if (result?.success) {
      setReviewedBookingIds(new Set(result.data.map((r) => r.booking)));
    }
  }, [getUserReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  /* ── handle Stripe success redirect ─────────────────────────────────────
     Stripe sends back: /bookings?session_id=cs_xxx
     The booking is created by the webhook ASYNCHRONOUSLY so we:
       1. Show the success banner immediately (payment definitely happened)
       2. Wait 3 s then refetch so the webhook has time to create the booking
       3. If still not there after 3 s, do one more fetch at 6 s
       4. Strip session_id from URL so refresh doesn't re-trigger this
  ─────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    setStripeSuccess(true);
    setStripeChecking(true);

    // Clean the URL immediately so a hard-refresh doesn't re-trigger
    navigate('/bookings', { replace: true });

    const refetchWithRetry = async () => {
      // First fetch after 2 s
      await new Promise((r) => setTimeout(r, 2000));
      await fetchGuestBookings();

      // Second fetch after another 3 s in case webhook was slow
      await new Promise((r) => setTimeout(r, 3000));
      await fetchGuestBookings();

      setStripeChecking(false);
    };

    refetchWithRetry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only — searchParams read directly from URL

  /* ── cancel ── */
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    await cancelBooking(bookingId);
  };

  const handleReviewSuccess = () => {
    loadReviews();
    setSelectedBookingForReview(null);
  };

  const filteredBookings = getBookingsByTab(activeTab);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />

        <main className="flex-grow pt-20 pb-16">
          <div className="page-container py-8">
            <div className="max-w-5xl mx-auto">
              {/* ── Page header ── */}
              <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  My Bookings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  All your past and upcoming stays in one place
                </p>
              </div>

              {/* ── Stripe success banner ── */}
              <AnimatePresence>
                {stripeSuccess && <StripeSuccessBanner onDismiss={() => setStripeSuccess(false)} />}
              </AnimatePresence>

              {/* ── Checking / syncing indicator ── */}
              <AnimatePresence>
                {stripeChecking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 flex items-center gap-2.5 text-sm text-earth-brown bg-earth-brown/8 dark:bg-earth-brown/15 border border-earth-brown/20 rounded-xl px-4 py-2.5"
                  >
                    <Loader2 size={14} className="animate-spin shrink-0" />
                    Syncing your booking — it will appear below in a moment…
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Error banner ── */}
              {error && (
                <div className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* ── Main card ── */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800 scrollbar-none">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-earth-brown text-earth-brown dark:text-cream-beige'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Content */}
                {isLoading ? (
                  <BookingSkeleton />
                ) : filteredBookings.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredBookings.map((booking, idx) => (
                      <motion.div
                        key={booking._id || booking.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="p-5 sm:p-6 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Property image */}
                          <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                            <img
                              src={
                                booking.property?.images?.[0] ||
                                booking.propertyImage ||
                                '/placeholder.svg'
                              }
                              alt={booking.property?.title || 'Property'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder.svg';
                              }}
                            />
                            <div className="absolute top-2 left-2">
                              <StatusBadge
                                status={booking.status}
                                getStatusBadge={getStatusBadge}
                              />
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            {/* Title + price */}
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <Link
                                to={`/properties/${booking.property?._id || booking.propertyId}`}
                                className="text-base font-semibold text-gray-900 dark:text-white hover:text-earth-brown dark:hover:text-cream-beige transition-colors leading-snug"
                              >
                                {booking.property?.title || booking.propertyName || 'Property'}
                              </Link>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-gray-900 dark:text-white text-base">
                                  Rs {booking.totalPrice?.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">total</p>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                              <MapPin size={11} className="shrink-0" />
                              {booking.property?.city && booking.property?.state
                                ? `${booking.property.city}, ${booking.property.state}`
                                : booking.location || 'Location not specified'}
                            </div>

                            {/* Date + guests row */}
                            <div className="flex flex-wrap gap-4 text-sm mb-4">
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                                  Check-in
                                </p>
                                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                  <Calendar size={12} className="text-earth-brown" />
                                  {formatDate(booking.checkIn)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                                  Check-out
                                </p>
                                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                  <Calendar size={12} className="text-earth-brown" />
                                  {formatDate(booking.checkOut)}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                                  Guests
                                </p>
                                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                  <User size={12} className="text-earth-brown" />
                                  {booking.guests?.adults || booking.guests || 1} guest
                                  {(booking.guests?.adults || booking.guests || 1) !== 1 ? 's' : ''}
                                </p>
                              </div>
                              {/* Payment method pill */}
                              {booking.paymentOption && (
                                <div>
                                  <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                                    Payment
                                  </p>
                                  <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                    <CreditCard size={12} className="text-earth-brown" />
                                    {booking.paymentOption === 'early'
                                      ? '40% paid · 60% on arrival'
                                      : 'Pay on arrival'}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Host + actions row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                              {/* Host */}
                              <Link
                                to={`/host/${booking.host?._id || booking.hostId}`}
                                className="flex items-center gap-2.5 group"
                              >
                                <img
                                  src={
                                    booking.host?.profilePic ||
                                    booking.host?.profilePicture ||
                                    '/placeholder.svg'
                                  }
                                  alt={booking.host?.fullName || 'Host'}
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                  onError={(e) => {
                                    if (e.target.src !== '/placeholder.svg')
                                      e.target.src = '/placeholder.svg';
                                  }}
                                />
                                <div>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mb-0.5">
                                    Hosted by
                                  </p>
                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-earth-brown transition-colors">
                                    {booking.host?.fullName || booking.hostName || 'Host'}
                                  </p>
                                </div>
                              </Link>

                              {/* Action buttons */}
                              <div className="flex flex-wrap gap-2">
                                <Link
                                  to={`/bookings/${booking._id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-lg text-xs font-medium transition-colors"
                                >
                                  <ExternalLink size={12} /> View Details
                                </Link>

                                <Link
                                  to={`/properties/${booking.property?._id || booking.propertyId}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-lg text-xs font-medium transition-colors"
                                >
                                  View Property
                                </Link>

                                {booking.host?.phone && (
                                  <a
                                    href={`tel:${booking.host.phone}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-lg text-xs font-medium transition-colors"
                                  >
                                    <Phone size={12} /> Call Host
                                  </a>
                                )}

                                {booking.status === 'upcoming' && (
                                  <button
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-medium transition-colors"
                                  >
                                    <X size={12} /> Cancel
                                  </button>
                                )}

                                {booking.status === 'completed' &&
                                  !reviewedBookingIds.has(booking._id) && (
                                    <button
                                      onClick={() => setSelectedBookingForReview(booking)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      <Star size={12} /> Write Review
                                    </button>
                                  )}

                                {booking.status === 'completed' &&
                                  reviewedBookingIds.has(booking._id) && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                                      <Check size={12} /> Reviewed
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState tab={activeTab} />
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
