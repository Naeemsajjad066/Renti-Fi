import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CreditCard,
  Users,
  Home,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  User,
  MessageSquare
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import HostSidebar from '@/components/HostSidebar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';
import toast from 'react-hot-toast';

const HostBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/bookings/${id}`);
      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error(error.response?.data?.message || 'Failed to load booking details');
      navigate('/host/bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      reserved: { label: 'Reserved', className: 'bg-blue-100 text-blue-800', icon: Clock },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'checked-in': { label: 'Checked In', className: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      completed: { label: 'Completed', className: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800', icon: XCircle },
      expired: { label: 'Expired', className: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    };
    return badges[status] || badges.reserved;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      partial: { label: 'Partially Paid', className: 'bg-blue-100 text-blue-800' },
      paid: { label: 'Fully Paid', className: 'bg-green-100 text-green-800' },
      refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex bg-gray-50">
          <HostSidebar
            isMobile={isMobile}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!booking) {
    return (
      <PageTransition>
        <div className="min-h-screen flex bg-gray-50">
          <HostSidebar
            isMobile={isMobile}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Booking not found</p>
              <Button onClick={() => navigate('/host/bookings')}>
                Back to Bookings
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const statusBadge = getStatusBadge(booking.status);
  const paymentBadge = getPaymentStatusBadge(booking.paymentStatus);
  const StatusIcon = statusBadge.icon;

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-gray-50">
        <HostSidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        <div className="flex-1 overflow-auto">
          <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Booking Details
                </h1>
                <div className="flex gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}>
                    <StatusIcon size={16} className="mr-1" />
                    {statusBadge.label}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentBadge.className}`}>
                    {paymentBadge.label}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">
                Booking ID: <span className="font-mono">{booking._id}</span>
              </p>
              {booking.verificationCode && (
                <div className="mt-4 inline-flex items-center bg-green-50 border-2 border-green-500 rounded-lg px-6 py-3">
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <div>
                    <div className="text-sm text-gray-600 font-medium">Guest Verification Code</div>
                    <div className="text-3xl font-bold text-green-600 tracking-wider">{booking.verificationCode}</div>
                    <div className="text-xs text-gray-500 mt-1">Ask guest to show this code at check-in</div>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Property Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-64">
                    <img
                      src={booking.property?.images?.[0] || '/placeholder.svg'}
                      alt={booking.property?.title || 'Property'}
                      className="w-full h-full object-cover"
                    />
                    <Link
                      to={`/properties/${booking.property?._id}`}
                      className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors inline-flex items-center"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Property
                    </Link>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {booking.property?.title || 'Property'}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={16} className="mr-2" />
                      <span>{booking.property?.address}, {booking.property?.city}, {booking.property?.state}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Home size={16} className="mr-2" />
                      <span>{booking.property?.propertyType} • {booking.property?.bedrooms} Bedrooms • {booking.property?.bathrooms} Bathrooms</span>
                    </div>
                  </div>
                </motion.div>

                {/* Map Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin size={20} className="mr-2" />
                    Location
                  </h3>
                  {booking.property?.latitude && booking.property?.longitude ? (
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${booking.property.latitude},${booking.property.longitude}&output=embed`}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p>{booking.property?.address}</p>
                      <p>{booking.property?.city}, {booking.property?.state} {booking.property?.zipCode}</p>
                      <p>{booking.property?.country}</p>
                    </div>
                  )}
                </motion.div>

                {/* Check-in/Check-out Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar size={20} className="mr-2" />
                    Stay Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Check-in</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {checkInDate.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Clock size={14} className="mr-1" />
                        <span className="text-sm">9:00 AM onwards</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Check-out</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {checkOutDate.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Clock size={14} className="mr-1" />
                        <span className="text-sm">Before 9:00 AM</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total nights</span>
                      <span className="font-semibold text-gray-900">{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 flex items-center">
                        <Users size={16} className="mr-2" />
                        Guests
                      </span>
                      <span className="font-semibold text-gray-900">
                        {booking.guests.adults} {booking.guests.adults === 1 ? 'Adult' : 'Adults'}
                        {booking.guests.children > 0 && `, ${booking.guests.children} ${booking.guests.children === 1 ? 'Child' : 'Children'}`}
                        {booking.guests.infants > 0 && `, ${booking.guests.infants} ${booking.guests.infants === 1 ? 'Infant' : 'Infants'}`}
                        {booking.guests.pets > 0 && `, ${booking.guests.pets} ${booking.guests.pets === 1 ? 'Pet' : 'Pets'}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* Guest Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <User size={20} className="mr-2" />
                      Guest Information
                    </h3>
                    <div className="flex items-center mb-4">
                      <img
                        src={booking.guest?.profilePic || '/placeholder.svg'}
                        alt={booking.guest?.fullName || 'Guest'}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {booking.guest?.fullName || 'Guest'}
                        </div>
                        <div className="text-sm text-gray-500">Booking Guest</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {booking.guest?.phoneNumber && (
                        <a
                          href={`tel:${booking.guest.phoneNumber}`}
                          className="flex items-center text-gray-600 hover:text-primary transition-colors"
                        >
                          <Phone size={16} className="mr-3" />
                          <span>{booking.guest.phoneNumber}</span>
                        </a>
                      )}
                      {booking.guest?.email && (
                        <a
                          href={`mailto:${booking.guest.email}`}
                          className="flex items-center text-gray-600 hover:text-primary transition-colors"
                        >
                          <Mail size={16} className="mr-3" />
                          <span className="text-sm break-all">{booking.guest.email}</span>
                        </a>
                      )}
                    </div>
                    {booking.specialRequests && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500 mb-2 flex items-center">
                          <MessageSquare size={16} className="mr-2" />
                          Special Requests
                        </div>
                        <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">
                          {booking.specialRequests}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Payment Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign size={20} className="mr-2" />
                      Payment Summary
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Base price ({booking.nights} nights)</span>
                        <span>Rs {booking.basePrice.toLocaleString()}</span>
                      </div>
                      {booking.cleaningFee > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Cleaning fee</span>
                          <span>Rs {booking.cleaningFee.toLocaleString()}</span>
                        </div>
                      )}
                      {booking.serviceFee > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Service fee</span>
                          <span>Rs {booking.serviceFee.toLocaleString()}</span>
                        </div>
                      )}
                      {booking.taxes > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Taxes</span>
                          <span>Rs {booking.taxes.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 mb-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>Rs {booking.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Host Payout Information */}
                    {booking.hostPayout > 0 && (
                      <div className="pt-4 border-t border-gray-200 mb-4">
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Platform Fee (5%)</span>
                          <span>Rs {booking.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-green-600">
                          <span>Your Payout</span>
                          <span>Rs {booking.hostPayout.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {/* Payment Details */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <CreditCard size={16} className="mr-2" />
                        <span className="font-medium">Payment Option: {booking.paymentOption === 'early' ? 'Early Payment' : 'Payment on Arrival'}</span>
                      </div>

                      {booking.paymentOption === 'early' && booking.paymentBreakdown && (
                        <>
                          <div className={`flex justify-between items-center ${booking.paymentBreakdown.upfrontPaid ? 'text-green-600' : 'text-gray-600'}`}>
                            <span className="flex items-center text-sm">
                              {booking.paymentBreakdown.upfrontPaid && <CheckCircle size={16} className="mr-2" />}
                              Upfront (40%)
                            </span>
                            <span className="font-semibold">Rs {booking.paymentBreakdown.upfrontAmount.toLocaleString()}</span>
                          </div>
                          {booking.paymentBreakdown.upfrontPaid && booking.paymentBreakdown.upfrontPaidAt && (
                            <div className="text-xs text-gray-500 ml-6">
                              Paid on {new Date(booking.paymentBreakdown.upfrontPaidAt).toLocaleDateString()}
                            </div>
                          )}
                          <div className={`flex justify-between items-center ${booking.paymentBreakdown.arrivalPaid ? 'text-green-600' : 'text-orange-600'}`}>
                            <span className="flex items-center text-sm">
                              {booking.paymentBreakdown.arrivalPaid ? <CheckCircle size={16} className="mr-2" /> : <Clock size={16} className="mr-2" />}
                              On Arrival (60%)
                            </span>
                            <span className="font-semibold">Rs {booking.paymentBreakdown.arrivalAmount.toLocaleString()}</span>
                          </div>
                          {!booking.paymentBreakdown.arrivalPaid && booking.status !== 'cancelled' && (
                            <div className="text-xs text-orange-600 ml-6">
                              To be collected at property
                            </div>
                          )}
                        </>
                      )}

                      {booking.paymentOption === 'arrival' && (
                        <div className={`flex justify-between items-center ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                          <span className="flex items-center text-sm">
                            {booking.paymentStatus === 'paid' ? <CheckCircle size={16} className="mr-2" /> : <Clock size={16} className="mr-2" />}
                            Full Payment on Arrival
                          </span>
                          <span className="font-semibold">Rs {booking.totalPrice.toLocaleString()}</span>
                        </div>
                      )}

                      {booking.refundAmount > 0 && (
                        <div className="flex justify-between items-center text-blue-600 pt-3 border-t border-gray-200">
                          <span className="text-sm">Refunded</span>
                          <span className="font-semibold">Rs {booking.refundAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Back to Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <Button
                variant="outline"
                onClick={() => navigate('/host/bookings')}
              >
                Back to All Bookings
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HostBookingDetails;
