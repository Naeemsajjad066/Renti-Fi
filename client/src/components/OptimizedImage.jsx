// components/OptimizedImage.jsx
import { useEffect, useState } from 'react';
import { useOptimizedImage } from '../hooks/useImagePreloader';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  priority = 'auto',
  placeholder = '/placeholder.svg',
  fallback = '/placeholder.svg',
  onLoad,
  onError,
  ...props
}) => {
  const [showLoader, setShowLoader] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { currentSrc, isLoaded } = useOptimizedImage(src, {
    priority,
    placeholder,
    fallback,
  });

  useEffect(() => {
    setImageLoaded(false);
  }, [src]);

  const handleLoad = (e) => {
    setShowLoader(false);
    setImageLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setShowLoader(false);
    onError?.(e);
  };

  return (
    <div className="relative">
      {showLoader && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="w-8 h-8 border-2 border-earth-brown border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded || imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={priority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
