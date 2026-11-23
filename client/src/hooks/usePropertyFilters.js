import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyContext } from '../contexts/PropertyContext';
import { PRICE_RANGE_DEFAULT } from '@/constants';

/**
 * Encapsulates all filter/sort/search state for the AllProperties page.
 * Reads initial city + checkIn values from URL search params.
 * Returns derived filteredProperties alongside state setters.
 */
const usePropertyFilters = () => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || '';
  const checkInParam = searchParams.get('checkIn') || '';

  const { properties, loading, fetchProperties } = useContext(PropertyContext);

  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState(cityParam);
  const [priceRange, setPriceRange] = useState(PRICE_RANGE_DEFAULT);
  const [sortBy, setSortBy] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    let result = [...properties];

    if (activeType !== 'All') {
      result = result.filter(
        (p) =>
          p.propertyType?.toLowerCase() === activeType.toLowerCase() ||
          p.type?.toLowerCase() === activeType.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title || p.name)?.toLowerCase().includes(q) ||
          (p.city && p.state ? `${p.city}, ${p.state}` : p.location)?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating: High to Low') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Latest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredProperties(result);
  }, [activeType, searchQuery, priceRange, sortBy, properties]);

  const resetFilters = () => {
    setActiveType('All');
    setSearchQuery('');
    setPriceRange(PRICE_RANGE_DEFAULT);
    setSortBy('');
  };

  return {
    // data
    filteredProperties,
    loading,
    checkInParam,
    // filter state
    activeType,
    setActiveType,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
  };
};

export default usePropertyFilters;
