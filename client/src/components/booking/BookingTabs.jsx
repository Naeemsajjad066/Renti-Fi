import React from 'react';
import { BOOKING_TABS } from '@/constants';

const BookingTabs = ({ activeTab, onTabChange }) => (
  <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800 scrollbar-none">
    {BOOKING_TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
          activeTab === tab
            ? 'border-earth-brown text-earth-brown dark:text-cream-beige'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);

export default BookingTabs;
