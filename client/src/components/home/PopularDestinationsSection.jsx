import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fadeUp, DESTINATIONS } from '@/constants';

const PopularDestinationsSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <div className="text-center mb-12">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Top Destinations
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Explore Popular Cities
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Discover the most booked destinations across Pakistan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DESTINATIONS.map((dest, i) => (
          <Link key={dest.id} to={`/properties?city=${encodeURIComponent(dest.name)}`}>
            <motion.div
              custom={i * 0.1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.22 }}
              className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer aspect-[3/4]"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <span className="absolute top-3 left-3 text-[11px] font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-2.5 py-1">
                {dest.tag}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-display font-bold leading-tight">{dest.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-white/75">{dest.properties} properties</p>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PopularDestinationsSection;
