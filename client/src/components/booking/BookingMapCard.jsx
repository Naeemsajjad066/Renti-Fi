import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

/**
 * Shared map location card for booking detail pages.
 *
 * @param {object}  property        — booking.property
 * @param {boolean} dark            — enables dark-mode classes
 * @param {boolean} showDirections  — shows the "Get Directions" button overlay
 * @param {string}  mapHeight       — tailwind height class for the iframe (default 'h-64')
 */
const BookingMapCard = ({ property, dark = true, showDirections = false, mapHeight = 'h-64' }) => {
  const cardBg = dark ? 'bg-white dark:bg-gray-800' : 'bg-white';
  const titleClass = dark ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900';
  const fallbackClass = dark ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500';
  const buttonClass = dark
    ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100'
    : 'bg-white hover:bg-gray-50 text-gray-800';

  const hasCoords = property?.latitude && property?.longitude;
  const mapSrc = showDirections
    ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&z=15`
    : `https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`${cardBg} rounded-lg shadow-md p-6`}
    >
      <h3 className={`text-xl font-semibold ${titleClass} mb-4 flex items-center`}>
        <MapPin size={20} className="mr-2" />
        Location
      </h3>

      {hasCoords ? (
        <div className={`relative ${mapHeight} rounded-lg overflow-hidden`}>
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapSrc}
            allowFullScreen
          />

          {showDirections && (
            <div className="absolute bottom-4 right-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
                  window.open(url, '_blank');
                }}
                className={`${buttonClass} px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center`}
              >
                <MapPin size={16} className="mr-2 text-primary" />
                Get Directions
              </motion.button>
            </div>
          )}
        </div>
      ) : (
        <div className={fallbackClass}>
          <p>{property?.address}</p>
          <p>
            {property?.city}, {property?.state} {property?.zipCode}
          </p>
          <p>{property?.country}</p>
        </div>
      )}
    </motion.div>
  );
};

export default BookingMapCard;
