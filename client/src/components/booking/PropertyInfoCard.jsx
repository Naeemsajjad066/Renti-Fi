import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Home, ExternalLink } from 'lucide-react';

const PropertyInfoCard = ({ booking, dark = true }) => {
  const cardBg = dark ? 'bg-white dark:bg-gray-800' : 'bg-white';
  const textPrimary = dark ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900';
  const textMuted = dark ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`${cardBg} rounded-lg shadow-md overflow-hidden`}
    >
      <div className="relative h-64">
        <img
          src={booking.property?.images?.[0] || '/placeholder.svg'}
          alt={booking.property?.title || 'Property'}
          className="w-full h-full object-cover"
        />
        <Link
          to={`/properties/${booking.property?._id}`}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center"
        >
          <ExternalLink size={16} className="mr-2" />
          View Property
        </Link>
      </div>
      <div className="p-6">
        <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
          {booking.property?.title || 'Property'}
        </h2>
        <div className={`flex items-center ${textMuted} mb-4`}>
          <MapPin size={16} className="mr-2" />
          <span>
            {booking.property?.address}, {booking.property?.city}, {booking.property?.state}
          </span>
        </div>
        <div className={`flex items-center ${textMuted}`}>
          <Home size={16} className="mr-2" />
          <span>
            {booking.property?.propertyType} • {booking.property?.bedrooms} Bedrooms •{' '}
            {booking.property?.bathrooms} Bathrooms
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyInfoCard;
