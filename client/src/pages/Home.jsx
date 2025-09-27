import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Home as HomeIcon, Filter, Star, ArrowRight, Heart, TrendingUp, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { PropertyContext } from '../contexts/PropertyContext';

// Destinations data (keeping as static for now)
// const destinations = [{
//   id: 1,
//   name: 'New York',
//   properties: 243,
//   image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
// }, {
//   id: 2,
//   name: 'Miami',
//   properties: 186,
//   image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
// }, {
//   id: 3,
//   name: 'Los Angeles',
//   properties: 312,
//   image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
// }, {
//   id: 4,
//   name: 'Chicago',
//   properties: 167,
//   image: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
// }];

// Mock properties for fallback (keeping structure but removing data)

const destinations = [{
  id: 1,
  name: 'Karachi',
  properties: 243,
  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}, {
  id: 2,
  name: 'Lahore',
  properties: 186,
  image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}, {
  id: 3,
  name: 'Islamabad',
  properties: 312,
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}, {
  id: 4,
  name: 'Rawalpindi',
  properties: 167,
  image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}];
const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Cabin', 'Beachfront', 'Countryside'];
const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    theme
  } = useTheme();
  const handleSearch = e => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Here you would typically trigger a search with the backend
  };
  return <div className="relative min-h-[85vh] overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-light-beige/40 to-white"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-earth-brown/5 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-soft-peach/20 blur-[90px]"></div>
        <div className="absolute left-[30%] bottom-[5%] w-[25%] h-[25%] rounded-full bg-cream-beige/20 blur-[80px]"></div>
      </div>
      
      <div className="relative page-container z-10 flex flex-col lg:flex-row items-center pt-32 pb-20">
        <motion.div initial={{
        opacity: 0,
        x: -50
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="w-full lg:w-1/2 pr-0 lg:pr-16 mb-12 lg:mb-0">
          <Badge className="mb-5 bg-earth-brown/10 text-earth-brown border-earth-brown/20 py-1.5 px-4 text-sm">
            Explore the world, one stay at a time
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl font-display font-bold leading-tight mb-6 text-gray-900">
            Find your <span className="relative inline-block">
              <span className="relative z-10">perfect</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-soft-peach/30 -z-10 transform -rotate-1"></span>
            </span> getaway
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-xl leading-relaxed">
            Discover extraordinary accommodations in stunning locations worldwide. Your dream vacation is just a few clicks away.
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 relative z-20 max-w-2xl">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <MapPin size={20} className="text-earth-brown" />
                </div>
                <input type="text" placeholder="Where are you going?" className="w-full pl-12 pr-4 py-4 border border-cream-beige rounded-xl bg-white focus:ring-2 focus:ring-earth-brown/20 focus:border-earth-brown outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-earth-brown" />
                </div>
                <input type="text" placeholder="Check in - Check out" className="w-full pl-12 pr-4 py-4 border border-cream-beige rounded-xl bg-white focus:ring-2 focus:ring-earth-brown/20 focus:border-earth-brown outline-none" />
              </div>
              
              <div className="md:w-auto">
                <button type="submit" className="w-full h-full px-8 py-4 bg-earth-brown text-white rounded-xl flex items-center justify-center transition-colors hover:bg-earth-brown/90 shadow-md hover:shadow-lg">
                  <Search size={20} className="mr-2" />
                  <span className="font-medium">Search</span>
                </button>
              </div>
            </form>
            
            <div className="mt-4 flex flex-wrap gap-3 items-center px-2">
              <span className="text-sm text-gray-500">Popular:</span>
              {['Karachi apartment', 'Lahore house', 'Islamabad villa', 'Murree cabin'].map(term => <Badge key={term} variant="outline" className="bg-transparent border-cream-beige text-gray-700 hover:bg-cream-beige/10 cursor-pointer">
                  {term}
                </Badge>)}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src={`https://randomuser.me/api/portraits/women/${i + 10}.jpg`} alt="User" className="w-full h-full object-cover" />
                </div>)}
            </div>
            
            <div>
              <div className="flex items-center text-amber-500 mb-1">
                <Star className="fill-amber-500 h-4 w-4" />
                <Star className="fill-amber-500 h-4 w-4" />
                <Star className="fill-amber-500 h-4 w-4" />
                <Star className="fill-amber-500 h-4 w-4" />
                <Star className="fill-amber-500 h-4 w-4" />
                <span className="ml-2 text-gray-800 font-medium">4.9</span>
              </div>
              <p className="text-gray-600 text-sm">from over 20,000 happy travelers</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="w-full lg:w-1/2 relative">
          <div className="relative h-[520px] perspective-1000">
            <motion.div className="absolute left-0 right-0 mx-auto w-[80%] h-[400px] rounded-2xl overflow-hidden shadow-2xl z-20" animate={{
            y: [0, -8, 0]
          }} transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}>
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury accommodation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-emerald-400">Mountain View Retreat</h3>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>Murree, Punjab</span>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm text-earth-brown px-3 py-1 rounded-lg font-medium">
                    Rs 32,000/night
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="absolute top-16 right-0 w-[200px] h-[150px] rounded-xl overflow-hidden shadow-lg z-10" animate={{
            y: [0, -12, 0],
            rotate: [0, -2, 0]
          }} transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}>
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Beautiful villa" className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div className="absolute bottom-12 left-0 w-[220px] h-[160px] rounded-xl overflow-hidden shadow-lg z-10" animate={{
            y: [0, 12, 0],
            rotate: [0, 2, 0]
          }} transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}>
              <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Beach house" className="w-full h-full object-cover" />
            </motion.div>
            
            <div className="absolute top-0 right-10 w-16 h-16 rounded-full border-4 border-dashed border-earth-brown/20 z-0"></div>
            <div className="absolute bottom-20 right-16 w-8 h-8 rounded-full bg-soft-peach/30 z-0"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {['Verified Hosts', 'Instant Booking', 'Free Cancellation'].map(feature => <Badge key={feature} className="bg-white border border-cream-beige/60 text-gray-700 py-1.5 px-3 shadow-sm">
                <CheckCircle size={14} className="mr-1 text-earth-brown" />
                {feature}
              </Badge>)}
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L60,64C120,64,240,64,360,58.7C480,53,600,43,720,48C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>
    </div>;
};
const PropertyTypeFilter = ({
  activeType,
  setActiveType
}) => {
  return <Tabs defaultValue="All" className="w-full mb-8" onValueChange={setActiveType}>
      <TabsList className="flex flex-wrap items-center gap-2 bg-transparent h-auto p-0">
        {propertyTypes.map(type => <TabsTrigger key={type} value={type} className="data-[state=active]:bg-earth-brown data-[state=active]:text-white dark:data-[state=active]:bg-cream-beige dark:data-[state=active]:text-earth-brown px-4 py-1.5 rounded-full text-sm transition-colors data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:bg-gray-200 dark:data-[state=inactive]:hover:bg-gray-700">
            {type}
          </TabsTrigger>)}
      </TabsList>
    </Tabs>;
};
const FeaturedListings = ({
  featuredProperties
}) => {
  return <section className="py-16 bg-white">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <Badge className="mb-2 bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30 border-none">
              Featured
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
              Featured Properties
            </h2>
            <p className="text-gray-600">
              Handpicked properties with exceptional quality and value
            </p>
          </div>
          
          <Link to="/properties" className="mt-3 sm:mt-0 group flex items-center text-earth-brown font-medium hover:text-earth-brown/80 transition-colors">
            <span>View all properties</span>
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map(property => <motion.div key={property._id || property.id} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
              <PropertyCard property={property} />
            </motion.div>)}
        </div>
      </div>
    </section>;
};
const PopularDestinations = () => {
  return <section className="py-16 bg-white dark:bg-gray-900">
      <div className="page-container">
        <div className="text-center mb-12">
          <Badge className="mb-2 bg-earth-brown/20 text-earth-brown dark:bg-cream-beige/20 dark:text-cream-beige hover:bg-earth-brown/30 dark:hover:bg-cream-beige/30 border-none">
            Destinations
          </Badge>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Popular Destinations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our most sought-after locations with the highest number of bookings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map(destination => <motion.div key={destination.id} whileHover={{
          y: -8
        }} transition={{
          duration: 0.2
        }} className="relative rounded-xl overflow-hidden shadow-md group">
              <div className="aspect-[4/5]">
                <img src={destination.image} alt={destination.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-xl font-semibold mb-1 text-emerald-400">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.properties} properties</p>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
const Home = () => {
  const { properties, featuredProperties, loading } = useContext(PropertyContext);
  const [activeType, setActiveType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const {
    theme
  } = useTheme();
  
  useEffect(() => {
    // Properties are managed by PropertyContext
    setIsLoading(loading);
  }, [loading]);
  
  const filteredProperties = activeType === 'All' ? properties : properties.filter(property => property.propertyType === activeType.toLowerCase());
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  return <PageTransition>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        
        <main className="flex-grow">
          <Hero />
          
          <FeaturedListings featuredProperties={featuredProperties} />
          
          <PopularDestinations />
          
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="page-container">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <Badge className="mb-2 bg-earth-brown/20 text-earth-brown dark:bg-cream-beige/20 dark:text-cream-beige hover:bg-earth-brown/30 dark:hover:bg-cream-beige/30 border-none">
                    Explore
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    Explore Properties
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Find the perfect place for your next stay
                  </p>
                </div>
                
                <Button variant="outline" className="mt-3 sm:mt-0 flex items-center gap-2 border-cream-beige dark:border-earth-brown/30 text-gray-700 dark:text-gray-300">
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
              </div>
              
              <PropertyTypeFilter activeType={activeType} setActiveType={setActiveType} />
              
              {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({
                length: 8
              }).map((_, index) => <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/2] mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>)}
                </div> : <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map(property => <motion.div key={property._id || property.id} variants={cardVariants}>
                      <PropertyCard property={property} />
                    </motion.div>)}
                </motion.div>}
            </div>
          </section>
          
          <section className="py-16 bg-gradient-to-r from-light-beige to-soft-peach/50 dark:from-gray-800 dark:to-gray-800/50">
            <div className="page-container">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <Badge className="mb-2 bg-earth-brown/20 text-earth-brown dark:bg-cream-beige/20 dark:text-cream-beige hover:bg-earth-brown/30 dark:hover:bg-cream-beige/30 border-none">
                  Why Choose Us
                </Badge>
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  The GuestHost Experience
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  We offer the best experience for both hosts and guests with premium service
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5
              }} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                  <div className="w-14 h-14 bg-earth-brown/20 dark:bg-cream-beige/20 rounded-full flex items-center justify-center mb-5">
                    <HomeIcon size={28} className="text-earth-brown dark:text-cream-beige" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
                    Curated Properties
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    From cozy apartments to luxurious villas, our properties are handpicked to ensure exceptional quality and comfort.
                  </p>
                </motion.div>
                
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: 0.1
              }} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                  <div className="w-14 h-14 bg-earth-brown/20 dark:bg-cream-beige/20 rounded-full flex items-center justify-center mb-5">
                    <MapPin size={28} className="text-earth-brown dark:text-cream-beige" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
                    Premium Locations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Properties in sought-after destinations that offer convenience, stunning views, and local experiences.
                  </p>
                </motion.div>
                
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: 0.2
              }} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                  <div className="w-14 h-14 bg-earth-brown/20 dark:bg-cream-beige/20 rounded-full flex items-center justify-center mb-5">
                    <Star size={28} className="text-earth-brown dark:text-cream-beige" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
                    5-Star Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Streamlined booking, 24/7 customer support, verified listings, and secure payments for peace of mind.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="page-container">
              <div className="bg-gradient-to-r from-cream-beige to-soft-peach dark:from-earth-brown/40 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <motion.div initial={{
                    opacity: 0,
                    x: -20
                  }} whileInView={{
                    opacity: 1,
                    x: 0
                  }} viewport={{
                    once: true
                  }} transition={{
                    duration: 0.5
                  }}>
                      <Badge className="mb-3 bg-white/60 dark:bg-white/20 text-earth-brown dark:text-cream-beige hover:bg-white/80 dark:hover:bg-white/30 border-none">
                        Become a Host
                      </Badge>
                      <h2 className="text-3xl font-display font-bold text-earth-brown dark:text-cream-beige mb-4">
                        Share Your Space,<br className="hidden md:block" /> Earn Extra Income
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                        Join thousands of hosts who are earning while connecting with travelers from all over the world.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <TrendingUp size={16} className="mr-2 text-earth-brown dark:text-cream-beige" />
                          <span>Earn up to Rs 300,000/month</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <Calendar size={16} className="mr-2 text-earth-brown dark:text-cream-beige" />
                          <span>Flexible scheduling</span>
                        </div>
                      </div>
                      <Link to="/host/dashboard" className="inline-flex items-center px-6 py-3 bg-earth-brown dark:bg-cream-beige text-white dark:text-earth-brown hover:bg-earth-brown/90 dark:hover:bg-cream-beige/90 rounded-lg transition-colors">
                        Start Hosting
                      </Link>
                    </motion.div>
                  </div>
                  <div className="w-full md:w-1/2 relative min-h-[350px]">
                    <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Become a host" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>;
};
export default Home;