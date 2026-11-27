// Centralized error handling utility
import { Component } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const handleApiError = (error, customMessage) => {
  if (error.response?.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    return;
  }

  const message =
    customMessage ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred';

  toast.error(message);
};

export const handleNetworkError = (_error) => {
  if (!navigator.onLine) {
    toast.error('No internet connection');
    return;
  }

  toast.error('Network error. Please try again.');
};

export const createErrorBoundary = (component) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error boundary caught an error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong.</div>;
      }

      return component;
    }
  };
};
