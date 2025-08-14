import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { CartItem, promoOffers } from '@/frontend/data/mockCartData';
import { 
  Tag, 
  Wallet, 
  CreditCard,
  Gift,
  Percent,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PriceBreakdownProps {
  items: CartItem[];
  loyaltyPoints?: number;
  walletBalance?: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  items,
  loyaltyPoints = 150,
  walletBalance = 250
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyalty, setUseLoyalty] = useState(false);

  // Calculate base amounts
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  // Calculate delivery charges
  const hasServices = items.some(item => item.type === 'service');
  const deliveryThreshold = 499;
  const deliveryFee = subtotal >= deliveryThreshold ? 0 : (hasServices ? 0 : 40);

  // Calculate taxes (GST)
  const gstRate = 0.12; // 12% GST on healthcare items
  const gstAmount = Math.round(subtotal * gstRate);

  // Apply promo discount
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      promoDiscount = Math.round((subtotal * appliedPromo.discount) / 100);
    } else {
      promoDiscount = appliedPromo.discount;
    }
  }

  // Apply wallet and loyalty
  const walletUsed = useWallet ? Math.min(walletBalance, subtotal - promoDiscount) : 0;
  const loyaltyDiscount = useLoyalty ? Math.min(loyaltyPoints, 100) : 0; // 1 point = ₹1, max ₹100

  const total = subtotal + gstAmount + deliveryFee - promoDiscount - walletUsed - loyaltyDiscount;

  const applyPromoCode = () => {
    setPromoError('');
    const promo = promoOffers.find(offer => offer.code === promoCode.toUpperCase());
    
    if (!promo) {
      setPromoError('Invalid promo code');
      return;
    }
    
    if (subtotal < promo.minOrder) {
      setPromoError(`Minimum order amount ₹${promo.minOrder} required`);
      return;
    }
    
    setAppliedPromo(promo);
    setPromoCode('');
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  return (
    <div className="space-y-6">
      {/* Promo Code Section */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Promo Code</h3>
        
        {appliedPromo ? (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {appliedPromo.code} Applied
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={removePromo} className="h-6 px-2">
                <XCircle className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {appliedPromo.description}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <Button 
                variant="outline" 
                onClick={applyPromoCode}
                disabled={!promoCode.trim()}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            
            {promoError && (
              <p className="text-sm text-destructive">{promoError}</p>
            )}
            
            {/* Available Offers */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Available offers:</p>
              {promoOffers.slice(0, 2).map((offer, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-secondary/50 rounded cursor-pointer hover:bg-secondary/70"
                  onClick={() => setPromoCode(offer.code)}
                >
                  <div className="flex items-center gap-2">
                    <Percent className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">{offer.code}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{offer.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wallet & Loyalty Points */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Payment Options</h3>
        
        {/* Wallet */}
        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <Wallet className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Wallet Balance</p>
              <p className="text-xs text-muted-foreground">Available: ₹{walletBalance}</p>
            </div>
          </div>
          <Button
            variant={useWallet ? "default" : "outline"}
            size="sm"
            onClick={() => setUseWallet(!useWallet)}
          >
            {useWallet ? 'Remove' : 'Use'}
          </Button>
        </div>

        {/* Loyalty Points */}
        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <Gift className="h-4 w-4 text-warning" />
            <div>
              <p className="text-sm font-medium">Loyalty Points</p>
              <p className="text-xs text-muted-foreground">{loyaltyPoints} points available</p>
            </div>
          </div>
          <Button
            variant={useLoyalty ? "default" : "outline"}
            size="sm"
            onClick={() => setUseLoyalty(!useLoyalty)}
            disabled={loyaltyPoints === 0}
          >
            {useLoyalty ? 'Remove' : 'Use'}
          </Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Bill Details</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({items.length} items)</span>
            <span>₹{subtotal}</span>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Product savings</span>
              <span>-₹{savings}</span>
            </div>
          )}
          
          {appliedPromo && (
            <div className="flex justify-between text-green-600">
              <span>Promo discount ({appliedPromo.code})</span>
              <span>-₹{promoDiscount}</span>
            </div>
          )}
          
          {walletUsed > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Wallet used</span>
              <span>-₹{walletUsed}</span>
            </div>
          )}
          
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Loyalty points used</span>
              <span>-₹{loyaltyDiscount}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>GST (12%)</span>
            <span>₹{gstAmount}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Delivery charges</span>
            <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          
          {/* Free delivery progress */}
          {deliveryFee > 0 && subtotal < deliveryThreshold && (
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Add ₹{deliveryThreshold - subtotal} more for FREE delivery!
              </p>
            </div>
          )}
          
          <hr className="border-border" />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total Payable</span>
            <span className="text-primary">₹{Math.max(0, total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="p-3 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Payment Methods</span>
        </div>
        <p className="text-xs text-muted-foreground">
          UPI, Credit/Debit Cards, Net Banking, Wallets accepted
        </p>
      </div>
    </div>
  );
};