import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUsr] = useState(null);

  // check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUsr(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // signup function
  const register = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);
      if (data.success) {
        setAuthUsr(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // login function
  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/login`, credentials);
      if (data.success) {
        setAuthUsr(data.userData);
        axios.defaults.headers.common["token"] = data.token;
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
    }
  };

  // logout function
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUsr(null);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
  };

  // update profile function
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUsr(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    token,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
