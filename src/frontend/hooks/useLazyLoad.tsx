import { useState, useRef, useCallback } from 'react';

interface UseLazyLoadProps<T> {
  items: T[];
  initialCount?: number;
  increment?: number;
}

export function useLazyLoad<T>({ 
  items, 
  initialCount = 10, 
  increment = 10 
}: UseLazyLoadProps<T>) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  
  const displayedItems = items.slice(0, displayCount);
  const hasMore = displayCount < items.length;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDisplayCount(prev => Math.min(prev + increment, items.length));
    setLoading(false);
  }, [loading, hasMore, increment, items.length]);

  const reset = useCallback(() => {
    setDisplayCount(initialCount);
    setLoading(false);
  }, [initialCount]);

  return {
    displayedItems,
    hasMore,
    loading,
    loadMore,
    reset,
    displayCount,
    totalCount: items.length
  };
}