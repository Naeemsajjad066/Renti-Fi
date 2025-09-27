
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PropertyContext } from '../contexts/PropertyContext';
import OptimizedImage from '../components/OptimizedImage';
import { useImagePreloader } from '../hooks/useImagePreloader';
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
  const { loadedImages, isLoading } = useImagePreloader(images);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-[16/9] overflow-hidden bg-gray-200 flex items-center justify-center">
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

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <OptimizedImage
            src={images[activeIndex]}
            alt={`Property image ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            priority="high"
            placeholder="/placeholder.svg"
            fallback="/placeholder.svg"
          />
        </motion.div>
      </div>
      
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === activeIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const BookingForm = ({ property }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ propertyId: property._id, checkIn, checkOut, guests });
    // Here you would typically send the booking request to your backend
  };

  if (!property) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-semibold">Rs {property.price}</span>
          <span className="text-gray-600">/night</span>
        </div>
        <div className="flex items-center">
          <Star size={16} className="text-primary mr-1" />
          <span className="font-medium">{property.rating || 4.5}</span>
          <span className="text-gray-600 ml-1">({property.totalReviews || 0} reviews)</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
              Check In
            </label>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
              Check Out
            </label>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            {[...Array(property.maxGuests || 4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
        >
          Book Now
        </button>
      </form>
      
      <div className="mt-6">
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-gray-600">Rs {property.price} x 5 nights</span>
          <span>Rs {property.price * 5}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-gray-600">Cleaning fee</span>
          <span>Rs 5,000</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-gray-600">Service fee</span>
          <span>Rs 3,000</span>
        </div>
        <div className="flex items-center justify-between py-4 font-semibold">
          <span>Total</span>
          <span>Rs {property.price * 5 + 8000}</span>
        </div>
      </div>
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
        
        <main className="flex-grow pt-20">
          <div className="page-container py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
                  <ChevronLeft size={16} className="mr-1" />
                  <span>Back to listings</span>
                </Link>
              </div>
              
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                {property.title || property.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <MapPin size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">
                    {property.city && property.state 
                      ? `${property.city}, ${property.state}` 
                      : property.location || property.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-primary mr-1" />
                  <span className="font-medium">{property.rating || 4.5}</span>
                  <span className="text-gray-600 ml-1">({property.totalReviews || 0} reviews)</span>
                </div>
              </div>
              
              <div className="mb-8 "   >
                <ImageGallery images={property.images} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between pb-6 mb-6 border-b">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Hosted by {property.host?.name || property.host?.fullName || 'Host'}
                      </h2>
                      <div className="flex items-center mt-1">
                        <span className="text-gray-600 mr-2">
                          {property.bedrooms || property.beds} beds · {property.bathrooms || property.baths} bath · Up to {property.maxGuests} guests
                        </span>
                      </div>
                    </div>
                    <Link to={"/"} className="flex-shrink-0">
                      <img
                        src={property.host?.profilePicture || property.host?.image || '/placeholder.svg'}
                        alt={property.host?.name || property.host?.fullName || 'Host'}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                    </Link>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">About this place</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                  
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {property.amenities.map((amenity, index) => {
                          const IconComponent = getAmenityIcon(amenity);
                          return (
                            <div key={index} className="flex items-center">
                              <IconComponent size={20} className="text-gray-700 mr-3" />
                              <span>{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Location</h2>
                    
                    {/* Location verification badge */}
                    {property.isLocationVerified && (
                      <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle size={12} className="mr-1" />
                        Location Verified
                      </div>
                    )}
                    
                    <div className="h-64 bg-gray-200 rounded-lg relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <iframe
                          className="w-full h-64 rounded-lg"
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
                        />
                      </div>
                      
                      {/* Get Route Button */}
                      {property.latitude && property.longitude && (
                        <div className="absolute bottom-4 right-4">
                          <Button
                            onClick={() => {
                              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
                              window.open(googleMapsUrl, '_blank');
                            }}
                            className="bg-earth-brown hover:bg-earth-brown/90 text-white shadow-lg"
                            size="sm"
                          >
                            <MapPin size={14} className="mr-1" />
                            Get Route
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-600">
                        {property.city && property.state 
                          ? `${property.city}, ${property.state}${property.country ? `, ${property.country}` : ''}` 
                          : property.address}
                      </p>
                      
                      {property.isLocationVerified ? (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          ✓ This property's location has been verified by the host
                          {property.locationCapturedAt && (
                            <span className="text-gray-500 ml-2">
                              (Verified on {new Date(property.locationCapturedAt).toLocaleDateString()})
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Exact location will be provided after booking confirmation
                        </p>
                      )}
                      
                      {property.locationAccuracy && property.locationAccuracy < 50 && (
                        <p className="text-xs text-gray-400">
                          Location accuracy: ±{property.locationAccuracy.toFixed(1)}m
                        </p>
                      )}
                    </div>
                  </div>
                  
                                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Host</h2>
                    <Link to={`/host/${property.host?._id || property.host}`} className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <img
                        src={property.host?.profilePicture || property.host?.image || '/placeholder.svg'}
                        alt={property.host?.name || property.host?.fullName || 'Host'}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">{property.host?.name || property.host?.fullName || 'Host'}</h3>
                        <p className="text-gray-600 mb-2">
                          Joined in {property.host?.createdAt ? new Date(property.host.createdAt).getFullYear() : 'Recently'}
                        </p>
                        <div className="flex items-center mb-2">
                          <Star size={16} className="text-primary mr-1" />
                          <span className="font-medium">{property.host?.rating || 4.5} Rating</span>
                        </div>
                        <div className="flex items-center">
                          <ShieldCheck size={16} className="text-green-600 mr-1" />
                          <span className="text-gray-700">Verified Host</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <BookingForm property={property} />
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
