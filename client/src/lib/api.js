import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
    }
    return Promise.reject(error);
  }
);

export default axios;
