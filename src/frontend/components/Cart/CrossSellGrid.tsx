import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { CrossSellItem } from '@/frontend/data/mockCartData';
import { Plus, ShoppingCart } from 'lucide-react';

interface CrossSellGridProps {
  items: CrossSellItem[];
  onAddToCart: (itemId: string) => void;
}

export const CrossSellGrid: React.FC<CrossSellGridProps> = ({
  items,
  onAddToCart
}) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Recommended for you
        </h3>
        <Badge variant="secondary" className="text-xs">
          Save More
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="relative mb-3">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-24 object-cover rounded-lg"
              />
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground leading-tight">
                {item.name}
              </h4>
              
              <p className="text-xs text-muted-foreground">
                {item.reason}
              </p>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-sm">₹{item.price}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <>
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{item.originalPrice}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                    </Badge>
                  </>
                )}
              </div>
              
              <Button 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => onAddToCart(item.id)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Combo Offer Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
              Bundle & Save More!
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Add all recommended items and get extra 10% off
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add All
          </Button>
        </div>
      </div>
    </div>
  );
};