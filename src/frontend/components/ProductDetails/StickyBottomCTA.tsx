import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ShoppingCart, Zap, MessageCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StickyBottomCTAProps {
  price: number;
  originalPrice?: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onAskExpert: () => void;
  inStock: boolean;
  className?: string;
}

export const StickyBottomCTA: React.FC<StickyBottomCTAProps> = ({
  price,
  originalPrice,
  onAddToCart,
  onBuyNow,
  onAskExpert,
  inStock,
  className
}) => {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 md:hidden",
      className
    )}>
      <div className="flex items-center gap-3">
        {/* Price */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">₹{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>

        {/* Ask Expert Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAskExpert}
          className="flex-shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>

        {/* Main CTAs */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onAddToCart}
            disabled={!inStock}
            className="flex-1 min-w-[80px]"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Cart
          </Button>
          <Button
            onClick={onBuyNow}
            disabled={!inStock}
            className="flex-1 min-w-[80px]"
          >
            <Zap className="h-4 w-4 mr-1" />
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
};