import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Shield, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HOST_PERKS = [
  { icon: TrendingUp, label: 'Earn up to Rs 300K/mo' },
  { icon: Calendar, label: 'Flexible scheduling' },
  { icon: Shield, label: 'Host protection' },
];

const HostCTASection = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-earth-brown via-[#b5a08d] to-soft-peach dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 shadow-xl"
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col lg:flex-row items-center">
          {/* Text side */}
          <div className="w-full lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center z-10">
            <Badge className="mb-4 w-fit bg-white/20 text-white border-white/30 rounded-full px-4 py-1.5 text-sm">
              Become a Host
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 leading-tight">
              Share your space,
              <br /> earn real income
            </h2>
            <p className="text-white/80 text-base mb-7 max-w-md leading-relaxed">
              Join thousands of hosts earning extra income. Set your own schedule, keep full
              control, and connect with travelers from across the country.
            </p>

            <div className="flex flex-wrap gap-5 mb-8">
              {HOST_PERKS.map((perk) => (
                <div key={perk.label} className="flex items-center gap-2 text-white/90 text-sm">
                  <perk.icon size={15} className="text-white/70" />
                  {perk.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/host/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-earth-brown font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-sm shadow-md"
              >
                Start Hosting Today
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium rounded-xl transition-all text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Image side */}
          <div className="w-full lg:w-1/2 relative h-64 lg:h-auto min-h-[340px]">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
              alt="Become a host"
              className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-earth-brown/60 to-transparent lg:bg-gradient-to-l" />

            {/* Floating earnings card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl z-10 min-w-[160px]"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. monthly earnings</p>
              <p className="text-2xl font-bold text-earth-brown font-display">Rs 85K</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                <TrendingUp size={12} />
                +24% this month
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HostCTASection;
