import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, CheckCircle, Clock } from 'lucide-react';

const PaymentSummaryCard = ({ booking, showHostPayout = false, dark = true }) => {
  const cardBg = dark ? 'bg-white dark:bg-gray-800' : 'bg-white';
  const textPrimary = dark ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900';
  const textMuted = dark ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600';
  const textSubtle = dark ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500';
  const borderClass = dark ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`${cardBg} rounded-lg shadow-md p-6`}
    >
      <h3 className={`text-xl font-semibold ${textPrimary} mb-4 flex items-center`}>
        <DollarSign size={20} className="mr-2" />
        Payment Summary
      </h3>

      {/* Breakdown */}
      <div className="space-y-3 mb-4">
        <div className={`flex justify-between ${textMuted}`}>
          <span>Base price ({booking.nights} nights)</span>
          <span>Rs {booking.basePrice.toLocaleString()}</span>
        </div>
        {booking.cleaningFee > 0 && (
          <div className={`flex justify-between ${textMuted}`}>
            <span>Cleaning fee</span>
            <span>Rs {booking.cleaningFee.toLocaleString()}</span>
          </div>
        )}
        {booking.serviceFee > 0 && (
          <div className={`flex justify-between ${textMuted}`}>
            <span>Service fee</span>
            <span>Rs {booking.serviceFee.toLocaleString()}</span>
          </div>
        )}
        {booking.taxes > 0 && (
          <div className={`flex justify-between ${textMuted}`}>
            <span>Taxes</span>
            <span>Rs {booking.taxes.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className={`pt-4 border-t ${borderClass} mb-4`}>
        <div className={`flex justify-between text-lg font-bold ${textPrimary}`}>
          <span>Total</span>
          <span>Rs {booking.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Host payout (host view only) */}
      {showHostPayout && booking.hostPayout > 0 && (
        <div className={`pt-4 border-t ${borderClass} mb-4`}>
          <div className={`flex justify-between ${textMuted} mb-2`}>
            <span>Platform Fee (5%)</span>
            <span>Rs {booking.platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-green-600">
            <span>Your Payout</span>
            <span>Rs {booking.hostPayout.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Payment option + breakdown */}
      <div className={`space-y-3 pt-4 border-t ${borderClass}`}>
        <div className={`flex items-center text-sm ${textMuted} mb-2`}>
          <CreditCard size={16} className="mr-2" />
          <span className="font-medium">
            Payment Option:{' '}
            {booking.paymentOption === 'early' ? 'Early Payment' : 'Payment on Arrival'}
          </span>
        </div>

        {booking.paymentOption === 'early' && booking.paymentBreakdown && (
          <>
            <div
              className={`flex justify-between items-center ${booking.paymentBreakdown.upfrontPaid ? 'text-green-600 dark:text-green-400' : textMuted}`}
            >
              <span className="flex items-center text-sm">
                {booking.paymentBreakdown.upfrontPaid && (
                  <CheckCircle size={16} className="mr-2" />
                )}
                Upfront (40%)
              </span>
              <span className="font-semibold">
                Rs {booking.paymentBreakdown.upfrontAmount.toLocaleString()}
              </span>
            </div>
            {booking.paymentBreakdown.upfrontPaid && booking.paymentBreakdown.upfrontPaidAt && (
              <div className={`text-xs ${textSubtle} ml-6`}>
                Paid on{' '}
                {new Date(booking.paymentBreakdown.upfrontPaidAt).toLocaleDateString()}
              </div>
            )}
            <div
              className={`flex justify-between items-center ${booking.paymentBreakdown.arrivalPaid ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}
            >
              <span className="flex items-center text-sm">
                {booking.paymentBreakdown.arrivalPaid ? (
                  <CheckCircle size={16} className="mr-2" />
                ) : (
                  <Clock size={16} className="mr-2" />
                )}
                On Arrival (60%)
              </span>
              <span className="font-semibold">
                Rs {booking.paymentBreakdown.arrivalAmount.toLocaleString()}
              </span>
            </div>
            {!booking.paymentBreakdown.arrivalPaid && booking.status !== 'cancelled' && (
              <div className="text-xs text-orange-600 dark:text-orange-400 ml-6">
                {showHostPayout ? 'To be collected at property' : 'Pay at property'}
              </div>
            )}
          </>
        )}

        {booking.paymentOption === 'arrival' && (
          <div
            className={`flex justify-between items-center ${booking.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}
          >
            <span className="flex items-center text-sm">
              {booking.paymentStatus === 'paid' ? (
                <CheckCircle size={16} className="mr-2" />
              ) : (
                <Clock size={16} className="mr-2" />
              )}
              Full Payment on Arrival
            </span>
            <span className="font-semibold">Rs {booking.totalPrice.toLocaleString()}</span>
          </div>
        )}

        {booking.refundAmount > 0 && (
          <div
            className={`flex justify-between items-center text-blue-600 dark:text-blue-400 pt-3 border-t ${borderClass}`}
          >
            <span className="text-sm">Refunded</span>
            <span className="font-semibold">Rs {booking.refundAmount.toLocaleString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentSummaryCard;
