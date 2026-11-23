import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Trash2, Edit3, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardFadeUp } from '@/constants/animations';

const DashboardPropertyCard = ({ property, onDelete }) => {
  const image = property.images?.[0] || property.image || '/placeholder.svg';
  const bookings = property.bookings ?? property.bookingsCount ?? 0;
  const income = property.monthlyIncome ?? property.income ?? 0;
  const isApproved = property.isVerified === true || property.verificationStatus === 'approved';

  return (
    <motion.div
      variants={cardFadeUp}
      initial="hidden"
      animate="visible"
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Approval status */}
        <div className="absolute top-3 left-3">
          {isApproved ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-full">
              <CheckCircle2 size={11} />
              Live
            </span>
          ) : property.verificationStatus === 'rejected' ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-500/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Clock size={11} />
              Rejected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-500/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Clock size={11} />
              Pending
            </span>
          )}
        </div>

        {/* Rating */}
        {property.rating && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full shadow-sm">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {property.rating}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 left-3 text-white">
          <span className="text-lg font-bold drop-shadow">
            Rs {(property.price ?? 0).toLocaleString()}
          </span>
          <span className="text-xs text-white/75 ml-1">/night</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-4">
          <MapPin size={13} className="text-earth-brown shrink-0" />
          {property.city || property.location || '—'}
          {property.state ? `, ${property.state}` : ''}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Bookings</p>
            <p className="font-bold text-gray-900 dark:text-white text-base">{bookings}</p>
          </div>
          <div className="bg-earth-brown/5 dark:bg-earth-brown/10 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Revenue</p>
            <p className="font-bold text-earth-brown text-base">
              Rs {Number(income).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to={`/host/add-listing/${property._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-xl text-xs gap-1.5"
            >
              <Edit3 size={13} />
              Edit
            </Button>
          </Link>
          <Link to={`/properties/${property._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-earth-brown/40 hover:text-earth-brown dark:hover:text-cream-beige rounded-xl text-xs gap-1.5"
            >
              <Eye size={13} />
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl px-2.5"
            onClick={() => onDelete(property)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPropertyCard;
