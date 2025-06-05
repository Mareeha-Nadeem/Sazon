import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Skeleton = memo(({ className }) => (
  <div 
    className={`animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded ${className}`}
  />
));

Skeleton.propTypes = {
  className: PropTypes.string
};

const LoadingSkeleton = ({ type = 'block', count = 1 }) => {
  const renderSearchSkeleton = () => (
    <div className="flex gap-6 w-full">
      <Skeleton className="h-12 flex-1 rounded-lg" />
      <Skeleton className="h-12 w-32 rounded-lg" />
    </div>
  );

  const renderFeatureCardSkeleton = () => (
    <div className="relative h-[700px] w-full overflow-hidden rounded-2xl bg-white">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-24 h-10 rounded-lg" />
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-3/4 h-16" />
            <Skeleton className="w-2/3 h-6" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="w-40 h-14 rounded-lg" />
            <Skeleton className="w-32 h-8" />
          </div>
          <div className="flex items-center gap-8 pt-8">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-6" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-base">
          <Skeleton className="w-full h-48 rounded-t-lg" />
          <div className="p-6 space-y-4">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
    </div>
  );

  const renderBlockSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="w-full h-32" />
      ))}
    </div>
  );

  switch (type) {
    case 'search':
      return renderSearchSkeleton();
    case 'feature-card':
      return renderFeatureCardSkeleton();
    case 'grid':
      return renderGridSkeleton();
    case 'spinner':
      return renderSpinner();
    default:
      return renderBlockSkeleton();
  }
};

LoadingSkeleton.propTypes = {
  type: PropTypes.oneOf(['block', 'search', 'feature-card', 'grid', 'spinner']),
  count: PropTypes.number
};

export default memo(LoadingSkeleton); 