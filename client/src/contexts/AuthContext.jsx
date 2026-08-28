import { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import axios from "../lib/api";
import toast from "react-hot-toast";
import { useLoading } from "./LoadingContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUsr] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Track initial auth check
  const { showLoading, hideLoading } = useLoading();

  // check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUsr(data.user);
      }
    } catch (error) {
      // Silently handle auth check failures
      if (error.response?.status === 401) {
        // Clear invalid tokens without logging error
        localStorage.removeItem("token");
        setToken(null);
        setAuthUsr(null);
        delete axios.defaults.headers.common["Authorization"];
      } else {
        // Only log non-401 errors
        console.error("Auth check error:", error.response?.data?.message || error.message);
      }
    }
  }, []);

  // signup function
  const register = useCallback(async (credentials) => {
    showLoading("Creating your account...");
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);
      if (data.success) {
        if (data.requiresVerification) {
          // Email verification required
          toast.success(data.message);
          return { success: true, requiresVerification: true, email: data.email };
        } else {
          // Direct registration (fallback)
          setAuthUsr(data.userData);
          axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success(data.message);
          return { success: true, requiresVerification: false };
        }
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  // verify email function
  const verifyEmail = useCallback(async (email, code, userData) => {
    showLoading("Verifying your email...");
    try {
      const { data } = await axios.post("/api/auth/verify-email", {
        email,
        code,
        userData
      });
      
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  // resend verification code function
  const resendVerificationCode = useCallback(async (email, fullName) => {
    showLoading("Sending verification code...");
    try {
      const { data } = await axios.post("/api/auth/resend-verification", {
        email,
        fullName
      });
      
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  // login function
  const login = useCallback(async (credentials) => {
    showLoading("Signing you in...");
    try {
      const { data } = await axios.post(`/api/auth/login`, credentials);
      if (data.success) {
  setAuthUsr(data.userData);
  axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      return data;  // 🔑 return API response
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;  // 🔑 rethrow so you can catch it in handleSubmit
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  // logout function
  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUsr(null);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
  }, []);

  // forgot password function
  const forgotPassword = useCallback(async (email) => {
    showLoading("Sending reset code...");
    try {
      const { data } = await axios.post("/api/auth/forgot-password", { email });
      if (data.success) {
        toast.success(data.message);
        return { success: true, email: data.email };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send reset code";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  // reset password function
  const resetPassword = useCallback(async (email, code, newPassword) => {
    showLoading("Resetting password...");
    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        email,
        code,
        newPassword
      });
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset password";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  // update profile function
  const updateProfile = useCallback(async (body) => {
    showLoading("Updating profile...");
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUsr(data.user);
        toast.success(data.message || "Profile updated successfully");
        return { success: true, user: data.user };
      } else {
        toast.error(data.message || "Failed to update profile");
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if token exists and is a valid non-empty string (not null, undefined, or string literals)
      if (token && typeof token === 'string' && token.trim().length > 0 && token !== 'null' && token !== 'undefined') {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await checkAuth();
      } else {
        // Clear any existing auth data if no valid token
        setAuthUsr(null);
        setToken(null);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
      setIsAuthLoading(false); // Mark initial auth check as complete
    };
    
    initializeAuth();
  }, []);

  const value = useMemo(() => ({
    axios,
    authUser,
    token,
    isAuthLoading,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
  }), [authUser, forgotPassword, isAuthLoading, login, logout, register, resendVerificationCode, resetPassword, token, updateProfile, verifyEmail]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
