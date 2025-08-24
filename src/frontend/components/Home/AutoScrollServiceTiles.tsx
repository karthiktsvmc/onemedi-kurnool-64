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
  return <section className="py-0 px-[2px]">
      <div className="container mx-auto px-0">
        <div className="mb-6">
          <h2 className="text-foreground py-0 text-center font-bold text-lg">Our Services</h2>
        </div>

        {/* 6x2 Grid Layout for all screen sizes */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {services.map((service, index) => <div key={service.title} className="animate-fade-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <ServiceTile {...service} />
            </div>)}
        </div>
      </div>
    </section>;
};