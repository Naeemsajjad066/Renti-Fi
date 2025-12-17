import React, { useState } from 'react';
import { X, AlertCircle, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ReportPropertyModal = ({ property, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewFiles, setPreviewFiles] = useState([]);

  const categories = [
    { value: 'false_information', label: 'False Information' },
    { value: 'safety_concerns', label: 'Safety Concerns' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'scam_fraud', label: 'Scam/Fraud' },
    { value: 'property_condition', label: 'Property Condition' },
    { value: 'host_behavior', label: 'Host Behavior' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + previewFiles.length > 5) {
      setError('Maximum 5 attachments allowed');
      return;
    }

    // Create previews for images
    const newPreviews = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        continue;
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            file,
            preview: e.target.result,
            type: 'image',
            name: file.name
          });
          if (newPreviews.length === files.length) {
            setPreviewFiles(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        newPreviews.push({
          file,
          preview: null,
          type: 'document',
          name: file.name
        });
      }
    }

    if (!files.some(f => f.type.startsWith('image/'))) {
      setPreviewFiles(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Upload through backend to avoid CORS issues with global axios interceptors
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      url: response.data.url,
      publicId: response.data.publicId,
      type: file.type.startsWith('image/') ? 'image' : 'document'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (formData.description.length < 20) {
      setError('Please provide a more detailed description (minimum 20 characters)');
      return;
    }

    setLoading(true);

    try {
      // Upload attachments if any
      const uploadedAttachments = [];
      for (const item of previewFiles) {
        try {
          const uploaded = await uploadToCloudinary(item.file);
          uploadedAttachments.push(uploaded);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          // Continue with other files
        }
      }

      // Submit complaint
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/complaints`,
        {
          propertyId: property._id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          attachments: uploadedAttachments
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        console.log('Complaint submitted successfully:', response.data);
        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
        // Close modal
        onClose();
        // Reset form
        setFormData({ title: '', description: '', category: 'other', attachments: [] });
        setPreviewFiles([]);
      } else {
        setError(response.data.message || 'Failed to submit complaint');
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={24} />
                Report Property
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Report: {property?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief summary of the issue"
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about the issue..."
                rows={5}
                maxLength={2000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/2000 characters (minimum 20)
              </p>
            </div>

            {/* Attachments */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload up to 5 images or documents (max 5MB each)
              </p>

              <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#A0937D] transition">
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG, PDF (max 5MB)
                </span>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  disabled={previewFiles.length >= 5}
                />
              </label>

              {/* Preview Files */}
              {previewFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {previewFiles.map((item, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 rounded-lg p-2 flex items-center gap-2"
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.preview}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <FileText size={24} className="text-gray-400" />
                        </div>
                      )}
                      <span className="text-xs text-gray-600 flex-1 truncate">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> False reports may result in account suspension.
                Our team will review your complaint within 24-48 hours.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportPropertyModal;
