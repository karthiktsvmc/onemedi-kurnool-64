import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Phone, Eye } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { HomeCareService } from '@/frontend/data/mockHomeCareData';

interface ServiceCardProps {
  service: HomeCareService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [selectedDuration, setSelectedDuration] = useState(service.durations[0]?.id || '');

  const getCurrentPrice = () => {
    const duration = service.durations.find(d => d.id === selectedDuration);
    return duration?.price;
  };

  const getCurrentUnit = () => {
    const duration = service.durations.find(d => d.id === selectedDuration);
    return duration?.unit;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <div className="bg-primary/20 backdrop-blur-sm rounded-full p-2">
            <span className="text-2xl">{service.serviceIcon}</span>
          </div>
        </div>
        {service.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="bg-accent text-accent-foreground">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="mb-3">
          <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1">
            {service.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium text-foreground">{service.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({service.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {service.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{service.tags.length - 2} more
            </Badge>
          )}
        </div>

        {/* Duration Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Duration
          </label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {service.durations.map((duration) => (
                <SelectItem key={duration.id} value={duration.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{duration.label}</span>
                    {duration.price && (
                      <span className="ml-2 font-medium">₹{duration.price.toLocaleString()}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        {getCurrentPrice() && (
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                ₹{getCurrentPrice()?.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                per {getCurrentUnit()}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Clock className="h-4 w-4 mr-1" />
            Enquire Now
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/home-care/${service.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};