import React from 'react';

const BookingSkeletonRow = () => (
  <div className="p-6 flex gap-5">
    <div className="w-40 h-28 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
    <div className="flex-1 space-y-3 pt-1">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

const BookingSkeleton = () => (
  <div className="divide-y divide-gray-100 dark:divide-gray-700/60 animate-pulse">
    {[0, 1, 2].map((i) => (
      <BookingSkeletonRow key={i} />
    ))}
  </div>
);

export default BookingSkeleton;
