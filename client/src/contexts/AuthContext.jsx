import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_ENDPOINTS, API_CONFIG } from "../config/api.config";

// Create the context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Register
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
        API_CONFIG
      );

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        API_CONFIG
      );

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.post(
            API_ENDPOINTS.AUTH.LOGOUT, // ✅ fixed
            {},
            {
              ...API_CONFIG,
              headers: {
                ...API_CONFIG.headers,
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (err) {
          console.warn(
            "Logout API call failed, but clearing local state anyway:",
            err.message
          );
        }
      }

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Logout failed");
    }
  };

  // Check auth
  const checkAuth = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
        ...API_CONFIG,
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      setUser(null);
      setIsAuthenticated(false);
      setError(err.response?.data?.message || "Authentication check failed");
    } finally {
      setLoading(false);
    }
  };

  // Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
