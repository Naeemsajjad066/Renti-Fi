
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import OptimizedImage from './OptimizedImage';

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Handle both old mock data structure and new database structure
  const propertyId = property._id || property.id;
  const propertyImage = property.images?.[0] || property.image || '/placeholder.svg';
  const propertyTitle = property.title || property.name;
  const propertyLocation = property.city && property.state 
    ? `${property.city}, ${property.state}` 
    : property.location;
  const propertyRating = property.rating || 4.5;
  const propertyType = property.propertyType || property.type || 'Property';
  const isFeatured = property.featured || property.isActive;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="property-card group rounded-xl overflow-hidden border border-cream-beige dark:border-earth-brown/30"
    >
      <Link to={`/property/${propertyId}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3] rounded-t-xl bg-gray-200 dark:bg-gray-700">
          <OptimizedImage
            src={propertyImage}
            alt={propertyTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            priority="high"
            placeholder="/placeholder.svg"
            fallback="/placeholder.svg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {isFeatured && (
            <Badge className="absolute top-3 left-3 bg-earth-brown text-white dark:bg-cream-beige dark:text-earth-brown border-none">
              Featured
            </Badge>
          )}
          
          <button 
            onClick={toggleLike}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              isLiked ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
            )}
          >
            <Heart size={14} className={isLiked ? "fill-current" : ""} />
          </button>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-earth-brown dark:group-hover:text-cream-beige transition-colors">{propertyTitle}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={14} className="mr-1" />
                <span>{propertyLocation}</span>
              </div>
            </div>
            <div className="flex items-center bg-earth-brown/10 dark:bg-cream-beige/10 px-2 py-1 rounded">
              <Star size={14} className="text-earth-brown dark:text-cream-beige mr-1" />
              <span className="text-sm font-medium text-earth-brown dark:text-cream-beige">{propertyRating}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Rs {property.price}
                <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">/night</span>
              </p>
            </div>
            
            <Badge variant="outline" className="bg-light-beige dark:bg-earth-brown/20 text-earth-brown dark:text-cream-beige border-cream-beige dark:border-earth-brown/30">
              {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
