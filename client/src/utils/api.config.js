// src/utils/api.config.js

export const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    PROFILE: `${BASE_URL}/auth/profile`,
    LOGOUT: `${BASE_URL}/auth/logout`, // make sure your backend supports this
  },
};

export const API_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
};

 