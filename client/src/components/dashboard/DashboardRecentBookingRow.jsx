import React from 'react';
import { BOOKING_STATUS_COLORS } from '@/constants/dashboard';

const DashboardRecentBookingRow = ({ booking, formatDate, formatCurrency }) => {
  const statusClass = BOOKING_STATUS_COLORS[booking.status] ?? BOOKING_STATUS_COLORS.pending;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
      <img
        src={booking.guest?.profilePic || '/placeholder.svg'}
        alt={booking.guest?.fullName || 'Guest'}
        className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-gray-100 dark:ring-gray-700"
        onError={(e) => {
          e.target.src = '/placeholder.svg';
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {booking.guest?.fullName || 'Guest'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {booking.property?.title || 'Property'} &middot; {formatDate(booking.checkIn)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(booking.totalPrice || booking.totalAmount || 0)}
        </p>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusClass}`}>
          {booking.status}
        </span>
      </div>
    </div>
  );
};

export default DashboardRecentBookingRow;
