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
  ArrowRight,
  BedDouble,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { useBooking } from '../contexts/BookingContext';
import { useReview } from '../contexts/ReviewContext';
import ReviewForm from '../components/ReviewForm';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  upcoming:  { label: 'Upcoming',  bg: 'bg-blue-500',   dot: 'bg-blue-400'   },
  active:    { label: 'Active',    bg: 'bg-emerald-500', dot: 'bg-emerald-400' },
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-500', dot: 'bg-emerald-400' },
  reserved:  { label: 'Reserved',  bg: 'bg-indigo-500',  dot: 'bg-indigo-400'  },
  completed: { label: 'Completed', bg: 'bg-gray-500',    dot: 'bg-gray-400'   },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500',     dot: 'bg-red-400'    },
  pending:   { label: 'Pending',   bg: 'bg-amber-500',   dot: 'bg-amber-400'  },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-gray-500', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-80`} />
      {cfg.label}
    </span>
  );
};

/* ─── night count helper ──────────────────────────────────────────────────── */
const nightCount = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  return diff > 0 ? diff : null;
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
        Your advance payment was received. Check the details below and watch for a confirmation email.
      </p>
    </div>
    <button onClick={onDismiss} className="text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-colors shrink-0 mt-0.5" aria-label="Dismiss">
      <X size={16} />
    </button>
  </motion.div>
);

/* ─── loading skeleton ────────────────────────────────────────────────────── */
const BookingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 animate-pulse">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="h-44 bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="flex gap-3 pt-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ─── empty state ─────────────────────────────────────────────────────────── */
const EmptyState = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-20 h-20 rounded-full bg-earth-brown/8 dark:bg-earth-brown/15 flex items-center justify-center mb-5">
      <BedDouble size={32} className="text-earth-brown/50" />
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-lg">
      {tab === 'all' ? 'No bookings yet' : `No ${tab} bookings`}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
      {tab === 'all'
        ? "Once you book a property it'll appear here."
        : `You don't have any ${tab} bookings right now.`}
    </p>
    <Link
      to="/properties"
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
    >
      Browse Properties <ArrowRight size={15} />
    </Link>
  </div>
);

