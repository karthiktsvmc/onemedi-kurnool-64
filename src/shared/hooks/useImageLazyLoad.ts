import { useState, useEffect, useRef } from 'react';

interface UseImageLazyLoadOptions {
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
}

export const useImageLazyLoad = (
  src: string,
  options: UseImageLazyLoadOptions = {}
) => {
  const [imageSrc, setImageSrc] = useState(options.placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            observer.disconnect();
          };
          img.onerror = () => {
            setIsError(true);
            observer.disconnect();
          };
          img.src = src;
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, options.threshold, options.rootMargin]);

  return {
    imgRef,
    imageSrc,
    isLoaded,
    isError,
  };
};