import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    idCardNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const formatIdCardNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 13 digits
    const limited = digits.slice(0, 13);
    
    // Add hyphens at the correct positions
    if (limited.length > 5 && limited.length < 12) {
      return `${limited.slice(0, 5)}-${limited.slice(5)}`;
    } else if (limited.length >= 12) {
      return `${limited.slice(0, 5)}-${limited.slice(5, 12)}-${limited.slice(12)}`;
    }
    
    return limited;
  };

  const handleIdCardChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatIdCardNumber(value);
    
    setFormData({
      ...formData,
      idCardNumber: formattedValue,
    });
    
    // Clear the error for this field when user starts typing
    if (errors.idCardNumber) {
      setErrors({
        ...errors,
        idCardNumber: '',
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      password: value,
    });
    
    // Clear the error for this field when user starts typing
    if (errors.password) {
      setErrors({
        ...errors,
        password: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Remove hyphens for validation
    const idCardDigits = formData.idCardNumber.replace(/\D/g, '');
    
    if (!idCardDigits) newErrors.idCardNumber = 'ID Card Number is required';
    else if (idCardDigits.length !== 13) newErrors.idCardNumber = 'ID Card Number must be 13 digits';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Handle successful form submission (will connect to backend)
    console.log('Form submitted', {
      ...formData,
      idCardNumber: formData.idCardNumber.replace(/\D/g, ''), // Send without hyphens to backend
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
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
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="idCardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                ID Card Number
              </label>
              <input
                id="idCardNumber"
                name="idCardNumber"
                type="text"
                value={formData.idCardNumber}
                onChange={handleIdCardChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                  errors.idCardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12345-6789012-3"
                maxLength={15} // 13 digits + 2 hyphens
                inputMode="numeric"
              />
              {errors.idCardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.idCardNumber}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;