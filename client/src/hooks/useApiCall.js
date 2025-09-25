import { useLoading } from '../contexts/LoadingContext';

// Custom hook for easier loading management
export const useApiCall = () => {
  const { showLoading, hideLoading } = useLoading();

  const callWithLoading = async (apiCall, loadingMessage = 'Processing...') => {
    showLoading(loadingMessage);
    try {
      const result = await apiCall();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    callWithLoading,
    showLoading,
    hideLoading
  };
};

export default useApiCall;