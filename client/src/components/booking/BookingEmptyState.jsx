import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const BookingEmptyState = ({ tab }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <Home size={26} className="text-gray-400" />
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
      {tab === 'all' ? 'No bookings yet' : `No ${tab} bookings`}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
      {tab === 'all'
        ? "Once you book a property it'll appear here."
        : `You don't have any ${tab} bookings right now.`}
    </p>
    <Link
      to="/properties"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-xl text-sm font-medium transition-colors"
    >
      Browse Properties
    </Link>
  </div>
);

export default BookingEmptyState;
