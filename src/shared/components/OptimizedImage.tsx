import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useImageLazyLoad } from '@/shared/hooks/useImageLazyLoad';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: React.ReactNode;
  lazy?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  lazy = true,
  aspectRatio = 'auto',
  className,
  ...props
}) => {
  const { imgRef, imageSrc, isLoaded, isError } = useImageLazyLoad(src, {
    placeholder: placeholder || '/placeholder.svg'
  });

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  }[aspectRatio];

  if (isError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-muted text-muted-foreground rounded-lg',
        aspectRatioClass,
        className
      )}>
        {fallback || (
          <div className="flex flex-col items-center gap-2 p-4">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">Image not available</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClass, className)}>
      <img
        ref={lazy ? imgRef : undefined}
        src={lazy ? imageSrc : src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};