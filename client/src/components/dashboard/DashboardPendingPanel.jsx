import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const DashboardPendingPanel = ({ count }) => (
  <div className="mt-5 bg-gradient-to-br from-earth-brown to-earth-brown/80 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-5 text-white">
    <p className="text-sm font-medium text-white/70 mb-1">Pending approval</p>
    <p className="text-3xl font-display font-bold mb-4">{count}</p>
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/70">Needs your action</span>
      <Link
        to="/host/bookings"
        className="inline-flex items-center gap-1 font-medium text-white hover:text-white/80 transition-colors"
      >
        Review
        <ArrowUpRight size={14} />
      </Link>
    </div>
  </div>
);

export default DashboardPendingPanel;
