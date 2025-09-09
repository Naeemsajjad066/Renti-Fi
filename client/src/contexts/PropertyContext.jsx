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

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [userProperties, setUserProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // ✅ Get single property
  const fetchPropertyById = async (id) => {
    try {
      const { data } = await axios.get(`/api/properties/${id}`);
      if (data.success) {
        setSelectedProperty(data.property);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Get properties of logged-in user
  const fetchUserProperties = async (userId) => {
    try {
      const { data } = await axios.get(`/api/properties/user/${userId || ""}`);
      if (data.success) {
        setUserProperties(data.properties);
      }
    } catch (error) {
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
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
