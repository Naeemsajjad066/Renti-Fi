import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, UserCircle2, ArrowRight } from 'lucide-react';

const ContactCard = ({ booking, variant, dark: _dark = true }) => {
  const isGuest = variant === 'guest';
  const person = isGuest ? booking.guest : booking.host;
  const roleLabel = isGuest ? 'Booking Guest' : 'Property Host';
  const title = isGuest ? 'Guest Information' : 'Host Contact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <UserCircle2 size={17} className="text-teal" />
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>

      <div className="p-5">
        {/* Avatar row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <img
              src={person?.profilePic || '/placeholder.svg'}
              alt={person?.fullName || roleLabel}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-teal/20"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white dark:border-gray-800" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white leading-tight">
              {person?.fullName || roleLabel}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{roleLabel}</p>
          </div>
        </div>

        {/* Contact links */}
        <div className="space-y-2">
          {person?.phoneNumber && (
            <a
              href={`tel:${person.phoneNumber}`}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-teal/8 dark:hover:bg-teal/15 hover:text-teal dark:hover:text-teal transition-colors text-sm"
            >
              <Phone size={14} className="text-teal shrink-0" />
              {person.phoneNumber}
            </a>
          )}
          {person?.email && (
            <a
              href={`mailto:${person.email}`}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-teal/8 dark:hover:bg-teal/15 hover:text-teal dark:hover:text-teal transition-colors text-sm"
            >
              <Mail size={14} className="text-teal shrink-0" />
              <span className="truncate">{person.email}</span>
            </a>
          )}
        </div>

        {/* View host profile (guest view) */}
        {!isGuest && booking.host?._id && (
          <Link
            to={`/host/${booking.host._id}`}
            className="mt-4 flex items-center justify-between w-full px-4 py-3 rounded-xl border border-teal/25 text-teal hover:bg-teal/8 dark:hover:bg-teal/15 transition-colors text-sm font-medium"
          >
            View Host Profile
            <ArrowRight size={14} />
          </Link>
        )}

        {/* Special requests (host view) */}
        {isGuest && booking.specialRequests && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              <MessageSquare size={12} />
              Special Requests
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 leading-relaxed">
              {booking.specialRequests}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactCard;
