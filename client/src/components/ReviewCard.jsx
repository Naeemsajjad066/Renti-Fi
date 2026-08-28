import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, MoreVertical, Trash2, Edit, Calendar } from 'lucide-react';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

const ReviewCard = ({ review, onDelete, onEdit, showHostResponse = true }) => {
  const { user } = useAuth();
  const { markHelpful, addHostResponse } = useReview();
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = user?._id === review.user?._id;
  const isHost = user?._id === review.property?.host?._id;

  const handleMarkHelpful = async () => {
    const result = await markHelpful(review._id, review.property?._id);
    if (!result.success) {
      alert(result.message || 'Failed to mark review as helpful');
    }
  };

  const handleHostResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmitting(true);
    const result = await addHostResponse(review._id, responseText);
    setIsSubmitting(false);

    if (result.success) {
      setShowResponseForm(false);
      setResponseText('');
    } else {
      alert(result.message || 'Failed to add response');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={review.user?.profilePic}
                alt={review.user?.fullName || review.user?.name}
              />
              <AvatarFallback className="bg-[#A0937D] text-white">
                {getInitials(review.user?.fullName || review.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-gray-900">
                {review.user?.fullName || review.user?.name}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(review.createdAt)}</span>
                {review.isVerified && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Verified Stay
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          {(isOwner || user?.role === 'admin') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <DropdownMenuItem onClick={() => onEdit?.(review)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Review
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete?.(review._id)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Review
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={review.rating} size="md" showNumber />
        </div>

        {/* Review Text */}
        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

        {/* Detailed Ratings */}
        {(review.cleanliness || review.accuracy || review.communication) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-4 bg-[#F6E6CB] rounded-lg">
            {review.cleanliness && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
                <StarRating rating={review.cleanliness} size="sm" showNumber={false} />
              </div>
            )}
            {review.accuracy && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Accuracy</p>
                <StarRating rating={review.accuracy} size="sm" showNumber={false} />
              </div>
            )}
            {review.communication && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Communication</p>
                <StarRating rating={review.communication} size="sm" showNumber={false} />
              </div>
            )}
            {review.location && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Location</p>
                <StarRating rating={review.location} size="sm" showNumber={false} />
              </div>
            )}
            {review.checkIn && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Check-in</p>
                <StarRating rating={review.checkIn} size="sm" showNumber={false} />
              </div>
            )}
            {review.value && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Value</p>
                <StarRating rating={review.value} size="sm" showNumber={false} />
              </div>
            )}
          </div>
        )}

        {/* Host Response */}
        {showHostResponse && review.hostResponse?.comment && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#A0937D]">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-[#A0937D]" />
              <span className="font-semibold text-sm text-gray-900">Response from host</span>
              <span className="text-xs text-gray-500">
                {formatDate(review.hostResponse.respondedAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700">{review.hostResponse.comment}</p>
          </div>
        )}

        {/* Host Response Form */}
        {isHost && !review.hostResponse && showResponseForm && (
          <form onSubmit={handleHostResponse} className="mt-4">
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0937D] focus:border-transparent resize-none"
              rows="3"
            />
            <div className="flex gap-2 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !responseText.trim()}
                className="bg-[#A0937D] hover:bg-[#8a7d6b]"
              >
                {isSubmitting ? 'Posting...' : 'Post Response'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowResponseForm(false);
                  setResponseText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleMarkHelpful}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#A0937D] transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Helpful ({review.helpfulCount || 0})</span>
          </button>

          {isHost && !review.hostResponse && !showResponseForm && (
            <button
              onClick={() => setShowResponseForm(true)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#A0937D] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Respond</span>
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;
