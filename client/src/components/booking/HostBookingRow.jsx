import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Phone,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STATUS_BADGES } from '@/constants';

const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmed':
      return CheckCircle2;
    case 'pending':
      return Clock;
    case 'cancelled':
      return XCircle;
    case 'completed':
      return CheckCircle2;
    default:
      return Clock;
  }
};

const HostBookingRow = ({
  booking,
  index,
  updateBookingStatus,
  formatDate,
  formatCurrency,
  getTotalGuests,
}) => {
  const statusConfig = STATUS_BADGES[booking.status] ?? STATUS_BADGES.pending;
  const StatusIcon = getStatusIcon(booking.status);

  return (
    <motion.div
      key={booking._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Property image + info */}
        <div className="flex items-start gap-4 flex-1">
          <Link to={`/properties/${booking.property?._id}`} className="flex-shrink-0">
            <img
              src={booking.property?.images?.[0] || '/placeholder.svg'}
              alt={booking.property?.title || 'Property'}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              onError={(e) => {
                e.target.src = '/placeholder.svg';
              }}
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link
                  to={`/properties/${booking.property?._id}`}
                  className="font-semibold text-gray-900 hover:text-earth-brown transition-colors line-clamp-1"
                >
                  {booking.property?.title || 'Property Title'}
                </Link>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin size={12} className="mr-1 text-earth-brown" />
                  <span>{booking.property?.city || 'Location'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={statusConfig.className}>
                  <StatusIcon size={12} className="mr-1" />
                  {statusConfig.label}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/host/bookings/${booking._id}`}
                        className="flex items-center cursor-pointer"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {booking.status === 'pending' && (
                      <>
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        >
                          <CheckCircle2 size={16} className="mr-2" />
                          Accept Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        >
                          <XCircle size={16} className="mr-2" />
                          Decline Booking
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Guest info */}
        <div className="flex items-center gap-4 lg:w-80">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={booking.guest?.profilePic || '/placeholder.svg'}
              alt={booking.guest?.fullName || 'Guest'}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                e.target.src = '/placeholder.svg';
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">
                {booking.guest?.fullName || 'Guest Name'}
              </p>
              {booking.guest?.phoneNumber && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={12} className="mr-1" />
                  <span>{booking.guest.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Users size={12} className="mr-1" />
                <span>{getTotalGuests(booking.guests)} guests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking dates + price */}
        <div className="lg:w-60">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1 text-earth-brown" />
              <span>Check-in: {formatDate(booking.checkIn)}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={12} className="mr-1 text-earth-brown" />
              <span>Check-out: {formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex items-center font-semibold text-gray-900 mt-2">
              <DollarSign size={12} className="mr-1 text-green-600" />
              <span>{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Special requests */}
      {booking.specialRequests && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Special Requests:</strong> {booking.specialRequests}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default HostBookingRow;
