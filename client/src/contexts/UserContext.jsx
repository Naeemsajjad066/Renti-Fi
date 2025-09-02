import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.config';
import { useAuth } from './AuthContext';

// Create the context
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user details automatically when auth changes
  useEffect(() => {
    if (isAuthenticated && authUser?._id) {
      fetchUserDetails(authUser._id);
    } else {
      setUserDetails(null);
    }
  }, [isAuthenticated, authUser]);

  // Fetch user details by ID
  const fetchUserDetails = async (userId) => {
    if (!userId) return null;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_ENDPOINTS.AUTH.PROFILE}/${userId}`, API_CONFIG);
      setUserDetails(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(API_ENDPOINTS.AUTH.PROFILE, userData, API_CONFIG);
      setUserDetails(response.data.user);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_ENDPOINTS.AUTH.PROFILE}/password`, passwordData, API_CONFIG);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user bookings
  const getUserBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_ENDPOINTS.AUTH.PROFILE}/bookings`, API_CONFIG);
      return response.data.bookings;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user bookings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user properties
  const getUserProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_ENDPOINTS.AUTH.PROFILE}/properties`, API_CONFIG);
      return response.data.properties;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user properties');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userDetails,
        loading,
        error,
        fetchUserDetails,
        updateProfile,
        updatePassword,
        getUserBookings,
        getUserProperties,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
