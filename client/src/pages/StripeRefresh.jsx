import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const StripeRefresh = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const refreshOnboarding = async () => {
      try {
        // Show message that link expired
        toast({
          title: 'Link Expired',
          description: 'Your onboarding link expired. Generating a new one...',
        });

        // Wait a moment
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create new onboarding link
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe-connect/create-link`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (data.success && data.url) {
          // Redirect to new Stripe onboarding link
          window.location.href = data.url;
        } else {
          throw new Error('Failed to create new onboarding link');
        }
      } catch (error) {
        console.error('Error refreshing onboarding:', error);
        toast({
          title: 'Error',
          description: 'Failed to create new onboarding link. Redirecting to dashboard...',
          variant: 'destructive',
        });

        // Redirect back to dashboard after error
        setTimeout(() => {
          navigate('/host/dashboard');
        }, 2000);
      }
    };

    refreshOnboarding();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Refreshing Link...</h2>
          <p className="text-gray-600">
            Your previous link expired. We're generating a new one for you.
          </p>
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 text-left">
              Onboarding links expire after a short time for security. You'll be redirected to
              Stripe to continue your setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeRefresh;
