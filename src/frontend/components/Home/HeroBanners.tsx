
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  bgGradient: string;
}

interface HeroBannersProps {
  banners: Banner[];
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ banners }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  if (!banners.length) return null;

  const banner = banners[currentBanner];

  return (
    <section className="relative h-48 md:h-68 overflow-hidden rounded-xl md:rounded-2xl mx-2 md:mx-4 my-4 md:my-6 shadow-elevated">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-90`} />
      
      {/* Background Image */}
      <img 
        src={banner.image} 
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xs md:max-w-lg text-white">
            <h2 className="text-lg md:text-3xl font-bold mb-2 animate-fade-in">
              {banner.title}
            </h2>
            <h3 className="text-sm md:text-xl mb-2 md:mb-3 opacity-90 animate-slide-up">
              {banner.subtitle}
            </h3>
            <p className="text-xs md:text-base mb-4 md:mb-6 opacity-80 animate-slide-up hidden md:block" style={{ animationDelay: '0.2s' }}>
              {banner.description}
            </p>
            <Link to={banner.ctaLink}>
              <Button 
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold animate-scale-in md:text-base text-sm"
                style={{ animationDelay: '0.4s' }}
              >
                {banner.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 md:h-10 md:w-10"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 md:h-10 md:w-10"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentBanner ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </section>
  );
};
