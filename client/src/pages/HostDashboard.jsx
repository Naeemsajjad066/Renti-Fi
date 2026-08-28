import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { PropertyContext } from '../contexts/PropertyContext';
import { motion } from 'framer-motion';
import StripeConnectSetup from '../components/StripeConnectSetup';
import { Star, Plus, Filter, MapPin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const HostDashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authUser } = useContext(AuthContext);
  const { userProperties, fetchUserProperties, deleteProperty, loading } =
    useContext(PropertyContext);

  useEffect(() => {
    if (authUser?._id) {
      // if your user id uses `id` instead of `_id`, change accordingly
      fetchUserProperties(authUser._id);
    }
  }, [authUser, fetchUserProperties]);

  // Auto-refresh properties every 30 seconds to check for approval updates
  useEffect(() => {
    if (!authUser?._id) return;

    const intervalId = setInterval(() => {
      fetchUserProperties(authUser._id);
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [authUser, fetchUserProperties]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex">
        <HostSidebar isMobile={isMobile} isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex-1 flex flex-col">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-earth-brown/10 to-soft-peach/20 border-b border-cream-beige/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                    Welcome to Your Host Dashboard
                  </h1>
                  <p className="text-gray-600 max-w-2xl">
                    Manage your properties, track bookings, and grow your hosting business with our
                    comprehensive tools.
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <Link to="/host/add-listing">
                    <Button
                      size="lg"
                      className="bg-earth-brown hover:bg-earth-brown/90 text-white p-3"
                    >
                      <Plus size={18} className="mr-2" />
                      Add New Property
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Stripe Connect Setup */}
              <div className="mb-8">
                <StripeConnectSetup />
              </div>

              <Tabs defaultValue="overview" className="w-full">
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  ></motion.div>

                  {/* Property Listings */}
                  <motion.div variants={itemVariants}>
                    <div className="bg-white rounded-xl border border-cream-beige/30 shadow-sm overflow-hidden">
                      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream-beige/30">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Your Properties</h2>
                          <p className="text-sm text-gray-500">
                            Manage and monitor performance of your listings
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5"
                          >
                            <Filter size={16} className="mr-2" />
                            Filter
                          </Button>
                          <Link to="/host/add-listing">
                            <Button
                              size="sm"
                              className="bg-earth-brown hover:bg-earth-brown/90 text-white"
                            >
                              <Plus size={16} className="mr-2" />
                              Add New
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                          <p>Loading properties...</p>
                        ) : userProperties.length === 0 ? (
                          <p>No properties found. Add one to get started!</p>
                        ) : (
                          userProperties.map((property) => {
                            const image =
                              property.images?.[0] ||
                              property.image ||
                              'https://via.placeholder.com/400';
                            const bookings = property.bookings ?? property.bookingsCount ?? 0;
                            const income = property.monthlyIncome ?? property.income ?? 0;

                            return (
                              <Card
                                key={property._id}
                                className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                              >
                                <div className="aspect-[4/3] relative">
                                  <img
                                    src={image}
                                    alt={property.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                  <div className="absolute top-3 right-3">
                                    <Badge className="bg-white/90 text-earth-brown border-none">
                                      <Star
                                        size={12}
                                        className="fill-amber-500 text-amber-500 mr-1"
                                      />
                                      {property.rating ?? '—'}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-bold text-gray-900 truncate">
                                    {property.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                                    <MapPin size={14} className="mr-1 text-earth-brown" />
                                    {property.location || property.city || '—'}
                                  </p>

                                  <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                                    <div className="p-2 bg-gray-50 rounded-md">
                                      <p className="text-xs text-gray-500">Bookings</p>
                                      <p className="font-bold text-gray-900">{bookings}</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-md">
                                      <p className="text-xs text-gray-500">Revenue</p>
                                      <p className="font-bold text-earth-brown">${income}</p>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="px-4 py-3 bg-gray-50 border-t border-cream-beige/30 flex justify-between">
                                  <div className="flex gap-2">
                                    <Link to={`/host/add-listing/${property._id}`}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-earth-brown hover:text-earth-brown/80 hover:bg-earth-brown/5 px-3"
                                      >
                                        Edit
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
                                      onClick={async () => {
                                        if (
                                          window.confirm(
                                            `Are you sure you want to delete "${property.title}"? This action cannot be undone.`
                                          )
                                        ) {
                                          const result = await deleteProperty(property._id);
                                          if (result?.success) {
                                            fetchUserProperties(authUser._id);
                                          }
                                        }
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                  <Link to={`/host/properties/${property._id}`}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-earth-brown hover:text-earth-brown/80 hover:bg-earth-brown/5 px-3"
                                    >
                                      View Details
                                    </Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            );
                          })
                        )}
                      </div>

                      <div className="p-4 border-t border-cream-beige/30 bg-gray-50 flex justify-center">
                        <Link to="/host/properties">
                          <Button
                            variant="outline"
                            className="text-earth-brown border-earth-brown/30 hover:bg-earth-brown/5"
                          >
                            View All Properties
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Properties Tab */}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostDashboard;
