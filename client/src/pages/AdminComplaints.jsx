import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, Search, Eye, Calendar, User, Home, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdminComplaints = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    under_review: 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
    dismissed: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const categoryLabels = {
    false_information: 'False Information',
    safety_concerns: 'Safety Concerns',
    inappropriate_content: 'Inappropriate Content',
    scam_fraud: 'Scam/Fraud',
    property_condition: 'Property Condition',
    host_behavior: 'Host Behavior',
    other: 'Other',
  };

  useEffect(() => {
    fetchComplaints();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: 'Error',
        description: 'Failed to load complaints',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      !filters.search ||
      complaint.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.property?.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A0937D]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Complaints Management</h1>
        <p className="text-gray-600">Review and manage property complaints</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <AlertCircle size={32} className="text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
              </div>
              <Clock size={32} className="text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Under Review</p>
                <p className="text-3xl font-bold text-blue-600">{stats.byStatus.under_review}</p>
              </div>
              <Eye size={32} className="text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.byStatus.resolved}</p>
              </div>
              <TrendingUp size={32} className="text-green-400" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search complaints..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No complaints found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[complaint.status]}`}
                      >
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[complaint.priority]}`}
                      >
                        {complaint.priority.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {complaint.property && (
                        <div className="flex items-center gap-1">
                          <Home size={14} />
                          <span>{complaint.property.title}</span>
                        </div>
                      )}
                      {complaint.reporter && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{complaint.reporter.fullName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {categoryLabels[complaint.category]}
                      </span>
                      {complaint.attachments && complaint.attachments.length > 0 && (
                        <span className="text-[#A0937D]">
                          {complaint.attachments.length} attachment(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/complaints/${complaint._id}`);
                    }}
                    className="ml-4 p-2 text-[#A0937D] hover:bg-[#A0937D] hover:text-white rounded-lg transition"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
