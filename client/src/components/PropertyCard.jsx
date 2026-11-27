import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Heart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import OptimizedImage from './OptimizedImage';

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const propertyId = property._id || property.id;
  const propertyImage = property.images?.[0] || property.image || '/placeholder.svg';
  const propertyTitle = property.title || property.name;
  const propertyLocation =
    property.city && property.state ? `${property.city}, ${property.state}` : property.location;
  const propertyRating = property.rating || 0;
  const totalReviews = property.totalReviews || 0;
  const propertyType = property.propertyType || property.type || 'Property';
  const isFeatured = property.featured || property.isActive;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/property/${propertyId}`} className="block">
        {/* ── Image ── */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-gray-700">
          <OptimizedImage
            src={propertyImage}
            alt={propertyTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            placeholder="/placeholder.svg"
            fallback="/placeholder.svg"
          />

          {/* dark scrim on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Featured badge */}
          {isFeatured && (
            <Badge className="absolute top-3 left-3 bg-earth-brown text-white border-none text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
              Featured
            </Badge>
          )}

          {/* Wishlist button */}
          <button
            onClick={toggleLike}
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 active:scale-90',
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white/90 dark:bg-gray-900/80 text-gray-500 hover:bg-white dark:hover:bg-gray-900'
            )}
          >
            <Heart size={14} className={isLiked ? 'fill-current' : ''} />
          </button>

          {/* Property type pill — bottom of image */}
          <span className="absolute bottom-3 left-3 text-[11px] font-medium bg-white/90 dark:bg-gray-900/80 text-earth-brown border border-earth-brown/20 rounded-full px-2.5 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
          </span>
        </div>

        {/* ── Info ── */}
        <div className="p-4">
          {/* Title + location */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] leading-snug mb-1 group-hover:text-earth-brown dark:group-hover:text-cream-beige transition-colors line-clamp-1">
            {propertyTitle}
          </h3>
          <div className="flex items-center gap-1 text-[13px] text-gray-500 dark:text-gray-400 mb-3">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{propertyLocation}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />

          {/* Price + Rating row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                Rs {property.price?.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/night</span>
            </div>

            {propertyRating > 0 && totalReviews > 0 ? (
              <div className="flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {propertyRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">({totalReviews})</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500">New listing</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
