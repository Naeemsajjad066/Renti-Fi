
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

// Mock data for a single property
const mockProperty = {
  id: 1,
  name: 'Modern Apartment in Downtown',
  description: 'This beautiful modern apartment is located in the heart of downtown, within walking distance of restaurants, cafes, and attractions. Featuring floor-to-ceiling windows with spectacular city views, a fully equipped kitchen, and a spacious living area, this property is perfect for both short and long-term stays.',
  location: 'Old Hasilpur',
  price: 120,
  rating: 4.8,
  reviews: 124,
  beds: 2,
  baths: 1,
  maxGuests: 4,
  host: {
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    rating: 4.9,
    responseRate: 99,
    joined: 'January 2020',
  },
  amenities: [
    { name: 'Wifi', icon: Wifi },
    { name: 'TV', icon: Tv },
    { name: 'Kitchen', icon: Utensils },
    { name: 'Coffee Maker', icon: Coffee },
    { name: 'Air Conditioning', icon: Wind },
    { name: 'Heating', icon: Snowflake },
    { name: 'Washer', icon: Bath },
    { name: 'Free Parking', icon: Car },
  ],
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ],
};

const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-[16/9] overflow-hidden">
        <motion.img
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          src={images[activeIndex]}
          alt="Property"
          className="w-full h-full object-cover"
        />
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

const BookingForm = ({ price }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ checkIn, checkOut, guests });
    // Here you would typically send the booking request to your backend
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-semibold">${price}</span>
          <span className="text-gray-600">/night</span>
        </div>
        <div className="flex items-center">
          <Star size={16} className="text-primary mr-1" />
          <span className="font-medium">{mockProperty.rating}</span>
          <span className="text-gray-600 ml-1">({mockProperty.reviews} reviews)</span>
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
            {[...Array(mockProperty.maxGuests)].map((_, i) => (
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
          <span className="text-gray-600">${price} x 5 nights</span>
          <span>${price * 5}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-gray-600">Cleaning fee</span>
          <span>$50</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-gray-600">Service fee</span>
          <span>$30</span>
        </div>
        <div className="flex items-center justify-between py-4 font-semibold">
          <span>Total</span>
          <span>${price * 5 + 80}</span>
        </div>
      </div>
    </div>
  );
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching property details from an API
    const fetchProperty = () => {
      setIsLoading(true);
      setTimeout(() => {
        // In a real app, you would fetch the specific property using the ID
        setProperty(mockProperty);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchProperty();
  }, [id]);

  if (isLoading) {
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

  if (!property) {
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
                {property.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <MapPin size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">{property.location}</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-primary mr-1" />
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-gray-600 ml-1">({property.reviews} reviews)</span>
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
                        Hosted by {property.host.name}
                      </h2>
                      <div className="flex items-center mt-1">
                        <span className="text-gray-600 mr-2">
                          {property.beds} beds · {property.baths} bath · Up to {property.maxGuests} guests
                        </span>
                      </div>
                    </div>
                    <Link to={"/"} className="flex-shrink-0">
                      <img
                        src={property.host.image}
                        alt={property.host.name}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer"
                      />
                    </Link>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">About this place</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <amenity.icon size={20} className="text-gray-700 mr-3" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Location</h2>
                    <div className="h-64 bg-gray-200 rounded-lg">
                      {/* Map would go here */}
                      <div className="w-full h-full flex items-center justify-center">
                      <iframe
  className="w-full h-64 rounded-lg"
  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
  allowFullScreen
/>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600">
                      Exact location provided after booking.
                    </p>
                  </div>
                  
                 {/* In PropertyDetails component, modify the host section */}
<div className="mb-8">
  <h2 className="text-xl font-semibold mb-4">Host</h2>
  <Link to={`/host/${property.host}`} className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
    <img
      src={property.host.image}
      alt={property.host.name}
      className="w-16 h-16 rounded-full object-cover"
    />
    <div>
      <h3 className="font-semibold">{property.host.name}</h3>
      <p className="text-gray-600 mb-2">Joined in {property.host.joined}</p>
      <div className="flex items-center mb-2">
        <Star size={16} className="text-primary mr-1" />
        <span className="font-medium">{property.host.rating} Rating</span>
      </div>
      <div className="flex items-center">
        <ShieldCheck size={16} className="text-green-600 mr-1" />
        <span className="text-gray-700">{property.host.responseRate}% Response Rate</span>
      </div>
    </div>
  </Link>
</div>
                </div>
                
                <div className="md:col-span-1">
                  <BookingForm price={property.price} />
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
