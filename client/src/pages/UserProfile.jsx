import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  Edit,
  Check,
  X,
  ChevronLeft,
  Camera
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Travel enthusiast and adventure seeker. Love exploring new places and meeting people from different cultures.',
    location: 'San Francisco, CA',
    joinDate: 'March 2021',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    // In a real app, you would send this data to your backend
  };

  const handleCancel = () => {
    setFormData(userData);
    setImagePreview(null);
    setIsEditing(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-20">
          <div className="page-container py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span>Back</span>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="md:w-1/4">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <img
                          src={imagePreview || userData.profileImage}
                          alt={userData.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        {isEditing && (
                          <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                            <Camera size={16} className="text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-center">{userData.name}</h2>
                      <p className="text-gray-500 text-sm text-center">Member since {userData.joinDate}</p>
                    </div>
                    
                    <nav className="space-y-2">
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                      >
                        Profile Information
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                      >
                        Security
                      </button>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'bookings' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                      >
                        My Bookings
                      </button>
                      <button
                        onClick={() => setActiveTab('payments')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                      >
                        Payment Methods
                      </button>
                    </nav>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="md:w-3/4">
                  {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Profile Information</h2>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
                          >
                            <Edit size={16} className="mr-2" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSubmit}
                              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                            >
                              <Check size={16} className="mr-2" />
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancel}
                              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                            >
                              <X size={16} className="mr-2" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <form className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              rows="4"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                              <User size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{userData.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Mail size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{userData.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Phone size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{userData.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{userData.location}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-6">
                            <div className="flex items-start">
                              <User size={20} className="text-gray-500 mr-3 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">About</p>
                                <p className="text-gray-700">{userData.bio}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-6">
                            <div className="flex items-center">
                              <Calendar size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Member since</p>
                                <p className="font-medium">{userData.joinDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'security' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                      <div className="space-y-6">
                        <div className="border-b pb-6">
                          <h3 className="font-medium mb-4">Change Password</h3>
                          <form className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                              <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                              <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                              <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
                            >
                              Update Password
                            </button>
                          </form>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors">
                              Enable
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'bookings' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Calendar size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-4">When you book a stay, it will appear here</p>
                        <Link
                          to="/"
                          className="inline-flex items-center px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
                        >
                          Explore stays
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'payments' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Lock size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                        <p className="text-gray-600">Add a payment method to make booking easier</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default UserProfile;