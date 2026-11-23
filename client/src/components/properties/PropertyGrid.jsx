import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { cardStagger, cardFadeUp } from '@/constants';

const PropertyCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/2] mb-4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
  </div>
);

const EmptyState = ({ onReset }) => (
  <div className="text-center py-12 bg-light-beige/30 dark:bg-gray-800 rounded-xl">
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      No properties match your search criteria
    </p>
    <Button onClick={onReset}>Reset Filters</Button>
  </div>
);

const PropertyGrid = ({ properties, loading, onResetFilters }) => (
  <div className="w-full lg:w-3/4">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
      </h2>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter size={16} />
        <span className="hidden md:inline">Advanced Filters</span>
      </Button>
    </div>

    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    ) : properties.length === 0 ? (
      <EmptyState onReset={onResetFilters} />
    ) : (
      <motion.div
        variants={cardStagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {properties.map((property) => (
          <motion.div key={property._id || property.id} variants={cardFadeUp}>
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </motion.div>
    )}
  </div>
);

export default PropertyGrid;
