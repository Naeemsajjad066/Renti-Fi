import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

// Mock data
const mockBookings = [
  {
    id: 1,
    propertyId: 1,
    propertyName: 'Modern Apartment in Downtown',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'New York, NY',
    hostName: 'Sarah Johnson',
    hostImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    checkIn: '2023-09-15',
    checkOut: '2023-09-20',
    guests: 2,
    totalPrice: 600,
    status: 'upcoming',
  },
  {
    id: 2,
    propertyId: 2,
    propertyName: 'Cozy Beach House',
    propertyImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Miami, FL',
    hostName: 'Michael Davis',
    hostImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    checkIn: '2023-08-01',
    checkOut: '2023-08-05',
    guests: 4,
    totalPrice: 800,
    status: 'completed',
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    upcoming: ['bg-blue-100', 'text-blue-800', 'Upcoming', <Clock size={14} className="mr-1" />],
    active: ['bg-green-100', 'text-green-800', 'Active', <Check size={14} className="mr-1" />],
    completed: ['bg-gray-100', 'text-gray-800', 'Completed', <Check size={14} className="mr-1" />],
    cancelled: ['bg-red-100', 'text-red-800', 'Cancelled', <X size={14} className="mr-1" />],
  }[status] || ['bg-gray-100', 'text-gray-800', status, null];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[0]} ${styles[1]}`}>
      {styles[3]}
      {styles[2]}
    </span>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const handleReviewSubmit = () => {
    console.log('Review for Booking ID:', selectedBooking.id);
    console.log('Rating:', rating);
    console.log('Review:', reviewText);

    // Mark booking as reviewed
    setReviewedBookings(prev => [...prev, selectedBooking.id]);

    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(0);
    setReviewText('');

    // Show success message
    setSuccessMessage('Review submitted!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };


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
                      <motion.div key={booking.id} className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col md:flex-row">
                          <div className="mb-4 md:mb-0 md:mr-6">
                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                              <img src={booking.propertyImage} alt={booking.propertyName} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2">
                                <StatusBadge status={booking.status} />
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                              <div>
                                <Link to={`/property/${booking.propertyId}`} className="text-xl font-semibold hover:text-primary">
                                  {booking.propertyName}
                                </Link>
                                <div className="flex items-center mt-1 text-gray-600 text-sm">
                                  <MapPin size={14} className="mr-1" />
                                  {booking.location}
                                </div>
                              </div>
                              <div className="mt-3 md:mt-0 text-right">
                                <div className="text-xl font-semibold">${booking.totalPrice}</div>
                                <div className="text-sm text-gray-600">Total</div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div><div className="text-sm text-gray-500">Check-in</div><div className="font-medium"><Calendar size={14} className="mr-1 inline" /> {formatDate(booking.checkIn)}</div></div>
                              <div><div className="text-sm text-gray-500">Check-out</div><div className="font-medium"><Calendar size={14} className="mr-1 inline" /> {formatDate(booking.checkOut)}</div></div>
                              <div><div className="text-sm text-gray-500">Guests</div><div className="font-medium"><User size={14} className="mr-1 inline" /> {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</div></div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                              <div className="flex items-center">
                                <img src={booking.hostImage} alt={booking.hostName} className="w-8 h-8 rounded-full object-cover mr-2" />
                                <div><div className="text-sm text-gray-500">Host</div><div className="font-medium">{booking.hostName}</div></div>
                              </div>
                              <div className="space-x-2">
                                {booking.status === 'upcoming' && (
                                  <button className="text-red-600 hover:text-red-800 text-sm">Cancel Booking</button>
                                )}
{booking.status === 'completed' && !reviewedBookings.includes(booking.id) ? (
  <>
    <button
      onClick={() => {
        setSelectedBooking(booking);
        setShowReviewModal(true);
      }}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
    >
      Give Review
    </button>
    <Link
      to={`/property/${booking.propertyId}`}
      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm"
    >
      Book Again
    </Link>
  </>
) : booking.status === 'completed' && reviewedBookings.includes(booking.id) ? (
  <div className="text-sm text-green-600 font-medium">Review submitted ✅</div>
) : null}

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

        {showReviewModal && (
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
                <button onClick={() => setShowReviewModal(false)} className="text-gray-600 hover:underline">
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
