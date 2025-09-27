// hooks/useImagePreloader.js
import { useState, useEffect } from 'react';

export const useImagePreloader = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          reject(src);
        };
        img.src = src;
      });
    };

    const preloadAll = async () => {
      try {
        const promises = imageUrls.map(preloadImage);
        const results = await Promise.allSettled(promises);
        
        loadedCount = results.filter(result => result.status === 'fulfilled').length;
        
        if (loadedCount === 0) {
          setError('Failed to load any images');
        }
      } catch (err) {
        setError('Error preloading images');
      } finally {
        setIsLoading(false);
      }
    };

    preloadAll();
  }, [imageUrls]);

  return { loadedImages, isLoading, error };
};

export const useOptimizedImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(options.placeholder || '/placeholder.svg');

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      setHasError(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setCurrentSrc(options.fallback || '/placeholder.svg');
    };

    // Set loading priority
    if (options.priority === 'high') {
      img.fetchPriority = 'high';
    }

    img.src = src;
  }, [src, options.fallback, options.placeholder, options.priority]);

  return { currentSrc, isLoaded, hasError };
};