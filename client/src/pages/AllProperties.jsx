import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { PropertiesHero, PropertyFilters, PropertyGrid } from '@/components/properties';
import usePropertyFilters from '@/hooks/usePropertyFilters';

const AllProperties = () => {
  const {
    filteredProperties,
    loading,
    checkInParam,
    activeType,
    setActiveType,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    resetFilters,
  } = usePropertyFilters();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow pt-24">
          <PropertiesHero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            checkInParam={checkInParam}
          />

          <section className="py-12 bg-white dark:bg-gray-900">
            <div className="page-container">
              <div className="flex flex-col lg:flex-row gap-8">
                <PropertyFilters
                  activeType={activeType}
                  onTypeChange={setActiveType}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                <PropertyGrid
                  properties={filteredProperties}
                  loading={loading}
                  onResetFilters={resetFilters}
                />
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
