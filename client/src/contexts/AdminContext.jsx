import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api.config';
import { useAuth } from './AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
const AdminContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { token } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentBookings: [],
    recentProperties: [],
  });
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Handle authorization errors
  const handleAuthError = useCallback((err) => {
    if (err.response?.status === 403) {
      // Redirect to home if user doesn't have admin access
      window.location.href = '/';
      return 'Access denied. Admin privileges required.';
    }
    return err.response?.data?.message || err.message;
  }, []);

  // Get Dashboard Statistics
  const getDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/admin/dashboard/stats`, {
        headers: getAuthHeader(),
      });

      if (response.data.success) {
        setDashboardStats(response.data.stats);
        return { success: true, data: response.data.stats };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = handleAuthError(err) || 'Failed to fetch dashboard stats';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, handleAuthError]);

  // Get All Users
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/admin/users`, { headers: getAuthHeader() });

      if (response.data.success) {
        setUsers(response.data.users);
        return { success: true, data: response.data.users };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch users';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Get All Properties
  const getAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/admin/properties`, {
        headers: getAuthHeader(),
      });

      if (response.data.success) {
        setProperties(response.data.properties);
        return { success: true, data: response.data.properties };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch properties';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Get All Bookings
  const getAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/admin/bookings`, { headers: getAuthHeader() });

      if (response.data.success) {
        setBookings(response.data.bookings);
        return { success: true, data: response.data.bookings };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch bookings';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Update User
  const updateUser = useCallback(
    async (userId, updates) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(`${BASE_URL}/admin/users/${userId}`, updates, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          // Update local state - merge updates with existing user data
          setUsers((prev) =>
            prev.map((user) =>
              user._id === userId ? { ...user, ...updates, ...response.data.user } : user
            )
          );
          return { success: true, data: response.data.user };
        }

        return { success: false, message: response.data.message };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to update user';
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Delete User
  const deleteUser = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          // Remove from local state
          setUsers((prev) => prev.filter((user) => user._id !== userId));
          return { success: true, message: response.data.message };
        }

        return { success: false, message: response.data.message };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete user';
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Update Property
  const updateProperty = useCallback(
    async (propertyId, updates) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(`${BASE_URL}/admin/properties/${propertyId}`, updates, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          // Update local state - merge updates with existing property data
          setProperties((prev) =>
            prev.map((property) =>
              property._id === propertyId
                ? { ...property, ...updates, ...response.data.property }
                : property
            )
          );
          return { success: true, data: response.data.property };
        }

        return { success: false, message: response.data.message };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to update property';
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  // Delete Property
  const deleteProperty = useCallback(
    async (propertyId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.delete(`${BASE_URL}/admin/properties/${propertyId}`, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          // Remove from local state
          setProperties((prev) => prev.filter((property) => property._id !== propertyId));
          return { success: true, message: response.data.message };
        }

        return { success: false, message: response.data.message };
      } catch (err) {
        const errorData = err.response?.data;
        const message = errorData?.message || 'Failed to delete property';
        setError(message);
        return {
          success: false,
          message,
          hasActiveBookings: errorData?.hasActiveBookings,
          hasUpcomingBookings: errorData?.hasUpcomingBookings,
          activeBookingsCount: errorData?.activeBookingsCount,
          upcomingBookingsCount: errorData?.upcomingBookingsCount,
        };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader]
  );

  const value = useMemo(
    () => ({
      dashboardStats,
      users,
      properties,
      bookings,
      loading,
      error,
      getDashboardStats,
      getAllUsers,
      getAllProperties,
      getAllBookings,
      updateUser,
      deleteUser,
      updateProperty,
      deleteProperty,
    }),
    [
      bookings,
      dashboardStats,
      deleteProperty,
      deleteUser,
      error,
      getAllBookings,
      getAllProperties,
      getAllUsers,
      getDashboardStats,
      loading,
      properties,
      updateProperty,
      updateUser,
      users,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
