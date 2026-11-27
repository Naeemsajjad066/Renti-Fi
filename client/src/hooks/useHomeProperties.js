import { useContext, useEffect } from 'react';
import { PropertyContext } from '../contexts/PropertyContext';

/**
 * Fetches and returns all properties + featured properties for the Home page.
 * Kicks off both requests on mount so the caller doesn't need to manage effects.
 */
const useHomeProperties = () => {
  const { properties, featuredProperties, loading, fetchProperties, fetchFeaturedProperties } =
    useContext(PropertyContext);

  useEffect(() => {
    fetchProperties();
    fetchFeaturedProperties();
  }, [fetchProperties, fetchFeaturedProperties]);

  return { properties, featuredProperties, loading };
};

export default useHomeProperties;
