import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

/**
 * Shared map location card for booking detail pages.
 *
 * @param {object}  property        — booking.property
 * @param {boolean} dark            — enables dark-mode classes (unused, kept for API compat)
 * @param {boolean} showDirections  — shows the "Get Directions" button
 * @param {string}  mapHeight       — tailwind height class for the iframe (default 'h-64')
 */
const BookingMapCard = ({
  property,
  dark: _dark = true,
  showDirections = false,
  mapHeight = 'h-64',
}) => {
  const hasCoords = property?.latitude && property?.longitude;
  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&z=15`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={17} className="text-earth-brown" />
          <h3 className="font-display font-semibold text-gray-900 dark:text-white">Location</h3>
        </div>
        {showDirections && hasCoords && (
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
              window.open(url, '_blank');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-earth-brown hover:text-earth-brown/80 transition-colors"
          >
            <Navigation size={13} />
            Get Directions
          </button>
        )}
      </div>

      {hasCoords ? (
        <div className={`${mapHeight} w-full`}>
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapSrc}
            allowFullScreen
            title="Property location"
          />
        </div>
      ) : (
        <div className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
          {property?.address && <p>{property.address}</p>}
          <p>{[property?.city, property?.state, property?.zipCode].filter(Boolean).join(', ')}</p>
          {property?.country && <p>{property.country}</p>}
        </div>
      )}
    </motion.div>
  );
};

export default BookingMapCard;
