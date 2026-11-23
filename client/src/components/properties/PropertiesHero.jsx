import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const PropertiesHero = ({ searchQuery, onSearchChange, checkInParam }) => (
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

      <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto mb-16">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={20} className="text-earth-brown" />
          </div>
          <Input
            type="text"
            placeholder="Search by location or property name..."
            className="pl-10 py-6 border-cream-beige dark:border-gray-600 focus:border-earth-brown bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </form>
    </div>
  </section>
);

export default PropertiesHero;
