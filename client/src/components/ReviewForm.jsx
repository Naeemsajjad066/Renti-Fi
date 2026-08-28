import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import StarRating from './StarRating';
import { useReview } from '../contexts/ReviewContext';
import { Button } from './ui/button';

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
    value: 0,
  });

  const [errors, setErrors] = useState({});

  const ratingCategories = [
    { key: 'cleanliness', label: 'Cleanliness', description: 'How clean was the property?' },
    { key: 'accuracy', label: 'Accuracy', description: 'Did it match the listing description?' },
    { key: 'communication', label: 'Communication', description: 'How was host communication?' },
    { key: 'location', label: 'Location', description: 'How convenient was the location?' },
    { key: 'checkIn', label: 'Check-in', description: 'Was check-in smooth and easy?' },
    { key: 'value', label: 'Value', description: 'Was it worth the price?' },
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
      booking: booking._id,
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
    setFormData((prev) => ({ ...prev, [category]: value }));
    if (errors[category]) {
      setErrors((prev) => ({ ...prev, [category]: null }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl"
        >
          <div className="bg-white overflow-y-auto max-h-[85vh]">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#A0937D] to-[#8a7d6b] px-6 py-4 border-b border-gray-200">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Write a Review</h2>
                  <p className="text-white/90 text-sm line-clamp-1">{booking.property.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Overall Rating */}
                <div className="bg-gradient-to-br from-[#F6E6CB] to-white p-4 rounded-xl border border-[#E7D4B5]">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Overall Rating *
                  </label>
                  <div className="flex items-center justify-center">
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={(value) => handleRatingChange('rating', value)}
                      interactive
                      size="xl"
                      showNumber
                    />
                  </div>
                  {errors.rating && (
                    <p className="text-sm text-red-600 mt-2 text-center">{errors.rating}</p>
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
                      setFormData((prev) => ({ ...prev, comment: e.target.value }));
                      if (errors.comment) {
                        setErrors((prev) => ({ ...prev, comment: null }));
                      }
                    }}
                    placeholder="Tell us about your stay..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#A0937D] focus:border-transparent resize-none bg-gray-50/50 hover:bg-white transition-colors"
                    rows="4"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    {errors.comment ? (
                      <p className="text-sm text-red-600">{errors.comment}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Minimum 10 characters</p>
                    )}
                    <p className="text-xs text-gray-500">{formData.comment.length}/1000</p>
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Rate Your Experience (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ratingCategories.map((category) => (
                      <div
                        key={category.key}
                        className="p-3 bg-gradient-to-br from-[#F6E6CB] to-white rounded-xl border border-[#E7D4B5] hover:shadow-md transition-all"
                      >
                        <p className="font-medium text-gray-900 text-sm mb-0.5">{category.label}</p>
                        <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                        <StarRating
                          rating={formData[category.key]}
                          onRatingChange={(value) => handleRatingChange(category.key, value)}
                          interactive
                          size="sm"
                          showNumber={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#A0937D] to-[#8a7d6b] hover:from-[#8a7d6b] hover:to-[#75685a] text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 border-2 border-gray-300 hover:bg-gray-100 rounded-xl font-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewForm;
