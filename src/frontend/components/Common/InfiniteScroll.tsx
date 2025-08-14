import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  loader?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  hasMore,
  loading,
  onLoadMore,
  loader,
  threshold = 200,
  className = ''
}) => {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      }, {
        rootMargin: `${threshold}px`
      });
      
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const defaultLoader = (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading more...</span>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={lastElementRef}>
          {loading ? (
            loader || defaultLoader
          ) : (
            <div className="flex justify-center py-8">
              <Button 
                variant="outline" 
                onClick={onLoadMore}
                className="px-8"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
};