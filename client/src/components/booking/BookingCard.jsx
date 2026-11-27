import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  MapPin,
  X,
  Check,
  Star,
  ExternalLink,
  Phone,
  CreditCard,
} from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import { PAYMENT_OPTION, PAYMENT_OPTION_LABELS, CURRENCY, BOOKING_STATUS } from '@/constants/booking';

const formatGuests = (booking) => {
  const count = booking.guests?.adults || booking.guests || 1;
  return `${count} guest${count !== 1 ? 's' : ''}`;
};

const formatPaymentOption = (option) =>
  PAYMENT_OPTION_LABELS[option] ?? PAYMENT_OPTION_LABELS[PAYMENT_OPTION.ARRIVAL];

const BookingCard = ({
  booking,
  index,
  formatDate,
  reviewedBookingIds,
  onCancel,
  onWriteReview,
}) => {
  const reviewed = reviewedBookingIds?.has(booking._id);

  return (
    <motion.div
      key={booking._id || booking.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="p-5 sm:p-6 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Property image */}
        <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
          <img
            src={booking.property?.images?.[0] || booking.propertyImage || '/placeholder.svg'}
            alt={booking.property?.title || 'Property'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 left-2">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <Link
              to={`/properties/${booking.property?._id || booking.propertyId}`}
              className="text-base font-semibold text-gray-900 dark:text-white hover:text-earth-brown dark:hover:text-cream-beige transition-colors leading-snug"
            >
              {booking.property?.title || booking.propertyName || 'Property'}
            </Link>
            <div className="text-right shrink-0">
              <p className="font-bold text-gray-900 dark:text-white text-base">
                {CURRENCY.PREFIX}{booking.totalPrice?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">total</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <MapPin size={11} className="shrink-0" />
            {booking.property?.city && booking.property?.state
              ? `${booking.property.city}, ${booking.property.state}`
              : booking.location || 'Location not specified'}
          </div>

          {/* Date + guests + payment row */}
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                Check-in
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <Calendar size={12} className="text-earth-brown" />
                {formatDate(booking.checkIn)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                Check-out
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <Calendar size={12} className="text-earth-brown" />
                {formatDate(booking.checkOut)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                Guests
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <User size={12} className="text-earth-brown" />
                {formatGuests(booking)}
              </p>
            </div>
            {booking.paymentOption && (
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                  Payment
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <CreditCard size={12} className="text-earth-brown" />
                  {formatPaymentOption(booking.paymentOption)}
                </p>
              </div>
            )}
          </div>

          {/* Host + actions row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Host */}
            <Link
              to={`/host/${booking.host?._id || booking.hostId}`}
              className="flex items-center gap-2.5 group"
            >
              <img
                src={booking.host?.profilePic || booking.host?.profilePicture || '/placeholder.svg'}
                alt={booking.host?.fullName || 'Host'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                onError={(e) => {
                  if (e.target.src !== '/placeholder.svg') e.target.src = '/placeholder.svg';
                }}
              />
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mb-0.5">
                  Hosted by
                </p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-earth-brown transition-colors">
                  {booking.host?.fullName || booking.hostName || 'Host'}
                </p>
              </div>
            </Link>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/bookings/${booking._id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-earth-brown hover:bg-earth-brown/90 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <ExternalLink size={12} /> View Details
              </Link>

              <Link
                to={`/properties/${booking.property?._id || booking.propertyId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-lg text-xs font-medium transition-colors"
              >
                View Property
              </Link>

              {booking.host?.phone && (
                <a
                  href={`tel:${booking.host.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-lg text-xs font-medium transition-colors"
                >
                  <Phone size={12} /> Call Host
                </a>
              )}

              {booking.status === BOOKING_STATUS.UPCOMING && (
                <button
                  onClick={() => onCancel(booking._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-medium transition-colors"
                >
                  <X size={12} /> Cancel
                </button>
              )}

              {booking.status === BOOKING_STATUS.COMPLETED && !reviewed && (
                <button
                  onClick={() => onWriteReview(booking)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-xs font-medium transition-colors"
                >
                  <Star size={12} /> Write Review
                </button>
              )}

              {booking.status === BOOKING_STATUS.COMPLETED && reviewed && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                  <Check size={12} /> Reviewed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
