import React from 'react';

const DashboardPropertySkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

export default DashboardPropertySkeleton;
