import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Hash } from 'lucide-react';
import { STATUS_BADGES, PAYMENT_STATUS_BADGES } from '@/constants';

const BookingDetailHeader = ({ booking, variant = 'guest', dark: _dark = true, onBack }) => {
  const isHost = variant === 'host';

  const statusBadge = STATUS_BADGES[booking.status] ?? STATUS_BADGES.reserved;
  const paymentBadge =
    PAYMENT_STATUS_BADGES[booking.paymentStatus] ?? PAYMENT_STATUS_BADGES.pending;
  const StatusIcon = statusBadge.icon;

  const codeLabel = isHost ? 'Guest Verification Code' : 'Your Check-in Code';
  const codeHint = isHost
    ? 'Ask the guest to show this at check-in'
    : 'Show this to your host at check-in';

  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-earth-brown dark:hover:text-earth-brown transition-colors"
        >
          <ArrowLeft size={15} />
          Back to bookings
        </button>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Booking Details
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Hash size={13} />
            <span className="font-mono">{booking._id}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${statusBadge.className}`}
          >
            <StatusIcon size={12} />
            {statusBadge.label}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${paymentBadge.className}`}
          >
            {paymentBadge.label}
          </span>
        </div>
      </div>

      {booking.verificationCode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 inline-flex items-center gap-4 bg-earth-brown/8 dark:bg-earth-brown/15 border border-earth-brown/25 dark:border-earth-brown/30 rounded-2xl px-5 py-4"
        >
          <div className="w-10 h-10 rounded-full bg-earth-brown/15 flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-earth-brown" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
              {codeLabel}
            </p>
            <p className="text-2xl font-bold text-earth-brown tracking-[0.2em] font-mono leading-none">
              {booking.verificationCode}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{codeHint}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookingDetailHeader;
