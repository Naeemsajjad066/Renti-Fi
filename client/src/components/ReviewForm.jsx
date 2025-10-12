import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import StarRating from './StarRating';
import { useReview } from '../contexts/ReviewContext';
import { Button } from './ui/button';
import { Card } from './ui/card';

const ReviewForm = ({ booking, onClose, onSuccess }) => {
  const { submitReview } = useReview();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    checkIn: 0,
    value: 0
  });

  const [errors, setErrors] = useState({});

  const ratingCategories = [
    { key: 'cleanliness', label: 'Cleanliness', description: 'How clean was the property?' },
    { key: 'accuracy', label: 'Accuracy', description: 'Did it match the listing description?' },
    { key: 'communication', label: 'Communication', description: 'How was host communication?' },
    { key: 'location', label: 'Location', description: 'How convenient was the location?' },
    { key: 'checkIn', label: 'Check-in', description: 'Was check-in smooth and easy?' },
    { key: 'value', label: 'Value', description: 'Was it worth the price?' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please select an overall rating';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write a review';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    } else if (formData.comment.trim().length > 1000) {
      newErrors.comment = 'Review must not exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Validate booking data
    if (!booking || !booking._id) {
      setErrors({ submit: 'Invalid booking data' });
      return;
    }

    const propertyId = booking.property?._id || booking.propertyId || booking.property;
    if (!propertyId) {
      setErrors({ submit: 'Property information is missing' });
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      ...formData,
      property: propertyId,
      booking: booking._id
    };

    const result = await submitReview(reviewData);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrors({ submit: result.message || 'Failed to submit review' });
    }
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({ ...prev, [category]: value }));
    if (errors[category]) {
      setErrors(prev => ({ ...prev, [category]: null }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Write a Review
                </h2>
                <p className="text-gray-600">
                  Share your experience at {booking.property.title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Overall Rating *
                </label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(value) => handleRatingChange('rating', value)}
                  interactive
                  size="xl"
                  showNumber
                />
                {errors.rating && (
                  <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
                )}
              </div>

              {/* Written Review */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, comment: e.target.value }));
                    if (errors.comment) {
                      setErrors(prev => ({ ...prev, comment: null }));
                    }
                  }}
                  placeholder="Tell us about your stay..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent resize-none"
                  rows="5"
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.comment ? (
                    <p className="text-sm text-red-600">{errors.comment}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Minimum 10 characters
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {formData.comment.length}/1000
                  </p>
                </div>
              </div>

              {/* Detailed Ratings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Rate Your Experience (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ratingCategories.map((category) => (
                    <div
                      key={category.key}
                      className="p-4 bg-[#F6E6CB] rounded-lg hover:bg-[#E7D4B5] transition-colors"
                    >
                      <p className="font-medium text-gray-900 mb-1">
                        {category.label}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {category.description}
                      </p>
                      <StarRating
                        rating={formData[category.key]}
                        onRatingChange={(value) => handleRatingChange(category.key, value)}
                        interactive
                        size="md"
                        showNumber={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#A0937D] hover:bg-[#8a7d6b] text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewForm;
