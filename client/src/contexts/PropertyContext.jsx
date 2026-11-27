// src/context/PropertyContext.jsx
import { createContext, useCallback, useMemo, useState } from 'react';
import axios from '../lib/api';
import toast from 'react-hot-toast';

export const PropertyContext = createContext(); // eslint-disable-line react-refresh/only-export-components
export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [userProperties, setUserProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState(new Map());

  // ✅ Get all properties
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/properties');
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Get featured properties
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/properties/featured');
      if (data.success) {
        setFeaturedProperties(data.properties);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, []);

  // ✅ Get single property with caching
  const fetchPropertyById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setSelectedProperty(null); // Clear previous property

        // Check cache first
        const cacheKey = `property_${id}`;
        const cachedProperty = cache.get(cacheKey);
        const now = Date.now();

        // Use cached data if it's less than 5 minutes old
        if (cachedProperty && now - cachedProperty.timestamp < 300000) {
          setSelectedProperty(cachedProperty.data);
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`/api/properties/${id}`);
        if (data.success) {
          setSelectedProperty(data.property);

          // Cache the property data
          setCache((prev) =>
            new Map(prev).set(cacheKey, {
              data: data.property,
              timestamp: now,
            })
          );
        } else {
          setSelectedProperty(null);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error(error.response?.data?.message || 'Property not found');
        setSelectedProperty(null);
      } finally {
        setLoading(false);
      }
    },
    [cache]
  );

  // ✅ Get properties of logged-in user
  const fetchUserProperties = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/properties/user/${userId || ''}`);
      if (data.success) {
        setUserProperties(data.properties);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, []);

  // ✅ Create property
  const createProperty = useCallback(async (formData) => {
    try {
      const { data } = await axios.post('/api/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setProperties((prev) => [...prev, data.property]);
        toast.success(data.message);
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  }, []);

  // ✅ Update property
  const updateProperty = useCallback(async (id, formData) => {
    try {
      const { data } = await axios.put(`/api/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setProperties((prev) => prev.map((p) => (p._id === id ? data.property : p)));
        toast.success('Property updated successfully');
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  }, []);

  // ✅ Delete property
  const deleteProperty = useCallback(async (id) => {
    try {
      const { data } = await axios.delete(`/api/properties/${id}`);
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
        toast.success(data.message);
        return { success: true, message: data.message };
      }
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || error.message;

      // Show detailed error for active bookings
      if (errorData?.hasActiveBookings || errorData?.hasUpcomingBookings) {
        toast.error(errorMessage, { duration: 5000 });
      } else {
        toast.error(errorMessage);
      }

      return {
        success: false,
        message: errorMessage,
        hasActiveBookings: errorData?.hasActiveBookings,
        hasUpcomingBookings: errorData?.hasUpcomingBookings,
      };
    }
  }, []);

  // ✅ Check availability (if backend supports it)
  const checkAvailability = useCallback(async (id) => {
    try {
      const { data } = await axios.get(`/api/properties/${id}/availability`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, []);

  const value = useMemo(
    () => ({
      properties,
      featuredProperties,
      userProperties,
      selectedProperty,
      loading,
      fetchProperties,
      fetchFeaturedProperties,
      fetchPropertyById,
      fetchUserProperties,
      createProperty,
      updateProperty,
      deleteProperty,
      checkAvailability,
    }),
    [
      checkAvailability,
      createProperty,
      deleteProperty,
      fetchFeaturedProperties,
      fetchProperties,
      fetchPropertyById,
      fetchUserProperties,
      loading,
      properties,
      featuredProperties,
      selectedProperty,
      userProperties,
      updateProperty,
    ]
  );

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};
