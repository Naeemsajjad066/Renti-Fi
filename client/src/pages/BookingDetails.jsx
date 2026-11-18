import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Bath,
  Navigation,
  MessageSquare,
  Star,
  KeyRound,
  Receipt,
  Info,
  ChevronRight,
  AlertTriangle,
  X,
  Building2,
  UserCheck,
  Wallet,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import ReviewForm from '@/components/ReviewForm';
import { useReview } from '../contexts/ReviewContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

/* ─── Status & Payment Configurations ────────────────────────────────────── */

const STATUS_CONFIG = {
  reserved: {
    label: 'Reserved',
    badgeBg:
      'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-500',
    icon: Clock,
    step: 1,
  },
  confirmed: {
    label: 'Confirmed',
    badgeBg:
      'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
    step: 2,
  },
  'checked-in': {
    label: 'Checked In',
    badgeBg: 'bg-teal/15 dark:bg-teal/25 text-teal dark:text-teal-300 border-teal/30',
    dot: 'bg-teal',
    icon: KeyRound,
    step: 3,
  },
  completed: {
    label: 'Completed',
    badgeBg:
      'bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/20',
    dot: 'bg-gray-500',
    icon: CheckCircle,
    step: 4,
  },
  cancelled: {
    label: 'Cancelled',
    badgeBg: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/20',
    dot: 'bg-red-500',
    icon: XCircle,
    step: 0,
  },
  expired: {
    label: 'Expired',
    badgeBg:
      'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/20',
    dot: 'bg-amber-500',
    icon: AlertCircle,
    step: 0,
  },
};

const PAYMENT_CONFIG = {
  pending: {
    label: 'Payment Pending',
    className:
      'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/20',
  },
  partial: {
    label: '40% Advance Paid',
    className:
      'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/20',
  },
  paid: {
    label: 'Fully Paid',
    className:
      'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  refunded: {
    label: 'Refunded',
    className:
      'bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/20',
  },
  failed: {
    label: 'Payment Failed',
    className: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/20',
  },
};

const LIFECYCLE_STEPS = [
  { key: 'reserved', label: 'Booked', description: 'Reservation created' },
  { key: 'confirmed', label: 'Confirmed', description: 'Ready for arrival' },
  { key: 'checked-in', label: 'Checked In', description: 'Enjoy your stay' },
  { key: 'completed', label: 'Completed', description: 'Stay finished' },
];

const CANCELLATION_REASONS = [
  'Change of travel dates or plans',
  'Found another accommodation',
  'Personal or family emergency',
  'Transportation or weather issues',
  'Booked by mistake',
  'Other reason',
];

/* ─── Skeleton Loader ────────────────────────────────────────────────────── */

const BookingDetailsSkeleton = () => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
    <Navbar />
    <main className="flex-grow pt-24 pb-16">
      <div className="page-container max-w-6xl animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
        <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-52 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

/* ─── Cancellation Modal ─────────────────────────────────────────────────── */

