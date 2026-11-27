import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import {
  HeroSection,
  HowItWorksSection,
  FeaturedListingsSection,
  PopularDestinationsSection,
  ExplorePropertiesSection,
  WhyChooseUsSection,
  TestimonialsSection,
  HostCTASection,
} from '@/components/home';
import useHomeProperties from '@/hooks/useHomeProperties';

const Home = () => {
  const { properties, featuredProperties, loading } = useHomeProperties();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />

        <main className="flex-grow">
          <HeroSection />
          <HowItWorksSection />
          <FeaturedListingsSection featuredProperties={featuredProperties} />
          <PopularDestinationsSection />
          <ExplorePropertiesSection properties={properties} loading={loading} />
          <WhyChooseUsSection />
          <TestimonialsSection />
          <HostCTASection />
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;
