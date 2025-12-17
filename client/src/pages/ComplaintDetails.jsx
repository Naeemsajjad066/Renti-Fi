import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Home,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    adminNotes: '',
    resolution: ''
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    under_review: 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
    dismissed: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const categoryLabels = {
    false_information: 'False Information',
    safety_concerns: 'Safety Concerns',
    inappropriate_content: 'Inappropriate Content',
    scam_fraud: 'Scam/Fraud',
    property_condition: 'Property Condition',
    host_behavior: 'Host Behavior',
    other: 'Other'
  };

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setComplaint(response.data.complaint);
        setFormData({
          status: response.data.complaint.status,
          priority: response.data.complaint.priority,
          adminNotes: response.data.complaint.adminNotes || '',
          resolution: response.data.complaint.resolution || ''
        });
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
      toast({
        title: "Error",
        description: "Failed to load complaint details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Complaint updated successfully"
        });
        fetchComplaintDetails();
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update complaint",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A0937D]"></div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Not Found</h2>
        <button
          onClick={() => navigate('/admin/complaints')}
          className="mt-4 px-6 py-2 bg-[#A0937D] text-white rounded-lg hover:bg-[#8a7d6b]"
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/complaints')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Complaints
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Complaint Details</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[complaint.status]}`}>
            {complaint.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{complaint.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className={`px-3 py-1 rounded-full font-semibold ${priorityColors[complaint.priority]}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    {categoryLabels[complaint.category]}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
            </div>

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Attachments ({complaint.attachments.length})</h3>
                <div className="grid grid-cols-2 gap-3">
                  {complaint.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      {attachment.type === 'image' ? (
                        <img
                          src={attachment.url}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:border-[#A0937D] transition"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 hover:border-[#A0937D] flex items-center justify-center">
                          <ImageIcon size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                        <ExternalLink size={24} className="text-white opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Submitted: {new Date(complaint.createdAt).toLocaleString()}</span>
                </div>
                {complaint.reviewedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} />
                    <span>Reviewed: {new Date(complaint.reviewedAt).toLocaleString()}</span>
                    {complaint.reviewedBy && (
                      <span className="text-gray-500">by {complaint.reviewedBy.fullName}</span>
                    )}
                  </div>
                )}
                {complaint.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Resolved: {new Date(complaint.resolvedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Property Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Home size={20} />
              Property Information
            </h3>
            {complaint.property ? (
              <div>
                <div className="flex items-start gap-4">
                  {complaint.property.images && complaint.property.images[0] && (
                    <img
                      src={complaint.property.images[0]}
                      alt={complaint.property.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{complaint.property.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{complaint.property.city}, {complaint.property.state}</span>
                      </div>
                      {complaint.property.price && (
                        <p>Price: Rs {complaint.property.price.toLocaleString()}/night</p>
                      )}
                    </div>
                    <button
                      onClick={() => window.open(`/property/${complaint.property._id}`, '_blank')}
                      className="mt-2 text-[#A0937D] hover:text-[#8a7d6b] font-semibold text-sm flex items-center gap-1"
                    >
                      View Property <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Property information not available</p>
            )}

            {/* Host Information */}
            {complaint.propertySnapshot && complaint.propertySnapshot.host && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Host Information</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={14} />
                  <span>{complaint.propertySnapshot.host.fullName}</span>
                  <span className="text-gray-400">•</span>
                  <span>{complaint.propertySnapshot.host.email}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Reporter Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} />
              Reporter Information
            </h3>
            {complaint.reporter && (
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Name:</strong> {complaint.reporter.fullName}</p>
                <p><strong>Email:</strong> {complaint.reporter.email}</p>
                {complaint.reporter.phoneNumber && (
                  <p><strong>Phone:</strong> {complaint.reporter.phoneNumber}</p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar - Admin Actions */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 sticky top-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Actions</h3>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  rows={4}
                  placeholder="Internal notes about this complaint..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent resize-none"
                />
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution
                </label>
                <textarea
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  rows={4}
                  placeholder="How was this complaint resolved?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent resize-none"
                />
              </div>

              {/* Update Button */}
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full px-4 py-3 bg-[#A0937D] text-white rounded-lg hover:bg-[#8a7d6b] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {updating ? 'Updating...' : 'Update Complaint'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
