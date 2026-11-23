import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Users, Moon } from 'lucide-react';
import { CHECKIN_TIME, CHECKOUT_TIME } from '@/constants/booking';

const formatLongDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatGuestSummary = (guests) => {
  if (!guests) return '1 Guest';
  const parts = [`${guests.adults ?? 1} ${(guests.adults ?? 1) === 1 ? 'Adult' : 'Adults'}`];
  if (guests.children > 0)
    parts.push(`${guests.children} ${guests.children === 1 ? 'Child' : 'Children'}`);
  if (guests.infants > 0)
    parts.push(`${guests.infants} ${guests.infants === 1 ? 'Infant' : 'Infants'}`);
  if (guests.pets > 0) parts.push(`${guests.pets} ${guests.pets === 1 ? 'Pet' : 'Pets'}`);
  return parts.join(', ');
};

const DateBlock = ({ label, date, time }) => (
  <div className="flex-1 min-w-0">
    <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-2">{label}</p>
    <p className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
      {formatLongDate(date)}
    </p>
    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
      <Clock size={11} />
      {time}
    </p>
  </div>
);

const StayDetailsCard = ({ booking }) => {
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <CalendarDays size={17} className="text-teal" />
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">Stay Details</h3>
      </div>

      <div className="p-5">
        {/* Check-in / check-out row */}
        <div className="flex items-stretch gap-4">
          <DateBlock label="Check-in" date={checkInDate} time={CHECKIN_TIME} />

          {/* Nights badge in the middle */}
          <div className="flex flex-col items-center justify-center gap-1 px-3">
            <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-col items-center gap-0.5 bg-teal/8 dark:bg-teal/15 border border-teal/20 rounded-xl px-3 py-2">
              <Moon size={13} className="text-teal" />
              <span className="text-sm font-bold text-teal">{booking.nights}</span>
              <span className="text-[10px] text-teal/70">
                {booking.nights === 1 ? 'night' : 'nights'}
              </span>
            </div>
            <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <DateBlock label="Check-out" date={checkOutDate} time={CHECKOUT_TIME} />
        </div>

        {/* Guests row */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users size={15} className="text-teal" />
            Guests
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatGuestSummary(booking.guests)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StayDetailsCard;
