import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * Renders the Stripe syncing indicator and error banner in one block.
 * Both are optional — pass the relevant props only when their state is active.
 */
const BookingStatusBanners = ({ stripeChecking, error }) => (
  <>
    {/* Syncing indicator */}
    <AnimatePresence>
      {stripeChecking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-4 flex items-center gap-2.5 text-sm text-earth-brown bg-earth-brown/8 dark:bg-earth-brown/15 border border-earth-brown/20 rounded-xl px-4 py-2.5"
        >
          <Loader2 size={14} className="animate-spin shrink-0" />
          Syncing your booking — it will appear below in a moment…
        </motion.div>
      )}
    </AnimatePresence>

    {/* Error banner */}
    {error && (
      <div className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
        {error}
      </div>
    )}
  </>
);

export default BookingStatusBanners;
