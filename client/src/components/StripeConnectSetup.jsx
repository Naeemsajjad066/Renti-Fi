import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, Loader2, DollarSign } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const StripeConnectSetup = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [stripeStatus, setStripeStatus] = useState({
    connected: false,
    onboardingComplete: false,
    accountStatus: null
  });
  const { toast } = useToast();

  // Check Stripe connection status on mount
  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe-connect/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStripeStatus(data);
      }
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleConnectStripe = async () => {
    console.log('Connect Stripe clicked');
    setLoading(true);
    try {
      // First, create Stripe account if not exists
      if (!stripeStatus.connected) {
        console.log('Creating Stripe account...');
        const createResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe-connect/create-account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('Create response status:', createResponse.status);
        const createData = await createResponse.json();
        console.log('Create data:', createData);
        
        if (!createData.success) {
          throw new Error(createData.message);
        }
      }

      // Get onboarding link
      console.log('Getting onboarding link...');
      const linkResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe-connect/create-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Link response status:', linkResponse.status);
      const linkData = await linkResponse.json();
      console.log('Link data:', linkData);
      
      if (linkData.success && linkData.url) {
        console.log('Redirecting to:', linkData.url);
        // Redirect to Stripe onboarding
        window.location.href = linkData.url;
      } else {
        throw new Error(linkData.message || 'No onboarding URL received');
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to connect Stripe account',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleViewDashboard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe-connect/dashboard-link`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open Stripe dashboard',
        variant: 'destructive'
      });
    }
  };

  if (checkingStatus) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Checking Stripe status...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg p-8 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            stripeStatus.onboardingComplete ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {stripeStatus.onboardingComplete ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <CreditCard className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Bank Account Setup</h3>
            <p className="text-gray-600 mt-1">
              {stripeStatus.onboardingComplete 
                ? 'Your bank account is connected and ready to receive payouts' 
                : 'Link your bank account to receive automatic payouts'}
            </p>
          </div>
        </div>

        {stripeStatus.onboardingComplete && (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Active
          </div>
        )}
      </div>

      {!stripeStatus.onboardingComplete ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">How Payments Work</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Required to list properties and receive payouts</li>
                  <li>Guests pay to RentiFi's secure platform</li>
                  <li>We automatically transfer 95% to your bank account</li>
                  <li>Track your earnings in the Stripe dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">1</div>
              <p className="text-sm text-gray-600">Click "Connect Stripe"</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">2</div>
              <p className="text-sm text-gray-600">Complete Stripe setup</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">3</div>
              <p className="text-sm text-gray-600">Start receiving payments</p>
            </div>
          </div>

          <button
            onClick={handleConnectStripe}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5 mr-2" />
                Link Bank Account
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Powered by Stripe Connect • Secure and PCI compliant
          </p>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-900">
                <p className="font-medium mb-2">Your bank account is connected!</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>You can now list properties</li>
                  <li>RentiFi will receive payments from guests</li>
                  <li>Automatic transfers to your bank (95% of booking)</li>
                  <li>View your earnings in Stripe dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleViewDashboard}
              className="py-3 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              View Earnings
            </button>
            <button
              onClick={checkStripeStatus}
              className="py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Refresh Status
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default StripeConnectSetup;
