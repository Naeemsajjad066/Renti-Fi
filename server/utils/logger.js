// Environment-based logging utility
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug('🐛', message, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (isDevelopment) {
      console.info('ℹ️', message, ...args);
    }
  },
  
  warn: (message, ...args) => {
    console.warn('⚠️', message, ...args);
  },
  
  error: (message, ...args) => {
    console.error('❌', message, ...args);
  },
  
  success: (message, ...args) => {
    if (isDevelopment) {
      console.log('✅', message, ...args);
    }
  },

  performance: (operation, duration) => {
    if (isDevelopment) {
      console.log(`⚡ ${operation} completed in ${duration}ms`);
    }
  }
};

export default logger;