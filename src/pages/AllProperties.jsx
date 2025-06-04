import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, MapPin, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const AllProperties = () => {
  // Mock properties data
  const mockProperties = [
    {
      id: 1,
      name: 'Modern Apartment in Downtown',
      location: 'New York, NY',
      price: 120,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      type: 'Apartment'
    },
    {
      id: 2,
      name: 'Cozy Beach House',
      location: 'Miami, FL',
      price: 200,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      type: 'House'
    },
    {
      id: 3,
      name: 'Mountain View Cabin',
      location: 'Denver, CO',
      price: 150,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Cabin'
    },
    {
      id: 4,
      name: 'Luxury Penthouse',
      location: 'Los Angeles, CA',
      price: 350,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      type: 'Apartment'
    },
    {
      id: 5,
      name: 'Historic Townhouse',
      location: 'Boston, MA',
      price: 180,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'House'
    },
    {
      id: 6,
      name: 'Lakefront Cottage',
      location: 'Chicago, IL',
      price: 140,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Cottage'
    },
    {
      id: 7,
      name: 'Urban Loft',
      location: 'Seattle, WA',
      price: 165,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Apartment'
    },
    {
      id: 8,
      name: 'Desert Retreat',
      location: 'Phoenix, AZ',
      price: 130,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Villa'
    },
    {
      id: 9,
      name: 'Oceanfront Villa',
      location: 'Malibu, CA',
      price: 450,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Villa'
    },
    {
      id: 10,
      name: 'Downtown Loft',
      location: 'Portland, OR',
      price: 175,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Apartment'
    }
  ];

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false); // Changed to false since we're using mock data

  const propertyTypeOptions = ['All', 'Apartment', 'House', 'Villa', 'Cabin', 'Cottage'];
  const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Rating: High to Low', 'Latest'];

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 500); // Small delay to simulate network request
  }, []);

  useEffect(() => {
    // Filter properties based on type, search query, and price range
    let filtered = properties;
    
    // Filter by type
    if (activeType !== 'All') {
      filtered = filtered.filter(property => property.type === activeType);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        property => 
          property.name.toLowerCase().includes(query) || 
          property.location.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(
      property => property.price >= priceRange[0] && property.price <= priceRange[1]
    );
    
    // Apply sorting
    if (sortBy === 'Price: Low to High') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating: High to Low') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Latest') {
      filtered = [...filtered].sort((a, b) => b.id - a.id); // Assuming higher ID means newer
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
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-grow pt-24">
          <section className="bg-gradient-to-b from-light-beige to-white py-16">
            <div className="page-container">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <Badge className="mb-3 bg-earth-brown/20 text-earth-brown hover:bg-earth-brown/30 border-none">
                  Explore Properties
                </Badge>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                  Find Your Perfect Stay
                </h1>
                <p className="text-lg text-gray-700">
                  Browse our curated collection of exceptional properties around the world
                </p>
              </div>
              
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-earth-brown" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by location or property name..."
                    className="pl-10 py-6 border-cream-beige focus:border-earth-brown text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </section>
          
          <section className="py-12 bg-white">
            <div className="page-container">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters sidebar */}
                <div className="w-full lg:w-1/4 space-y-6">
                  <div className="bg-light-beige/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-earth-brown mb-4">Filters</h3>
                    
                    {/* Property Type Filter */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Property Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {propertyTypeOptions.map(type => (
                          <Badge 
                            key={type} 
                            className={`px-3 py-1.5 cursor-pointer ${
                              activeType === type 
                                ? "bg-earth-brown text-white" 
                                : "bg-white text-gray-700 hover:bg-gray-100"
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
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                      <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Sort Option */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map(option => (
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
                    <h2 className="text-2xl font-semibold text-gray-900">
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
                          <div className="bg-gray-200 rounded-lg aspect-[3/2] mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    filteredProperties.length > 0 ? (
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      >
                        {filteredProperties.map(property => (
                          <motion.div key={property.id} variants={cardVariants}>
                            <PropertyCard property={property} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="text-center py-12 bg-light-beige/30 rounded-xl">
                        <p className="text-lg text-gray-700 mb-4">No properties match your search criteria</p>
                        <Button onClick={() => {
                          setActiveType('All');
                          setSearchQuery('');
                          setPriceRange([0, 500]);
                          setSortBy('');
                        }}>
                          Reset Filters
                        </Button>
                      </div>
                    )
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