// API Configuration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Property endpoints
  PROPERTIES: `${API_BASE_URL}/properties`,
  PROPERTY: (id: string) => `${API_BASE_URL}/properties/${id}`,

  // Authentication endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/bookings`,
  BOOKING: (id: string) => `${API_BASE_URL}/bookings/${id}`,
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
};