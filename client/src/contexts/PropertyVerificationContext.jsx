import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api.config';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const PropertyVerificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePropertyVerification = () => {
  const context = useContext(PropertyVerificationContext);
  if (!context) {
    throw new Error('usePropertyVerification must be used within PropertyVerificationProvider');
  }
  return context;
};

export const PropertyVerificationProvider = ({ children }) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Get all pending properties
  const getPendingProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/admin/properties/pending`, {
        headers: getAuthHeader(),
      });

      if (response.data.success) {
        setPendingProperties(response.data.properties);
        return { success: true, data: response.data.properties, count: response.data.count };
      }

      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch pending properties';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Approve property
  const approveProperty = useCallback(
    async (propertyId, adminNotes = '') => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(
          `${BASE_URL}/admin/properties/${propertyId}/approve`,
          { adminNotes },
          { headers: getAuthHeader() }
        );

        if (response.data.success) {
          // Remove from pending list
          setPendingProperties((prev) => prev.filter((p) => p._id !== propertyId));

          toast({
            title: 'Property Approved!',
            description: 'The property has been approved and the host has been notified.',
            variant: 'success',
          });

          return { success: true, data: response.data.property };
        }

        return { success: false, message: response.data.message };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to approve property';
        setError(message);
        toast({
          title: 'Approval Failed',
          description: message,
          variant: 'destructive',
        });
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader, toast]
  );

  // Reject property
  const rejectProperty = useCallback(
    async (propertyId, rejectionReason, adminNotes = '') => {
      try {
        setLoading(true);
        setError(null);

        if (!rejectionReason || rejectionReason.trim() === '') {
          toast({
            title: 'Rejection Reason Required',
            description: 'Please provide a reason for rejecting the property.',
            variant: 'destructive',
          });
          return { success: false, message: 'Rejection reason is required' };
        }

        const response = await axios.put(
          `${BASE_URL}/admin/properties/${propertyId}/reject`,
          { rejectionReason, adminNotes },
          { headers: getAuthHeader() }
        );

        if (response.data.success) {
          // Remove from pending list
          setPendingProperties((prev) => prev.filter((p) => p._id !== propertyId));

          toast({
            title: 'Property Rejected',
            description: 'The property has been rejected and the host has been notified.',
            variant: 'default',
          });

          return { success: true, data: response.data.property };
        }

        return { success: false, message: response.data.message };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to reject property';
        setError(message);
        toast({
          title: 'Rejection Failed',
          description: message,
          variant: 'destructive',
        });
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeader, toast]
  );

  const value = {
    pendingProperties,
    loading,
    error,
    getPendingProperties,
    approveProperty,
    rejectProperty,
  };

  return (
    <PropertyVerificationContext.Provider value={value}>
      {children}
    </PropertyVerificationContext.Provider>
  );
};
