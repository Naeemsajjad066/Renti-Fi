import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Fetches a single booking for the host-side details page.
 * Uses raw axios (matching the original implementation).
 */
const useHostBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/bookings/${id}`);
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error(error.response?.data?.message || 'Failed to load booking details');
      navigate('/host/bookings');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  return { booking, loading, navigate };
};

export default useHostBookingDetails;
