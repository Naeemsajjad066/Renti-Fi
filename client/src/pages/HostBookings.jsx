import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Home,
  Filter,
  Search,
  Eye,
  MessageSquare,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HostBookings = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchHostBookings();
  }, [authUser]);

  const fetchHostBookings = async () => {
    if (!authUser?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/user/${authUser._id}?type=host`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching host bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchHostBookings();
    setRefreshing(false);
  };

  // Handle booking status update (accept/decline)
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the booking in the local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status } 
              : booking
          )
        );
        
        // Show success message
        const actionText = status === 'confirmed' ? 'accepted' : 'declined';
        console.log(`✅ Booking ${actionText} successfully`);
      } else {
        console.error('❌ Failed to update booking status:', data.message);
      }
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = !searchTerm || 
      booking.guest?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { variant: 'default', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200' },
      pending: { variant: 'secondary', icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      cancelled: { variant: 'destructive', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-200' },
      completed: { variant: 'outline', icon: CheckCircle2, className: 'bg-blue-100 text-blue-800 border-blue-200' }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total guests from guest object or return simple number
  const getTotalGuests = (guests) => {
    if (typeof guests === 'object' && guests) {
      return (guests.adults || 0) + (guests.children || 0) + (guests.infants || 0);
    }
    return guests || 1;
  };

  // Calculate booking statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
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
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Host Bookings</h1>
                <p className="text-gray-600 mt-1">Manage and monitor all bookings for your properties</p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshBookings}
                  disabled={refreshing}
                  className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5"
                >
                  <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-earth-brown/30 text-earth-brown hover:bg-earth-brown/5"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-earth-brown/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <Calendar className="text-earth-brown" size={24} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                      </div>
                      <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      </div>
                      <Clock className="text-yellow-500" size={24} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Cancelled</p>
                        <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                      </div>
                      <XCircle className="text-red-500" size={24} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.totalRevenue)}</p>
                      </div>
                      <DollarSign className="text-blue-500" size={24} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input
                          placeholder="Search by guest name, property title, or city..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} className="text-earth-brown" />
                    Booking Requests ({filteredBookings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-earth-brown border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading bookings...</p>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={fetchHostBookings} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        {bookings.length === 0 ? 'No bookings found' : 'No bookings match your search criteria'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bookings.length === 0 ? 'Bookings will appear here when guests book your properties.' : 'Try adjusting your filters or search terms.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredBookings.map((booking, index) => {
                        const statusConfig = getStatusBadge(booking.status);
                        const StatusIcon = statusConfig.icon;
                        
                        return (
                          <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                              
                              {/* Property Image & Info */}
                              <div className="flex items-start gap-4 flex-1">
                                <Link to={`/properties/${booking.property?._id}`} className="flex-shrink-0">
                                  <img
                                    src={booking.property?.images?.[0] || '/placeholder.svg'}
                                    alt={booking.property?.title || 'Property'}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                    onError={(e) => {
                                      e.target.src = '/placeholder.svg';
                                    }}
                                  />
                                </Link>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <Link 
                                        to={`/properties/${booking.property?._id}`}
                                        className="font-semibold text-gray-900 hover:text-earth-brown transition-colors line-clamp-1"
                                      >
                                        {booking.property?.title || 'Property Title'}
                                      </Link>
                                      <div className="flex items-center text-sm text-gray-600 mt-1">
                                        <MapPin size={12} className="mr-1 text-earth-brown" />
                                        <span>{booking.property?.city || 'Location'}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Badge className={statusConfig.className}>
                                        <StatusIcon size={12} className="mr-1" />
                                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                      </Badge>
                                      
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                            <MoreVertical size={16} />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Eye size={16} className="mr-2" />
                                            View Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <MessageSquare size={16} className="mr-2" />
                                            Message Guest
                                          </DropdownMenuItem>
                                          {booking.status === 'pending' && (
                                            <>
                                              <DropdownMenuItem 
                                                className="text-green-600"
                                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                              >
                                                <CheckCircle2 size={16} className="mr-2" />
                                                Accept Booking
                                              </DropdownMenuItem>
                                              <DropdownMenuItem 
                                                className="text-red-600"
                                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                              >
                                                <XCircle size={16} className="mr-2" />
                                                Decline Booking
                                              </DropdownMenuItem>
                                            </>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Guest Info */}
                              <div className="flex items-center gap-4 lg:w-80">
                                <div className="flex items-center gap-3 flex-1">
                                  <img
                                    src={booking.guest?.profilePic || '/placeholder.svg'}
                                    alt={booking.guest?.fullName || 'Guest'}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    onError={(e) => {
                                      e.target.src = '/placeholder.svg';
                                    }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">
                                      {booking.guest?.fullName || 'Guest Name'}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Users size={12} className="mr-1" />
                                      <span>{getTotalGuests(booking.guests)} guests</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Booking Details */}
                              <div className="lg:w-60">
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center">
                                    <Calendar size={12} className="mr-1 text-earth-brown" />
                                    <span>Check-in: {formatDate(booking.checkIn)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar size={12} className="mr-1 text-earth-brown" />
                                    <span>Check-out: {formatDate(booking.checkOut)}</span>
                                  </div>
                                  <div className="flex items-center font-semibold text-gray-900 mt-2">
                                    <DollarSign size={12} className="mr-1 text-green-600" />
                                    <span>{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Special Requests */}
                            {booking.specialRequests && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800">
                                  <strong>Special Requests:</strong> {booking.specialRequests}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostBookings;