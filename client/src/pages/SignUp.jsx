import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // const { register } = useAuth();
  const navigate = useNavigate();
  // const { user } = useUser();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone number, only allow digits and limit to 11 characters
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, ''); // Remove non-digit characters
      if (digitsOnly.length <= 11) {
        setFormData({
          ...formData,
          [name]: digitsOnly,
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    // Validate name format (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.fullName.trim())) {
      toast.error('Full name can only contain letters and spaces');
      return;
    }

    // Validate name length
    if (formData.fullName.trim().length < 3) {
      toast.error('Full name must be at least 3 characters long');
      return;
    }

    if (!formData.idCard.trim()) {
      toast.error('ID card number is required');
      return;
    }

    // Validate ID card format (only numbers)
    const idCardRegex = /^[0-9]{13}$/;
    if (!idCardRegex.test(formData.idCard.replace(/[-\s]/g, ''))) {
      toast.error('ID card must be exactly 13 digits');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return;
    }

    // Validate phone number format (exactly 11 digits, numbers only)
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      toast.error('Phone number must be exactly 11 digits');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email address is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.confirmPassword) {
      toast.error('Please confirm your password');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const result = await register({
        fullName: formData.fullName,
        idCard: formData.idCard,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.requiresVerification) {
        // Navigate to email verification page
        navigate('/verify-email', {
          state: {
            email: result.email,
            userData: {
              fullName: formData.fullName,
              idCard: formData.idCard,
              phoneNumber: formData.phoneNumber,
              password: formData.password,
            },
          },
        });
      } else if (result.success) {
        // Direct registration success (fallback)
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch {
      // Error is handled by AuthContext
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
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
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-gray-700 rounded-full border-2 border-soft-peach"></div>
              </div>
              <span className="ml-2 text-3xl font-display font-bold">
                <span className="text-earth-brown">Rent</span>
                <span className="text-soft-peach">ifi</span>
              </span>
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our community of hosts and guests
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30"
        >
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                minLength={3}
                pattern="[a-zA-Z\s]+"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="Naeem Sajjad"
                title="Full name can only contain letters and spaces (minimum 3 characters)"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="idCard"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                ID Card Number
              </label>
              <input
                id="idCard"
                name="idCard"
                type="text"
                value={formData.idCard}
                onChange={handleChange}
                required
                minLength={13}
                maxLength={13}
                pattern="[0-9]{13}"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="3120399248231"
                title="ID card must be exactly 13 digits"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="^(\+92|0)?[0-9]{10}$"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="03058765423"
                title="Please enter a valid phone number (e.g., 03001234567)"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
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
                placeholder="naeem99@example.com"
                title="Please enter a valid email address"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </motion.div>
          </motion.form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary dark:text-primary-400 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default SignUp;
