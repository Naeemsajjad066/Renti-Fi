import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PropertyCard from '@/components/PropertyCard';
import { fadeUp } from '@/constants';

const FeaturedListingsSection = ({ featuredProperties }) => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
        <div>
          <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
            Handpicked for You
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Featured Properties
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Exceptional quality, verified hosts, unforgettable stays
          </p>
        </div>
        <Link
          to="/properties"
          className="mt-4 sm:mt-0 group inline-flex items-center gap-2 text-earth-brown font-medium text-sm hover:gap-3 transition-all"
        >
          View all properties
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {featuredProperties.map((property, i) => (
          <motion.div
            key={property._id || property.id}
            custom={i * 0.1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedListingsSection;
