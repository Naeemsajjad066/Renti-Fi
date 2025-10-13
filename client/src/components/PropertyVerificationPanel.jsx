import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, FileText, CheckCircle, XCircle, Eye, Download,
  Calendar, Home, Bed, Bath, Users, DollarSign, Clock,
  AlertCircle, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { usePropertyVerification } from '../contexts/PropertyVerificationContext';

const PropertyVerificationPanel = () => {
  const { pendingProperties, loading, getPendingProperties, approveProperty, rejectProperty } = usePropertyVerification();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  useEffect(() => {
    getPendingProperties();
  }, [getPendingProperties]);

  const handleAction = (property, actionType) => {
    setSelectedProperty(property);
    setAction(actionType);
    setShowModal(true);
    setRejectionReason('');
    setAdminNotes('');
  };

  const handleSubmit = async () => {
    if (!selectedProperty) return;

    setSubmitting(true);
    let result;

    if (action === 'approve') {
      result = await approveProperty(selectedProperty._id, adminNotes);
    } else if (action === 'reject') {
      if (!rejectionReason.trim()) {
        alert('Please provide a rejection reason');
        setSubmitting(false);
        return;
      }
      result = await rejectProperty(selectedProperty._id, rejectionReason, adminNotes);
    }

    setSubmitting(false);

    if (result.success) {
      setShowModal(false);
      setSelectedProperty(null);
    }
  };

  const nextImage = () => {
    if (selectedProperty?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProperty?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
    }
  };

  const nextDoc = () => {
    if (selectedProperty?.propertyDocuments) {
      setCurrentDocIndex((prev) => (prev + 1) % selectedProperty.propertyDocuments.length);
    }
  };

  const prevDoc = () => {
    if (selectedProperty?.propertyDocuments) {
      setCurrentDocIndex((prev) => (prev - 1 + selectedProperty.propertyDocuments.length) % selectedProperty.propertyDocuments.length);
    }
  };

  if (loading && pendingProperties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#A0937D]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Verification</h2>
          <p className="text-gray-600 mt-1">Review and verify property listings</p>
        </div>
        <Badge className="bg-[#A0937D] text-white text-lg px-4 py-2">
          {pendingProperties.length} Pending
        </Badge>
      </div>

      {pendingProperties.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No properties pending verification at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingProperties.map((property) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                    {property.verificationStatus}
                  </Badge>
                </div>

                {/* Property Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.city}, {property.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {property.maxGuests}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-lg font-bold text-[#A0937D]">
                      Rs {property.price?.toLocaleString()}/night
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Host Info */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Host: <span className="font-medium">{property.host?.fullName}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setSelectedProperty(property);
                        setCurrentImageIndex(0);
                        setCurrentDocIndex(0);
                      }}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Property Review Modal */}
      <AnimatePresence>
        {selectedProperty && !showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#A0937D] to-[#8a7d6b] px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedProperty.title}</h2>
                    <p className="text-white/90 text-sm">{selectedProperty.city}, {selectedProperty.state}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedProperty(null)}
                    className="text-white hover:bg-white/20"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Images</h3>
                  {selectedProperty.images?.length > 0 ? (
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={selectedProperty.images[currentImageIndex]}
                          alt={`Property ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedProperty.images.length > 1 && (
                        <>
                          <Button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                            size="sm"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                            size="sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {selectedProperty.images.length}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No images uploaded</p>
                  )}
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Property Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {selectedProperty.propertyType}</p>
                      <p><span className="font-medium">Bedrooms:</span> {selectedProperty.bedrooms}</p>
                      <p><span className="font-medium">Bathrooms:</span> {selectedProperty.bathrooms}</p>
                      <p><span className="font-medium">Max Guests:</span> {selectedProperty.maxGuests}</p>
                      <p><span className="font-medium">Price:</span> Rs {selectedProperty.price?.toLocaleString()}/night</p>
                      <p><span className="font-medium">Address:</span> {selectedProperty.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Host Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedProperty.host?.fullName}</p>
                      <p><span className="font-medium">Email:</span> {selectedProperty.host?.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedProperty.host?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 text-sm">{selectedProperty.description}</p>
                </div>

                {/* Location */}
                {selectedProperty.latitude && selectedProperty.longitude && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Location Verification</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Location verified at: {selectedProperty.latitude.toFixed(6)}, {selectedProperty.longitude.toFixed(6)}
                        {selectedProperty.locationAccuracy && ` (±${selectedProperty.locationAccuracy.toFixed(0)}m)`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Host ID Card */}
                {selectedProperty.hostIdCard?.url && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Host ID Card</h3>
                    <div className="relative max-w-md">
                      <img
                        src={selectedProperty.hostIdCard.url}
                        alt="Host ID Card"
                        className="w-full rounded-lg border-2 border-gray-200"
                      />
                      <a
                        href={selectedProperty.hostIdCard.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        View Full
                      </a>
                    </div>
                  </div>
                )}

                {/* Property Documents */}
                {selectedProperty.propertyDocuments?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Property Documents</h3>
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={selectedProperty.propertyDocuments[currentDocIndex].url}
                          alt={`Document ${currentDocIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {selectedProperty.propertyDocuments.length > 1 && (
                        <>
                          <Button
                            onClick={prevDoc}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                            size="sm"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={nextDoc}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
                            size="sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {currentDocIndex + 1} / {selectedProperty.propertyDocuments.length}
                          </div>
                        </>
                      )}
                      <a
                        href={selectedProperty.propertyDocuments[currentDocIndex].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleAction(selectedProperty, 'approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Property
                  </Button>
                  <Button
                    onClick={() => handleAction(selectedProperty, 'reject')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    size="lg"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Property
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval/Rejection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => !submitting && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4">
                {action === 'approve' ? 'Approve Property' : 'Reject Property'}
              </h3>

              {action === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason * <span className="text-red-500">(Required)</span>
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes for record keeping..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || (action === 'reject' && !rejectionReason.trim())}
                  className={action === 'approve' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1 bg-red-600 hover:bg-red-700'}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {action === 'approve' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                      Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  variant="outline"
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyVerificationPanel;
