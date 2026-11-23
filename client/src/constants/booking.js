import { Clock, Check, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const BOOKING_TABS = ['all', 'upcoming', 'active', 'completed', 'cancelled'];

export const STATUS_BADGES = {
  reserved: { label: 'Reserved', className: 'bg-blue-100 text-blue-800', icon: Clock },
  upcoming: { label: 'Upcoming', className: 'bg-blue-100 text-blue-800', icon: Clock },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  active: { label: 'Active', className: 'bg-green-100 text-green-800', icon: Check },
  'checked-in': {
    label: 'Checked In',
    className: 'bg-purple-100 text-purple-800',
    icon: CheckCircle,
  },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800', icon: XCircle },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
  expired: { label: 'Expired', className: 'bg-orange-100 text-orange-800', icon: AlertCircle },
};

export const PAYMENT_STATUS_BADGES = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  partial: { label: 'Partially Paid', className: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Fully Paid', className: 'bg-green-100 text-green-800' },
  refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
};

export const HOST_BOOKING_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export const CHECKIN_TIME = '9:00 AM onwards';
export const CHECKOUT_TIME = 'Before 9:00 AM';
