import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

/**
 * Fetches a single booking for the guest-side details page.
 * Uses the authenticated api instance and detects whether the
 * current user is the host.
 */
const useBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/bookings/${id}`);
      if (data.success) {
        setBooking(data.booking);
        const hostId = data.booking.host?._id || data.booking.host;
        setIsHost(authUser?._id?.toString() === hostId?.toString());
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error(error.response?.data?.message || 'Failed to load booking details');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, authUser]);

  useEffect(() => {
    if (id && authUser) fetchBookingDetails();
  }, [id, authUser, fetchBookingDetails]);

  const handleCancelBooking = useCallback(async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking?\n\nIf you paid 40% upfront, that amount will NOT be refunded.'
      )
    )
      return;

    try {
      setCancelling(true);
      const { data } = await api.post(`/api/bookings/${id}/cancel`);
      if (data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookingDetails();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  }, [id, fetchBookingDetails]);

  return {
    booking,
    loading,
    cancelling,
    isHost,
    navigate,
    fetchBookingDetails,
    handleCancelBooking,
  };
};

export default useBookingDetails;
