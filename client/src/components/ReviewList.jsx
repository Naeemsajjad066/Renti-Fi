import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Filter, TrendingUp } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { useReview } from '../contexts/ReviewContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

const ReviewList = ({ propertyId }) => {
  const { getPropertyReviews, getPropertyStats, deleteReview } = useReview();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const loadReviews = async () => {
    setLoading(true);

    // Fetch reviews
    const reviewResult = await getPropertyReviews(propertyId);
    if (reviewResult.success) {
      setReviews(reviewResult.data);
    }

    // Fetch stats
    const statsResult = await getPropertyStats(propertyId);
    if (statsResult.success) {
      setStats(statsResult.data);
    }

    setLoading(false);
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    const result = await deleteReview(reviewId, propertyId);
    if (result.success) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      loadReviews(); // Reload to update stats
    } else {
      alert(result.message || 'Failed to delete review');
    }
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterRating === 'all') return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A0937D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats && (
        <Card className="p-6 bg-gradient-to-r from-[#F6E6CB] to-[#E7D4B5]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Star className="w-8 h-8 fill-[#A0937D] text-[#A0937D]" />
                <span className="text-4xl font-bold text-gray-900">
                  {stats.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Based on {stats.totalReviews || reviews.length}{' '}
                {(stats.totalReviews || reviews.length) === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 w-12">{rating} stars</span>
                      <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: rating * 0.1 }}
                          className="bg-[#A0937D] h-full"
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          {stats.averageCleanliness && (
            <div className="mt-6 pt-6 border-t border-[#A0937D]/20">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Cleanliness', value: stats.averageCleanliness },
                  { label: 'Accuracy', value: stats.averageAccuracy },
                  { label: 'Communication', value: stats.averageCommunication },
                  { label: 'Location', value: stats.averageLocation },
                  { label: 'Check-in', value: stats.averageCheckIn },
                  { label: 'Value', value: stats.averageValue },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {item.value?.toFixed(1) || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Filters and Sort */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            All Reviews ({filteredAndSortedReviews.length})
          </h3>

          <div className="flex flex-wrap gap-3">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {filteredAndSortedReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedReviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReviewCard review={review} onDelete={handleDelete} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filterRating !== 'all' ? 'No reviews match your filter' : 'No reviews yet'}
          </h3>
          <p className="text-gray-600">
            {filterRating !== 'all'
              ? 'Try adjusting your filters to see more reviews.'
              : 'Be the first to share your experience at this property.'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default ReviewList;
