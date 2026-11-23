import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { fadeUp, FEATURES } from '@/constants';

const WhyChooseUsSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-950">
    <div className="page-container">
      <div className="text-center mb-14">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Why Rentifi
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          A better way to rent
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          We've rethought every step of the rental experience so you can focus on what matters —
          enjoying your stay.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            custom={i * 0.12}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}
            >
              <f.icon size={22} />
            </div>
            <h3 className="text-base font-display font-semibold text-gray-900 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;
