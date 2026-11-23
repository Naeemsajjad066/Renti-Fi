import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { PropertyContext } from '../contexts/PropertyContext';
import { useBooking } from '../contexts/BookingContext';
import {
  PROPERTY_AUTO_REFRESH_MS,
  RECENT_BOOKINGS_LIMIT,
  STAT_CARD_CONFIGS,
} from '../constants/dashboard';

const useHostDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { authUser } = useContext(AuthContext);
  const {
    userProperties,
    fetchUserProperties,
    deleteProperty,
    loading: propertiesLoading,
  } = useContext(PropertyContext);
  const { hostBookings, fetchHostBookings, getBookingStats, formatDate, formatCurrency } =
    useBooking();

  // Initial fetch
  useEffect(() => {
    if (!authUser?._id) return;
    fetchUserProperties(authUser._id);
    fetchHostBookings();
  }, [authUser, fetchUserProperties, fetchHostBookings]);

  // Auto-refresh properties to pick up admin approval changes
  useEffect(() => {
    if (!authUser?._id) return;
    const id = setInterval(() => fetchUserProperties(authUser._id), PROPERTY_AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [authUser, fetchUserProperties]);

  const handleDeleteProperty = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    const result = await deleteProperty(property._id);
    if (result?.success) fetchUserProperties(authUser._id);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Derive stats
  const stats = getBookingStats(hostBookings);

  // Build stat card data by merging static config with live values
  const statCards = STAT_CARD_CONFIGS.map((cfg) => ({
    ...cfg,
    value:
      cfg.key === 'properties'
        ? userProperties.length
        : cfg.isCurrency
          ? formatCurrency(stats[cfg.key] ?? 0)
          : (stats[cfg.key] ?? 0),
  }));

  const recentBookings = [...hostBookings]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, RECENT_BOOKINGS_LIMIT);

  return {
    // sidebar
    sidebarOpen,
    toggleSidebar,
    // auth
    authUser,
    // properties
    userProperties,
    propertiesLoading,
    handleDeleteProperty,
    // bookings
    recentBookings,
    statCards,
    stats,
    formatDate,
    formatCurrency,
  };
};

export default useHostDashboard;
