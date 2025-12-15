import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  Search,
  Eye,
  Pause,
  Trash2,
  Check,
  X,
  MoreHorizontal,
  TrendingUp,
  Shield,
  Home,
  Calendar,
  Filter,
  Download,
  Star,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import PropertyVerificationPanel from './PropertyVerificationPanel';
import { usePropertyVerification } from '../contexts/PropertyVerificationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useEffect } from 'react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { pendingProperties, getPendingProperties } = usePropertyVerification();
  const { 
    dashboardStats, 
    users, 
    bookings,
    getDashboardStats, 
    getAllUsers, 
    getAllBookings,
    loading
  } = useAdmin();

  useEffect(() => {
    getPendingProperties();
    getDashboardStats();
    if (activeTab === 'users') {
      getAllUsers();
    } else if (activeTab === 'bookings') {
      getAllBookings();
    }
  }, [getPendingProperties, getDashboardStats, getAllUsers, getAllBookings, activeTab]);

  // Placeholder data for features not yet implemented
  const complaints = [];

  const filteredUsers = (users || []).filter(user =>
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-light-beige to-cream-beige">
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Modern Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden md:flex md:flex-shrink-0 md:sticky md:top-0 md:h-screen"
          >
            <div className="flex flex-col w-64 lg:w-72 bg-white/80 backdrop-blur-lg border-r border-earth-brown/20 shadow-xl">
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-r from-earth-brown to-earth-brown/90">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-xl">RentiFi Admin</h1>
                    <p className="text-cream-beige text-sm">Management Panel</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5"></div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col flex-grow p-6 overflow-y-auto">
                <nav className="space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                    { id: 'users', label: 'User Management', icon: Users },
                    { id: 'verification', label: 'Property Verification', icon: Shield },
                    { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all duration-300 ${activeTab === item.id
                            ? 'bg-gradient-to-r from-earth-brown to-earth-brown/90 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-soft-peach/50 hover:text-earth-brown'
                          }`}
                      >
                        <Icon className="mr-3 w-5 h-5" />
                        {item.label}
                        {activeTab === item.id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Quick Stats */}
                <div className="mt-8 p-4 bg-gradient-to-br from-soft-peach/30 to-cream-beige/30 rounded-xl border border-earth-brown/10">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Overview</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-medium text-earth-brown">{dashboardStats?.totalUsers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Verification</span>
                      <span className="font-medium text-orange-600">{pendingProperties?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Bookings</span>
                      <span className="font-medium text-blue-600">{dashboardStats?.totalBookings || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Navigation */}
          <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex space-x-2 bg-white/90 backdrop-blur-lg rounded-full p-2 shadow-xl border border-earth-brown/20">
              {[
                { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
                { id: 'users', icon: Users, label: 'Users' },
                { id: 'verification', icon: Shield, label: 'Verify' },
                { id: 'complaints', icon: AlertTriangle, label: 'Issues' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`p-3 rounded-full transition-all duration-200 ${activeTab === item.id
                        ? 'bg-earth-brown text-white shadow-md'
                        : 'text-gray-700 hover:bg-earth-brown/10'
                      }`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col w-full md:w-auto overflow-hidden">
            {/* Header */}
            <motion.header
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-lg shadow-sm border-b border-earth-brown/10 sticky top-0 z-40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
                    {activeTab === 'verification' ? 'Property Verification' : activeTab}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    {activeTab === 'dashboard' && 'Overview of your platform'}
                    {activeTab === 'users' && 'Manage all users and their activities'}
                    {activeTab === 'verification' && 'Review and verify property listings with documents'}
                    {activeTab === 'complaints' && 'Review and resolve user complaints'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button variant="outline" size="sm" className="border-earth-brown/20 text-earth-brown hover:bg-earth-brown hover:text-white hidden sm:flex">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="border-earth-brown/20 text-earth-brown hover:bg-earth-brown hover:text-white">
                    <Filter className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
              </div>
            </motion.header>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6"
            >
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-brown"></div>
                    </div>
                  ) : (
                    <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                      {
                        label: 'Total Users',
                        value: dashboardStats?.totalUsers?.toLocaleString() || '0',
                        icon: Users,
                        color: 'from-blue-500 to-blue-600',
                        change: '+12%'
                      },
                      {
                        label: 'Total Bookings',
                        value: dashboardStats?.totalBookings?.toLocaleString() || '0',
                        icon: Calendar,
                        color: 'from-green-500 to-green-600',
                        change: '+8%'
                      },
                      {
                        label: 'Revenue',
                        value: `Rs ${(dashboardStats?.totalRevenue ? dashboardStats.totalRevenue  : 0).toFixed(0)}`,
                        icon: DollarSign,
                        color: 'from-earth-brown to-earth-brown/80',
                        change: '+15%'
                      },
                      {
                        label: 'Active Properties',
                        value: dashboardStats?.activeProperties?.toString() || '0',
                        icon: Home,
                        color: 'from-purple-500 to-purple-600',
                        change: '+5%'
                      }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="relative overflow-hidden border-0 shadow-lg">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                  <p className="text-sm text-green-600 font-medium">{stat.change} vs last month</p>
                                </div>
                                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-earth-brown" />
                          Recent Activities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dashboardStats?.recentUsers?.length > 0 ? (
                          dashboardStats.recentUsers.map((user, index) => (
                            <div key={user._id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">New user registered</p>
                                <p className="text-xs text-gray-500">{user.name} • {new Date(user.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                          Pending Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-yellow-800">Property Verifications</p>
                              <p className="text-sm text-yellow-600">{pendingProperties?.length || 0} properties awaiting approval</p>
                            </div>
                            <Badge variant="secondary">{pendingProperties?.length || 0}</Badge>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-blue-800">Recent Bookings</p>
                              <p className="text-sm text-blue-600">{dashboardStats?.recentBookings?.length || 0} new bookings this week</p>
                            </div>
                            <Badge>{dashboardStats?.recentBookings?.length || 0}</Badge>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-green-800">Active Properties</p>
                              <p className="text-sm text-green-600">{dashboardStats?.activeProperties || 0} properties currently active</p>
                            </div>
                            <Badge variant="default">{dashboardStats?.activeProperties || 0}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
                  )}
                </div>
              )}

              {/* Property Verification Tab */}
              {activeTab === 'verification' && (
                <PropertyVerificationPanel />
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-earth-brown focus:border-earth-brown transition-colors"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm">All Users</Button>
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm">Hosts</Button>
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm">Guests</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Users Grid */}
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-brown"></div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-12 text-center">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No users found</p>
                      </CardContent>
                    </Card>
                  ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-full bg-earth-brown/20 flex items-center justify-center text-earth-brown font-bold flex-shrink-0">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-gray-900 truncate">{user.name || 'Unknown User'}</h3>
                                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                </div>
                              </div>
                              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">User Type:</span>
                                <span className="font-medium text-earth-brown">{user.isHost ? 'Host' : 'Guest'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Joined:</span>
                                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Email Verified:</span>
                                <span className="font-medium">{user.isEmailVerified ? '✓' : '✗'}</span>
                              </div>
                              {user.phoneNumber && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="font-medium">{user.phoneNumber}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="w-4 h-4 sm:mr-1" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Pause className="w-4 h-4 sm:mr-1" />
                                <span className="hidden sm:inline">Suspend</span>
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 sm:flex-none">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  )}
                </div>
              )}

              {/* Complaints Tab */}
              {activeTab === 'complaints' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {complaints.map((complaint) => (
                      <motion.div
                        key={complaint.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Badge variant={
                                    complaint.priority === 'High' ? 'destructive' :
                                      complaint.priority === 'Medium' ? 'secondary' : 'default'
                                  }>
                                    {complaint.priority} Priority
                                  </Badge>
                                  <Badge variant={complaint.status === 'Pending' ? 'secondary' : 'default'}>
                                    {complaint.status}
                                  </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  Complaint against {complaint.against}
                                </h3>
                                <div className="text-sm text-gray-600 mb-2 space-y-1">
                                  <p className="break-all sm:break-normal">From: {complaint.from}</p>
                                  <p>{complaint.date} • Category: {complaint.category}</p>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{complaint.message}</p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t border-gray-100">
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              {complaint.status === 'Pending' && (
                                <Button size="sm" className="w-full sm:w-auto bg-earth-brown hover:bg-earth-brown/90">
                                  <Check className="w-4 h-4 mr-2" />
                                  Resolve
                                </Button>
                              )}
                              <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}


            </motion.main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPanel;