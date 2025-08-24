import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceTileProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  link: string;
  gradient: string;
  badge?: string;
}

export const ServiceTile = ({ icon: Icon, title, subtitle, link, gradient, badge }: ServiceTileProps) => {
  return (
    <Link 
      to={link}
      className="flex flex-col items-center group min-w-[85px] snap-start animate-scale-in hover:scale-105 transition-all duration-300 ease-out"
    >
      <div className="relative">
        {badge && (
          <div className="absolute -top-2 -right-2 bg-emergency text-white text-xs px-2 py-1 rounded-full font-medium z-10 animate-pulse">
            {badge}
          </div>
        )}
        
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${gradient} flex items-center justify-center mb-3 mx-auto 
          group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 ease-out
          shadow-lg ring-2 ring-white/20 group-hover:ring-white/40`}>
          <Icon className="h-6 w-6 md:h-7 md:w-7 text-white transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      
      <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300">
        <h3 className="font-semibold text-foreground text-xs md:text-sm mb-1 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-[10px] md:text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">{subtitle}</p>
      </div>
    </Link>
  );
};