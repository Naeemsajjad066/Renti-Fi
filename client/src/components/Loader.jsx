import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4"
      >
        <div className="text-center">
          {/* Animated Logo */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-earth-brown to-soft-peach rounded-xl flex items-center justify-center shadow-lg">
                <Home size={32} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-soft-peach"></div>
            </motion.div>
          </div>

          {/* Brand Name */}
          <div className="mb-4">
            <span className="text-2xl font-display font-bold">
              <span className="text-earth-brown">Rent</span>
              <span className="text-soft-peach">ifi</span>
            </span>
          </div>

          {/* Loading Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 font-medium mb-6"
          >
            {message}
          </motion.p>

          {/* Loading Dots Animation */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  y: [-4, 4, -4],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-3 h-3 bg-gradient-to-r from-earth-brown to-soft-peach rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
