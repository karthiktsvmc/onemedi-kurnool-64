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
  services
}) => {
  return <section className="px-0 py-0">
      <div className="container mx-auto px-2">
        <div className="mb-4">
          <h2 className="text-foreground text-center font-bold text-lg md:text-xl">Our Services</h2>
        </div>

        {/* 6x2 Grid Layout - Responsive: 3x4 on mobile, 6x2 on tablet+ */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 max-w-6xl mx-auto">
          {services.map((service, index) => <div key={service.title} className="animate-fade-in" style={{
          animationDelay: `${index * 0.05}s`
        }}>
              <ServiceTile {...service} />
            </div>)}
        </div>
      </div>
    </section>;
};