import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Home as HomeIcon,
  Filter,
  Star,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Shield,
  Zap,
  Users,
  Award,
  ChevronRight,
  Quote,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyContext } from '../contexts/PropertyContext';

/* ─── static data ─────────────────────────────────────────────────────────── */

const destinations = [
  {
    id: 1,
    name: 'Karachi',
    properties: 243,
    tag: 'City Escapes',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Lahore',
    properties: 186,
    tag: 'Cultural Hub',
    image:
      'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Islamabad',
    properties: 312,
    tag: 'Capital Stays',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Murree',
    properties: 167,
    tag: 'Hill Retreats',
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Cabin', 'Beachfront', 'Countryside'];

const stats = [
  { value: '10K+', label: 'Properties Listed' },
  { value: '50K+', label: 'Happy Guests' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '120+', label: 'Cities Covered' },
];

const howItWorks = [
  {
    step: '01',
    icon: Search,
    title: 'Search Your Destination',
    desc: 'Enter your city and travel dates to browse hundreds of verified properties.',
  },
  {
    step: '02',
    icon: Calendar,
    title: 'Book Instantly',
    desc: 'Choose your perfect stay and confirm in seconds with secure online payment.',
  },
  {
    step: '03',
    icon: HomeIcon,
    title: 'Enjoy Your Stay',
    desc: 'Check in seamlessly and experience the comfort of a home away from home.',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Khan',
    location: 'Lahore',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Rentifi made finding a weekend villa in Murree effortless. The property was exactly as described and check-in was a breeze!',
  },
  {
    id: 2,
    name: 'Bilal Ahmed',
    location: 'Karachi',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'I listed my apartment and had bookings within the first week. The host dashboard is incredibly easy to use.',
  },
  {
    id: 3,
    name: 'Sara Malik',
    location: 'Islamabad',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'Best rental platform in Pakistan. Verified listings and responsive support made my whole trip stress-free.',
  },
];

/* ─── animation variants ──────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

/* ─── Hero ────────────────────────────────────────────────────────────────── */

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('city', searchQuery.trim());
    if (checkInDate) params.append('checkIn', checkInDate);
    navigate(`/properties?${params.toString()}`);
  };

  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    navigate(`/properties?city=${encodeURIComponent(term)}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-earth-brown/10 to-soft-peach/20 blur-[140px]" />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cream-beige/30 to-light-beige/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-soft-peach/10 blur-[100px]" />
      </div>

      <div className="relative z-10 page-container flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-28 lg:pt-36 pb-20">
        {/* ── Left: copy + search ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 flex flex-col"
        >
          <motion.div variants={fadeUp}>
            <Badge className="mb-6 inline-flex items-center gap-2 bg-earth-brown/10 text-earth-brown border-earth-brown/20 py-1.5 px-4 text-sm font-medium rounded-full">
              <span className="w-2 h-2 rounded-full bg-earth-brown animate-pulse" />
              Pakistan's #1 Rental Platform
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl xl:text-6xl font-display font-bold leading-[1.1] tracking-tight mb-6 text-gray-900 dark:text-white"
          >
            Find your{' '}
            <span className="relative inline-block text-earth-brown">
              perfect
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 220 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10 Q55 2 110 7 Q165 12 218 4"
                  stroke="#E3CDC1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{' '}
            getaway
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed"
          >
            Discover handpicked homes, villas, and apartments across Pakistan. Book instantly,
            travel freely.
          </motion.p>

          {/* Search card */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_40px_rgba(160,147,125,0.18)] dark:shadow-gray-900/50 p-3 mb-6 border border-cream-beige/40 dark:border-gray-700"
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <MapPin
                  size={18}
                  className="absolute inset-y-0 left-3.5 my-auto text-earth-brown pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Where to? (city, area…)"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border border-transparent focus:border-earth-brown/40 focus:ring-2 focus:ring-earth-brown/10 outline-none text-sm transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 relative">
                <Calendar
                  size={18}
                  className="absolute inset-y-0 left-3.5 my-auto text-earth-brown pointer-events-none z-10"
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-transparent focus:border-earth-brown/40 focus:ring-2 focus:ring-earth-brown/10 outline-none text-sm transition"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-earth-brown hover:bg-earth-brown/90 active:scale-[0.98] text-white rounded-xl font-medium text-sm shadow-md transition-all duration-200 whitespace-nowrap"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">Popular:</span>
              {['Karachi', 'Lahore', 'Islamabad', 'Murree'].map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="text-xs px-3 py-1 rounded-full border border-cream-beige dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-cream-beige/20 hover:border-earth-brown/30 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[11, 12, 13, 14].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/women/${i}.jpg`}
                  alt="User"
                  className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  4.9
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                from 20,000+ happy travelers
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 ml-2 text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4">
              <Shield size={13} className="text-earth-brown" />
              Verified &amp; Secure
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: floating images ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 relative hidden sm:block"
        >
          <div className="relative h-[540px]">
            {/* Main card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              className="absolute left-8 right-8 mx-auto h-[400px] rounded-3xl overflow-hidden shadow-2xl z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Luxury accommodation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-white/70 mb-0.5 uppercase tracking-wide">
                      Featured Stay
                    </p>
                    <h3 className="text-lg font-semibold leading-tight">Mountain View Retreat</h3>
                    <div className="flex items-center gap-1 mt-1 text-sm text-white/80">
                      <MapPin size={13} />
                      Murree, Punjab
                    </div>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm text-earth-brown px-3 py-1.5 rounded-xl font-semibold text-sm">
                    Rs 32,000<span className="text-xs font-normal text-gray-500">/night</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small card top-right */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, -1.5, 0] }}
              transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
              className="absolute top-12 -right-4 w-[190px] h-[140px] rounded-2xl overflow-hidden shadow-xl z-30 border-2 border-white dark:border-gray-800"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Villa"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Small card bottom-left */}
            <motion.div
              animate={{ y: [0, 14, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
              className="absolute bottom-10 -left-4 w-[200px] h-[150px] rounded-2xl overflow-hidden shadow-xl z-30 border-2 border-white dark:border-gray-800"
            >
              <img
                src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Beach house"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 0.8 }}
              className="absolute top-6 left-4 z-40 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 border border-cream-beige/40 dark:border-gray-700"
            >
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-none">
                  Verified Host
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Instant Booking</p>
              </div>
            </motion.div>

            {/* Decorative shapes */}
            <div className="absolute top-0 right-20 w-16 h-16 rounded-full border-[3px] border-dashed border-earth-brown/20 z-0" />
            <div className="absolute bottom-24 right-12 w-6 h-6 rounded-full bg-soft-peach/50 z-0" />
            <div className="absolute top-1/2 left-0 w-4 h-4 rounded-full bg-cream-beige z-0" />
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['Verified Hosts', 'Instant Booking', 'Free Cancellation', 'Secure Payments'].map(
              (f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-cream-beige/60 dark:border-gray-700 rounded-full px-3 py-1.5 shadow-sm"
                >
                  <CheckCircle size={11} className="text-earth-brown" />
                  {f}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-cream-beige/40 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="page-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-2xl font-display font-bold text-earth-brown">{s.value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── How It Works ────────────────────────────────────────────────────────── */

const HowItWorks = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <div className="text-center mb-14">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Simple Process
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Book in 3 easy steps
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          From search to check-in — we've made renting a property the simplest thing you'll do
          today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* connector line */}
        <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-cream-beige via-earth-brown/30 to-cream-beige z-0" />

        {howItWorks.map((step, i) => (
          <motion.div
            key={step.step}
            custom={i * 0.12}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-cream-beige/40 dark:border-gray-700 flex items-center justify-center mb-5 relative">
              <step.icon size={28} className="text-earth-brown" />
              <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-earth-brown text-white text-xs font-bold flex items-center justify-center shadow">
                {i + 1}
              </span>
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Featured Listings ───────────────────────────────────────────────────── */

const FeaturedListings = ({ featuredProperties }) => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
        <div>
          <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
            Handpicked for You
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Featured Properties
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Exceptional quality, verified hosts, unforgettable stays
          </p>
        </div>
        <Link
          to="/properties"
          className="mt-4 sm:mt-0 group inline-flex items-center gap-2 text-earth-brown font-medium text-sm hover:gap-3 transition-all"
        >
          View all properties
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {featuredProperties.map((property, i) => (
          <motion.div
            key={property._id || property.id}
            custom={i * 0.1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Popular Destinations ────────────────────────────────────────────────── */

const PopularDestinations = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <div className="text-center mb-12">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Top Destinations
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Explore Popular Cities
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Discover the most booked destinations across Pakistan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {destinations.map((dest, i) => (
          <Link key={dest.id} to={`/properties?city=${encodeURIComponent(dest.name)}`}>
            <motion.div
              custom={i * 0.1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.22 }}
              className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer aspect-[3/4]"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* top tag */}
              <span className="absolute top-3 left-3 text-[11px] font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-2.5 py-1">
                {dest.tag}
              </span>

              {/* bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-display font-bold leading-tight">{dest.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-white/75">{dest.properties} properties</p>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Property Type Filter ────────────────────────────────────────────────── */

const PropertyTypeFilter = ({ setActiveType }) => (
  <Tabs defaultValue="All" className="w-full mb-8" onValueChange={setActiveType}>
    <TabsList className="flex flex-wrap items-center gap-2 bg-transparent h-auto p-0">
      {propertyTypes.map((type) => (
        <TabsTrigger
          key={type}
          value={type}
          className="data-[state=active]:bg-earth-brown data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-earth-brown dark:data-[state=active]:text-white px-4 py-2 rounded-full text-sm transition-all data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-cream-beige/40 dark:data-[state=inactive]:hover:bg-gray-700 border-none"
        >
          {type}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

/* ─── Explore Properties ──────────────────────────────────────────────────── */

const ExploreProperties = ({ properties, loading }) => {
  const [activeType, setActiveType] = useState('All');

  const filteredProperties =
    activeType === 'All'
      ? properties
      : properties.filter((p) => p.propertyType === activeType.toLowerCase());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
          <div>
            <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
              Explore
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
              All Properties
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Find the perfect place for your next stay
            </p>
          </div>
          <Link to="/properties">
            <Button
              variant="outline"
              className="mt-4 sm:mt-0 flex items-center gap-2 border-cream-beige dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-cream-beige/20 dark:hover:bg-gray-800 rounded-xl text-sm"
            >
              <Filter size={14} />
              Advanced Filters
            </Button>
          </Link>
        </div>

        <PropertyTypeFilter setActiveType={setActiveType} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-[4/3] rounded-2xl mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
              <HomeIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Try a different property type or browse all listings.
            </p>
            <Button
              onClick={() => setActiveType('All')}
              className="bg-earth-brown text-white hover:bg-earth-brown/90 rounded-xl"
            >
              Show All Properties
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProperties.map((property) => (
              <motion.div key={property._id || property.id} variants={cardVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/* ─── Why Choose Us ───────────────────────────────────────────────────────── */

const features = [
  {
    icon: Shield,
    title: 'Verified & Trusted',
    desc: 'Every listing is manually reviewed. Our hosts go through identity verification before going live.',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'No waiting for approvals. Confirm your stay in seconds with real-time availability.',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'Curated properties that meet strict quality standards — from cozy flats to luxury villas.',
    color: 'bg-earth-brown/10 dark:bg-earth-brown/20 text-earth-brown',
  },
  {
    icon: Users,
    title: 'Local Expertise',
    desc: 'Our hosts are local insiders who provide tips, recommendations, and genuine hospitality.',
    color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  },
];

const WhyChooseUs = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <div className="text-center mb-14">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Why Rentifi
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          A better way to rent
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          We've rethought every step of the rental experience so you can focus on what matters —
          enjoying your stay.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i * 0.12}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}
            >
              <f.icon size={22} />
            </div>
            <h3 className="text-base font-display font-semibold text-gray-900 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Testimonials ────────────────────────────────────────────────────────── */

const Testimonials = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="page-container">
      <div className="text-center mb-14">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Guest Stories
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          What our users say
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Real experiences from real guests and hosts across Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            custom={i * 0.12}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 relative"
          >
            <Quote
              size={28}
              className="text-earth-brown/20 dark:text-earth-brown/30 absolute top-5 right-5"
            />
            <div className="flex items-center gap-1 mb-4">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cream-beige dark:border-gray-600"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Become a Host CTA ───────────────────────────────────────────────────── */

const HostCTA = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-earth-brown via-[#b5a08d] to-soft-peach dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 shadow-xl"
      >
        {/* decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col lg:flex-row items-center">
          {/* text side */}
          <div className="w-full lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center z-10">
            <Badge className="mb-4 w-fit bg-white/20 text-white border-white/30 rounded-full px-4 py-1.5 text-sm">
              Become a Host
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 leading-tight">
              Share your space,
              <br /> earn real income
            </h2>
            <p className="text-white/80 text-base mb-7 max-w-md leading-relaxed">
              Join thousands of hosts earning extra income. Set your own schedule, keep full
              control, and connect with travelers from across the country.
            </p>

            <div className="flex flex-wrap gap-5 mb-8">
              {[
                { icon: TrendingUp, label: 'Earn up to Rs 300K/mo' },
                { icon: Calendar, label: 'Flexible scheduling' },
                { icon: Shield, label: 'Host protection' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/90 text-sm">
                  <item.icon size={15} className="text-white/70" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/host/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-earth-brown font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-sm shadow-md"
              >
                Start Hosting Today
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium rounded-xl transition-all text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* image side */}
          <div className="w-full lg:w-1/2 relative h-64 lg:h-auto min-h-[340px]">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
              alt="Become a host"
              className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-earth-brown/60 to-transparent lg:bg-gradient-to-l" />

            {/* floating earnings card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl z-10 min-w-[160px]"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. monthly earnings</p>
              <p className="text-2xl font-bold text-earth-brown font-display">Rs 85K</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                <TrendingUp size={12} />
                +24% this month
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Home (root component) ───────────────────────────────────────────────── */

const Home = () => {
  const { properties, featuredProperties, loading, fetchProperties, fetchFeaturedProperties } =
    useContext(PropertyContext);

  useEffect(() => {
    fetchProperties();
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties, fetchProperties]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow">
          <Hero />
          <HowItWorks />
          <FeaturedListings featuredProperties={featuredProperties} />
          <PopularDestinations />
          <ExploreProperties properties={properties} loading={loading} />
          <WhyChooseUs />
          <Testimonials />
          <HostCTA />
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;
