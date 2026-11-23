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
  <section className="relative overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover dark:brightness-50"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 dark:from-gray-950/80 dark:via-gray-950/70 dark:to-gray-950/90" />

    <div className="relative z-10 page-container py-20 pb-10">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <Badge className="mb-4 bg-white/20 dark:bg-white/10 text-white border-white/30 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm">
          Explore Properties
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow">
          Find Your Perfect Stay
        </h1>
        <p className="text-lg text-white/80 dark:text-white/60">
          Browse our curated collection of exceptional properties across Pakistan
        </p>
        {checkInParam && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm">
            <Calendar size={16} />
            <span>Check-in: {formatDate(checkInParam)}</span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto translate-y-6">
        <div className="relative shadow-2xl rounded-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <Search size={20} className="text-earth-brown" />
          </div>
          <Input
            type="text"
            placeholder="Search by location or property name..."
            className="pl-12 py-6 text-base rounded-2xl border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-earth-brown focus:ring-2 focus:ring-earth-brown/20 shadow-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </form>
    </div>
  </section>
);

export default PropertiesHero;
