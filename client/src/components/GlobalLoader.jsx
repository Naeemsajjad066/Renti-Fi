import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';
import Loader from './Loader';

const GlobalLoader = () => {
  const { loading, loadingMessage } = useLoading();

  return <AnimatePresence>{loading && <Loader message={loadingMessage} />}</AnimatePresence>;
};

export default GlobalLoader;
