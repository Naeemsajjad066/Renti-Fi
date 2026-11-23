import React from 'react';
import { STATUS_BADGES } from '@/constants/booking';

/**
 * Renders a coloured pill for a booking status.
 * Falls back to the 'pending' config for unknown statuses.
 */
const BookingStatusBadge = ({ status }) => {
  const cfg = STATUS_BADGES[status] ?? STATUS_BADGES.pending;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
    >
      <Icon size={12} className="mr-1" />
      {cfg.label}
    </span>
  );
};

export default BookingStatusBadge;
