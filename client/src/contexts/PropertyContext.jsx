// src/context/PropertyContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const PropertyContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

// ✅ Attach token globally for all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 responses globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't show toast for 401 on auth check requests
      const isAuthCheck = error.config?.url?.includes('/api/auth/check');
      if (!isAuthCheck) {
        // Unauthorized request handled silently
      }
      
      // Clear invalid tokens
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [userProperties, setUserProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState(new Map());

  // ✅ Get all properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/properties");
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get featured properties
  const fetchFeaturedProperties = async () => {
    try {
      const { data } = await axios.get("/api/properties/featured");
      if (data.success) {
        setFeaturedProperties(data.properties);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Get single property with caching
  const fetchPropertyById = async (id) => {
    try {
      setLoading(true);
      setSelectedProperty(null); // Clear previous property
      
      // Check cache first
      const cacheKey = `property_${id}`;
      const cachedProperty = cache.get(cacheKey);
      const now = Date.now();
      
      // Use cached data if it's less than 5 minutes old
      if (cachedProperty && (now - cachedProperty.timestamp) < 300000) {
        setSelectedProperty(cachedProperty.data);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`/api/properties/${id}`);
      if (data.success) {
        setSelectedProperty(data.property);
        
        // Cache the property data
        setCache(prev => new Map(prev).set(cacheKey, {
          data: data.property,
          timestamp: now
        }));
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
  };

  // ✅ Get properties of logged-in user
  const fetchUserProperties = async (userId) => {
    try {
      console.log('Fetching user properties for userId:', userId);
      const { data } = await axios.get(`/api/properties/user/${userId || ""}`);
      console.log('User properties response:', data);
      if (data.success) {
        console.log(`Setting ${data.properties.length} user properties`);
        setUserProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching user properties:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Create property
  const createProperty = async (formData) => {
    try {
      const { data } = await axios.post("/api/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
  };

  // ✅ Update property
  const updateProperty = async (id, formData) => {
    try {
      const { data } = await axios.put(`/api/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? data.property : p))
        );
        toast.success("Property updated successfully");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // ✅ Delete property
  const deleteProperty = async (id) => {
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
        hasUpcomingBookings: errorData?.hasUpcomingBookings
      };
    }
  };

  // ✅ Check availability (if backend supports it)
  const checkAvailability = async (id) => {
    try {
      const { data } = await axios.get(`/api/properties/${id}/availability`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFeaturedProperties();
  }, []);

  const value = {
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
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
