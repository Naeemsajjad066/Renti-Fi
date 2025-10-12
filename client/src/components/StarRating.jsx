import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  interactive = false, 
  size = 'md',
  showNumber = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const displayRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
            className={`transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${sizes[size]} ${
                star <= displayRating
                  ? 'fill-[#A0937D] text-[#A0937D]'
                  : 'fill-none text-gray-300'
              }`}
            />
          </motion.button>
        ))}
      </div>
      {showNumber && rating > 0 && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