/* ─── booking card ────────────────────────────────────────────────────────── */
const BookingCard = ({
  booking,
  formatDate,
  reviewedBookingIds,
  onCancel,
  onReview,
}) => {
  const nights = nightCount(booking.checkIn, booking.checkOut);
  const guestCount = booking.guests?.adults ?? booking.guests ?? 1;
  const propertyId = booking.property?._id ?? booking.propertyId;
  const hostId = booking.host?._id ?? booking.hostId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* ── Image header with gradient overlay ── */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={booking.property?.images?.[0] ?? booking.propertyImage ?? '/placeholder.svg'}
          alt={booking.property?.title ?? 'Property'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = '/placeholder.svg'; }}
        />
        {/* Dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status pill — top right */}
        <div className="absolute top-3 right-3">
          <StatusPill status={booking.status} />
        </div>

        {/* Property name + location over image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <Link
            to={`/properties/${propertyId}`}
            className="block font-bold text-white text-base leading-snug hover:text-cream-beige transition-colors line-clamp-1"
          >
            {booking.property?.title ?? booking.propertyName ?? 'Property'}
          </Link>
          {(booking.property?.city || booking.location) && (
            <p className="flex items-center gap-1 text-white/75 text-xs mt-0.5">
              <MapPin size={10} />
              {booking.property?.city && booking.property?.state
                ? `${booking.property.city}, ${booking.property.state}`
                : booking.location}
            </p>
          )}
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="px-4 pt-4 pb-3">

        {/* Date timeline */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-0.5">Check-in</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatDate(booking.checkIn)}</p>
          </div>

          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
            <span className="text-[10px] font-semibold text-earth-brown bg-earth-brown/10 dark:bg-earth-brown/20 px-2 py-0.5 rounded-full whitespace-nowrap">
              {nights ? `${nights}n` : '→'}
            </span>
            <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-0.5">Check-out</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatDate(booking.checkOut)}</p>
          </div>
        </div>

        {/* Meta row: guests · payment · price */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User size={11} className="text-earth-brown" />
              {guestCount} guest{guestCount !== 1 ? 's' : ''}
            </span>
            {booking.paymentOption && (
              <span className="flex items-center gap-1">
                <CreditCard size={11} className="text-earth-brown" />
                {booking.paymentOption === 'early' ? '40% advance' : 'Pay on arrival'}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              Rs {booking.totalPrice?.toLocaleString()}
            </span>
            {nights && (
              <span className="text-gray-400 dark:text-gray-500 ml-1 text-[11px]">/ {nights} night{nights !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Host strip */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800 mb-3">
          <Link to={`/host/${hostId}`} className="flex items-center gap-2.5 group/host">
            <img
              src={booking.host?.profilePic ?? booking.host?.profilePicture ?? '/placeholder.svg'}
              alt={booking.host?.fullName ?? 'Host'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-earth-brown/20"
              onError={(e) => { if (e.target.src !== '/placeholder.svg') e.target.src = '/placeholder.svg'; }}
            />
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">Hosted by</p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover/host:text-earth-brown transition-colors">
                {booking.host?.fullName ?? booking.hostName ?? 'Host'}
              </p>
            </div>
          </Link>

          {booking.host?.phone && (
            <a
              href={`tel:${booking.host.phone}`}
              className="inline-flex items-center gap-1 text-xs text-earth-brown hover:text-earth-brown/80 font-medium transition-colors"
            >
              <Phone size={12} /> Call
            </a>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/bookings/${booking._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            View Details <ChevronRight size={13} />
          </Link>

          <Link
            to={`/properties/${propertyId}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-earth-brown/50 hover:text-earth-brown dark:hover:text-cream-beige rounded-xl text-xs font-medium transition-colors"
          >
            Property <ExternalLink size={11} />
          </Link>

          {booking.status === 'upcoming' && (
            <button
              onClick={() => onCancel(booking._id)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-red-200 dark:border-red-800/40 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-xs font-medium transition-colors"
            >
              <X size={12} /> Cancel
            </button>
          )}

          {booking.status === 'completed' && !reviewedBookingIds.has(booking._id) && (
            <button
              onClick={() => onReview(booking)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 rounded-xl text-xs font-semibold transition-colors"
            >
              <Star size={12} /> Review
            </button>
          )}

          {booking.status === 'completed' && reviewedBookingIds.has(booking._id) && (
            <span className="inline-flex items-center gap-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-medium">
              <Check size={12} /> Reviewed
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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

  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [stripeChecking, setStripeChecking] = useState(false);

  useEffect(() => { fetchAllBookings(); }, []);

  const loadReviews = useCallback(async () => {
    const result = await getUserReviews();
    if (result?.success) setReviewedBookingIds(new Set(result.data.map((r) => r.booking)));
  }, [getUserReviews]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;
    setStripeSuccess(true);
    setStripeChecking(true);
    navigate('/bookings', { replace: true });
    (async () => {
      await new Promise((r) => setTimeout(r, 2000));
      await fetchGuestBookings();
      await new Promise((r) => setTimeout(r, 3000));
      await fetchGuestBookings();
      setStripeChecking(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

              {/* Page header */}
              <div className="mb-7">
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  My Bookings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  All your past and upcoming stays in one place
                </p>
              </div>

              {/* Stripe success banner */}
              <AnimatePresence>
                {stripeSuccess && <StripeSuccessBanner onDismiss={() => setStripeSuccess(false)} />}
              </AnimatePresence>

              {/* Syncing indicator */}
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

              {/* Error banner */}
              {error && (
                <div className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Tabs */}
              <div className="flex overflow-x-auto gap-1 mb-6 scrollbar-none bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      activeTab === tab
                        ? 'bg-earth-brown text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
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
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking._id ?? booking.id}
                      booking={booking}
                      formatDate={formatDate}
                      reviewedBookingIds={reviewedBookingIds}
                      onCancel={handleCancelBooking}
                      onReview={setSelectedBookingForReview}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <EmptyState tab={activeTab} />
                </div>
              )}
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
