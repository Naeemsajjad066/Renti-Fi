import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const StripeSuccessBanner = ({ onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    className="mb-6 flex items-start gap-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-2xl px-5 py-4"
  >
    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-green-800 dark:text-green-300">
        Payment successful — booking confirmed!
      </p>
      <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
        Your advance payment was received. Check the details below and watch for a confirmation
        email.
      </p>
    </div>
    <button
      onClick={onDismiss}
      className="text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-colors shrink-0 mt-0.5"
      aria-label="Dismiss"
    >
      <X size={16} />
    </button>
  </motion.div>
);

export default StripeSuccessBanner;
