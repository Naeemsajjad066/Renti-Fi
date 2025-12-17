import React from 'react';
import { CreditCard, Banknote, Info } from 'lucide-react';

const PaymentOptionSelector = ({ 
  selectedOption, 
  onOptionChange, 
  totalPrice, 
  propertyPaymentOptions 
}) => {
  
  const upfrontAmount = (totalPrice * 0.4).toFixed(0);
  const arrivalAmount = (totalPrice * 0.6).toFixed(0);

  const paymentOptions = [
    {
      id: 'arrival',
      title: 'Pay on Arrival',
      icon: <Banknote className="w-6 h-6" />,
      description: 'Pay full amount in cash when you arrive',
      breakdown: [
        { label: 'Due on arrival', amount: totalPrice }
      ],
      badge: 'No upfront payment',
      available: propertyPaymentOptions === 'arrival' || propertyPaymentOptions === 'both'
    },
    {
      id: 'early',
      title: 'Pay Now (40% Advance)',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure your booking with online payment',
      breakdown: [
        { label: 'Pay now (40%)', amount: parseInt(upfrontAmount) },
        { label: 'Due on arrival (60%)', amount: parseInt(arrivalAmount) }
      ],
      badge: 'Secure with Stripe',
      available: propertyPaymentOptions === 'early' || propertyPaymentOptions === 'both'
    }
  ];

  const availableOptions = paymentOptions.filter(opt => opt.available);

  if (availableOptions.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Payment options not configured for this property</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Choose Payment Method
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {availableOptions.map((option) => (
          <label
            key={option.id}
            className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedOption === option.id
                ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentOption"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={(e) => onOptionChange(e.target.value)}
              className="sr-only"
            />
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedOption === option.id
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {option.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{option.title}</h4>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
              
              {selectedOption === option.id && (
                <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              {option.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">
                    Rs {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                option.id === 'early'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {option.badge}
              </span>
            </div>
          </label>
        ))}
      </div>

      {selectedOption === 'early' && (
        <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Secure Online Payment</p>
            <p>You'll pay 40% now to confirm your booking. The remaining 60% is due upon arrival at the property.</p>
          </div>
        </div>
      )}

      {selectedOption === 'arrival' && (
        <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-medium mb-1">Cash Payment on Arrival</p>
            <p>Your booking will be reserved. Full payment of Rs {totalPrice.toLocaleString()} is required when you check in.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptionSelector;
