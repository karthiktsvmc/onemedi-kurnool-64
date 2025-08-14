import { useState, useRef, useEffect } from 'react';

interface UseImageLazyLoadProps {
  src: string;
  placeholder?: string;
  threshold?: number;
}

export function useImageLazyLoad({ 
  src, 
  placeholder = '/api/placeholder/400/300',
  threshold = 0.1 
}: UseImageLazyLoadProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!imageRef) return;

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
      { threshold }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef, src, threshold]);

  return {
    imageSrc,
    setImageRef,
    isLoaded,
    isError
  };
}