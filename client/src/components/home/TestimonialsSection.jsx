import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fadeUp, TESTIMONIALS } from '@/constants';

const TestimonialsSection = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="page-container">
      <div className="text-center mb-14">
        <Badge className="mb-3 bg-earth-brown/10 text-earth-brown border-earth-brown/20 rounded-full px-4 py-1.5 text-sm">
          Guest Stories
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          What our users say
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Real experiences from real guests and hosts across Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.id}
            custom={i * 0.12}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 relative"
          >
            <Quote
              size={28}
              className="text-earth-brown/20 dark:text-earth-brown/30 absolute top-5 right-5"
            />
            <div className="flex items-center gap-1 mb-4">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cream-beige dark:border-gray-600"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
