import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const StripeReturn = () => {
  const [status, setStatus] = useState('checking'); // checking, success, error
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkStripeStatus = async () => {
      try {
        // Wait a moment for Stripe to update their records
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe-connect/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const data = await response.json();

        if (data.success && data.onboardingComplete) {
          setStatus('success');
          toast({
            title: 'Success!',
            description: 'Your bank account has been connected successfully.',
          });

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/host/dashboard');
          }, 2000);
        } else if (data.success && !data.onboardingComplete) {
          // Onboarding not complete, redirect back to continue
          setStatus('error');
          toast({
            title: 'Setup Incomplete',
            description: 'Please complete the bank account setup.',
            variant: 'destructive',
          });

          setTimeout(() => {
            navigate('/host/dashboard');
          }, 2000);
        } else {
          throw new Error('Failed to verify account status');
        }
      } catch (error) {
        console.error('Error checking Stripe status:', error);
        setStatus('error');
        toast({
          title: 'Error',
          description: 'Failed to verify bank account connection.',
          variant: 'destructive',
        });

        // Still redirect to dashboard after error
        setTimeout(() => {
          navigate('/host/dashboard');
        }, 2000);
      }
    };

    checkStripeStatus();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'checking' && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing...</h2>
            <p className="text-gray-600">
              We're verifying your bank account connection. Please wait...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Set!</h2>
            <p className="text-gray-600">
              Your bank account has been connected successfully. You can now start receiving
              payouts!
            </p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Incomplete</h2>
            <p className="text-gray-600">
              Your bank account setup wasn't completed. You can try again from your dashboard.
            </p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeReturn;
