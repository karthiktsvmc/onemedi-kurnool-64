import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface PageLoaderProps {
  type?: 'grid' | 'list' | 'detail' | 'cards';
  count?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  type = 'grid', 
  count = 8 
}) => {
  if (type === 'detail') {
    return (
      <div className="space-y-6 p-4">
        {/* Header skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Image skeleton */}
        <Skeleton className="aspect-square rounded-lg" />
        
        {/* Content skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="w-20 h-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="w-24 h-10" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`grid gap-6 ${
      type === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1'
    }`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
};