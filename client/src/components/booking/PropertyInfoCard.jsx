import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, ExternalLink, Star } from 'lucide-react';

const PropertyInfoCard = ({ booking, dark: _dark = true }) => {
  const property = booking.property ?? {};
  const rating = property.rating ?? property.averageRating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      {/* Image */}
      <div className="relative h-56 sm:h-72">
        <img
          src={property.images?.[0] || '/placeholder.svg'}
          alt={property.title || 'Property'}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Rating pill */}
        {rating && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-100 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            <Star size={11} className="fill-tangerine text-tangerine" />
            {Number(rating).toFixed(1)}
          </div>
        )}

        {/* View property button */}
        <Link
          to={`/properties/${property._id}`}
          className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 text-xs font-medium px-3 py-1.5 rounded-full shadow transition-colors"
        >
          <ExternalLink size={12} />
          View Property
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-xs text-white/70 uppercase tracking-widest mb-1">
            {property.propertyType}
          </p>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
            {property.title || 'Property'}
          </h2>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-teal shrink-0" />
          {[property.address, property.city, property.state].filter(Boolean).join(', ')}
        </span>
        {property.bedrooms && (
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} className="text-teal shrink-0" />
            {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
          </span>
        )}
        {property.bathrooms && (
          <span className="flex items-center gap-1.5">
            <Bath size={14} className="text-teal shrink-0" />
            {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyInfoCard;
