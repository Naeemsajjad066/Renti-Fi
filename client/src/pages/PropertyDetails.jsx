
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PropertyContext } from '../contexts/PropertyContext';
import { useBooking } from '../contexts/BookingContext';
import OptimizedImage from '../components/OptimizedImage';
import { useImagePreloader } from '../hooks/useImagePreloader';
import ReviewList from '../components/ReviewList';
import { 
  MapPin, 
  Wifi, 
  Home, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Users,
  Tv,
  Coffee,
  Wind,
  Snowflake,
  Bath,
  Car,
  Utensils,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';

// Default amenities mapping for display
const amenityIcons = {
  'wifi': Wifi,
  'tv': Tv,
  'television': Tv,
  'kitchen': Utensils,
  'coffee': Coffee,
  'coffee maker': Coffee,
  'air conditioning': Wind,
  'ac': Wind,
  'heating': Snowflake,
  'washer': Bath,
  'washing machine': Bath,
  'parking': Car,
  'free parking': Car,
  'pool': Bath,
  'gym': Bath,
  'wifi': Wifi,
  'internet': Wifi
};

// Function to get icon for amenity
const getAmenityIcon = (amenity) => {
  const amenityLower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (amenityLower.includes(key)) {
      return icon;
    }
  }
  return ShieldCheck; // Default icon
};

const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { loadedImages, isLoading } = useImagePreloader(images);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextModal = () => {
    setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handlePrevModal = () => {
    setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  // Keyboard navigation and body scroll management for modal
  useEffect(() => {
    if (!showAllPhotos) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setShowAllPhotos(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevModal();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextModal();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [showAllPhotos, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <OptimizedImage 
            src="/placeholder.svg" 
            alt="No image available" 
            className="w-full h-full object-cover" 
            priority="high"
          />
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-xl group">
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <OptimizedImage
            src={images[0]}
            alt="Property image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            priority="high"
            placeholder="/placeholder.svg"
            fallback="/placeholder.svg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
    );
  }

  // Modern grid layout for multiple images
  return (
    <div className="relative">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden shadow-xl">
        {/* Main large image */}
        <div 
          className="col-span-2 row-span-2 relative group cursor-pointer" 
          onClick={() => {
            setSelectedImageIndex(0);
            setShowAllPhotos(true);
          }}
        >
          <OptimizedImage
            src={images[0]}
            alt="Property main image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            priority="high"
            placeholder="/placeholder.svg"
            fallback="/placeholder.svg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        </div>
        
        {/* Secondary images */}
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index} 
            className="relative group cursor-pointer" 
            onClick={() => {
              setSelectedImageIndex(index + 1);
              setShowAllPhotos(true);
            }}
          >
            <OptimizedImage
              src={image}
              alt={`Property image ${index + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              placeholder="/placeholder.svg"
              fallback="/placeholder.svg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            {/* Show more overlay on last image */}
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show all photos button */}
      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl font-medium hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Show all {images.length} photos
      </button>

      {/* Modal for all photos */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 text-white">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">
                  {selectedImageIndex + 1} / {images.length}
                </h3>
              </div>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all text-2xl"
              >
                ×
              </button>
            </div>

            {/* Main image viewer */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="relative max-w-5xl max-h-full">
                <OptimizedImage
                  src={images[selectedImageIndex]}
                  alt={`Property image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevModal}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextModal}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="p-6">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      index === selectedImageIndex 
                        ? 'ring-3 ring-white ring-opacity-70 opacity-100' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Close on backdrop click */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setShowAllPhotos(false)}
          />
        </div>
      )}
    </div>
  );
};

