import React from 'react';
import { Shield, Award, CheckCircle, Heart, LucideIcon } from 'lucide-react';
interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  description: string;
}
interface TrustBadgesProps {
  badges: TrustBadge[];
}
const iconMap: {
  [key: string]: LucideIcon;
} = {
  Shield,
  Award,
  CheckCircle,
  Heart
};
export const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % badges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [badges.length]);

  return <section className="py-6 md:py-8 px-4">
      <div className="container mx-auto px-0">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-4 md:gap-6 pb-4"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {badges.map((badge, index) => {
            const IconComponent = iconMap[badge.icon] || Shield;
            return <div key={badge.id} className="flex-shrink-0 w-full snap-start animate-fade-in" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="bg-card rounded-xl p-4 md:p-6 shadow-card hover:shadow-elevated transition-all duration-300 group cursor-default">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors text-sm md:text-base">
                          {badge.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>;
          })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {badges.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>;
};