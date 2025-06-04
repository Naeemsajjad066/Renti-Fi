
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const NotFound = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-9xl font-display font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
              404
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Home size={18} className="mr-2" />
                Back to Home
              </Link>
              <Link
                to="#"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={18} className="mr-2" />
                Go Back
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
