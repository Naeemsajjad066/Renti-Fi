import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { useLoading } from "./LoadingContext";

export const BookingContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

// Attach token globally for all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthCheck = error.config?.url?.includes('/api/auth/check');
      if (!isAuthCheck) {
        // Unauthorized request handled silently
      }
      
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

export const BookingProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);
  const { showLoading, hideLoading } = useLoading();

  // State management
  const [bookings, setBookings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [guestBookings, setGuestBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Review states
  const [showReviewModal, setShowReviewModal] = useState({ show: false, selectedBooking: null });
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewedBookings, setReviewedBookings] = useState([]);

  // Cache for bookings
  const [cache, setCache] = useState(new Map());

  // ✅ Fetch all bookings for current user (both as guest and host)
  const fetchAllBookings = async () => {
    if (!authUser?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [guestResponse, hostResponse] = await Promise.all([
        axios.get('/api/bookings?type=guest'),
        axios.get(`/api/bookings/user/${authUser._id}?type=host`)
      ]);

      if (guestResponse?.data?.success) {
        setGuestBookings(guestResponse.data.bookings || []);
      }

      if (hostResponse?.data?.success) {
        setHostBookings(hostResponse.data.bookings || []);
      }

      // Combine all bookings
      const allBookings = [
        ...(guestResponse?.data?.bookings || []),
        ...(hostResponse?.data?.bookings || [])
      ];
      setBookings(allBookings);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch guest bookings only
  const fetchGuestBookings = async () => {
    if (!authUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/bookings?type=guest');
      
      if (response?.data?.success) {
        setGuestBookings(response.data.bookings || []);
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch guest bookings');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch host bookings only
  const fetchHostBookings = async () => {
    if (!authUser?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/bookings/user/${authUser._id}?type=host`);

      if (response?.data?.success) {
        setHostBookings(response.data.bookings || []);
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch host bookings');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh bookings
  const refreshBookings = async (type = 'all') => {
    setRefreshing(true);
    try {
      switch (type) {
        case 'guest':
          await fetchGuestBookings();
          break;
        case 'host':
          await fetchHostBookings();
          break;
        default:
          await fetchAllBookings();
      }
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Get single booking by ID
  const fetchBookingById = async (id) => {
    try {
      setLoading(true);
      
      // Check cache first
      const cacheKey = `booking_${id}`;
      const cachedBooking = cache.get(cacheKey);
      const now = Date.now();
      
      if (cachedBooking && (now - cachedBooking.timestamp) < 300000) {
        setSelectedBooking(cachedBooking.data);
        setLoading(false);
        return cachedBooking.data;
      }

      const response = await axios.get(`/api/bookings/${id}`);
      
      if (response?.data?.success) {
        const booking = response.data.booking;
        setSelectedBooking(booking);
        
        // Cache the booking data
        setCache(prev => new Map(prev).set(cacheKey, {
          data: booking,
          timestamp: now
        }));
        
        return booking;
      } else {
        throw new Error(response?.data?.message || 'Booking not found');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Booking not found');
      setSelectedBooking(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create new booking
  const createBooking = async (bookingData) => {
    showLoading("Creating booking...");
    try {
      const response = await axios.post('/api/bookings', bookingData);
      
      if (response?.data?.success) {
        const newBooking = response.data.booking;
        
        // Update relevant state
        setGuestBookings(prev => [...prev, newBooking]);
        setBookings(prev => [...prev, newBooking]);
        
        toast.success(response.data.message || 'Booking created successfully');
        return { success: true, booking: newBooking };
      } else {
        toast.error(response?.data?.message || 'Failed to create booking');
        return { success: false, message: response?.data?.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      hideLoading();
    }
  };

  // ✅ Update booking status (for hosts)
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/status`, { status });
      
      if (response.data.success) {
        // Update booking in all relevant states
        const updateBookingInArray = (bookings) =>
          bookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status } 
              : booking
          );

        setHostBookings(prev => updateBookingInArray(prev));
        setBookings(prev => updateBookingInArray(prev));
        
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking(prev => ({ ...prev, status }));
        }

        // Clear cache for this booking
        setCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(`booking_${bookingId}`);
          return newCache;
        });
        
        const actionText = status === 'confirmed' ? 'accepted' : 'declined';
        toast.success(`Booking ${actionText} successfully`);
        return { success: true };
      } else {
        toast.error(response.data.message || 'Failed to update booking status');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update booking status';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // ✅ Cancel booking (for guests)
  const cancelBooking = async (bookingId, reason = 'Cancelled by guest') => {
    showLoading("Cancelling booking...");
    try {
      const response = await axios.post(`/api/bookings/${bookingId}/cancel`, { reason });
      
      if (response.data.success) {
        // Update booking in all relevant states
        const updateBookingInArray = (bookings) =>
          bookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' } 
              : booking
          );

        setGuestBookings(prev => updateBookingInArray(prev));
        setBookings(prev => updateBookingInArray(prev));
        
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking(prev => ({ ...prev, status: 'cancelled' }));
        }

        // Clear cache for this booking
        setCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(`booking_${bookingId}`);
          return newCache;
        });

        toast.success('Booking cancelled successfully');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Failed to cancel booking');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      hideLoading();
    }
  };

  // ✅ Submit review for completed booking
  const submitReview = async (bookingId, reviewData) => {
    showLoading("Submitting review...");
    try {
      const response = await axios.post(`/api/bookings/${bookingId}/review`, reviewData);
      
      if (response.data.success) {
        // Mark booking as reviewed
        setReviewedBookings(prev => [...prev, bookingId]);
        
        // Reset review modal state
        setShowReviewModal({ show: false, selectedBooking: null });
        setRating(0);
        setReviewText('');
        
        toast.success('Review submitted successfully');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Failed to submit review');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      hideLoading();
    }
  };

  // ✅ Utility functions
  const getStatusFromDates = (booking) => {
    const today = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    if (booking.status === 'cancelled') return 'cancelled';
    if (today < checkIn) return 'upcoming';
    if (today >= checkIn && today <= checkOut) return 'active';
    if (today > checkOut) return 'completed';
    
    return booking.status;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { 
        variant: 'default', 
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Confirmed'
      },
      pending: { 
        variant: 'secondary', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pending'
      },
      cancelled: { 
        variant: 'destructive', 
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Cancelled'
      },
      completed: { 
        variant: 'outline', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Completed'
      },
      upcoming: {
        variant: 'secondary',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Upcoming'
      },
      active: {
        variant: 'default',
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Active'
      }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalGuests = (guests) => {
    if (typeof guests === 'object' && guests) {
      return (guests.adults || 0) + (guests.children || 0) + (guests.infants || 0);
    }
    return guests || 1;
  };

  // ✅ Calculate booking statistics
  const getBookingStats = (bookingsList = hostBookings) => {
    return {
      total: bookingsList.length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      pending: bookingsList.filter(b => b.status === 'pending').length,
      cancelled: bookingsList.filter(b => b.status === 'cancelled').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      totalRevenue: bookingsList
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalAmount || b.totalPrice || 0), 0)
    };
  };

  // ✅ Filter bookings
  const getFilteredBookings = (bookingsList, filterType = filter, search = searchTerm) => {
    return bookingsList.filter(booking => {
      const matchesFilter = filterType === 'all' || booking.status === filterType;
      const matchesSearch = !search || 
        booking.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        booking.property?.title?.toLowerCase().includes(search.toLowerCase()) ||
        booking.property?.city?.toLowerCase().includes(search.toLowerCase()) ||
        booking.host?.fullName?.toLowerCase().includes(search.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  };

  // ✅ Get bookings by tab for guest bookings
  const getBookingsByTab = (tab = activeTab) => {
    if (tab === 'all') {
      return guestBookings.map(booking => ({ 
        ...booking, 
        status: getStatusFromDates(booking) 
      }));
    }
    
    return guestBookings
      .map(booking => ({ 
        ...booking, 
        status: getStatusFromDates(booking) 
      }))
      .filter(b => b.status === tab);
  };

  // ✅ Initialize bookings when user changes
  useEffect(() => {
    if (authUser) {
      fetchAllBookings();
    } else {
      // Clear all booking data when user logs out
      setBookings([]);
      setHostBookings([]);
      setGuestBookings([]);
      setSelectedBooking(null);
      setError(null);
      setCache(new Map());
    }
  }, [authUser]);

  const value = {
    // State
    bookings,
    hostBookings,
    guestBookings,
    selectedBooking,
    loading,
    error,
    refreshing,
    
    // Filter states
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    
    // Review states
    showReviewModal,
    setShowReviewModal,
    reviewText,
    setReviewText,
    rating,
    setRating,
    reviewedBookings,
    setReviewedBookings,
    
    // API functions
    fetchAllBookings,
    fetchGuestBookings,
    fetchHostBookings,
    fetchBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    submitReview,
    refreshBookings,
    
    // Utility functions
    getStatusFromDates,
    getStatusBadge,
    formatCurrency,
    formatDate,
    getTotalGuests,
    getBookingStats,
    getFilteredBookings,
    getBookingsByTab
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook for using booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};