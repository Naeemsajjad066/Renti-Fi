import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Home as HomeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import PropertyTypeFilter from './PropertyTypeFilter';
import { cardStagger, cardFadeUp } from '@/constants';

const PropertyCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl overflow-hidden">
    <div className="bg-gray-200 dark:bg-gray-700 aspect-[4/3] rounded-2xl mb-3" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
  </div>
);

const EmptyState = ({ onReset }) => (
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
      onClick={onReset}
      className="bg-earth-brown text-white hover:bg-earth-brown/90 rounded-xl"
    >
      Show All Properties
    </Button>
  </div>
);

const ExplorePropertiesSection = ({ properties, loading }) => {
  const [activeType, setActiveType] = useState('All');

  const filteredProperties =
    activeType === 'All'
      ? properties
      : properties.filter((p) => p.propertyType === activeType.toLowerCase());

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

        <PropertyTypeFilter onTypeChange={setActiveType} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <EmptyState onReset={() => setActiveType('All')} />
        ) : (
          <motion.div
            variants={cardStagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProperties.map((property) => (
              <motion.div key={property._id || property.id} variants={cardFadeUp}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExplorePropertiesSection;
