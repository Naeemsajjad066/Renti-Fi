import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
// import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
// import { useUser } from '../contexts/UserContext';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
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
  const [success, setSuccess] = useState(false);  

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        fullName: formData.fullName,
        idCard: formData.idCard,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
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
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of hosts and guests
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm"
        >
          <motion.form 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="John Doe"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="idCardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                ID Card Number
              </label>
              <input
                id="idCardNumber"
                name="idCardNumber"
                type="text"
                value={formData.idCardNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="ID123456789"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="john.doe@example.com"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
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