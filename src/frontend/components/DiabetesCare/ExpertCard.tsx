import React from 'react';
import { Star, Clock, Phone, Video, Languages } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DiabetesExpert } from '@/frontend/data/mockDiabetesCareData';

interface ExpertCardProps {
  expert: DiabetesExpert;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Expert Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={expert.image}
          alt={expert.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge 
            variant={expert.availability.includes('Today') ? 'destructive' : 'secondary'}
            className={expert.availability.includes('Today') ? 'bg-green-500 text-white' : ''}
          >
            {expert.availability}
          </Badge>
        </div>
      </div>

      {/* Expert Details */}
      <div className="p-4">
        {/* Name and Title */}
        <h3 className="font-semibold text-foreground text-lg mb-1">
          {expert.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{expert.title}</p>
        
        {/* Rating and Experience */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-foreground">{expert.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{expert.experience}</span>
          </div>
        </div>

        {/* Specialization */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {expert.specialization.slice(0, 2).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {expert.specialization.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{expert.specialization.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
          <Languages className="h-4 w-4" />
          <span>{expert.languages.join(', ')}</span>
        </div>

        {/* Consultation Fee */}
        <div className="mb-4">
          <span className="text-lg font-bold text-primary">
            ₹{expert.consultationFee}
          </span>
          <span className="text-sm text-muted-foreground ml-1">consultation</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            <Video className="h-4 w-4 mr-1" />
            Book Video
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};