import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PROPERTY_TYPE_OPTIONS,
  SORT_OPTIONS,
  PRICE_RANGE_MIN,
  PRICE_RANGE_MAX,
  PRICE_RANGE_STEP,
} from '@/constants';

const PropertyFilters = ({
  activeType,
  onTypeChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
}) => (
  <aside className="w-full lg:w-1/4">
    <div className="bg-light-beige/30 dark:bg-gray-800 rounded-xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-earth-brown dark:text-cream-beige">Filters</h3>

      {/* Property type */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Property Type</h4>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPE_OPTIONS.map((type) => (
            <Badge
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                activeType === type
                  ? 'bg-earth-brown text-white dark:bg-cream-beige dark:text-earth-brown'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Price Range (per night)
        </h4>
        <Slider
          min={PRICE_RANGE_MIN}
          max={PRICE_RANGE_MAX}
          step={PRICE_RANGE_STEP}
          value={priceRange}
          onValueChange={onPriceChange}
          className="mb-4"
        />
        <div className="flex justify-between items-center text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Rs {priceRange[0].toLocaleString()}
            </span>
          </div>
          <span className="text-gray-400">—</span>
          <div className="flex flex-col text-right">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Rs {priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort By</h4>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </aside>
);

export default PropertyFilters;
