import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import { useReview } from '../contexts/ReviewContext';

/**
 * Encapsulates ALL state, effects, and handlers for the Bookings page:
 *  - fetches bookings on mount
 *  - loads which bookings have already been reviewed
 *  - handles the Stripe success redirect with retry refetches
 *  - exposes cancel + review-success handlers
 */
const useBookingsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    loading,
    error,
    activeTab,
    setActiveTab,
    cancelBooking,
    fetchGuestBookings,
    fetchAllBookings,
    formatDate,
    getBookingsByTab,
  } = useBooking();

  const { getUserReviews } = useReview();

  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
  const [stripeSuccess, setStripeSuccess] = useState(false);
  const [stripeChecking, setStripeChecking] = useState(false);

  /* Fetch fresh bookings on mount */
  useEffect(() => {
    fetchAllBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Load reviews to know which bookings are already reviewed */
  const loadReviews = useCallback(async () => {
    const result = await getUserReviews();
    if (result?.success) {
      setReviewedBookingIds(new Set(result.data.map((r) => r.booking)));
    }
  }, [getUserReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  /* Handle Stripe success redirect: /bookings?session_id=cs_xxx
     The booking is created by the webhook asynchronously, so we show the
     banner immediately and refetch with a couple of retries. */
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    setStripeSuccess(true);
    setStripeChecking(true);
    navigate('/bookings', { replace: true });

    const refetchWithRetry = async () => {
      await new Promise((r) => setTimeout(r, 2000));
      await fetchGuestBookings();
      await new Promise((r) => setTimeout(r, 3000));
      await fetchGuestBookings();
      setStripeChecking(false);
    };

    refetchWithRetry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    await cancelBooking(bookingId);
  };

  const handleReviewSuccess = () => {
    loadReviews();
    setSelectedBookingForReview(null);
  };

  const filteredBookings = getBookingsByTab(activeTab);

  return {
    // data
    filteredBookings,
    loading,
    error,
    activeTab,
    setActiveTab,
    formatDate,
    // reviews
    selectedBookingForReview,
    setSelectedBookingForReview,
    reviewedBookingIds,
    handleReviewSuccess,
    // stripe
    stripeSuccess,
    stripeChecking,
    dismissStripeSuccess: () => setStripeSuccess(false),
    // actions
    handleCancelBooking,
  };
};

export default useBookingsPage;
