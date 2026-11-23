import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Renders either a guest or host contact card depending on `variant`.
 * - variant="guest"  → host view (shows guest info)
 * - variant="host"   → guest view (shows host info + "View Host Profile" button)
 */
const ContactCard = ({ booking, variant, dark = true }) => {
  const isGuest = variant === 'guest';
  const person = isGuest ? booking.guest : booking.host;
  const roleLabel = isGuest ? 'Booking Guest' : 'Property Host';
  const title = isGuest ? 'Guest Information' : 'Host Contact';

  const cardBg = dark ? 'bg-white dark:bg-gray-800' : 'bg-white';
  const textPrimary = dark ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900';
  const textMuted = dark ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600';
  const textSubtle = dark ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500';
  const borderClass = dark ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200';
  const bodyText = dark ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700';
  const bodyBg = dark ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`${cardBg} rounded-lg shadow-md p-6`}
    >
      <h3 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center`}>
        {isGuest ? <User size={20} className="mr-2" /> : null}
        {title}
      </h3>

      <div className="flex items-center mb-4">
        <img
          src={person?.profilePic || '/placeholder.svg'}
          alt={person?.fullName || (isGuest ? 'Guest' : 'Host')}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <div className={`font-semibold ${textPrimary}`}>
            {person?.fullName || (isGuest ? 'Guest' : 'Host')}
          </div>
          <div className={`text-sm ${textSubtle}`}>{roleLabel}</div>
        </div>
      </div>

      <div className="space-y-3">
        {person?.phoneNumber && (
          <a
            href={`tel:${person.phoneNumber}`}
            className={`flex items-center ${textMuted} hover:text-primary transition-colors`}
          >
            <Phone size={16} className="mr-3" />
            <span>{person.phoneNumber}</span>
          </a>
        )}
        {person?.email && (
          <a
            href={`mailto:${person.email}`}
            className={`flex items-center ${textMuted} hover:text-primary transition-colors`}
          >
            <Mail size={16} className="mr-3" />
            <span className="text-sm break-all">{person.email}</span>
          </a>
        )}
      </div>

      {/* Host-only: View Host Profile button */}
      {!isGuest && (
        <Link to={`/host/${booking.host?._id}`} className="mt-4 block">
          <Button variant="outline" className="w-full">
            View Host Profile
          </Button>
        </Link>
      )}

      {/* Guest-only: special requests */}
      {isGuest && booking.specialRequests && (
        <div className={`mt-4 pt-4 border-t ${borderClass}`}>
          <div className={`text-sm ${textSubtle} mb-2 flex items-center`}>
            <MessageSquare size={16} className="mr-2" />
            Special Requests
          </div>
          <div className={`${bodyText} text-sm ${bodyBg} p-3 rounded-md`}>
            {booking.specialRequests}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContactCard;
