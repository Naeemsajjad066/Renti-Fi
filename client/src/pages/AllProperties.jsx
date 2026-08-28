import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, Calendar } from 'lucide-react';
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

const AllProperties = () => {
  // Mock properties data

  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const checkInParam = searchParams.get('checkIn');

  const { properties, loading, fetchProperties } = useContext(PropertyContext);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState(cityParam || '');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('');

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

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    // Set initial filtered properties when properties load
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    // Filter properties based on type, search query, and price range
    let filtered = properties;

    // Filter by type
    if (activeType !== 'All') {
      filtered = filtered.filter(
        (property) =>
          property.propertyType?.toLowerCase() === activeType.toLowerCase() ||
          property.type?.toLowerCase() === activeType.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          (property.title || property.name)?.toLowerCase().includes(query) ||
          (property.city && property.state
            ? `${property.city}, ${property.state}`
            : property.location
          )
            ?.toLowerCase()
            .includes(query) ||
          property.description?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (property) => property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Apply sorting
    if (sortBy === 'Price: Low to High') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating: High to Low') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Latest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    setFilteredProperties(filtered);
  }, [activeType, searchQuery, priceRange, sortBy, properties]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow pt-24">
          <section className="bg-gradient-to-b from-light-beige to-white dark:from-gray-800 dark:to-gray-900 py-16">
            <div className="page-container">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <Badge className="mb-3 bg-earth-brown/20 dark:bg-earth-brown/30 text-earth-brown hover:bg-earth-brown/30 dark:hover:bg-earth-brown/40 border-none">
                  Explore Properties
                </Badge>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Find Your Perfect Stay
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Browse our curated collection of exceptional properties around the world
                </p>
                {checkInParam && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-earth-brown/10 dark:bg-earth-brown/20 text-earth-brown dark:text-cream-beige px-4 py-2 rounded-full text-sm">
                    <Calendar size={16} />
                    <span>Check-in: {formatDate(checkInParam)}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-earth-brown" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by location or property name..."
                    className="pl-10 py-6 border-cream-beige dark:border-gray-600 focus:border-earth-brown bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </section>

          <section className="py-12 bg-white dark:bg-gray-900">
            <div className="page-container">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters sidebar */}
                <div className="w-full lg:w-1/4 space-y-6">
                  <div className="bg-light-beige/30 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-earth-brown dark:text-cream-beige mb-4">
                      Filters
                    </h3>

                    {/* Property Type Filter */}
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

                    {/* Price Range Filter */}
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

                    {/* Sort Option */}
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
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {filteredProperties.length} Properties
                    </h2>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      <span className="hidden md:inline">Advanced Filters</span>
                    </Button>
                  </div>

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
