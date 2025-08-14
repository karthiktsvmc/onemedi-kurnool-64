import React from 'react';
import { Home, Clock, Droplets } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DiabetesTest } from '@/frontend/data/mockDiabetesCareData';

interface TestCardProps {
  test: DiabetesTest;
}

export const TestCard: React.FC<TestCardProps> = ({ test }) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-2">
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            {test.name}
          </h3>
        </div>
        {test.badge && (
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            {test.badge}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {test.description}
      </p>

      {/* Test Details */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        {test.homeCollection && (
          <div className="flex items-center gap-1 text-green-600">
            <Home className="h-4 w-4" />
            <span>Home Collection</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{test.reportTime}</span>
        </div>
        {test.fasting && (
          <Badge variant="outline" className="text-xs">
            Fasting Required
          </Badge>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            ₹{test.price.toLocaleString()}
          </span>
          {test.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{test.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        {test.originalPrice && (
          <span className="text-sm text-green-600 font-medium">
            Save ₹{(test.originalPrice - test.price).toLocaleString()}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="flex-1" size="sm">
          Book Test
        </Button>
        <Button variant="outline" size="sm">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};