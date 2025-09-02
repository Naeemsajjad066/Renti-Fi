import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { API_ENDPOINTS, API_CONFIG } from "../config/api.config";
import { useAuth } from "./AuthContext";

// Create the context
const BookingContext = createContext();

// Custom hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

// Provider component
export const BookingProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create booking
  const createBooking = async (bookingData) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to create a booking");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        API_ENDPOINTS.BOOKINGS,
        bookingData,
        API_CONFIG
      );
      setBookings((prev) => [...prev, response.data.booking]);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to create booking");
      throw err;
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async () => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to view bookings");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_ENDPOINTS.BOOKINGS, API_CONFIG);
      setBookings(response.data.bookings);
      setLoading(false);
      return response.data.bookings;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to fetch bookings");
      throw err;
    }
  };

  // Fetch booking by ID
  const fetchBookingById = async (bookingId) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to view booking details");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        API_ENDPOINTS.BOOKING(bookingId),
        API_CONFIG
      );
      setLoading(false);
      return response.data.booking;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to fetch booking details");
      throw err;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to cancel a booking");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.BOOKING(bookingId)}/cancel`,
        {},
        API_CONFIG
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to cancel booking");
      throw err;
    }
  };

  // Update booking
  const updateBooking = async (bookingId, updateData) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to update a booking");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        API_ENDPOINTS.BOOKING(bookingId),
        updateData,
        API_CONFIG
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, ...response.data.booking } : b
        )
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to update booking");
      throw err;
    }
  };

  const value = {
    bookings,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    fetchBookingById,
    cancelBooking,
    updateBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
