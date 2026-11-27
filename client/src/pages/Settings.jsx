import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Eye, EyeOff, CheckCircle, User } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

const Settings = () => {
  // User data state
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile photo state
  const { authUser } = useContext(AuthContext);

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }

    // Clear success message when editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!userData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!userData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (userData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (userData.newPassword !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Show success message
    setSuccessMessage('Your settings have been updated successfully!');

    // Reset form (except for name and email)
    setUserData({
      ...userData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Link to="/" className="mr-4">
              <ArrowLeft size={24} className="text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Profile photo */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Photo</h2>

                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profilePhotoPreview ? (
                        <img
                          src={profilePhotoPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={handlePhotoClick}
                      className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white hover:bg-primary/90 transition-colors"
                    >
                      <Camera size={18} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    JPG, GIF or PNG. Max size of 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Account settings */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Account Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={authUser?.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={authUser?.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Password change section */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>

                    {/* Current password */}
                    <div className="mb-4">
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={userData.currentPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                            errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                      )}
                    </div>

                    {/* New password */}
                    <div className="mb-4">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={userData.newPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                            errors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={userData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Success message */}
                  {successMessage && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-start">
                      <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
