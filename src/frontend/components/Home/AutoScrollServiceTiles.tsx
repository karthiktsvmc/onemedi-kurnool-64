import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { ServiceTile } from '@/frontend/components/Layout/ServiceTile';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  link: string;
  gradient: string;
  badge?: string;
}

interface AutoScrollServiceTilesProps {
  services: Service[];
  autoScrollInterval?: number;
}

export const AutoScrollServiceTiles: React.FC<AutoScrollServiceTilesProps> = ({
  services,
  autoScrollInterval = 4000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const itemsPerView = {
    mobile: 4,
    desktop: 6
  };

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, services.length - itemsPerView.mobile);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [isAutoScrolling, services.length, autoScrollInterval]);

  const scrollTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    // Resume auto-scroll after manual interaction
    setTimeout(() => setIsAutoScrolling(true), 8000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? Math.max(0, services.length - itemsPerView.mobile) : currentIndex - 1;
    scrollTo(newIndex);
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, services.length - itemsPerView.mobile);
    const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    scrollTo(newIndex);
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  return (
    <section className="py-6 px-4">
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Our Services</h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoScroll}
              className="text-primary hover:text-primary-dark"
            >
              {isAutoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="text-primary hover:text-primary-dark"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="text-primary hover:text-primary-dark"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile: Auto-scrolling horizontal view */}
        <div className="md:hidden relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView.mobile)}%)`
            }}
          >
            {services.map((service, index) => (
              <div
                key={service.title}
                className="flex-shrink-0 w-1/4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceTile {...service} />
              </div>
            ))}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.max(0, services.length - itemsPerView.mobile + 1) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ServiceTile {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};