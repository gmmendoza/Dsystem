import React from 'react';

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="animate-pulse space-y-4 w-full">
    <div className="h-10 bg-gray-800 rounded-lg w-full" />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-800/40 rounded-xl w-full" />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-gray-800/40 border border-gray-800 rounded-2xl h-32 w-full shadow-lg" />
);

export const FormSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 bg-gray-800 rounded w-1/4" />
    <div className="h-12 bg-gray-800 rounded-xl w-full" />
    <div className="h-6 bg-gray-800 rounded w-1/3" />
    <div className="h-12 bg-gray-800 rounded-xl w-full" />
    <div className="h-14 bg-gray-700/50 rounded-xl w-full mt-8" />
  </div>
);