const BookingForm = ({ property }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Use booking context
  const { createBooking, loading: isLoading } = useBooking();

  // Get today's date in YYYY-MM-DD format for min date restriction
  const today = new Date().toISOString().split('T')[0];

  // Calculate pricing dynamically
  useEffect(() => {
    if (checkIn && checkOut && property) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        const basePrice = property.price * nights;
        const cleaningFee = Math.round(basePrice * 0.1);
        const serviceFee = Math.round(basePrice * 0.05);
        const taxes = Math.round((basePrice + cleaningFee + serviceFee) * 0.12);
        const totalPrice = basePrice + cleaningFee + serviceFee + taxes;
        
        setPricing({
          nights,
          basePrice,
          cleaningFee,
          serviceFee,
          taxes,
          totalPrice
        });

        // Check availability
        checkPropertyAvailability();
      } else {
        setPricing(null);
      }
    }
  }, [checkIn, checkOut, property]);

  const checkPropertyAvailability = async () => {
    if (!property?._id || !checkIn || !checkOut) {
      setIsAvailable(true);
      return;
    }
    
    // Basic date validation first
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today || checkOutDate <= checkInDate) {
      setIsAvailable(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // If no token, assume available (user not logged in)
      if (!token) {
        // No auth token, assuming available
        setIsAvailable(true);
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/bookings/availability/${property._id}?checkIn=${checkIn}&checkOut=${checkOut}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // If API fails, default to available
        // Availability check failed
        setIsAvailable(true);
        return;
      }
      
      const data = await response.json();
      // Process availability response
      setIsAvailable(data.success ? data.available : true);
    } catch (error) {
      // Handle availability check error
      // Default to available if there's an error
      setIsAvailable(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to make a booking');
      return;
    }

    const bookingData = {
      propertyId: property._id,
      checkIn,
      checkOut,
      guests: {
        adults: guests,
        children: 0,
        infants: 0
      }
    };

    const result = await createBooking(bookingData);
    
    if (result.success) {
      setBookingDetails(result.booking);
      setShowSuccess(true);
      // Reset form
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setPricing(null);
    }
  };

  if (!property) return null;

  // Success Modal
  if (showSuccess && bookingDetails) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 mb-6">
            Your reservation has been successfully created.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Check-in:</span> {new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
              <p><span className="font-medium">Check-out:</span> {new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
              <p><span className="font-medium">Guests:</span> {bookingDetails.guests.adults}</p>
              <p><span className="font-medium">Total:</span> Rs {bookingDetails.totalPrice.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/bookings'} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              View My Bookings
            </Button>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Book Another Stay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">Rs {property.price?.toLocaleString()}</span>
            <span className="text-gray-500 text-lg">/night</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Plus taxes and fees</p>
        </div>
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl">
          <Star size={16} className="text-amber-400 mr-1 fill-current" />
          <span className="font-semibold text-gray-900">{property.rating || 4.5}</span>
          <span className="text-gray-500 ml-1 text-sm">({property.totalReviews || 0})</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
          <div className="grid grid-cols-2">
            <div className="p-4 border-r border-gray-200">
              <label htmlFor="checkIn" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Check In
              </label>
              <input
                id="checkIn"
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-lg font-medium text-gray-900 bg-transparent border-none outline-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                required
              />
            </div>
            <div className="p-4">
              <label htmlFor="checkOut" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Check Out
              </label>
              <input
                id="checkOut"
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-lg font-medium text-gray-900 bg-transparent border-none outline-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors relative">
          <label htmlFor="guests" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-lg font-medium text-gray-900 bg-transparent border-none outline-none appearance-none cursor-pointer pr-8"
          >
            {[...Array(property.maxGuests || 4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
          <Users size={20} className="absolute right-4 top-8 text-gray-400 pointer-events-none" />
        </div>

        {!isAvailable && checkIn && checkOut && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <div>
                <p className="text-red-800 font-medium text-sm">Not Available</p>
                <p className="text-red-600 text-sm mt-1">
                  Property is not available for selected dates. Please choose different dates.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.button
          type="submit"
          disabled={isLoading || !isAvailable || !checkIn || !checkOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
              />
              Processing...
            </>
          ) : (
            <>
              <Calendar size={20} className="mr-2" />
              Reserve Now
            </>
          )}
        </motion.button>
        
        <p className="text-center text-sm text-gray-500">
          You won't be charged yet
        </p>
      </form>
      
      {pricing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-50 rounded-xl p-4"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Price breakdown</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600 flex items-center">
                Rs {property.price?.toLocaleString()} × {pricing.nights} {pricing.nights === 1 ? 'night' : 'nights'}
              </span>
              <span className="font-medium">Rs {pricing.basePrice?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="font-medium">Rs {pricing.cleaningFee?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Service fee</span>
              <span className="font-medium">Rs {pricing.serviceFee?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Taxes & fees</span>
              <span className="font-medium">Rs {pricing.taxes?.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">Rs {pricing.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const PropertyDetails = () => {
  const { id } = useParams();
  const { selectedProperty, fetchPropertyById, loading } = useContext(PropertyContext);
  
  useEffect(() => {
    if (id) {
      fetchPropertyById(id);
    }
  }, [id, fetchPropertyById]);

  // Preload property images when property data is available
  useEffect(() => {
    if (selectedProperty?.images?.length > 0) {
      selectedProperty.images.forEach(imageSrc => {
        const img = new Image();
        img.fetchPriority = 'high';
        img.src = imageSrc;
      });
    }
  }, [selectedProperty]);

  const property = selectedProperty;


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-8 w-full max-w-6xl p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!loading && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-20 bg-gradient-to-b from-white to-gray-50">
          <div className="page-container py-8">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-all duration-300 hover:bg-gray-100 px-3 py-2 rounded-lg mb-6">
                  <ChevronLeft size={18} className="mr-1" />
                  <span className="font-medium">Back to listings</span>
                </Link>
                
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {property.title || property.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                      <MapPin size={18} className="text-primary mr-2" />
                      <span className="font-medium">
                        {property.city && property.state 
                          ? `${property.city}, ${property.state}` 
                          : property.location || property.address}
                      </span>
                    </div>
                    <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
                      <Star size={16} className="text-amber-400 mr-1 fill-current" />
                      <span className="font-semibold text-gray-900">{property.rating || 4.5}</span>
                      <span className="text-gray-600 ml-1">({property.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-2" />
                      <span>Up to {property.maxGuests || 4} guests</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <ImageGallery images={property.images} />
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  {/* Host info section with modern design */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          Hosted by {property.host?.name || property.host?.fullName || 'Host'}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                            <Home size={16} className="mr-2 text-primary" />
                            <span className="font-medium">{property.bedrooms || property.beds} beds</span>
                          </div>
                          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                            <Bath size={16} className="mr-2 text-primary" />
                            <span className="font-medium">{property.bathrooms || property.baths} bath</span>
                          </div>
                          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                            <Users size={16} className="mr-2 text-primary" />
                            <span className="font-medium">Up to {property.maxGuests} guests</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/host/${property.host?._id || property.host}`} className="flex-shrink-0 ml-6">
                        <div className="relative group">
                          <img
                            src={property.host?.profilePic || property.host?.image || '/placeholder.svg'}
                            alt={property.host?.name || property.host?.fullName || 'Host'}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-primary/20 transition-all duration-300 shadow-md"
                            onError={(e) => {
                              e.target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                  
                  {/* Description section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About this place</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {property.description}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Amenities section */}
                  {property.amenities && property.amenities.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {property.amenities.map((amenity, index) => {
                          const IconComponent = getAmenityIcon(amenity);
                          return (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                                <IconComponent size={20} className="text-primary" />
                              </div>
                              <span className="font-medium text-gray-900">{amenity}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Location section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Where you'll be</h2>
                      {property.isLocationVerified && (
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-800 font-medium">
                          <CheckCircle size={16} className="mr-2" />
                          Verified Location
                        </div>
                      )}
                    </div>
                    
                    <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner">
                      <iframe
                        className="w-full h-full"
                        src={
                          property.latitude && property.longitude
                            ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&z=15`
                            : `https://maps.google.com/maps?q=${encodeURIComponent(
                                property.city && property.state 
                                  ? `${property.city}, ${property.state}` 
                                  : property.location || property.address
                              )}&output=embed`
                        }
                        allowFullScreen
                        style={{ border: 'none' }}
                      />
                      
                      {/* Get Route Button */}
                      {property.latitude && property.longitude && (
                        <div className="absolute bottom-4 right-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
                              window.open(googleMapsUrl, '_blank');
                            }}
                            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                          >
                            <MapPin size={16} className="mr-2 text-primary" />
                            Get Directions
                          </motion.button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.city && property.state 
                              ? `${property.city}, ${property.state}${property.country ? `, ${property.country}` : ''}` 
                              : property.address}
                          </p>
                          
                          {property.isLocationVerified ? (
                            <div className="mt-2 flex items-start gap-2">
                              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-green-600 font-medium">
                                  Location verified by host
                                </p>
                                {property.locationCapturedAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Verified on {new Date(property.locationCapturedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">
                              Exact location will be provided after booking confirmation
                            </p>
                          )}
                          
                          {property.locationAccuracy && property.locationAccuracy < 50 && (
                            <p className="text-xs text-gray-400 mt-1">
                              Location accuracy: ±{property.locationAccuracy.toFixed(1)}m
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Reviews section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-8"
                  >
                    <ReviewList propertyId={property._id} />
                  </motion.div>
                  
                  {/* Host details section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet your host</h2>
                    <Link to={`/host/${property.host?._id || property.host}`} className="block group">
                      <div className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300">
                        <div className="relative">
                          <img
                            src={property.host?.profilePic || property.host?.image || '/placeholder.svg'}
                            alt={property.host?.name || property.host?.fullName || 'Host'}
                            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                            <ShieldCheck size={14} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {property.host?.name || property.host?.fullName || 'Host'}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Host since {property.host?.createdAt ? new Date(property.host.createdAt).getFullYear() : 'Recently'}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center bg-white/80 px-3 py-2 rounded-xl">
                              <Star size={16} className="text-amber-400 mr-2 fill-current" />
                              <span className="font-semibold text-gray-900">{property.host?.rating || 4.5}</span>
                              <span className="text-gray-600 ml-1">rating</span>
                            </div>
                            <div className="flex items-center bg-green-100 px-3 py-2 rounded-xl">
                              <ShieldCheck size={16} className="text-green-600 mr-2" />
                              <span className="font-medium text-green-700">Verified Host</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
                
                <div className="lg:col-span-1">
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="sticky top-24"
                  >
                    <BookingForm property={property} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PropertyDetails;
