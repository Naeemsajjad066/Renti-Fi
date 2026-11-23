import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Bookings',
    icon: Calendar,
    border: 'border-earth-brown/20',
    iconColor: 'text-earth-brown',
    valueColor: 'text-gray-900',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle2,
    border: 'border-green-200',
    iconColor: 'text-green-500',
    valueColor: 'text-green-600',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    border: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    valueColor: 'text-yellow-600',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    icon: XCircle,
    border: 'border-red-200',
    iconColor: 'text-red-500',
    valueColor: 'text-red-600',
  },
];

const BookingStatsBar = ({ stats, formatCurrency }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    {STAT_CARDS.map(({ key, label, icon: Icon, border, iconColor, valueColor }) => (
      <Card key={key} className={border}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-2xl font-bold ${valueColor}`}>{stats[key]}</p>
            </div>
            <Icon className={iconColor} size={24} />
          </div>
        </CardContent>
      </Card>
    ))}

    {/* Revenue card (always last) */}
    <Card className="border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <DollarSign className="text-blue-500" size={24} />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BookingStatsBar;
