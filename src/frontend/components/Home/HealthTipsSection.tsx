import React from 'react';
import { ChevronRight, Clock, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
interface HealthTip {
  id: string;
  image: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  publishDate: string;
}
interface HealthTipsSectionProps {
  tips: HealthTip[];
}
export const HealthTipsSection: React.FC<HealthTipsSectionProps> = ({
  tips
}) => {
  return <section className="py-6 md:py-8 px-4">
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Health Tips & Articles</h2>
          <Link to="/health-tips" className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium">
            Read More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="overflow-hidden">
          <div className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {tips.map((tip, index) => <article key={tip.id} className="flex-shrink-0 w-72 md:w-80 snap-start animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group cursor-pointer">
                  <div className="relative">
                    <img src={tip.image} alt={tip.title} className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 md:top-3 left-2 md:left-3">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                        {tip.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-foreground text-base md:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {tip.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">
                      {tip.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{tip.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(tip.publishDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary-dark text-xs md:text-sm">
                      Read Full Article
                    </Button>
                  </div>
                </div>
              </article>)}
          </div>
        </div>
      </div>
    </section>;
};