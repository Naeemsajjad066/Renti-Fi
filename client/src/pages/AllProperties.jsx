import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Calendar, ChevronDown, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PropertyContext } from '../contexts/PropertyContext';

const AMENITY_OPTIONS = [
  'WiFi',
  'Air Conditioning',
  'Parking',
  'Swimming Pool',
  'Kitchen',
  'Washer',
  'TV',
  'Gym',
  'Balcony',
  'Pet Friendly',
];

const AllProperties = () => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const checkInParam = searchParams.get('checkIn');

  const { properties, loading, fetchProperties } = useContext(PropertyContext);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState(cityParam || '');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('');

  // Advanced filter state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [minBathrooms, setMinBathrooms] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const propertyTypeOptions = [
    'All',
    'Apartment',
    'House',
    'Villa',
    'Cabin',
    'Cottage',
    'Loft',
    'Condo',
    'Townhouse',
  ];
  const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Rating: High to Low', 'Latest'];

  const advancedActive =
    minBedrooms > 0 || minBathrooms > 0 || maxGuests > 0 || selectedAmenities.length > 0;

  const resetAdvanced = () => {
    setMinBedrooms(0);
    setMinBathrooms(0);
    setMaxGuests(0);
    setSelectedAmenities([]);
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    let filtered = properties;

    if (activeType !== 'All') {
      filtered = filtered.filter(
        (p) =>
          p.propertyType?.toLowerCase() === activeType.toLowerCase() ||
          p.type?.toLowerCase() === activeType.toLowerCase()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.title || p.name)?.toLowerCase().includes(q) ||
          (p.city && p.state ? `${p.city}, ${p.state}` : p.location)?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Advanced filters
    if (minBedrooms > 0) filtered = filtered.filter((p) => (p.bedrooms || 0) >= minBedrooms);
    if (minBathrooms > 0) filtered = filtered.filter((p) => (p.bathrooms || 0) >= minBathrooms);
    if (maxGuests > 0) filtered = filtered.filter((p) => (p.maxGuests || 0) >= maxGuests);
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((p) =>
        selectedAmenities.every((amenity) =>
          (p.amenities || []).some((a) => a.toLowerCase() === amenity.toLowerCase())
        )
      );
    }

    if (sortBy === 'Price: Low to High') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low')
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === 'Rating: High to Low')
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'Latest')
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

    setFilteredProperties(filtered);
  }, [
    activeType,
    searchQuery,
    priceRange,
    sortBy,
    minBedrooms,
    minBathrooms,
    maxGuests,
    selectedAmenities,
    properties,
  ]);

  const handleSearch = (e) => e.preventDefault();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow pt-20">
          {/* ── Compact hero / search bar ── */}
          <section className="bg-gradient-to-r from-earth-brown to-earth-brown/80 py-10">
            <div className="page-container">
              <div className="max-w-3xl mx-auto text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  Find Your Perfect Stay
                </h1>
                <p className="text-cream-beige/80 text-sm md:text-base">
                  Browse verified properties across Pakistan
                </p>
                {checkInParam && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm">
                    <Calendar size={14} />
                    <span>Check-in: {formatDate(checkInParam)}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-earth-brown" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by city, area, or property name..."
                    className="pl-11 py-5 rounded-xl border-0 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-base focus-visible:ring-2 focus-visible:ring-cream-beige"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </section>

          <section className="py-8 bg-white dark:bg-gray-900">
            <div className="page-container">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters sidebar */}
                <div className="w-full lg:w-1/4 space-y-6">
                  <div className="bg-light-beige/30 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-earth-brown dark:text-cream-beige mb-4">
                      Filters
                    </h3>

                    {/* Property Type */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Property Type
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {propertyTypeOptions.map((type) => (
                          <Badge
                            key={type}
                            className={`px-3 py-1.5 cursor-pointer ${
                              activeType === type
                                ? 'bg-earth-brown text-white dark:bg-cream-beige dark:text-earth-brown'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveType(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Price Range */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Price Range (per night)
                      </h4>
                      <Slider
                        min={0}
                        max={100000}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mb-4"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Rs {priceRange[0].toLocaleString()}
                          </span>
                        </div>
                        <div className="text-gray-400">—</div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Rs {priceRange[1].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Sort By */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Sort By
                      </h4>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Property listings */}
                <div className="w-full lg:w-3/4">
                  {/* Toolbar */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {filteredProperties.length} Properties
                    </h2>
                    <Button
                      variant="outline"
                      className={`flex items-center gap-2 transition-colors ${
                        advancedActive ? 'border-earth-brown text-earth-brown bg-earth-brown/5' : ''
                      }`}
                      onClick={() => setShowAdvanced((v) => !v)}
                    >
                      <Filter size={16} />
                      <span className="hidden md:inline">Advanced Filters</span>
                      {advancedActive && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-earth-brown text-white text-xs flex items-center justify-center">
                          {
                            [
                              minBedrooms > 0,
                              minBathrooms > 0,
                              maxGuests > 0,
                              selectedAmenities.length > 0,
                            ].filter(Boolean).length
                          }
                        </span>
                      )}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                      />
                    </Button>
                  </div>

                  {/* Advanced filter panel */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="bg-light-beige/40 dark:bg-gray-800 border border-earth-brown/20 rounded-xl p-5 mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                              Advanced Filters
                            </h3>
                            {advancedActive && (
                              <button
                                onClick={resetAdvanced}
                                className="text-xs text-earth-brown hover:underline flex items-center gap-1"
                              >
                                <X size={12} /> Clear all
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Bedrooms */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Min Bedrooms
                              </label>
                              <div className="flex gap-2 flex-wrap">
                                {[0, 1, 2, 3, 4, 5].map((n) => (
                                  <button
                                    key={n}
                                    onClick={() => setMinBedrooms(n)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                                      minBedrooms === n
                                        ? 'bg-earth-brown text-white border-earth-brown'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-earth-brown'
                                    }`}
                                  >
                                    {n === 0 ? 'Any' : n + '+'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Bathrooms */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Min Bathrooms
                              </label>
                              <div className="flex gap-2 flex-wrap">
                                {[0, 1, 2, 3, 4].map((n) => (
                                  <button
                                    key={n}
                                    onClick={() => setMinBathrooms(n)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                                      minBathrooms === n
                                        ? 'bg-earth-brown text-white border-earth-brown'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-earth-brown'
                                    }`}
                                  >
                                    {n === 0 ? 'Any' : n + '+'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Max Guests */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Min Guests Capacity
                              </label>
                              <div className="flex gap-2 flex-wrap">
                                {[0, 2, 4, 6, 8, 10].map((n) => (
                                  <button
                                    key={n}
                                    onClick={() => setMaxGuests(n)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                                      maxGuests === n
                                        ? 'bg-earth-brown text-white border-earth-brown'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-earth-brown'
                                    }`}
                                  >
                                    {n === 0 ? 'Any' : n + '+'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="mt-5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Amenities
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {AMENITY_OPTIONS.map((amenity) => (
                                <button
                                  key={amenity}
                                  onClick={() => toggleAmenity(amenity)}
                                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                    selectedAmenities.includes(amenity)
                                      ? 'bg-earth-brown text-white border-earth-brown'
                                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-earth-brown'
                                  }`}
                                >
                                  {amenity}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active advanced filter chips */}
                  {advancedActive && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {minBedrooms > 0 && (
                        <span className="inline-flex items-center gap-1 bg-earth-brown/10 text-earth-brown text-xs px-3 py-1 rounded-full">
                          {minBedrooms}+ beds
                          <button onClick={() => setMinBedrooms(0)}>
                            <X size={10} />
                          </button>
                        </span>
                      )}
                      {minBathrooms > 0 && (
                        <span className="inline-flex items-center gap-1 bg-earth-brown/10 text-earth-brown text-xs px-3 py-1 rounded-full">
                          {minBathrooms}+ baths
                          <button onClick={() => setMinBathrooms(0)}>
                            <X size={10} />
                          </button>
                        </span>
                      )}
                      {maxGuests > 0 && (
                        <span className="inline-flex items-center gap-1 bg-earth-brown/10 text-earth-brown text-xs px-3 py-1 rounded-full">
                          {maxGuests}+ guests
                          <button onClick={() => setMaxGuests(0)}>
                            <X size={10} />
                          </button>
                        </span>
                      )}
                      {selectedAmenities.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1 bg-earth-brown/10 text-earth-brown text-xs px-3 py-1 rounded-full"
                        >
                          {a}
                          <button onClick={() => toggleAmenity(a)}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/2] mb-4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredProperties.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {filteredProperties.map((property) => (
                        <motion.div key={property._id || property.id} variants={cardVariants}>
                          <PropertyCard property={property} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 bg-light-beige/30 dark:bg-gray-800 rounded-xl">
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        No properties match your search criteria
                      </p>
                      <Button
                        onClick={() => {
                          setActiveType('All');
                          setSearchQuery('');
                          setPriceRange([0, 100000]);
                          setSortBy('');
                          resetAdvanced();
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
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

export default AllProperties;
