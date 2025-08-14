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

  return <section className="py-8 px-4">
      <div className="container mx-auto px-0">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-6 pb-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / Math.min(3, badges.length))}%)`
            }}
          >
            {badges.map((badge, index) => {
            const IconComponent = iconMap[badge.icon] || Shield;
            return <div key={badge.id} className="flex-shrink-0 w-full md:w-1/3 snap-start animate-fade-in" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="min-w-[280px] bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {badge.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
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