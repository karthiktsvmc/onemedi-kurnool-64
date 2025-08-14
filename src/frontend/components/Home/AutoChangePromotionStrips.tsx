import React, { useState, useEffect } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Home as HomeIcon, TruckIcon, Clock, Shield, Stethoscope } from 'lucide-react';

interface PromotionStrip {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  icon?: React.ElementType;
  cta?: string;
}

interface AutoChangePromotionStripsProps {
  className?: string;
}

export const AutoChangePromotionStrips: React.FC<AutoChangePromotionStripsProps> = ({ className = '' }) => {
  const promotionalStrips: PromotionStrip[] = [
    {
      id: '1',
      title: 'Flash Sale - 50% OFF',
      subtitle: 'On all health packages',
      bgColor: 'bg-gradient-to-r from-emergency to-orange-500',
      textColor: 'text-white',
      icon: Shield,
      cta: 'Book Now'
    },
    {
      id: '2',
      title: 'Free Home Collection',
      subtitle: 'Book 2+ tests and get free collection',
      bgColor: 'bg-gradient-to-r from-health-green to-green-600',
      textColor: 'text-white',
      icon: HomeIcon,
      cta: 'Book Tests'
    },
    {
      id: '3',
      title: 'Free Home Sample Collection',
      subtitle: 'Safe & convenient sample collection at your doorstep',
      bgColor: 'bg-gradient-to-r from-primary to-primary-dark',
      textColor: 'text-primary-foreground',
      icon: TruckIcon,
      cta: 'Schedule'
    },
    {
      id: '4',
      title: '24Hr Report Delivery',
      subtitle: 'Get your lab reports within 24 hours',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white',
      icon: Clock,
      cta: 'Learn More'
    },
    {
      id: '5',
      title: 'Expert Doctor Consultation',
      subtitle: 'Free consultation with report review',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-white',
      icon: Stethoscope,
      cta: 'Consult Now'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promotionalStrips.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [promotionalStrips.length]);

  const currentStrip = promotionalStrips[currentIndex];
  const IconComponent = currentStrip.icon;

  return (
    <section className={`py-4 px-4 ${className}`}>
      <div className="container mx-auto px-0">
        <div className="relative overflow-hidden rounded-xl">
          <div
            className={`${currentStrip.bgColor} ${currentStrip.textColor} p-6 transition-all duration-500 ease-in-out`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {IconComponent && (
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                    <IconComponent className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">{currentStrip.title}</h3>
                  <p className="text-sm md:text-base opacity-90">{currentStrip.subtitle}</p>
                </div>
              </div>
              
              {currentStrip.cta && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  {currentStrip.cta}
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {promotionalStrips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};