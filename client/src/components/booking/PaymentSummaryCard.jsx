import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, CreditCard, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import {
  PAYMENT_OPTION,
  PAYMENT_STATUS,
  BOOKING_STATUS,
  CURRENCY,
  PLATFORM_FEE_LABEL,
  PAYMENT_SPLIT,
} from '@/constants/booking';

const UPFRONT_LABEL = `Upfront (${PAYMENT_SPLIT.UPFRONT_RATIO * 100}%)`;
const ARRIVAL_LABEL = `On Arrival (${PAYMENT_SPLIT.ARRIVAL_RATIO * 100}%)`;

const Row = ({ label, value, muted = false, bold = false }) => (
  <div className={`flex justify-between items-center ${muted ? 'opacity-70' : ''}`}>
    <span
      className={`text-sm ${bold ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
    >
      {label}
    </span>
    <span
      className={`text-sm ${bold ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
    >
      {value}
    </span>
  </div>
);

const PaymentSummaryCard = ({ booking, showHostPayout = false, dark: _dark = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
  >
    <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
      <Receipt size={17} className="text-earth-brown" />
      <h3 className="font-display font-semibold text-gray-900 dark:text-white">Payment Summary</h3>
    </div>

    <div className="p-5 space-y-3">
      <Row
        label={`Base price (${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'})`}
        value={`${CURRENCY.PREFIX}${booking.basePrice?.toLocaleString()}`}
      />
      {booking.cleaningFee > 0 && (
        <Row label="Cleaning fee" value={`${CURRENCY.PREFIX}${booking.cleaningFee.toLocaleString()}`} />
      )}
      {booking.serviceFee > 0 && (
        <Row label="Service fee" value={`${CURRENCY.PREFIX}${booking.serviceFee.toLocaleString()}`} />
      )}
      {booking.taxes > 0 && <Row label="Taxes" value={`${CURRENCY.PREFIX}${booking.taxes.toLocaleString()}`} />}

      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center bg-earth-brown/8 dark:bg-earth-brown/15 rounded-xl px-4 py-3">
          <span className="font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="text-lg font-bold text-earth-brown">
            {CURRENCY.PREFIX}{booking.totalPrice?.toLocaleString()}
          </span>
        </div>
      </div>

      {showHostPayout && booking.hostPayout > 0 && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <Row
            label={PLATFORM_FEE_LABEL}
            value={`${CURRENCY.PREFIX}${booking.platformFee?.toLocaleString()}`}
            muted
          />
          <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
            <span className="flex items-center gap-1.5 font-semibold text-green-700 dark:text-green-400">
              <TrendingUp size={14} />
              Your Payout
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {CURRENCY.PREFIX}{booking.hostPayout?.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          <CreditCard size={12} />
          Payment Breakdown
        </p>

        {booking.paymentOption === PAYMENT_OPTION.EARLY && booking.paymentBreakdown && (
          <div className="space-y-2.5">
            <div
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                booking.paymentBreakdown.upfrontPaid
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/40'
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                {booking.paymentBreakdown.upfrontPaid ? (
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                ) : (
                  <Clock size={14} className="text-gray-400 shrink-0" />
                )}
                <span
                  className={
                    booking.paymentBreakdown.upfrontPaid
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                >
                  {UPFRONT_LABEL}
                </span>
              </span>
              <span
                className={`text-sm font-semibold ${
                  booking.paymentBreakdown.upfrontPaid
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
              {CURRENCY.PREFIX}{booking.paymentBreakdown.upfrontAmount?.toLocaleString()}
              </span>
            </div>
            {booking.paymentBreakdown.upfrontPaid && booking.paymentBreakdown.upfrontPaidAt && (
              <p className="text-xs text-gray-400 dark:text-gray-500 pl-9">
                Paid on {new Date(booking.paymentBreakdown.upfrontPaidAt).toLocaleDateString()}
              </p>
            )}

            <div
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
                booking.paymentBreakdown.arrivalPaid
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-orange-50 dark:bg-orange-900/20'
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                {booking.paymentBreakdown.arrivalPaid ? (
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                ) : (
                  <Clock size={14} className="text-orange-400 shrink-0" />
                )}
                <span
                  className={
                    booking.paymentBreakdown.arrivalPaid
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-orange-700 dark:text-orange-400'
                  }
                >
                  {ARRIVAL_LABEL}
                </span>
              </span>
              <span
                className={`text-sm font-semibold ${
                  booking.paymentBreakdown.arrivalPaid
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-orange-700 dark:text-orange-400'
                }`}
              >
              {CURRENCY.PREFIX}{booking.paymentBreakdown.arrivalAmount?.toLocaleString()}
              </span>
            </div>
            {!booking.paymentBreakdown.arrivalPaid && booking.status !== BOOKING_STATUS.CANCELLED && (
              <p className="text-xs text-orange-500 dark:text-orange-400 pl-9">
                {showHostPayout ? 'To be collected at property' : 'Pay at property on arrival'}
              </p>
            )}
          </div>
        )}

        {booking.paymentOption === PAYMENT_OPTION.ARRIVAL && (
          <div
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
              booking.paymentStatus === PAYMENT_STATUS.PAID
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-orange-50 dark:bg-orange-900/20'
            }`}
          >
            <span className="flex items-center gap-2 text-sm">
              {booking.paymentStatus === PAYMENT_STATUS.PAID ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <Clock size={14} className="text-orange-400" />
              )}
              <span
                className={
                  booking.paymentStatus === PAYMENT_STATUS.PAID
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-orange-700 dark:text-orange-400'
                }
              >
                Full Payment on Arrival
              </span>
            </span>
            <span
              className={`text-sm font-semibold ${
                booking.paymentStatus === PAYMENT_STATUS.PAID
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-orange-700 dark:text-orange-400'
              }`}
            >
              {CURRENCY.PREFIX}{booking.totalPrice?.toLocaleString()}
            </span>
          </div>
        )}

        {booking.refundAmount > 0 && (
          <div className="mt-2.5 flex justify-between items-center rounded-lg px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20">
            <span className="text-sm text-blue-700 dark:text-blue-400">Refunded</span>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              {CURRENCY.PREFIX}{booking.refundAmount?.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default PaymentSummaryCard;
