
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Users, 
  BarChart,
  Clock,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  MapPin,
  Percent,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data for dashboard
const recentBookings = [
  { id: 1, guest: 'Emily Johnson', property: 'Luxury Villa with Ocean View', date: '2023-10-15', status: 'confirmed', amount: 1050 },
  { id: 2, guest: 'Michael Smith', property: 'Modern Downtown Loft', date: '2023-10-20', status: 'pending', amount: 600 },
  { id: 3, guest: 'Sarah Davis', property: 'Beachfront Cottage', date: '2023-10-25', status: 'confirmed', amount: 840 },
  { id: 4, guest: 'James Wilson', property: 'Mountain Cabin Retreat', date: '2023-11-02', status: 'cancelled', amount: 720 },
  { id: 5, guest: 'Lisa Brown', property: 'City Center Apartment', date: '2023-11-10', status: 'pending', amount: 550 },
];

const listings = [
  { 
    id: 1, 
    title: 'Luxury Villa with Ocean View', 
    location: 'Malibu, CA', 
    rating: 4.9, 
    bookings: 23,
    income: 13950,
    occupancy: 82,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 2, 
    title: 'Modern Downtown Loft', 
    location: 'New York, NY', 
    rating: 4.7, 
    bookings: 18,
    income: 7600,
    occupancy: 75,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 3, 
    title: 'Beachfront Cottage', 
    location: 'Santa Monica, CA', 
    rating: 4.8, 
    bookings: 15,
    income: 9200,
    occupancy: 68,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 4, 
    title: 'Mountain Cabin Retreat', 
    location: 'Aspen, CO', 
    rating: 4.9, 
    bookings: 12,
    income: 8400,
    occupancy: 70,
    image: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
];

const activityItems = [
  { 
    id: 1, 
    type: 'booking', 
    title: 'New booking request', 
    description: 'Emily Johnson requested to book Luxury Villa',
    time: '2 hours ago',
    icon: Calendar
  },
  { 
    id: 2, 
    type: 'message', 
    title: 'New message', 
    description: 'Michael Smith sent you a message about check-in details',
    time: '5 hours ago',
    icon: MessageSquare
  },
  { 
    id: 3, 
    type: 'review', 
    title: 'New review', 
    description: 'Sarah Davis left a 5-star review for Beachfront Cottage',
    time: '1 day ago',
    icon: Star
  },
  { 
    id: 4, 
    type: 'payout', 
    title: 'Payout processed', 
    description: 'Your payout of $840 has been processed',
    time: '2 days ago',
    icon: DollarSign
  },
  { 
    id: 5, 
    type: 'system', 
    title: 'System update', 
    description: 'Rentifi platform updated with new features',
    time: '3 days ago',
    icon: Zap
  },
];

const insights = [
  { 
    title: 'Booking Conversion Rate', 
    value: '68%', 
    change: '+5.2%',
    trend: 'up',
    description: 'Percentage of inquiries that convert to bookings',
    icon: Percent
  },
  { 
    title: 'Average Response Time', 
    value: '26 min', 
    change: '-12.5%',
    trend: 'up',
    description: 'How quickly you respond to guest messages',
    icon: Clock
  },
  { 
    title: 'Repeat Guest Rate', 
    value: '32%', 
    change: '+8.3%',
    trend: 'up',
    description: 'Percentage of guests who book again',
    icon: Users
  },
  { 
    title: 'Listing Quality Score', 
    value: '92/100', 
    change: '+3.5%',
    trend: 'up',
    description: 'Based on photos, description and amenities',
    icon: CheckCircle
  },
];

const HostDashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const showNotification = () => {
    toast({
      title: "Action completed",
      description: "Your changes have been saved successfully.",
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex">
        <HostSidebar 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        
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
                    Manage your properties, track bookings, and grow your hosting business with our comprehensive tools.
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <Link to="/host/add-listing">
                    <Button size="lg" className="bg-earth-brown hover:bg-earth-brown/90 text-white">
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
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-8 bg-white border border-cream-beige/30 p-1 rounded-xl shadow-sm">
                  <TabsTrigger value="overview" className="text-sm md:text-base py-2 px-4 rounded-lg data-[state=active]:bg-earth-brown data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="text-sm md:text-base py-2 px-4 rounded-lg data-[state=active]:bg-earth-brown data-[state=active]:text-white">
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="text-sm md:text-base py-2 px-4 rounded-lg data-[state=active]:bg-earth-brown data-[state=active]:text-white">
                    Bookings
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="text-sm md:text-base py-2 px-4 rounded-lg data-[state=active]:bg-earth-brown data-[state=active]:text-white">
                    Insights
                  </TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {/* Stats Cards */}
                    <motion.div variants={itemVariants}>
                      <Card className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
                          <div className="p-2 bg-green-100 rounded-full">
                            <DollarSign size={16} className="text-green-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$30,750</div>
                          <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp size={14} className="mr-1" />
                            +12.5% from last month
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Card className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Calendar size={16} className="text-blue-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">56</div>
                          <p className="text-xs text-blue-600 flex items-center mt-1">
                            <TrendingUp size={14} className="mr-1" />
                            +8.3% from last month
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Card className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Occupancy Rate</CardTitle>
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Home size={16} className="text-purple-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">78%</div>
                          <div className="mt-2">
                            <Progress value={78} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Card className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Guest Satisfaction</CardTitle>
                          <div className="p-2 bg-amber-100 rounded-full">
                            <Star size={16} className="text-amber-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">4.8/5</div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= 4 ? "text-amber-500 fill-amber-500" : "text-amber-200 fill-amber-200"}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">(42 reviews)</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <motion.div 
                      variants={itemVariants}
                      className="lg:col-span-1 space-y-6"
                    >
                      <Card className="border-cream-beige/30 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Recent Activity</span>
                            <Button variant="ghost" size="sm" className="text-earth-brown hover:text-earth-brown/80" onClick={showNotification}>
                              View all
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-5">
                            {activityItems.map((item, index) => (
                              <div key={item.id} className="flex items-start">
                                <div className={`flex-shrink-0 p-2 rounded-full 
                                  ${item.type === 'booking' ? 'bg-blue-100' : 
                                    item.type === 'message' ? 'bg-indigo-100' : 
                                    item.type === 'review' ? 'bg-amber-100' : 
                                    item.type === 'payout' ? 'bg-green-100' : 'bg-soft-peach/30'}`}>
                                  <item.icon size={16} className={`
                                    ${item.type === 'booking' ? 'text-blue-600' : 
                                      item.type === 'message' ? 'text-indigo-600' : 
                                      item.type === 'review' ? 'text-amber-600' : 
                                      item.type === 'payout' ? 'text-green-600' : 'text-earth-brown'}`} />
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                  <div className="flex items-center mt-1">
                                    <Clock size={12} className="text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-400">{item.time}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    {/* Upcoming Bookings */}
                    <motion.div 
                      variants={itemVariants}
                      className="lg:col-span-2"
                    >
                      <Card className="border-cream-beige/30 shadow-sm">
                        <CardHeader>
                          <CardTitle>Upcoming Bookings</CardTitle>
                          <CardDescription>
                            Manage your upcoming reservations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recentBookings.slice(0, 3).map((booking) => (
                              <div 
                                key={booking.id} 
                                className="border border-cream-beige/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                              >
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{booking.guest}</h4>
                                  <p className="text-sm text-gray-500">{booking.property}</p>
                                  <div className="flex items-center mt-1">
                                    <Calendar size={14} className="text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-400">{booking.date}</span>
                                  </div>
                                </div>
                                <div className="mt-3 sm:mt-0 flex items-center">
                                  <Badge className={
                                    booking.status === 'confirmed' 
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200 mr-3' 
                                      : booking.status === 'pending'
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 mr-3'
                                      : 'bg-red-100 text-red-800 hover:bg-red-200 mr-3'
                                  }>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </Badge>
                                  <p className="text-sm font-semibold text-earth-brown">${booking.amount}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t border-cream-beige/30 flex justify-between pt-4">
                          <p className="text-sm text-gray-500">Showing 3 of {recentBookings.length} bookings</p>
                          <Link to="/host/bookings">
                            <Button variant="outline" size="sm" className="text-earth-brown border-earth-brown/30 hover:bg-earth-brown/5">
                              View All Bookings
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </div>
                  
                  {/* Insights Section */}
                  <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {insights.map((insight, index) => (
                        <Card key={index} className="border-cream-beige/30 shadow-sm">
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">{insight.title}</CardTitle>
                            <div className="p-2 bg-earth-brown/10 rounded-full">
                              <insight.icon size={16} className="text-earth-brown" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{insight.value}</div>
                            <p className={`text-xs flex items-center mt-1 ${
                              insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {insight.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1 transform rotate-180" />}
                              {insight.change}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">{insight.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Property Listings */}
                  <motion.div variants={itemVariants}>
                    <div className="bg-white rounded-xl border border-cream-beige/30 shadow-sm overflow-hidden">
                      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream-beige/30">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Your Properties</h2>
                          <p className="text-sm text-gray-500">Manage and monitor performance of your listings</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-2">
                          <Button variant="outline" size="sm" className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5">
                            <Filter size={16} className="mr-2" />
                            Filter
                          </Button>
                          <Link to="/host/add-listing">
                            <Button size="sm" className="bg-earth-brown hover:bg-earth-brown/90 text-white">
                              <Plus size={16} className="mr-2" />
                              Add New
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {listings.map((listing) => (
                          <Card key={listing.id} className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="aspect-[4/3] relative">
                              <img 
                                src={listing.image} 
                                alt={listing.title} 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-white/90 text-earth-brown border-none">
                                  <Star size={12} className="fill-amber-500 text-amber-500 mr-1" />
                                  {listing.rating}
                                </Badge>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                <div className="flex justify-between items-center">
                                  <Badge className="bg-blue-500/80 text-white border-none flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    {listing.bookings} Bookings
                                  </Badge>
                                  <Badge className="bg-green-500/80 text-white border-none flex items-center">
                                    <Percent size={12} className="mr-1" />
                                    {listing.occupancy}% Occupied
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-gray-900 line-clamp-1">{listing.title}</h3>
                              <p className="text-sm text-gray-500 mb-3 flex items-center">
                                <MapPin size={14} className="mr-1 text-earth-brown" />
                                {listing.location}
                              </p>
                              
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-cream-beige/30">
                                <div>
                                  <p className="text-xs text-gray-500">Monthly earnings</p>
                                  <p className="font-bold text-earth-brown">${listing.income}</p>
                                </div>
                                <Link to={`/host/properties/${listing.id}`}>
                                  <Button variant="ghost" size="sm" className="text-earth-brown hover:text-earth-brown/80 hover:bg-earth-brown/5">
                                    Manage
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-cream-beige/30 bg-gray-50 flex justify-center">
                        <Link to="/host/properties">
                          <Button variant="outline" className="text-earth-brown border-earth-brown/30 hover:bg-earth-brown/5">
                            View All Properties
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Properties Tab */}
                <TabsContent value="properties">
                  <Card className="border-cream-beige/30">
                    <CardHeader>
                      <CardTitle>Properties Management</CardTitle>
                      <CardDescription>View and manage all your listings in one place</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6">
                        <div className="relative w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Search properties..." 
                            className="pl-10 pr-4 py-2 border border-cream-beige/50 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-earth-brown/20"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="border-earth-brown/30 text-earth-brown">
                            <Filter size={16} className="mr-2" />
                            Filter
                          </Button>
                          <Link to="/host/add-listing">
                            <Button size="sm" className="bg-earth-brown hover:bg-earth-brown/90 text-white">
                              <Plus size={16} className="mr-2" />
                              Add Property
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                          <Card key={listing.id} className="border-cream-beige/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="aspect-[4/3] relative">
                              <img 
                                src={listing.image} 
                                alt={listing.title} 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-white/90 text-earth-brown border-none">
                                  <Star size={12} className="fill-amber-500 text-amber-500 mr-1" />
                                  {listing.rating}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-gray-900 truncate">{listing.title}</h3>
                              <p className="text-sm text-gray-500 mb-3 flex items-center">
                                <MapPin size={14} className="mr-1 text-earth-brown" />
                                {listing.location}
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                                <div className="p-2 bg-gray-50 rounded-md">
                                  <p className="text-xs text-gray-500">Bookings</p>
                                  <p className="font-bold text-gray-900">{listing.bookings}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-md">
                                  <p className="text-xs text-gray-500">Revenue</p>
                                  <p className="font-bold text-earth-brown">${listing.income}</p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="px-4 py-3 bg-gray-50 border-t border-cream-beige/30 flex justify-between">
                              <Button variant="ghost" size="sm" className="text-earth-brown hover:text-earth-brown/80 hover:bg-earth-brown/5 px-3">
                                Edit
                              </Button>
                              <Link to={`/host/properties/${listing.id}`}>
                                <Button variant="ghost" size="sm" className="text-earth-brown hover:text-earth-brown/80 hover:bg-earth-brown/5 px-3">
                                  View Details
                                </Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Bookings Tab */}
                <TabsContent value="bookings">
                  <Card className="border-cream-beige/30">
                    <CardHeader>
                      <CardTitle>Bookings Management</CardTitle>
                      <CardDescription>Track and manage all your guest reservations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6">
                        <div className="relative w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Search bookings..." 
                            className="pl-10 pr-4 py-2 border border-cream-beige/50 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-earth-brown/20"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" className="border-earth-brown/30 text-earth-brown">
                            <Filter size={16} className="mr-2" />
                            Filter
                          </Button>
                          <Button size="sm" className="bg-earth-brown hover:bg-earth-brown/90 text-white">
                            <Calendar size={16} className="mr-2" />
                            Calendar View
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            className="border border-cream-beige/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-cream-beige/5 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-soft-peach/20 flex items-center justify-center text-earth-brown mr-3">
                                  {booking.guest.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{booking.guest}</h4>
                                  <p className="text-sm text-gray-500">{booking.property}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center mt-3 sm:mt-0">
                              <div className="flex items-center text-gray-500 text-sm mr-6">
                                <Calendar size={14} className="mr-1" />
                                {booking.date}
                              </div>
                              <Badge className={
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200 mr-3' 
                                  : booking.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 mr-3'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200 mr-3'
                              }>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <p className="text-sm font-semibold text-earth-brown">${booking.amount}</p>
                            </div>
                            <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
                              <Button variant="ghost" size="sm" className="text-earth-brown hover:bg-earth-brown/5 p-1">
                                <MessageSquare size={16} />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-earth-brown hover:bg-earth-brown/5 p-1">
                                <ChevronRight size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Insights Tab */}
                <TabsContent value="insights">
                  <Card className="border-cream-beige/30">
                    <CardHeader>
                      <CardTitle>Performance Insights</CardTitle>
                      <CardDescription>Analyze your revenue and booking statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <Card className="border-cream-beige/30 shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-base">Revenue Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <BarChart className="h-12 w-12 mx-auto text-earth-brown/50 mb-2" />
                              <p>Revenue chart visualization coming soon</p>
                              <Button variant="ghost" size="sm" className="text-earth-brown mt-4">Explore data</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-cream-beige/30 shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-base">Booking Trends</CardTitle>
                          </CardHeader>
                          <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <TrendingUp className="h-12 w-12 mx-auto text-earth-brown/50 mb-2" />
                              <p>Booking trends visualization coming soon</p>
                              <Button variant="ghost" size="sm" className="text-earth-brown mt-4">Explore data</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="bg-earth-brown/5 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                          <Button variant="outline" size="sm" className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5">
                            <Calendar size={16} className="mr-2" />
                            Last 30 Days
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {insights.map((insight, index) => (
                            <Card key={index} className="border-0 bg-white shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm text-gray-500">{insight.title}</p>
                                  <div className="p-1.5 bg-cream-beige/50 rounded-full">
                                    <insight.icon size={14} className="text-earth-brown" />
                                  </div>
                                </div>
                                <div className="text-xl font-bold">{insight.value}</div>
                                <p className={`text-xs flex items-center mt-1 ${
                                  insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {insight.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1 transform rotate-180" />}
                                  {insight.change}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostDashboard;
