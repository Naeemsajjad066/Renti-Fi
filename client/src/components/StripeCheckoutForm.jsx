import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, CreditCard } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const StripeCheckoutForm = ({ 
  amount, 
  bookingData, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: false,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: 'Error',
        description: 'Stripe has not loaded yet. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (!cardholderName || !billingEmail) {
      toast({
        title: 'Missing information',
        description: 'Please provide cardholder name and email.',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent on backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingData })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = data;

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName,
            email: billingEmail,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend and create booking
        const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            bookingData
          })
        });

        const confirmData = await confirmResponse.json();

        if (!confirmData.success) {
          throw new Error(confirmData.message || 'Failed to confirm payment');
        }

        toast({
          title: 'Payment successful!',
          description: 'Your booking has been confirmed.',
        });

        onSuccess(confirmData.booking);
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Secure payment</span>
        </div>
      </div>

      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Amount to pay now:</span>
          <span className="text-2xl font-bold text-[#D4AF37]">
            Rs {amount.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          40% upfront payment to confirm your booking
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Billing Email
          </label>
          <input
            type="email"
            id="billingEmail"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:border-transparent">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-900">
          Your payment information is encrypted and secure. We use Stripe for payment processing and never store your card details.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C4A037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay Rs ${amount.toLocaleString()}`
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By confirming your payment, you agree to our terms and conditions.
      </p>
    </form>
  );
};

export default StripeCheckoutForm;
