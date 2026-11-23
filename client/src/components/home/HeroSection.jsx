import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Star, Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  fadeUp,
  stagger,
  POPULAR_SEARCH_TERMS,
  TRUST_BADGES,
  HERO_SOCIAL_PROOF_AVATARS,
  STATS,
} from '@/constants';

const HeroSection = () => {
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
        {/* Left: copy + search */}
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
              {POPULAR_SEARCH_TERMS.map((term) => (
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
              {HERO_SOCIAL_PROOF_AVATARS.map((i) => (
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

        {/* Right: floating images */}
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
              transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
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
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-cream-beige/60 dark:border-gray-700 rounded-full px-3 py-1.5 shadow-sm"
              >
                <CheckCircle size={11} className="text-earth-brown" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-cream-beige/40 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="page-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
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

export default HeroSection;
