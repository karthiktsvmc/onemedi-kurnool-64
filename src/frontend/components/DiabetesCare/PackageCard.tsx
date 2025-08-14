import React from 'react';
import { Check, Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DiabetesCarePackage } from '@/frontend/data/mockDiabetesCareData';

interface PackageCardProps {
  package: DiabetesCarePackage;
}

export const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  return (
    <div className={`bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
      pkg.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      {/* Package Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground text-lg">
            {pkg.title}
          </h3>
          <div className="flex gap-1">
            {pkg.popular && (
              <Badge variant="destructive" className="bg-primary text-primary-foreground">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            {pkg.badge && !pkg.popular && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {pkg.badge}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {pkg.description}
        </p>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ₹{pkg.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{pkg.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">
              Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              for {pkg.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Package Includes */}
      <div className="p-4">
        <h4 className="font-medium text-foreground mb-3">Package Includes:</h4>
        <ul className="space-y-2 mb-4">
          {pkg.includes.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1">
            Subscribe Now
          </Button>
          <Button variant="outline" size="default">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};