// src/pages/UserProfile.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Camera,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { AuthContext } from "../contexts/AuthContext";

const UserProfile = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);

  // Local form state initialized from authUser
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    location: "",
    profilePic: "",
    joinDate: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phoneNumber: authUser.phoneNumber || "",
        bio: authUser.bio || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
        joinDate: authUser.createdAt ? new Date(authUser.createdAt).getFullYear().toString() : "2025",
      });
      setProfileImage(authUser.profilePic || null);
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (base64Image) => {
    setProfileImage(base64Image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate full name
    if (formData.fullName && formData.fullName.trim()) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(formData.fullName.trim())) {
        toast.error("Full name can only contain letters and spaces");
        return;
      }
      if (formData.fullName.trim().length < 3) {
        toast.error("Full name must be at least 3 characters long");
        return;
      }
    }

    // Validate phone number if provided
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }

    try {
      const updateData = {
        fullName: formData.fullName,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
      };
      
      // Only include profilePic if it has changed
      if (profileImage && profileImage !== authUser.profilePic) {
        updateData.profilePic = profileImage;
      }
      
      const result = await updateProfile(updateData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (err) {
      console.log("Update profile error:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(authUser.profilePic || null);
    setFormData({
      fullName: authUser.fullName || "",
      email: authUser.email || "",
      phoneNumber: authUser.phoneNumber || "",
      bio: authUser.bio || "",
      location: authUser.location || "",
      profilePic: authUser.profilePic || "",
      joinDate: authUser.createdAt ? new Date(authUser.createdAt).getFullYear().toString() : "2025",
    });
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
                      {isEditing ? (
                        <div className="mb-4">
                          <ProfilePictureUpload
                            currentImage={profileImage}
                            onImageChange={handleImageChange}
                            disabled={false}
                          />
                        </div>
                      ) : (
                        <div className="relative mb-4">
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt={formData.fullName}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                          />
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-center">
                        {formData.fullName}
                      </h2>
                      <p className="text-gray-500 text-sm text-center">
                        Member since {formData.joinDate}
                      </p>
                    </div>

                    <nav className="space-y-2">
                      <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeTab === "profile"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Profile Information
                      </button>
                      <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeTab === "security"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Security
                      </button>
                      <button
                        onClick={() => setActiveTab("payments")}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          activeTab === "payments"
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Payment Methods
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Main Content */}
                <div className="md:w-3/4">
                  {activeTab === "profile" && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                          Profile Information
                        </h2>
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                              </label>
                              <input
                                type="tel"
                                value={formData.phoneNumber}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={formData.location || "Lahore"}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bio
                            </label>
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
                                <p className="font-medium">
                                  {formData.fullName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Mail size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{formData.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Phone size={20} className="text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">
                                  {formData.phoneNumber}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <MapPin
                                size={20}
                                className="text-gray-500 mr-3"
                              />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Location
                                </p>
                                <p className="font-medium">
                                  {formData.location || "Lahore"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-6">
                            <div className="flex items-start">
                              <User
                                size={20}
                                className="text-gray-500 mr-3 mt-1"
                              />
                              <div>
                                <p className="text-sm text-gray-500">About</p>
                                <p className="text-gray-700">{formData.bio}</p>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-6">
                            <div className="flex items-center">
                              <Calendar
                                size={20}
                                className="text-gray-500 mr-3"
                              />
                              <div>
                                <p className="text-sm text-gray-500">
                                  Member since
                                </p>
                                <p className="font-medium">
                                  {formData.joinDate}
                                </p>
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
