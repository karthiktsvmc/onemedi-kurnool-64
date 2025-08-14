
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/shared/lib/utils';
import { getImageWithFallback, handleImageError } from '@/frontend/utils/imageUtils';

interface CategoryTileProps {
  id: string;
  name: string;
  image: string;
  isSelected: boolean;
  onClick: () => void;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  id,
  name,
  image,
  isSelected,
  onClick
}) => {
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tileRef.current) {
      gsap.fromTo(tileRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const handleClick = () => {
    if (tileRef.current) {
      gsap.to(tileRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
    onClick();
  };

  return (
    <div
      ref={tileRef}
      className="flex flex-col items-center cursor-pointer transition-all duration-200 min-w-[80px] snap-start group"
      onClick={handleClick}
    >
      <div className="relative mb-2">
        <img
          src={getImageWithFallback(image, 'category')}
          alt={name}
          className={`w-12 h-12 rounded-full object-cover transition-all duration-300 group-hover:scale-110 ${
            isSelected 
              ? 'ring-3 ring-primary ring-offset-2 shadow-lg scale-105' 
              : 'group-hover:shadow-md'
          }`}
          onError={(e) => handleImageError(e, 'category')}
        />
      </div>
      <span className={`text-xs font-medium text-center leading-tight transition-colors duration-200 ${
        isSelected ? 'text-primary font-semibold' : 'text-foreground group-hover:text-primary'
      }`}>
        {name}
      </span>
    </div>
  );
};
