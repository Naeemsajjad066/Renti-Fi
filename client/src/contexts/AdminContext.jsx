import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api.config';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

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
    recentProperties: []
  });
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Get Dashboard Statistics
  const getDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/admin/dashboard/stats`,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        setDashboardStats(response.data.stats);
        return { success: true, data: response.data.stats };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch dashboard stats';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeader]);

  // Get All Users
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/admin/users`,
        { headers: getAuthHeader() }
      );

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
  }, [token, getAuthHeader]);

  // Get All Properties
  const getAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/admin/properties`,
        { headers: getAuthHeader() }
      );

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
  }, [token, getAuthHeader]);

  // Get All Bookings
  const getAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${BASE_URL}/admin/bookings`,
        { headers: getAuthHeader() }
      );

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
  }, [token, getAuthHeader]);

  // Update User
  const updateUser = useCallback(async (userId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(
        `${BASE_URL}/admin/users/${userId}`,
        updates,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user._id === userId ? response.data.user : user
        ));
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
  }, [token, getAuthHeader]);

  const value = {
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
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
