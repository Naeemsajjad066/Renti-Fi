import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { CHECKIN_TIME, CHECKOUT_TIME } from '@/constants/booking';

const formatLongDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatGuestSummary = (guests) => {
  const parts = [`${guests.adults} ${guests.adults === 1 ? 'Adult' : 'Adults'}`];
  if (guests.children > 0)
    parts.push(`${guests.children} ${guests.children === 1 ? 'Child' : 'Children'}`);
  if (guests.infants > 0)
    parts.push(`${guests.infants} ${guests.infants === 1 ? 'Infant' : 'Infants'}`);
  if (guests.pets > 0) parts.push(`${guests.pets} ${guests.pets === 1 ? 'Pet' : 'Pets'}`);
  return parts.join(', ');
};

const StayDetailsCard = ({ booking, dark = true }) => {
  const cardBg = dark ? 'bg-white dark:bg-gray-800' : 'bg-white';
  const textPrimary = dark ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900';
  const textMuted = dark ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600';
  const textSubtle = dark ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500';
  const borderClass = dark ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200';

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${cardBg} rounded-lg shadow-md p-6`}
    >
      <h3 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center`}>
        <Calendar size={20} className="mr-2" />
        Stay Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className={`text-sm ${textSubtle} mb-1`}>Check-in</div>
          <div className={`text-lg font-semibold ${textPrimary}`}>{formatLongDate(checkInDate)}</div>
          <div className={`flex items-center ${textMuted} mt-1`}>
            <Clock size={14} className="mr-1" />
            <span className="text-sm">{CHECKIN_TIME}</span>
          </div>
        </div>
        <div>
          <div className={`text-sm ${textSubtle} mb-1`}>Check-out</div>
          <div className={`text-lg font-semibold ${textPrimary}`}>{formatLongDate(checkOutDate)}</div>
          <div className={`flex items-center ${textMuted} mt-1`}>
            <Clock size={14} className="mr-1" />
            <span className="text-sm">{CHECKOUT_TIME}</span>
          </div>
        </div>
      </div>

      <div className={`mt-4 pt-4 border-t ${borderClass}`}>
        <div className="flex items-center justify-between">
          <span className={textMuted}>Total nights</span>
          <span className={`font-semibold ${textPrimary}`}>
            {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`${textMuted} flex items-center`}>
            <Users size={16} className="mr-2" />
            Guests
          </span>
          <span className={`font-semibold ${textPrimary}`}>
            {formatGuestSummary(booking.guests)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StayDetailsCard;
