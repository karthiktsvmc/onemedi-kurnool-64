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
export const ServiceTile = ({
  icon: Icon,
  title,
  subtitle,
  link,
  gradient,
  badge
}: ServiceTileProps) => {
  return <Link to={link} className="flex flex-col items-center group snap-start animate-scale-in hover:scale-105 transition-all duration-300 ease-out p-2 px-0 py-0">
      <div className="relative">
        {badge && <div className="absolute -top-1 -right-1 bg-emergency text-white text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium z-10 animate-pulse">
            {badge}
          </div>}
        
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full ${gradient} flex items-center justify-center mb-2 sm:mb-3 mx-auto 
          group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 ease-out
          shadow-lg ring-1 sm:ring-2 ring-white/20 group-hover:ring-white/40`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      
      <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300">
        <h3 className="font-semibold text-foreground text-[10px] sm:text-xs lg:text-sm mb-0.5 sm:mb-1 group-hover:text-primary transition-colors duration-300 leading-tight">{title}</h3>
        <p className="text-[8px] sm:text-[10px] lg:text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">{subtitle}</p>
      </div>
    </Link>;
};