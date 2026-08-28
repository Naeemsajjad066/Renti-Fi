import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LoadingContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message);
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
    setLoadingMessage('');
  }, []);

  const value = useMemo(
    () => ({
      loading,
      loadingMessage,
      showLoading,
      hideLoading,
    }),
    [loading, loadingMessage, showLoading, hideLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
