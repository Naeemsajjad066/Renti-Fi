import { Home, Calendar, CheckCircle2, DollarSign } from 'lucide-react';

/**
 * Base config for the 4 dashboard stat cards.
 * `value` and `trend` are injected at runtime from live data.
 */
export const STAT_CARD_CONFIGS = [
  {
    key: 'properties',
    label: 'Total Properties',
    icon: Home,
    iconBg: 'bg-earth-brown/10 text-earth-brown',
    valueColor: 'text-gray-900 dark:text-white',
    delay: 0,
  },
  {
    key: 'total',
    label: 'Total Bookings',
    icon: Calendar,
    iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    valueColor: 'text-gray-900 dark:text-white',
    delay: 0.08,
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle2,
    iconBg: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    valueColor: 'text-green-600 dark:text-green-400',
    delay: 0.16,
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: DollarSign,
    iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    valueColor: 'text-earth-brown',
    delay: 0.24,
    isCurrency: true,
  },
];

export const BOOKING_STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export const PROPERTY_AUTO_REFRESH_MS = 30000;
export const RECENT_BOOKINGS_LIMIT = 5;
export const PROPERTIES_PREVIEW_LIMIT = 4;
