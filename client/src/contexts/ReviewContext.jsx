import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLoading } from './LoadingContext';
import axios from 'axios';
import { BASE_URL } from '../utils/api.config';

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const { token } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  
  const [reviews, setReviews] = useState([]);
  const [propertyReviews, setPropertyReviews] = useState({});
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);
  const [reviewStats, setReviewStats] = useState(null);

  // Get authorization header
  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Submit a new review
  const submitReview = useCallback(async (reviewData) => {
    try {
      showLoading('Submitting review...');
      setError(null);

      // Check if user is authenticated
      if (!token) {
        const message = 'You must be logged in to submit a review';
        setError(message);
        return { success: false, message };
      }

      const response = await axios.post(
        `${BASE_URL}/reviews`,
        reviewData,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        // Update property reviews cache
        const propertyId = reviewData.property;
        if (propertyReviews[propertyId]) {
          setPropertyReviews(prev => ({
            ...prev,
            [propertyId]: [response.data.data, ...prev[propertyId]]
          }));
        }

        // Update user reviews
        setUserReviews(prev => [response.data.data, ...prev]);

        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit review';
      setError(message);
      return { success: false, message };
    } finally {
      hideLoading();
    }
  }, [token, getAuthHeader, showLoading, hideLoading, propertyReviews]);

  // Get all reviews for a property
  const getPropertyReviews = useCallback(async (propertyId, forceRefresh = false) => {
    try {
      // Return cached data if available and not forcing refresh
      if (propertyReviews[propertyId] && !forceRefresh) {
        return { success: true, data: propertyReviews[propertyId] };
      }

      setError(null);

      const response = await axios.get(
        `${BASE_URL}/reviews/property/${propertyId}`,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        setPropertyReviews(prev => ({
          ...prev,
          [propertyId]: response.data.data
        }));

        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch reviews';
      setError(message);
      return { success: false, message };
    }
  }, [token, getAuthHeader, propertyReviews]);

  // Get property review statistics
  const getPropertyStats = useCallback(async (propertyId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/reviews/property/${propertyId}/stats`,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        setReviewStats(response.data.data);
        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch review stats';
      return { success: false, message };
    }
  }, [token, getAuthHeader]);

  // Get user's reviews
  const getUserReviews = useCallback(async (userId = null) => {
    try {
      setError(null);

      const endpoint = userId 
        ? `${BASE_URL}/reviews/user/${userId}`
        : `${BASE_URL}/reviews/my-reviews`;

      const response = await axios.get(endpoint, { headers: getAuthHeader() });

      if (response.data.success) {
        if (!userId) {
          setUserReviews(response.data.data);
        }
        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch user reviews';
      setError(message);
      return { success: false, message };
    }
  }, [token, getAuthHeader]);

  // Update a review
  const updateReview = useCallback(async (reviewId, updateData) => {
    try {
      setError(null);

      const response = await axios.put(
        `${BASE_URL}/reviews/${reviewId}`,
        updateData,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        const updatedReview = response.data.data;

        // Update property reviews cache
        const propertyId = updatedReview.property;
        if (propertyReviews[propertyId]) {
          setPropertyReviews(prev => ({
            ...prev,
            [propertyId]: prev[propertyId].map(review =>
              review._id === reviewId ? updatedReview : review
            )
          }));
        }

        // Update user reviews
        setUserReviews(prev =>
          prev.map(review => (review._id === reviewId ? updatedReview : review))
        );

        return { success: true, data: updatedReview };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update review';
      setError(message);
      return { success: false, message };
    }
  }, [token, getAuthHeader, propertyReviews]);

  // Delete a review
  const deleteReview = useCallback(async (reviewId, propertyId) => {
    try {
      setError(null);

      const response = await axios.delete(
        `${BASE_URL}/reviews/${reviewId}`,
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        // Update property reviews cache
        if (propertyReviews[propertyId]) {
          setPropertyReviews(prev => ({
            ...prev,
            [propertyId]: prev[propertyId].filter(review => review._id !== reviewId)
          }));
        }

        // Update user reviews
        setUserReviews(prev => prev.filter(review => review._id !== reviewId));

        return { success: true };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete review';
      setError(message);
      return { success: false, message };
    }
  }, [token, getAuthHeader, propertyReviews]);

  // Add host response to a review
  const addHostResponse = useCallback(async (reviewId, responseText) => {
    try {
      setError(null);

      const response = await axios.post(
        `${BASE_URL}/reviews/${reviewId}/response`,
        { comment: responseText },
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        const updatedReview = response.data.data;

        // Update property reviews cache
        const propertyId = updatedReview.property;
        if (propertyReviews[propertyId]) {
          setPropertyReviews(prev => ({
            ...prev,
            [propertyId]: prev[propertyId].map(review =>
              review._id === reviewId ? updatedReview : review
            )
          }));
        }

        return { success: true, data: updatedReview };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add response';
      setError(message);
      return { success: false, message };
    }
  }, [token, getAuthHeader, propertyReviews]);

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId, propertyId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/reviews/${reviewId}/helpful`,
        {},
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        // Update property reviews cache
        if (propertyReviews[propertyId]) {
          setPropertyReviews(prev => ({
            ...prev,
            [propertyId]: prev[propertyId].map(review =>
              review._id === reviewId ? response.data.data : review
            )
          }));
        }

        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to mark helpful';
      return { success: false, message };
    }
  }, [token, getAuthHeader, propertyReviews]);

  // Check if user can review a property (has completed booking)
  const canUserReview = useCallback(async (propertyId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/reviews/can-review/${propertyId}`,
        { headers: getAuthHeader() }
      );

      return response.data;
    } catch (err) {
      return { success: false, canReview: false };
    }
  }, [token, getAuthHeader]);

  // Clear review cache
  const clearReviewCache = useCallback((propertyId = null) => {
    if (propertyId) {
      setPropertyReviews(prev => {
        const newCache = { ...prev };
        delete newCache[propertyId];
        return newCache;
      });
    } else {
      setPropertyReviews({});
    }
  }, []);

  const value = {
    reviews,
    propertyReviews,
    userReviews,
    reviewStats,
    error,
    submitReview,
    getPropertyReviews,
    getPropertyStats,
    getUserReviews,
    updateReview,
    deleteReview,
    addHostResponse,
    markHelpful,
    canUserReview,
    clearReviewCache
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
