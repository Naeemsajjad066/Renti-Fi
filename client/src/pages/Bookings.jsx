import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  MapPin,
  X,
  Check,
  Clock,
  Star,
  ExternalLink,
  MessageSquare,
  Phone
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { useBooking } from '../contexts/BookingContext';

const StatusBadge = ({ status, getStatusBadge }) => {
  const statusConfig = getStatusBadge(status);
  const icons = {
    upcoming: <Clock size={14} className="mr-1" />,
    active: <Check size={14} className="mr-1" />,
    completed: <Check size={14} className="mr-1" />,
    cancelled: <X size={14} className="mr-1" />,
    confirmed: <Check size={14} className="mr-1" />,
    pending: <Clock size={14} className="mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
      {icons[status]}
      {statusConfig.label}
    </span>
  );
};

const Bookings = () => {
  // Use the booking context
  const {
    loading: isLoading,
    error,
    activeTab,
    setActiveTab,
    showReviewModal,
    setShowReviewModal,
    reviewText,
    setReviewText,
    rating,
    setRating,
    reviewedBookings,
    setReviewedBookings,
    cancelBooking,
    submitReview,
    getStatusFromDates,
    formatDate,
    getStatusBadge,
    getBookingsByTab
  } = useBooking();

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      // Using context's toast handling
      return;
    }

    if (!showReviewModal?.selectedBooking) return;

    const reviewData = {
      rating,
      review: reviewText,
      propertyId: showReviewModal.selectedBooking.property?._id,
      hostId: showReviewModal.selectedBooking.host?._id
    };

    await submitReview(showReviewModal.selectedBooking._id, reviewData);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    await cancelBooking(bookingId);
  };

  const filteredBookings = getBookingsByTab(activeTab);


  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow pt-20">
          <div className="page-container py-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex border-b">
                  {['all', 'upcoming', 'active', 'completed', 'cancelled'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 text-sm font-medium border-b-2 ${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="p-6 animate-pulse">Loading...</div>
                ) : filteredBookings.length > 0 ? (
                  <div className="divide-y">
                    {filteredBookings.map(booking => (
                      <motion.div key={booking._id || booking.id} className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col md:flex-row">
                          <div className="mb-4 md:mb-0 md:mr-6">
                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                              <img 
                                src={booking.property?.images?.[0] || booking.propertyImage || '/placeholder.svg'} 
                                alt={booking.property?.title || booking.propertyName || 'Property'} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/placeholder.svg'; }}
                              />
                              <div className="absolute top-2 right-2">
                                <StatusBadge status={booking.status} getStatusBadge={getStatusBadge} />
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                              <div>
                                <Link 
                                  to={`/properties/${booking.property?._id || booking.propertyId}`} 
                                  className="text-xl font-semibold hover:text-primary transition-colors"
                                >
                                  {booking.property?.title || booking.propertyName || 'Property'}
                                </Link>
                                <div className="flex items-center mt-1 text-gray-600 text-sm">
                                  <MapPin size={14} className="mr-1" />
                                  {booking.property?.city && booking.property?.state 
                                    ? `${booking.property.city}, ${booking.property.state}`
                                    : booking.location || 'Location not specified'}
                                </div>
                              </div>
                              <div className="mt-3 md:mt-0 text-right">
                                <div className="text-xl font-semibold">Rs {booking.totalPrice?.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Total</div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Check-in</div>
                                <div className="font-medium">
                                  <Calendar size={14} className="mr-1 inline" /> 
                                  {formatDate(booking.checkIn)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Check-out</div>
                                <div className="font-medium">
                                  <Calendar size={14} className="mr-1 inline" /> 
                                  {formatDate(booking.checkOut)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Guests</div>
                                <div className="font-medium">
                                  <User size={14} className="mr-1 inline" /> 
                                  {booking.guests?.adults || booking.guests || 1} {(booking.guests?.adults || booking.guests || 1) === 1 ? 'Guest' : 'Guests'}
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center">
                                <Link 
                                  to={`/host/${booking.host?._id || booking.hostId}`}
                                  className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                  <img 
                                    src={booking.host?.profilePic || booking.host?.profilePicture || booking.host?.image || booking.hostImage || '/placeholder.svg'} 
                                    alt={booking.host?.fullName || booking.hostName || 'Host'} 
                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                    onError={(e) => {
                                      console.log('Host image failed to load:', e.target.src);
                                      console.log('Host data:', booking.host);
                                      if (e.target.src !== '/placeholder.svg') {
                                        e.target.src = '/placeholder.svg';
                                      }
                                    }}
                                  />
                                  <div>
                                    <div className="text-sm text-gray-500">Host</div>
                                    <div className="font-medium hover:text-primary transition-colors">
                                      {booking.host?.fullName || booking.hostName || 'Host'}
                                    </div>
                                  </div>
                                </Link>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {/* View Property Button */}
                                <Link
                                  to={`/properties/${booking.property?._id || booking.propertyId}`}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                                >
                                  <ExternalLink size={14} className="mr-1" />
                                  View Property
                                </Link>

                                {/* Contact Host Button */}
                                {booking.host?.phone && (
                                  <a
                                    href={`tel:${booking.host.phone}`}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                                  >
                                    <Phone size={14} className="mr-1" />
                                    Call Host
                                  </a>
                                )}

                                {/* Status-specific Actions */}
                                {booking.status === 'upcoming' && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="text-sm"
                                  >
                                    Cancel Booking
                                  </Button>
                                )}

                                {booking.status === 'completed' && !reviewedBookings.includes(booking._id) && (
                                  <>
                                    <Button
                                      onClick={() => {
                                        setShowReviewModal({ show: true, selectedBooking: booking });
                                      }}
                                      className="text-sm bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Star size={14} className="mr-1" />
                                      Give Review
                                    </Button>
                                    <Link
                                      to={`/properties/${booking.property?._id || booking.propertyId}`}
                                      className="inline-flex items-center px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm transition-colors"
                                    >
                                      Book Again
                                    </Link>
                                  </>
                                )}

                                {booking.status === 'completed' && reviewedBookings.includes(booking._id) && (
                                  <div className="inline-flex items-center text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-md">
                                    <Check size={14} className="mr-1" />
                                    Review submitted
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-600">No bookings found.</div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {showReviewModal?.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows="4"
                placeholder="Write your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer mr-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowReviewModal({ show: false, selectedBooking: null })} className="text-gray-600 hover:underline">
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Bookings;
