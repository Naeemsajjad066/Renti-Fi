import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star,
  Users,
  Home,
  MapPin,
  ShieldCheck,
  Calendar,
  ChevronLeft,
  MessageSquare,
  Phone,
  Mail,
  Award,
  Clock,
  User
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const HostProfile = () => {
  const { hostId } = useParams();
  const [host, setHost] = useState(null);
  const [hostProperties, setHostProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  useEffect(() => {
    const fetchHostProfile = async () => {
      setIsLoading(true);
      try {
        // ✅ correct mount point: /api/auth (not /api/users)
        const hostResponse = await fetch(`${backendUrl}/api/auth/public/${hostId}`);
        
        if (!hostResponse.ok) {
          throw new Error('Host not found');
        }
        
        const hostData = await hostResponse.json();

        if (!hostData.success) {
          throw new Error(hostData.message || 'Host not found');
        }

        const hostInfo = hostData.user;
        
        // Fetch host's properties
        const propertiesResponse = await fetch(`${backendUrl}/api/properties/host/${hostId}`);
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setHostProperties(propertiesData.properties || []);
        } else {
          setHostProperties([]);
        }

        // ✅ Build processed host — set explicit fields AFTER spreading so they
        //    don't get clobbered by the spread (previous code did it in reverse)
        const processedHost = {
          ...hostInfo,
          _id:        hostInfo._id        || hostId,
          fullName:   hostInfo.fullName   || hostInfo.name || 'Host',
          email:      hostInfo.email      || null,
          // ✅ prefer profilePic (what the DB stores), fall back gracefully
          profilePic: hostInfo.profilePic || hostInfo.profilePicture || hostInfo.image || hostInfo.avatar || null,
          phone:      hostInfo.phone      || hostInfo.phoneNumber    || null,
          createdAt:  hostInfo.createdAt  || new Date(),
          bio:        hostInfo.bio        || hostInfo.description    || '',
        };
        
        setHost(processedHost);
      } catch (error) {
        setError(error.message || 'Unable to load host profile');
        setHost(null);
        setHostProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (hostId) {
      fetchHostProfile();
    }
  }, [hostId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-8 w-full max-w-6xl p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex gap-8">
            <div className="w-1/3">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded mt-4"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-2/3"></div>
            </div>
            <div className="w-2/3">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !host) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Host Not Found</h1>
              <p className="text-gray-600 mb-6">
                {error || "The host you're looking for doesn't exist."}
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
              >
                <ChevronLeft size={16} className="mr-2" />
                Back to Home
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // Calculate host statistics
  const totalProperties = hostProperties.length;
  const averageRating = hostProperties.length > 0
    ? (hostProperties.reduce((sum, prop) => sum + (prop.rating || 0), 0) / hostProperties.length).toFixed(1)
    : '5.0'; // Default to 5.0 for new hosts
  const totalReviews = hostProperties.reduce((sum, prop) => sum + (prop.totalReviews || 0), 0);
  const joinDate = new Date(host.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // profilePic is already resolved in processedHost — just fall back to placeholder
  const getProfilePicture = () => host.profilePic || '/placeholder.svg';

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-20">
          <div className="page-container py-8">
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <div className="mb-6">
                <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
                  <ChevronLeft size={16} className="mr-1" />
                  <span>Back to listings</span>
                </Link>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Host Info Sidebar */}
                <div className="lg:w-1/3">
                  <div className="sticky top-24">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <div className="text-center mb-6">
                        <img
                          src={getProfilePicture()}
                          alt={host.fullName}
                          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                          onError={(e) => {
                            console.log('Profile picture failed to load:', e.target.src);
                            console.log('Host data:', host);
                            if (e.target.src !== '/placeholder.svg') {
                              e.target.src = '/placeholder.svg';
                            }
                          }}
                        />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{host.fullName}</h1>
                        <div className="flex items-center justify-center mb-2">
                          <Star size={16} className="text-primary mr-1" />
                          <span className="font-medium">{averageRating} Rating</span>
                          <span className="text-gray-500 ml-1">({totalReviews} reviews)</span>
                        </div>
                      </div>
                      
                      {/* Host Statistics */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Home size={18} className="text-primary mr-3" />
                            <span className="font-medium">Properties</span>
                          </div>
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {totalProperties}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Star size={18} className="text-yellow-500 mr-3" />
                            <span className="font-medium">Rating</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            {averageRating || '5.0'} ⭐
                          </span>
                        </div>
                        
                        <div className="flex items-center py-3 px-4 bg-gray-50 rounded-lg">
                          <Calendar size={18} className="text-gray-600 mr-3" />
                          <div>
                            <span className="font-medium text-gray-900">Member since</span>
                            <p className="text-sm text-gray-600">{joinDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                          <ShieldCheck size={18} className="text-green-600 mr-3" />
                          <div>
                            <span className="font-medium text-green-800">Verified Host</span>
                            <p className="text-sm text-green-600">Identity confirmed</p>
                          </div>
                        </div>

                        <div className="flex items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Clock size={18} className="text-blue-600 mr-3" />
                          <div>
                            <span className="font-medium text-blue-800">Quick Response</span>
                            <p className="text-sm text-blue-600">Usually responds within an hour</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <MessageSquare size={16} className="text-primary mr-2" />
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          {host.email && (
                            <a 
                              href={`mailto:${host.email}`}
                              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200">
                                <Mail size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-600">{host.email}</p>
                              </div>
                            </a>
                          )}
                          {host.phone && (
                            <a 
                              href={`tel:${host.phone}`}
                              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200">
                                <Phone size={16} className="text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Phone</p>
                                <p className="text-sm text-gray-600">{host.phone || '+92 300 1234567'}</p>
                              </div>
                            </a>
                          )}
                          
                          {/* Message Button */}
                          <button className="w-full flex items-center justify-center p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            <MessageSquare size={16} className="mr-2" />
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Host Achievements */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
                        <Award size={18} className="text-primary mr-2" />
                        Host Badges & Achievements
                      </h3>
                      <div className="space-y-4">
                        {/* Superhost Badge */}
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-4">
                              <Star size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Superhost</p>
                              <p className="text-sm text-gray-600">Top-rated host with exceptional reviews</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Verified Badge */}
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                              <ShieldCheck size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Verified Host</p>
                              <p className="text-sm text-gray-600">Identity and contact information confirmed</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Experience Badge */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                              <Home size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Experienced Host</p>
                              <p className="text-sm text-gray-600">Professional property management</p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Response Badge */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                              <Clock size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Quick Responder</p>
                              <p className="text-sm text-gray-600">Responds to messages within an hour</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Host Properties */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Home size={24} className="text-primary mr-3" />
                        Property Portfolio
                      </h2>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Properties</p>
                        <p className="text-2xl font-bold text-primary">{totalProperties}</p>
                      </div>
                    </div>
                    
                    {totalReviews > 0 && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">Guest Satisfaction</h4>
                            <p className="text-sm text-gray-600">{totalReviews} verified reviews</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Star size={20} className="text-yellow-500 mr-1" />
                              <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                            </div>
                            <p className="text-xs text-gray-500">Average rating</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {hostProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {hostProperties.map((property) => (
                          <motion.div
                            key={property._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                          >
                            <Link to={`/properties/${property._id}`} className="block">
                              <div className="relative overflow-hidden">
                                <img
                                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                  alt={property.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                                <div className="absolute top-3 right-3">
                                  <div className="bg-white px-2 py-1 rounded-full shadow-sm">
                                    <div className="flex items-center">
                                      <Star size={12} className="text-yellow-500 mr-1" />
                                      <span className="text-xs font-semibold">{property.rating || '5.0'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                  {property.title || 'Beautiful Property'}
                                </h3>
                                
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                  <MapPin size={14} className="mr-1 text-primary" />
                                  <span>{property.city || 'Karachi'}, {property.state || 'Sindh'}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                  <Users size={14} className="mr-2 text-gray-500" />
                                  <span>{property.bedrooms || 2} beds</span>
                                  <span className="mx-1">·</span>
                                  <span>{property.bathrooms || 1} baths</span>
                                  <span className="mx-1">·</span>
                                  <span>{property.maxGuests || 4} guests</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {property.totalReviews > 0 && (
                                      <span className="text-sm text-gray-500">({property.totalReviews} reviews)</span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="text-lg font-bold text-gray-900">Rs {(property.price || 15000).toLocaleString()}</span>
                                    <span className="text-gray-600 text-sm">/night</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Home size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">This host hasn't listed any properties yet.</p>
                      </div>
                    )}
                  </div>

                  {/* About Section */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <User size={20} className="text-primary mr-2" />
                      About {host.fullName}
                    </h2>
                    
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base mb-6">
                        {host.bio || `Welcome! I'm ${host.fullName}, a dedicated host on Rentifi with a passion for providing exceptional hospitality. I believe that every guest deserves a comfortable, clean, and memorable stay. With ${totalProperties} ${totalProperties === 1 ? 'property' : 'properties'} under my care, I'm committed to ensuring your experience exceeds your expectations.`}
                      </p>
                      
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-2">My Hosting Philosophy</h4>
                        <p className="text-blue-800 text-sm">
                          "I treat every guest like family and every property like my own home. Clear communication, attention to detail, and genuine care for my guests' comfort are the pillars of my hosting approach."
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{totalProperties}+</div>
                          <div className="text-sm text-gray-600">Properties</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{totalReviews || '50'}+</div>
                          <div className="text-sm text-gray-600">Happy Guests</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">2+</div>
                          <div className="text-sm text-gray-600">Years Hosting</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Languages & Interests */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Languages & Interests</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">English</span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Urdu</span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Hindi</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Travel</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Photography</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Architecture</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Food</span>
                      </div>
                    </div>
                  </div>
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

export default HostProfile;