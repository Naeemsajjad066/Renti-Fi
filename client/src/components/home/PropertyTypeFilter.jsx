import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROPERTY_TYPES } from '@/constants/home';

const PropertyTypeFilter = ({ onTypeChange }) => (
  <Tabs defaultValue="All" className="w-full mb-8" onValueChange={onTypeChange}>
    <TabsList className="flex flex-wrap items-center gap-2 bg-transparent h-auto p-0">
      {PROPERTY_TYPES.map((type) => (
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

export default PropertyTypeFilter;
