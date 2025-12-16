import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      
      if (response?.success) {
        // Check if user is admin and redirect accordingly
        if (response.userData?.role === 'admin' || isAdminMode) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else if (response?.requiresVerification) {
        // User needs to verify email
        navigate("/verify-email", {
          state: {
            email: response.email,
            userData: null // User already exists, no need to pass userData
          }
        });
      }
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      // Error handling is done in AuthContext
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        {/* Logo & Heading */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-earth-brown to-soft-peach rounded-lg flex items-center justify-center shadow-md">
                  <Home size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-soft-peach"></div>
              </div>
              <span className="ml-2 text-3xl font-display font-bold">
                <span className="text-earth-brown">Rent</span>
                <span className="text-soft-peach">ifi</span>
              </span>
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{isAdminMode ? 'Admin Login' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isAdminMode ? 'Sign in to admin dashboard' : 'Sign in to your account'}
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="Naeem123@gmail.com"
                title="Please enter a valid email address"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary dark:text-primary-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                {isAdminMode ? 'Sign In as Admin' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {isAdminMode ? '← Back to User Login' : '🔐 Admin Login'}
            </button>
            
            {!isAdminMode && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary dark:text-primary-400 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
