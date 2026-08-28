import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Home,
  Search,
  MapPin,
  Star,
  Calendar,
  Heart,
  Check,
  ChevronRight,
  Trees,
  Coffee,
  Wind,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

// Featured properties data
const featuredProperties = [
  {
    id: 1,
    title: 'Luxury Villa with Sea View',
    location: 'Malibu, CA',
    price: 350,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Pool', 'Sauna', 'Beach Access'],
  },
  {
    id: 2,
    title: 'Modern DHA Apartment',
    location: 'Karachi, Sindh',
    price: 200,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Gym', 'Smart Home', 'Concierge'],
  },
  {
    id: 3,
    title: 'Seaside House',
    location: 'Santa Monica, CA',
    price: 280,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Beach', 'Hot Tub', 'Garden'],
  },
];

// Popular destinations
const destinations = [
  {
    name: 'Karachi',
    properties: 245,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Lahore',
    properties: 189,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Islamabad',
    properties: 156,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Rawalpindi',
    properties: 214,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

// Experience categories with icons
const experiences = [
  { name: 'Nature Retreats', icon: <Trees className="h-6 w-6" />, count: 124 },
  { name: 'Urban Escapes', icon: <Coffee className="h-6 w-6" />, count: 86 },
  { name: 'Beachfront Villas', icon: <Wind className="h-6 w-6" />, count: 57 },
  { name: 'Mountain Cabins', icon: <Home className="h-6 w-6" />, count: 93 },
];

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-grow">
          {/* Redesigned Hero Section */}
          <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-light-beige via-light-beige to-white overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 right-[10%] w-[300px] h-[300px] rounded-full bg-soft-peach/20 blur-[80px]"></div>
              <div className="absolute bottom-40 left-[5%] w-[250px] h-[250px] rounded-full bg-cream-beige/30 blur-[60px]"></div>
              <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-earth-brown/10 blur-[70px]"></div>
            </div>

            <div className="relative page-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 py-20 lg:py-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="flex flex-col text-left"
              >
                <Badge className="mb-4 self-start bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30">
                  Premium Living Spaces
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-6 leading-tight text-gray-900">
                  Discover Your{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-earth-brown to-soft-peach">
                    Dream Stay
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
                  Handpicked luxury accommodations with exceptional amenities for unforgettable
                  experiences in breathtaking locations worldwide.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
                  <Button
                    size="lg"
                    className="bg-earth-brown hover:bg-earth-brown/90 text-white border-none px-6 py-6 text-base"
                  >
                    Find Your Perfect Stay
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-earth-brown text-earth-brown hover:bg-earth-brown/10 px-6 py-6 text-base"
                  >
                    View Our Collections
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium">Verified Properties</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium">24/7 Concierge</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium">Luxury Amenities</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                {/* Main Image with Property Cards Floating */}
                <div className="relative h-[520px] perspective-1000">
                  {/* Floating Cards */}
                  <motion.div
                    className="absolute -top-12 -left-12 w-64 h-48 rounded-lg overflow-hidden shadow-elevated z-10"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [-3, -2, -3],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Luxury property"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="font-semibold text-base">Luxury Villa</div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.9 · Superhost</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-8 -right-8 w-64 h-48 rounded-lg overflow-hidden shadow-elevated z-10"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [3, 2, 3],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: 0.5,
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Beach property"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="font-semibold text-base">Beach House</div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.8 · Beachfront</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Main Image */}
                  <div className="absolute inset-0 m-auto w-[420px] h-[520px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(160,147,125,0.3)] border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Mountain lodge"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="text-2xl font-bold mb-2">Mountain Lodge</div>
                      <div className="flex items-center mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Murree, Punjab</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.9</span>
                        </div>
                        <div className="px-3 py-1 bg-earth-brown/70 backdrop-blur-sm rounded-full text-sm">
                          Rs 35,000/night
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border-4 border-dashed border-earth-brown/30 rotate-45"></div>
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-cream-beige/30"></div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 100"
                className="w-full h-auto"
              >
                <path
                  fill="#ffffff"
                  fillOpacity="1"
                  d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
                ></path>
              </svg>
            </div>
          </section>

          {/* Enhanced Search Section */}
          <section className="py-12 bg-white">
            <div className="page-container">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-[0_10px_40px_rgba(160,147,125,0.15)] p-6 rounded-2xl border border-cream-beige/40">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <MapPin size={18} className="text-earth-brown" />
                      </div>
                      <input
                        type="text"
                        placeholder="Where are you going?"
                        className="w-full h-14 pl-10 pr-4 bg-white text-gray-800 rounded-xl border border-cream-beige focus:ring-2 focus:ring-earth-brown/20 focus:border-earth-brown text-base"
                      />
                    </div>

                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <Calendar size={18} className="text-earth-brown" />
                      </div>
                      <input
                        type="text"
                        placeholder="Check in - Check out"
                        className="w-full h-14 pl-10 pr-4 bg-white text-gray-800 rounded-xl border border-cream-beige focus:ring-2 focus:ring-earth-brown/20 focus:border-earth-brown text-base"
                      />
                    </div>

                    <div className="relative">
                      <button
                        type="submit"
                        className="w-full md:w-auto h-14 px-8 bg-earth-brown text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center text-base"
                      >
                        <Search size={18} className="mr-2" />
                        <span>Search</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-3 items-center">
                    <span className="text-gray-600 text-base mr-1">Popular:</span>
                    {['Beach house', 'Mountain cabin', 'City apartment', 'Luxury villa'].map(
                      (term) => (
                        <Badge
                          key={term}
                          variant="outline"
                          className="bg-white text-gray-700 hover:bg-cream-beige/20 border-cream-beige cursor-pointer py-2 px-4 text-base"
                        >
                          {term}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Categories - Redesigned */}
          <section className="py-20 bg-gradient-to-b from-white to-light-beige/30">
            <div className="page-container">
              <div className="text-center mb-16">
                <Badge className="mb-3 bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30 text-base py-2 px-4">
                  Curated Experiences
                </Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                  Discover Exceptional Stays
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Explore our handpicked collection of unique accommodations tailored to your
                  preferences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(160,147,125,0.1)] border border-cream-beige/30 h-full flex flex-col">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-earth-brown/10 text-earth-brown mb-6 group-hover:bg-earth-brown group-hover:text-white transition-colors duration-300">
                        {experience.icon}
                      </div>
                      <h3 className="text-xl font-display font-bold mb-3 text-gray-900">
                        {experience.name}
                      </h3>
                      <p className="text-gray-600 mb-6 flex-grow">
                        {experience.count} exclusive properties with unique amenities and
                        exceptional service
                      </p>
                      <Link
                        to={`/experiences/${experience.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center text-earth-brown font-medium group-hover:text-earth-brown/80 transition-colors"
                      >
                        <span>Explore Collection</span>
                        <ChevronRight
                          size={18}
                          className="ml-1 group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Properties - Enhanced */}
          <section className="py-20 bg-white">
            <div className="page-container">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                  <Badge className="mb-3 bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30 text-base py-2 px-4">
                    Featured
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
                    Exceptional Properties
                  </h2>
                  <p className="text-gray-600 max-w-xl text-lg">
                    Handpicked luxury accommodations with premium amenities and stunning locations
                  </p>
                </div>

                <Link
                  to="/properties"
                  className="mt-4 md:mt-0 group flex items-center text-earth-brown font-medium text-lg hover:text-earth-brown/80 transition-colors"
                >
                  <span>View all properties</span>
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                  />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(160,147,125,0.15)] border border-cream-beige/30 h-full flex flex-col">
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          <button className="p-2.5 rounded-full bg-white/90 hover:bg-white text-earth-brown transition-colors shadow-md">
                            <Heart
                              size={20}
                              className="group-hover:fill-red-500 transition-colors"
                            />
                          </button>
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-earth-brown/80 text-white hover:bg-earth-brown border-none text-sm py-1.5 px-3">
                            Premium
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-display font-bold text-gray-900 group-hover:text-earth-brown transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="font-medium text-gray-800">{property.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={16} className="mr-1 text-earth-brown" />
                          <span>{property.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="text-sm px-3 py-1 bg-cream-beige/30 text-gray-700 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-cream-beige/30">
                          <div>
                            <span className="text-2xl font-bold text-earth-brown">
                              Rs {property.price}
                            </span>
                            <span className="text-gray-600"> / night</span>
                          </div>
                          <Link
                            to={`/property/${property.id}`}
                            className="px-4 py-2 bg-earth-brown/10 hover:bg-earth-brown/20 text-earth-brown rounded-lg transition-colors font-medium"
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Destinations - Enhanced */}
          <section className="py-20 bg-gradient-to-b from-white to-light-beige/40">
            <div className="page-container">
              <div className="text-center mb-16">
                <Badge className="mb-3 bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30 text-base py-2 px-4">
                  Top Destinations
                </Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                  Explore Popular Locations
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Discover our most sought-after destinations with exceptional properties
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={destination.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(160,147,125,0.2)] border-2 border-white">
                      <div className="aspect-[4/5]">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <h3 className="text-2xl font-display font-bold text-white mb-2">
                            {destination.name}
                          </h3>
                          <div className="flex items-center text-white/90 bg-black/30 backdrop-blur-sm w-fit px-3 py-1.5 rounded-full">
                            <Home size={16} className="mr-2" />
                            <span className="font-medium">{destination.properties} properties</span>
                          </div>
                          <div className="mt-4 overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                            <Button
                              className="bg-white text-earth-brown hover:bg-cream-beige border-none"
                              size="sm"
                            >
                              Explore Destination
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button className="bg-earth-brown text-white hover:bg-earth-brown/90 border-none py-6 px-8 text-base shadow-md hover:shadow-lg">
                  View All Destinations
                </Button>
              </div>
            </div>
          </section>

          {/* Become a Host CTA - Enhanced */}
          <section className="py-20 bg-white">
            <div className="page-container">
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(160,147,125,0.2)] border border-cream-beige/30">
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-cream-beige/40 to-soft-peach/30">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <Badge className="mb-4 bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30 text-base py-2 px-4">
                        Join Our Community
                      </Badge>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
                        Share Your Space,
                        <br className="hidden lg:block" /> Earn Extra Income
                      </h2>
                      <p className="text-lg text-gray-700 mb-8 max-w-xl">
                        Join thousands of hosts who are earning while connecting with travelers from
                        all over the world. Our platform makes it easy to list your property and
                        start hosting guests.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to="/host/dashboard"
                          className="inline-flex items-center justify-center px-6 py-4 bg-earth-brown text-white rounded-lg transition-colors hover:bg-earth-brown/90 shadow-md hover:shadow-lg text-base font-medium"
                        >
                          Start Hosting
                        </Link>
                        <Link
                          to="/host/learn-more"
                          className="inline-flex items-center justify-center px-6 py-4 bg-white text-earth-brown border border-earth-brown/30 rounded-lg transition-colors hover:bg-earth-brown/5 text-base font-medium"
                        >
                          Learn More
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[600px]">
                    <img
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Become a host"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl font-bold text-earth-brown">Rs 124,000</div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">Average monthly income</p>
                          <p className="text-gray-600 text-sm">for hosts in your area</p>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          +24% YoY
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
