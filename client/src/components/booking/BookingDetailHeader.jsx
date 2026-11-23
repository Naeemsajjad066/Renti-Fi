import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { STATUS_BADGES, PAYMENT_STATUS_BADGES } from '@/constants';

/**
 * Shared booking detail header with status/payment badges and
 * optional verification code block.
 *
 * @param {object}  booking
 * @param {'guest'|'host'} variant — controls styling + verification code labels
 * @param {boolean} dark           — enables dark-mode classes
 */
const BookingDetailHeader = ({ booking, variant = 'guest', dark = true }) => {
  const isHost = variant === 'host';

  const statusBadge = STATUS_BADGES[booking.status] ?? STATUS_BADGES.reserved;
  const paymentBadge =
    PAYMENT_STATUS_BADGES[booking.paymentStatus] ?? PAYMENT_STATUS_BADGES.pending;
  const StatusIcon = statusBadge.icon;

  const titleClass = dark ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900';
  const idClass = dark ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600';

  // Verification code styling differs between guest (primary) and host (green)
  const codeBg = isHost
    ? 'bg-green-50 border-2 border-green-500'
    : 'bg-primary/10 border-2 border-primary';
  const codeColor = isHost ? 'text-green-600' : 'text-primary';
  const codeLabel = isHost ? 'Guest Verification Code' : 'Verification Code';
  const codeHint = isHost
    ? 'Ask guest to show this code at check-in'
    : 'Show this code to your host at check-in';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className={`text-3xl font-bold ${titleClass}`}>Booking Details</h1>
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}
          >
            <StatusIcon size={16} className="mr-1" />
            {statusBadge.label}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentBadge.className}`}
          >
            {paymentBadge.label}
          </span>
        </div>
      </div>
      <p className={idClass}>
        Booking ID: <span className="font-mono">{booking._id}</span>
      </p>
      {booking.verificationCode && (
        <div className={`mt-4 inline-flex items-center ${codeBg} rounded-lg px-6 py-3`}>
          <CheckCircle className={`${codeColor} mr-3`} size={24} />
          <div>
            <div className={`text-sm ${idClass} font-medium`}>{codeLabel}</div>
            <div className={`text-3xl font-bold ${codeColor} tracking-wider`}>
              {booking.verificationCode}
            </div>
            <div
              className={`text-xs ${dark ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'} mt-1`}
            >
              {codeHint}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookingDetailHeader;
