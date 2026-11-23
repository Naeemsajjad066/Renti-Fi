import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { fadeUp, HOW_IT_WORKS } from '@/constants';

const HowItWorksSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <div className="text-center mb-14">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Simple Process
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Book in 3 easy steps
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          From search to check-in — we've made renting a property the simplest thing you'll do
          today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-cream-beige via-earth-brown/30 to-cream-beige z-0" />

        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.step}
            custom={i * 0.12}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-cream-beige/40 dark:border-gray-700 flex items-center justify-center mb-5 relative">
              <step.icon size={28} className="text-earth-brown" />
              <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-earth-brown text-white text-xs font-bold flex items-center justify-center shadow">
                {i + 1}
              </span>
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
