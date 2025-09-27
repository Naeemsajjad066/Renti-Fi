import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { PropertyContext } from "../contexts/PropertyContext";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Home,
  Calendar,
  Banknote,
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
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import HostSidebar from "@/components/HostSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data for dashboard
const recentBookings = [
  {
    id: 1,
    guest: "Emily Johnson",
    property: "Luxury Villa with Ocean View",
    date: "2023-10-15",
    status: "confirmed",
    amount: 1050,
  },
  {
    id: 2,
    guest: "Michael Smith",
    property: "Modern Downtown Loft",
    date: "2023-10-20",
    status: "pending",
    amount: 600,
  },
  {
    id: 3,
    guest: "Sarah Davis",
    property: "Beachfront Cottage",
    date: "2023-10-25",
    status: "confirmed",
    amount: 840,
  },
  {
    id: 4,
    guest: "James Wilson",
    property: "Mountain Cabin Retreat",
    date: "2023-11-02",
    status: "cancelled",
    amount: 720,
  },
  {
    id: 5,
    guest: "Lisa Brown",
    property: "City Center Apartment",
    date: "2023-11-10",
    status: "pending",
    amount: 550,
  },
];

const listings = [
  {
    id: 1,
    title: "Luxury Villa with Sea View",
    location: "Malibu, CA",
    rating: 4.9,
    bookings: 23,
    income: 13950,
    occupancy: 82,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Modern F-7 Apartment",
    location: "Karachi, Sindh",
    rating: 4.7,
    bookings: 18,
    income: 7600,
    occupancy: 75,
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Seaside House",
    location: "Santa Monica, CA",
    rating: 4.8,
    bookings: 15,
    income: 9200,
    occupancy: 68,
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Mountain Cabin Retreat",
    location: "Aspen, CO",
    rating: 4.9,
    bookings: 12,
    income: 8400,
    occupancy: 70,
    image:
      "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const activityItems = [
  {
    id: 1,
    type: "booking",
    title: "New booking request",
    description: "Emily Johnson requested to book Luxury Villa",
    time: "2 hours ago",
    icon: Calendar,
  },
  {
    id: 2,
    type: "message",
    title: "New message",
    description: "Michael Smith sent you a message about check-in details",
    time: "5 hours ago",
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "review",
    title: "New review",
    description: "Sarah Davis left a 5-star review for Beachfront Cottage",
    time: "1 day ago",
    icon: Star,
  },
  {
    id: 4,
    type: "payout",
    title: "Payout processed",
    description: "Your payout of Rs 84,000 has been processed",
    time: "2 days ago",
    icon: Banknote,
  },
  {
    id: 5,
    type: "system",
    title: "System update",
    description: "Rentifi platform updated with new features",
    time: "3 days ago",
    icon: Zap,
  },
];

const insights = [
  {
    title: "Booking Conversion Rate",
    value: "68%",
    change: "+5.2%",
    trend: "up",
    description: "Percentage of inquiries that convert to bookings",
    icon: Percent,
  },
  {
    title: "Average Response Time",
    value: "26 min",
    change: "-12.5%",
    trend: "up",
    description: "How quickly you respond to guest messages",
    icon: Clock,
  },
  {
    title: "Repeat Guest Rate",
    value: "32%",
    change: "+8.3%",
    trend: "up",
    description: "Percentage of guests who book again",
    icon: Users,
  },
  {
    title: "Listing Quality Score",
    value: "92/100",
    change: "+3.5%",
    trend: "up",
    description: "Based on photos, description and amenities",
    icon: CheckCircle,
  },
];

const HostDashboard = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authUser } = useContext(AuthContext);
  const { userProperties, fetchUserProperties, loading } =
    useContext(PropertyContext);

  useEffect(() => {
    if (authUser?._id) {
      // if your user id uses `id` instead of `_id`, change accordingly
      fetchUserProperties(authUser._id);
    }
  }, [authUser]);
  console.log(userProperties);

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
                    Manage your properties, track bookings, and grow your
                    hosting business with our comprehensive tools.
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
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-8 bg-white border border-cream-beige/30 p-1 rounded-xl shadow-sm">
                  <TabsTrigger
                    value="overview"
                    className="text-sm md:text-base py-2 px-4 rounded-lg data-[state=active]:bg-earth-brown data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                </TabsList>

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
                          <h2 className="text-xl font-bold text-gray-900">
                            Your Properties
                          </h2>
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
                              "https://via.placeholder.com/400";
                            const bookings =
                              property.bookings ?? property.bookingsCount ?? 0;
                            const income =
                              property.monthlyIncome ?? property.income ?? 0;

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
                                      {property.rating ?? "—"}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-bold text-gray-900 truncate">
                                    {property.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                                    <MapPin
                                      size={14}
                                      className="mr-1 text-earth-brown"
                                    />
                                    {property.location || property.city || "—"}
                                  </p>

                                  <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                                    <div className="p-2 bg-gray-50 rounded-md">
                                      <p className="text-xs text-gray-500">
                                        Bookings
                                      </p>
                                      <p className="font-bold text-gray-900">
                                        {bookings}
                                      </p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-md">
                                      <p className="text-xs text-gray-500">
                                        Revenue
                                      </p>
                                      <p className="font-bold text-earth-brown">
                                        ${income}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="px-4 py-3 bg-gray-50 border-t border-cream-beige/30 flex justify-between">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-earth-brown hover:text-earth-brown/80 hover:bg-earth-brown/5 px-3"
                                  >
                                    Edit
                                  </Button>
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
