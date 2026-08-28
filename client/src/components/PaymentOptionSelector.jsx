import React from 'react';
import { CreditCard, Banknote, ShieldCheck, Clock } from 'lucide-react';

/**
 * PaymentOptionSelector
 * Renders 1 or 2 stacked payment option cards that match the booking card's
 * earth-brown design system. Cards are always full-width (never side-by-side)
 * so they fit cleanly inside the narrow booking sidebar.
 */
const PaymentOptionSelector = ({
  selectedOption,
  onOptionChange,
  totalPrice,
  propertyPaymentOptions,
}) => {
  const upfront  = Math.round(totalPrice * 0.4);
  const onArrival = Math.round(totalPrice * 0.6);

  const options = [
    {
      id: 'arrival',
      icon: Banknote,
      title: 'Pay on Arrival',
      subtitle: 'Full cash payment when you check in',
      pill: { label: 'No card needed', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
      meta: [
        { label: 'Due today',    value: 'Rs 0',                     muted: true  },
        { label: 'Due on arrival', value: `Rs ${totalPrice.toLocaleString()}`, bold: true },
      ],
      available: propertyPaymentOptions === 'arrival' || propertyPaymentOptions === 'both',
    },
    {
      id: 'early',
      icon: CreditCard,
      title: 'Pay 40% Now',
      subtitle: 'Secure your stay with Stripe',
      pill: { label: 'Instant confirmation', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
      meta: [
        { label: 'Due today (40%)',    value: `Rs ${upfront.toLocaleString()}`,   bold: true  },
        { label: 'Due on arrival (60%)', value: `Rs ${onArrival.toLocaleString()}`, muted: true },
      ],
      available: propertyPaymentOptions === 'early' || propertyPaymentOptions === 'both',
    },
  ];

  const available = options.filter(o => o.available);

  if (available.length === 0) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400 text-center">
        No payment methods configured for this property.
      </div>
    );
  }

  return (
    <div>
      {/* Section label */}
      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">
        Payment Method
      </p>

      <div className="space-y-2">
        {available.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const Icon = opt.icon;

          return (
            <label
              key={opt.id}
              className={[
                'flex items-start gap-3.5 rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-all duration-150 select-none',
                isSelected
                  ? 'border-earth-brown bg-earth-brown/5 dark:bg-earth-brown/10'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800',
              ].join(' ')}
            >
              <input
                type="radio"
                name="paymentOption"
                value={opt.id}
                checked={isSelected}
                onChange={(e) => onOptionChange(e.target.value)}
                className="sr-only"
              />

              {/* Icon */}
              <div
                className={[
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                  isSelected
                    ? 'bg-earth-brown text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
                ].join(' ')}
              >
                <Icon size={17} />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {opt.title}
                  </span>
                  {/* Custom radio dot */}
                  <span
                    className={[
                      'w-4.5 h-4.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'border-earth-brown bg-earth-brown'
                        : 'border-gray-300 dark:border-gray-600',
                    ].join(' ')}
                  >
                    {isSelected && (
                      <span className="w-[7px] h-[7px] rounded-full bg-white block" />
                    )}
                  </span>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2.5">{opt.subtitle}</p>

                {/* Amount breakdown */}
                <div className="space-y-1">
                  {opt.meta.map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{row.label}</span>
                      <span
                        className={`text-xs font-semibold ${
                          row.muted
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pill */}
                <span className={`inline-flex items-center gap-1 mt-2.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${opt.pill.color}`}>
                  {opt.id === 'early' ? <ShieldCheck size={10} /> : <Clock size={10} />}
                  {opt.pill.label}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentOptionSelector;
