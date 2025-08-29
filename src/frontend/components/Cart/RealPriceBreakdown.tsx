import { CartItem } from '@/shared/hooks/useCart';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Percent, Gift } from 'lucide-react';

interface RealPriceBreakdownProps {
  items: CartItem[];
}

export const RealPriceBreakdown = ({ items }: RealPriceBreakdownProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const deliveryFee = 0; // Free delivery for healthcare items
  const discount = 0; // Will implement coupon system later
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="space-y-4">
      {/* Coupon Code */}
      <div>
        <div className="flex gap-2">
          <Input 
            placeholder="Enter coupon code" 
            className="flex-1 text-sm"
          />
          <Button variant="outline" size="sm">
            <Percent className="h-3 w-3 mr-1" />
            Apply
          </Button>
        </div>
      </div>

      <Separator />

      {/* Price Details */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            Delivery Fee
            {deliveryFee === 0 && (
              <Badge variant="secondary" className="text-xs ml-1">FREE</Badge>
            )}
          </span>
          <span className={deliveryFee === 0 ? "line-through text-muted-foreground" : ""}>
            ₹{deliveryFee.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              Discount
            </span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">₹{total.toFixed(2)}</span>
        </div>

        {subtotal > 500 && (
          <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
            🎉 You saved ₹50 on delivery with orders above ₹500!
          </div>
        )}
      </div>
    </div>
  );
};