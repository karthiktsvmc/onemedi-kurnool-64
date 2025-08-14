import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Minus, Plus, ShoppingCart, Zap, MapPin, RotateCcw, Info } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface Variant {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

interface PricingSectionProps {
  variants: Variant[];
  onAddToCart: (variantId: string, quantity: number) => void;
  onBuyNow: (variantId: string, quantity: number) => void;
  onSubscribe: (variantId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  variants,
  onAddToCart,
  onBuyNow,
  onSubscribe
}) => {
  const [selectedVariant, setSelectedVariant] = useState<string>(variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);

  const currentVariant = variants.find(v => v.id === selectedVariant) || variants[0];
  const savings = currentVariant ? currentVariant.originalPrice - currentVariant.price : 0;
  const savingsPercent = currentVariant ? Math.round((savings / currentVariant.originalPrice) * 100) : 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const checkDelivery = () => {
    // Mock delivery check - replace with Supabase function later
    setDeliveryAvailable(pincode.length === 6);
  };

  const validatePromoCode = () => {
    // Mock promo validation - replace with Supabase function later
    console.log('Validating promo code:', promoCode);
  };

  if (!currentVariant) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Variant Selection */}
        <div>
          <label className="text-sm font-medium text-foreground">Pack Size</label>
          <Select value={selectedVariant} onValueChange={setSelectedVariant}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.name} - ₹{variant.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">₹{currentVariant.price}</span>
            <span className="text-lg text-muted-foreground line-through">₹{currentVariant.originalPrice}</span>
            <Badge variant="destructive" className="text-sm">
              {savingsPercent}% OFF
            </Badge>
          </div>
          <p className="text-sm text-green-600 font-medium">You save ₹{savings}</p>
        </div>

        {/* Quantity Selector */}
        <div>
          <label className="text-sm font-medium text-foreground">Quantity</label>
          <div className="flex items-center gap-3 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-sm font-medium text-foreground">Promo Code</label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button variant="outline" onClick={validatePromoCode}>
              Apply
            </Button>
          </div>
        </div>

        {/* Delivery Check */}
        <div>
          <label className="text-sm font-medium text-foreground">Delivery</label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
            />
            <Button variant="outline" onClick={checkDelivery}>
              <MapPin className="h-4 w-4 mr-1" />
              Check
            </Button>
          </div>
          {deliveryAvailable !== null && (
            <p className={`text-sm mt-1 ${deliveryAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {deliveryAvailable ? '✓ Delivery available in your area' : '✗ Delivery not available'}
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => onAddToCart(selectedVariant, quantity)}
            disabled={!currentVariant.inStock}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => onBuyNow(selectedVariant, quantity)}
            disabled={!currentVariant.inStock}
          >
            <Zap className="h-5 w-5 mr-2" />
            Buy Now
          </Button>

          {/* Subscription Option */}
          <div className="border rounded-lg p-4 bg-primary-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Save More with Subscription</p>
                <p className="text-sm text-muted-foreground">Auto refill monthly & save 10%</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSubscribe(selectedVariant)}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};