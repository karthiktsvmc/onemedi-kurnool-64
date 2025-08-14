import React from 'react';
import { gsap } from 'gsap';
interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
}
interface PartnersSectionProps {
  partners: Partner[];
}
export const PartnersSection: React.FC<PartnersSectionProps> = ({
  partners
}) => {
  return <section className="py-8 px-4 bg-secondary/20">
      <div className="container mx-auto px-0">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Trusted Partners</h2>
        
        <div className="overflow-hidden">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {partners.concat(partners).map((partner, index) => <div key={`${partner.id}-${index}`} className="flex-shrink-0 snap-start group cursor-pointer">
                <div className="w-32 h-16 bg-white rounded-lg shadow-card hover:shadow-elevated transition-all duration-300 group-hover:scale-105 flex items-center justify-center p-4">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                  {partner.name}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};