const CancelBookingModal = ({ isOpen, onClose, onConfirm, cancelling, booking }) => {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const isEarlyPaid = booking.paymentOption === 'early' && booking.paymentBreakdown?.upfrontPaid;
  const upfrontAmount = booking.paymentBreakdown?.upfrontAmount || 0;
  const arrivalAmount = booking.paymentBreakdown?.arrivalAmount || 0;

  const handleConfirm = (e) => {
    e.preventDefault();
    const finalReason =
      selectedReason === 'Other reason' && customReason.trim()
        ? customReason.trim()
        : selectedReason;
    onConfirm(finalReason);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/25 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cancel Reservation?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  This action cannot be undone once confirmed
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleConfirm} className="p-6 space-y-5">
            {/* Financial impact box */}
            {isEarlyPaid ? (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-4 text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                  <AlertCircle size={15} className="text-amber-600 shrink-0" />
                  Non-Refundable Advance Policy
                </p>
                <div className="space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
                  <div className="flex justify-between">
                    <span>Upfront Paid (40% — Non-refundable):</span>
                    <span className="font-bold">Rs {upfrontAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>Arrival Balance Waived (60%):</span>
                    <span className="font-bold">Rs {arrivalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60 p-4 text-sm text-gray-600 dark:text-gray-300">
                Your reservation at{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {booking.property?.title}
                </span>{' '}
                will be cancelled immediately and the dates will be released.
              </div>
            )}

            {/* Reason selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                Reason for cancelling
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-teal bg-teal/5 dark:bg-teal/15 text-gray-900 dark:text-white font-medium'
                        : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-teal"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {selectedReason === 'Other reason' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please share a brief reason..."
                  rows={2}
                  className="mt-3 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal"
                />
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={cancelling}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="submit"
                disabled={cancelling}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { getUserReviews } = useReview();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [copiedField, setCopiedField] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/bookings/${id}`);
      if (data.success) {
        setBooking(data.booking);
        const hostId = data.booking.host?._id || data.booking.host;
        setIsHost(authUser?._id?.toString() === hostId?.toString());
        if (data.booking.isReviewed) {
          setHasReviewed(true);
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error(error.response?.data?.message || 'Failed to load booking details');
      const fromHost = window.location.pathname.includes('host');
      navigate(fromHost ? '/host/bookings' : '/bookings');
    } finally {
      setLoading(false);
    }
  }, [id, authUser, navigate]);

  const checkReviewStatus = useCallback(async () => {
    if (!id) return;
    try {
      const result = await getUserReviews();
      if (result?.success && Array.isArray(result.data)) {
        const reviewed = result.data.some(
          (r) => (r.booking?._id || r.booking)?.toString() === id.toString()
        );
        if (reviewed) setHasReviewed(true);
      }
    } catch {
      // Ignore review check errors silently
    }
  }, [id, getUserReviews]);

  useEffect(() => {
    if (id && authUser) {
      fetchBookingDetails();
      checkReviewStatus();
    }
  }, [id, authUser, fetchBookingDetails, checkReviewStatus]);

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCancelBooking = async (reason) => {
    try {
      setCancelling(true);
      const { data } = await api.post(`/api/bookings/${id}/cancel`, { reason });
      if (data.success) {
        toast.success('Booking cancelled successfully');
        setShowCancelModal(false);
        fetchBookingDetails();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <BookingDetailsSkeleton />;
  }

  if (!booking) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
          <Navbar />
          <main className="flex-grow pt-24 flex items-center justify-center px-4">
            <div className="text-center max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={30} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Not Found
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                We couldn&apos;t locate this reservation. It may have been removed or you may not
                have permission to view it.
              </p>
              <Button
                onClick={() => navigate('/bookings')}
                className="bg-teal hover:bg-teal/90 text-white rounded-xl px-6"
              >
                Back to My Bookings
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.reserved;
  const paymentCfg = PAYMENT_CONFIG[booking.paymentStatus] || PAYMENT_CONFIG.pending;
  const StatusIcon = statusCfg.icon;

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const now = new Date();

  const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
  const isCurrentlyActive =
    now >= checkInDate &&
    now <= checkOutDate &&
    booking.status !== 'cancelled' &&
    booking.status !== 'expired';
  const isPastStay = now > checkOutDate || booking.status === 'completed';

  const canCancel =
    !['cancelled', 'completed', 'expired'].includes(booking.status) && daysUntilCheckIn > 1;

  const canReview =
    !isHost &&
    (booking.status === 'completed' || (isPastStay && booking.status === 'confirmed')) &&
    !hasReviewed;

  const images =
    booking.property?.images?.length > 0 ? booking.property.images : ['/placeholder.svg'];

  const fullAddress = [booking.property?.address, booking.property?.city, booking.property?.state]
    .filter(Boolean)
    .join(', ');

  const totalGuestsCount =
    (booking.guests?.adults || 0) +
    (booking.guests?.children || 0) +
    (booking.guests?.infants || 0);

  // Calculate paid & remaining amounts for clear UX
  const totalAmount = booking.totalPrice || 0;
  let paidAmount = 0;
  let remainingAmount = totalAmount;

  if (booking.paymentStatus === 'paid') {
    paidAmount = totalAmount;
    remainingAmount = 0;
  } else if (booking.paymentOption === 'early' && booking.paymentBreakdown) {
    paidAmount =
      (booking.paymentBreakdown.upfrontPaid ? booking.paymentBreakdown.upfrontAmount || 0 : 0) +
      (booking.paymentBreakdown.arrivalPaid ? booking.paymentBreakdown.arrivalAmount || 0 : 0);
    remainingAmount = Math.max(0, totalAmount - paidAmount);
  }

  const paidPercentage =
    totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;

  // Contextual status headline
  const getStayHeadline = () => {
    if (booking.status === 'cancelled') {
      return {
        title: 'Reservation Cancelled',
        subtitle: booking.cancelledAt
          ? `Cancelled on ${new Date(booking.cancelledAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}${booking.cancellationReason ? ` • Reason: "${booking.cancellationReason}"` : ''}`
          : 'This booking has been cancelled.',
        tone: 'red',
      };
    }
    if (booking.status === 'expired') {
      return {
        title: 'Reservation Expired',
        subtitle: 'This booking expired before confirmation was completed.',
        tone: 'amber',
      };
    }
    if (booking.status === 'completed' || isPastStay) {
      return {
        title: 'Stay Completed',
        subtitle: `You checked out on ${checkOutDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}. Thank you for staying with RentiFi!`,
        tone: 'neutral',
      };
    }
    if (booking.status === 'checked-in' || isCurrentlyActive) {
      return {
        title: 'Currently Checked In',
        subtitle: `Enjoy your stay at ${booking.property?.title || 'the property'}! Check-out is ${checkOutDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} before 9:00 AM.`,
        tone: 'teal',
      };
    }
    if (daysUntilCheckIn === 0) {
      return {
        title: 'Check-In is Today!',
        subtitle: 'Have your 6-digit verification code ready to show your host upon arrival.',
        tone: 'teal',
      };
    }
    if (daysUntilCheckIn === 1) {
      return {
        title: 'Check-In is Tomorrow!',
        subtitle: 'Pack your bags — your stay begins tomorrow from 9:00 AM onwards.',
        tone: 'teal',
      };
    }
    return {
      title: `Upcoming Stay in ${daysUntilCheckIn} Days`,
      subtitle: `Your reservation at ${booking.property?.title || 'the property'} is ${booking.status}.`,
      tone: 'teal',
    };
  };

  const headline = getStayHeadline();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />

        <main className="flex-grow pt-20 pb-16">
          <div className="page-container max-w-6xl py-6">
            {/* ── Top Bar: Back Navigation + Utility Actions ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => navigate(isHost ? '/host/bookings' : '/bookings')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:border-teal/50 hover:text-teal transition-all font-medium shadow-sm"
                >
                  <ArrowLeft size={15} />
                  <span>{isHost ? 'Host Bookings' : 'My Bookings'}</span>
                </button>
                <ChevronRight size={14} className="text-gray-400 hidden sm:block" />
                <span className="text-gray-500 dark:text-gray-400 hidden sm:inline font-mono text-xs">
                  #{booking._id?.slice(-8).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleCopy(booking._id, 'Booking ID')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-teal/50 hover:text-teal transition-all shadow-sm"
                >
                  {copiedField === 'Booking ID' ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>Booking ID</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-teal/50 hover:text-teal transition-all shadow-sm"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Print Itinerary</span>
                </button>

                {canReview && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <Star size={14} className="fill-white" />
                    <span>Write a Review</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Hero Status & Lifecycle Banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6 relative overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  booking.status === 'cancelled'
                    ? 'bg-red-500'
                    : booking.status === 'expired'
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-teal via-emerald-500 to-tangerine'
                }`}
              />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.badgeBg}`}
                    >
                      <StatusIcon size={13} />
                      {statusCfg.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${paymentCfg.className}`}
                    >
                      <CreditCard size={12} />
                      {paymentCfg.label}
                    </span>

                    {hasReviewed && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        Reviewed
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                    {headline.title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {headline.subtitle}
                  </p>
                </div>

                {/* Quick reference metadata */}
                <div className="flex flex-col sm:items-end justify-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 shrink-0">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
                    Reservation Reference
                  </span>
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200 text-sm mt-0.5">
                    {booking._id}
                  </span>
                  {booking.createdAt && (
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Booked on{' '}
                      {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* ── 4-Step Lifecycle Progress Tracker ── */}
              {statusCfg.step > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {LIFECYCLE_STEPS.map((stepObj, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted =
                        statusCfg.step > stepNum || booking.status === 'completed';
                      const isCurrent =
                        statusCfg.step === stepNum && booking.status !== 'completed';

                      return (
                        <div
                          key={stepObj.key}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            isCurrent
                              ? 'border-teal/40 bg-teal/5 dark:bg-teal/15'
                              : isCompleted
                                ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10'
                                : 'border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/30 opacity-60'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                  ? 'bg-teal text-white ring-4 ring-teal/20'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {isCompleted ? <Check size={14} /> : stepNum}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {stepObj.label}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                              {stepObj.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Main 2-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Left / Main Column (2/3 width) ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Property Showcase Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  {/* Hero Image with Overlay Controls */}
                  <div className="relative h-64 sm:h-80 bg-gray-100 dark:bg-gray-800 overflow-hidden group">
                    <img
                      src={images[selectedImageIdx] || '/placeholder.svg'}
                      alt={booking.property?.title || 'Property'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top badges over image */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      {booking.property?.propertyType && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/55 backdrop-blur-md text-white text-xs font-medium capitalize">
                          <Building2 size={13} className="text-teal-300" />
                          {booking.property.propertyType}
                        </span>
                      )}

                      <Link
                        to={`/properties/${booking.property?._id}`}
                        className="inline-flex items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 hover:bg-white text-gray-900 dark:text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all"
                      >
                        <span>View Property</span>
                        <ExternalLink size={13} />
                      </Link>
                    </div>

                    {/* Property Title & Location on Image Bottom */}
                    <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <Link
                          to={`/properties/${booking.property?._id}`}
                          className="text-xl sm:text-2xl font-display font-bold text-white hover:text-cream-beige transition-colors line-clamp-1"
                        >
                          {booking.property?.title || 'Property'}
                        </Link>
                        {fullAddress && (
                          <p className="flex items-center gap-1.5 text-white/85 text-xs sm:text-sm mt-1">
                            <MapPin size={14} className="text-teal-300 shrink-0" />
                            <span className="line-clamp-1">{fullAddress}</span>
                          </p>
                        )}
                      </div>

                      {images.length > 1 && (
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-xl self-start sm:self-auto print:hidden">
                          {images.slice(0, 4).map((imgUrl, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImageIdx(idx)}
                              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImageIdx === idx
                                  ? 'border-white scale-105'
                                  : 'border-transparent opacity-65 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Thumb ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/placeholder.svg';
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Property Quick Specs & Amenities Bar */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                      {booking.property?.bedrooms != null && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 text-xs font-medium text-gray-700 dark:text-gray-300">
                          <BedDouble size={15} className="text-teal" />
                          <span>
                            {booking.property.bedrooms}{' '}
                            {booking.property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                          </span>
                        </div>
                      )}
                      {booking.property?.bathrooms != null && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 text-xs font-medium text-gray-700 dark:text-gray-300">
                          <Bath size={15} className="text-teal" />
                          <span>
                            {booking.property.bathrooms}{' '}
                            {booking.property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                          </span>
                        </div>
                      )}
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 text-xs font-medium text-gray-700 dark:text-gray-300">
                        <Users size={15} className="text-teal" />
                        <span>
                          {totalGuestsCount} {totalGuestsCount === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal/10 text-xs font-semibold text-teal">
                        <Calendar size={15} />
                        <span>
                          {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'} Stay
                        </span>
                      </div>
                    </div>

                    {/* Included Amenities Preview */}
                    {booking.property?.amenities?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
                          Property Amenities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {booking.property.amenities.slice(0, 8).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 capitalize"
                            >
                              <Sparkles size={11} className="text-teal" />
                              {amenity}
                            </span>
                          ))}
                          {booking.property.amenities.length > 8 && (
                            <Link
                              to={`/properties/${booking.property?._id}`}
                              className="inline-flex items-center px-3 py-1 rounded-lg bg-teal/10 text-teal text-xs font-medium hover:bg-teal/20 transition-colors"
                            >
                              +{booking.property.amenities.length - 8} more
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* 2. Stay Itinerary & Schedule Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Stay Itinerary
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Check-in and check-out schedule
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-bold">
                      {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
                    </span>
                  </div>

                  {/* Boarding-pass style Check-in / Check-out boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Check-in Box */}
                    <div className="md:col-span-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 p-4">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal mb-1">
                        Check-In
                      </span>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {checkInDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        <Clock size={13} className="text-teal" />
                        <span>From 9:00 AM onwards</span>
                      </div>
                    </div>

                    {/* Center Connector */}
                    <div className="md:col-span-1 flex md:flex-col items-center justify-center py-1">
                      <div className="w-8 h-8 rounded-full bg-teal/10 dark:bg-teal/20 text-teal flex items-center justify-center text-xs font-bold">
                        →
                      </div>
                    </div>

                    {/* Check-out Box */}
                    <div className="md:col-span-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 p-4">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-tangerine mb-1">
                        Check-Out
                      </span>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {checkOutDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        <Clock size={13} className="text-tangerine" />
                        <span>Before 9:00 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Details & Special Requests */}
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Users size={16} className="text-teal" />
                        <span>Registered Guests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.guests?.adults > 0 && (
                          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {booking.guests.adults}{' '}
                            {booking.guests.adults === 1 ? 'Adult' : 'Adults'}
                          </span>
                        )}
                        {booking.guests?.children > 0 && (
                          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {booking.guests.children}{' '}
                            {booking.guests.children === 1 ? 'Child' : 'Children'}
                          </span>
                        )}
                        {booking.guests?.infants > 0 && (
                          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {booking.guests.infants}{' '}
                            {booking.guests.infants === 1 ? 'Infant' : 'Infants'}
                          </span>
                        )}
                        {booking.guests?.pets > 0 && (
                          <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            {booking.guests.pets} {booking.guests.pets === 1 ? 'Pet' : 'Pets'}
                          </span>
                        )}
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                          <MessageSquare size={13} className="text-teal" />
                          <span>Special Requests</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          &ldquo;{booking.specialRequests}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Helpful Check-In Guide for Guests */}
                    {!isHost &&
                      booking.status !== 'cancelled' &&
                      booking.status !== 'completed' && (
                        <div className="rounded-xl bg-teal/5 dark:bg-teal/10 border border-teal/15 p-4 flex items-start gap-3">
                          <Info size={17} className="text-teal shrink-0 mt-0.5" />
                          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 leading-relaxed">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Smooth Check-In Reminders
                            </p>
                            <p>
                              • Coordinate your arrival time with{' '}
                              <strong>{booking.host?.fullName || 'your host'}</strong> ahead of
                              check-in.
                            </p>
                            <p>
                              • Keep your <strong>6-digit Verification PIN</strong> handy to confirm
                              arrival at the property.
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>

                {/* 3. Location & Directions Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Property Location
                        </h3>
                        {fullAddress && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{fullAddress}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                      {fullAddress && (
                        <button
                          onClick={() => handleCopy(fullAddress, 'Address')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-teal/50 hover:text-teal transition-colors"
                        >
                          {copiedField === 'Address' ? (
                            <Check size={13} className="text-emerald-500" />
                          ) : (
                            <Copy size={13} />
                          )}
                          <span>Copy Address</span>
                        </button>
                      )}

                      {booking.property?.latitude && booking.property?.longitude && (
                        <button
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.property.latitude},${booking.property.longitude}`;
                            window.open(url, '_blank');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal hover:bg-teal/90 text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <Navigation size={13} />
                          <span>Get Directions</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {booking.property?.latitude && booking.property?.longitude ? (
                    <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                      <iframe
                        title="Property Location Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${booking.property.latitude},${booking.property.longitude}&output=embed&z=15`}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-5 text-sm text-gray-600 dark:text-gray-300">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.property?.address}
                      </p>
                      <p className="mt-0.5">
                        {booking.property?.city}, {booking.property?.state}{' '}
                        {booking.property?.zipCode}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ── Right / Sidebar Column (1/3 width) ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* 1. Digital Check-In Verification Pass */}
                  {booking.verificationCode && booking.status !== 'cancelled' && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="rounded-2xl overflow-hidden bg-gradient-to-br from-charcoal-gray via-charcoal-gray to-teal text-white shadow-md relative"
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-200">
                            <ShieldCheck size={15} />
                            Check-In Pass
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(booking.verificationCode, 'Verification Code')
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-medium text-white transition-colors print:hidden"
                          >
                            {copiedField === 'Verification Code' ? (
                              <>
                                <Check size={12} className="text-emerald-300" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy PIN</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Individual digit boxes */}
                        <div className="grid grid-cols-6 gap-1.5 my-3">
                          {String(booking.verificationCode)
                            .split('')
                            .map((digit, index) => (
                              <div
                                key={index}
                                className="h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-xl font-mono font-bold tracking-wider shadow-inner"
                              >
                                {digit}
                              </div>
                            ))}
                        </div>

                        <p className="text-xs text-white/80 text-center mt-2">
                          {isHost
                            ? 'Ask your guest to present this 6-digit code upon check-in'
                            : 'Present this 6-digit PIN to your host upon arrival'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* 2. Payment Summary & Receipt Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                          <Receipt size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Payment Summary
                        </h3>
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>
                          Base rate ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Rs {booking.basePrice?.toLocaleString()}
                        </span>
                      </div>

                      {booking.cleaningFee > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Cleaning fee</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Rs {booking.cleaningFee.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {booking.serviceFee > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Service fee</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Rs {booking.serviceFee.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {booking.taxes > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Taxes & fees</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Rs {booking.taxes.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total Row */}
                    <div className="my-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-baseline justify-between">
                      <div>
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          Total Amount
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {booking.paymentOption === 'early'
                            ? 'Split payment (40% advance / 60% arrival)'
                            : 'Full payment on arrival'}
                        </p>
                      </div>
                      <span className="text-xl font-display font-extrabold text-teal">
                        Rs {booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>

                    {/* Payment Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Paid: Rs {paidAmount.toLocaleString()}
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {remainingAmount > 0 && booking.status !== 'cancelled'
                            ? `Due: Rs ${remainingAmount.toLocaleString()}`
                            : `${paidPercentage}% Paid`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal to-emerald-500 transition-all duration-500"
                          style={{ width: `${paidPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Payment Schedule Breakdown */}
                    <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                      {booking.paymentOption === 'early' && booking.paymentBreakdown && (
                        <>
                          {/* Upfront 40% */}
                          <div
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                              booking.paymentBreakdown.upfrontPaid
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {booking.paymentBreakdown.upfrontPaid ? (
                                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                              ) : (
                                <Clock size={15} className="text-amber-500 shrink-0" />
                              )}
                              <div>
                                <p className="font-semibold">40% Upfront Advance</p>
                                {booking.paymentBreakdown.upfrontPaid &&
                                  booking.paymentBreakdown.upfrontPaidAt && (
                                    <p className="text-[11px] opacity-80">
                                      Paid on{' '}
                                      {new Date(
                                        booking.paymentBreakdown.upfrontPaidAt
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <span className="font-bold text-sm">
                              Rs {booking.paymentBreakdown.upfrontAmount?.toLocaleString()}
                            </span>
                          </div>

                          {/* Arrival 60% */}
                          <div
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                              booking.paymentBreakdown.arrivalPaid
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {booking.paymentBreakdown.arrivalPaid ? (
                                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                              ) : (
                                <Wallet size={15} className="text-amber-500 shrink-0" />
                              )}
                              <div>
                                <p className="font-semibold">60% Due on Arrival</p>
                                {!booking.paymentBreakdown.arrivalPaid &&
                                  booking.status !== 'cancelled' && (
                                    <p className="text-[11px] opacity-80">
                                      Pay directly at property check-in
                                    </p>
                                  )}
                              </div>
                            </div>
                            <span className="font-bold text-sm">
                              Rs {booking.paymentBreakdown.arrivalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}

                      {booking.paymentOption === 'arrival' && (
                        <div
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {booking.paymentStatus === 'paid' ? (
                              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Wallet size={15} className="text-amber-500 shrink-0" />
                            )}
                            <div>
                              <p className="font-semibold">100% Payment on Arrival</p>
                              <p className="text-[11px] opacity-80">
                                {booking.paymentStatus === 'paid'
                                  ? 'Collected at property'
                                  : 'Pay host at check-in'}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-sm">
                            Rs {booking.totalPrice?.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {booking.refundAmount > 0 && (
                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs flex items-center justify-between text-blue-700 dark:text-blue-300">
                          <span className="font-semibold">Refunded Amount</span>
                          <span className="font-bold text-sm">
                            Rs {booking.refundAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* 3. Host / Guest Contact Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
                  >
                    {isHost ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Guest Details
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-teal bg-teal/10 px-2.5 py-0.5 rounded-full">
                            <UserCheck size={12} /> Verified Guest
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5 mb-5">
                          <img
                            src={booking.guest?.profilePic || '/placeholder.svg'}
                            alt={booking.guest?.fullName || 'Guest'}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal/20"
                            onError={(e) => {
                              e.target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate">
                              {booking.guest?.fullName || 'Guest'}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {booking.guest?.email || 'Primary Reservation Holder'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {booking.guest?.phoneNumber && (
                            <a
                              href={`tel:${booking.guest.phoneNumber}`}
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal/10 hover:bg-teal/20 text-teal text-xs font-semibold transition-colors"
                            >
                              <Phone size={14} />
                              <span>Call Guest</span>
                            </a>
                          )}
                          {booking.guest?.email && (
                            <a
                              href={`mailto:${booking.guest.email}`}
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors"
                            >
                              <Mail size={14} />
                              <span>Email</span>
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Your Host
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-teal bg-teal/10 px-2.5 py-0.5 rounded-full">
                            <ShieldCheck size={12} /> Verified Host
                          </span>
                        </div>

                        <Link
                          to={`/host/${booking.host?._id}`}
                          className="flex items-center gap-3.5 mb-5 group"
                        >
                          <img
                            src={booking.host?.profilePic || '/placeholder.svg'}
                            alt={booking.host?.fullName || 'Host'}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal/20 group-hover:ring-teal transition-all"
                            onError={(e) => {
                              e.target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-teal transition-colors truncate">
                              {booking.host?.fullName || 'Property Host'}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Property Host • View Profile →
                            </p>
                          </div>
                        </Link>

                        <div className="grid grid-cols-2 gap-2.5 mb-3 print:hidden">
                          {booking.host?.phoneNumber && (
                            <a
                              href={`tel:${booking.host.phoneNumber}`}
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal hover:bg-teal/90 text-white text-xs font-semibold transition-colors shadow-sm"
                            >
                              <Phone size={14} />
                              <span>Call Host</span>
                            </a>
                          )}
                          {booking.host?.email && (
                            <a
                              href={`mailto:${booking.host.email}`}
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal/50 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-colors"
                            >
                              <Mail size={14} />
                              <span>Email Host</span>
                            </a>
                          )}
                        </div>

                        {booking.host?.phoneNumber && (
                          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                            Direct line: {booking.host.phoneNumber}
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>

                  {/* 4. Cancellation Policy & Cancel Action Card */}
                  {!isHost && canCancel && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 print:hidden"
                    >
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                        <AlertCircle size={15} className="text-amber-500" />
                        Cancellation Policy
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                        {booking.paymentOption === 'early' &&
                        booking.paymentBreakdown?.upfrontPaid ? (
                          <>
                            Cancelling now waives the remaining arrival balance of{' '}
                            <strong className="text-gray-700 dark:text-gray-200">
                              Rs {booking.paymentBreakdown.arrivalAmount?.toLocaleString()}
                            </strong>
                            . The 40% advance deposit (
                            <strong className="text-gray-700 dark:text-gray-200">
                              Rs {booking.paymentBreakdown.upfrontAmount?.toLocaleString()}
                            </strong>
                            ) is non-refundable.
                          </>
                        ) : (
                          'You can cancel this reservation up to 24 hours before check-in.'
                        )}
                      </p>

                      <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={cancelling}
                        className="w-full py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/70 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors"
                      >
                        Cancel Reservation
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* ── Custom Cancellation Modal ── */}
        <CancelBookingModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelBooking}
          cancelling={cancelling}
          booking={booking}
        />

        {/* ── Review Modal for Completed Bookings ── */}
        {showReviewModal && (
          <ReviewForm
            booking={booking}
            onClose={() => setShowReviewModal(false)}
            onSuccess={() => {
              setHasReviewed(true);
              setShowReviewModal(false);
            }}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default BookingDetails;
