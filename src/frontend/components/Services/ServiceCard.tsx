
import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { getImageWithFallback, handleImageError } from '@/frontend/utils/imageUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface Variant {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
}

interface Center {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
}

interface Duration {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
}

interface ServiceCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  brand?: string;
  center?: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  discount?: string;
  inStock?: boolean;
  prescription?: boolean;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite?: boolean;
  variants?: Variant[];
  centers?: Center[];
  durations?: Duration[];
  badges?: string[];
  experience?: string;
}

export const ServiceCard = ({
  id,
  image,
  title,
  subtitle,
  brand,
  center,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
  inStock = true,
  prescription = false,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  variants,
  centers,
  durations,
  badges,
  experience
}: ServiceCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState(price);
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState(originalPrice);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId);
    if (variants) {
      const variant = variants.find(v => v.id === variantId);
      if (variant) {
        setCurrentPrice(variant.price);
        setCurrentOriginalPrice(variant.originalPrice);
      }
    }
  };

  const handleCenterChange = (centerId: string) => {
    setSelectedCenter(centerId);
    if (centers) {
      const centerOption = centers.find(c => c.id === centerId);
      if (centerOption) {
        setCurrentPrice(centerOption.price);
        setCurrentOriginalPrice(centerOption.originalPrice);
      }
    }
  };

  const handleDurationChange = (durationId: string) => {
    setSelectedDuration(durationId);
    if (durations) {
      const duration = durations.find(d => d.id === durationId);
      if (duration) {
        setCurrentPrice(duration.price);
        setCurrentOriginalPrice(duration.originalPrice);
      }
    }
  };

  const savedAmount = currentOriginalPrice && currentPrice 
    ? (parseInt(currentOriginalPrice) - parseInt(currentPrice)).toString()
    : '0';

  const discountPercent = currentOriginalPrice && currentPrice
    ? Math.round(((parseInt(currentOriginalPrice) - parseInt(currentPrice)) / parseInt(currentOriginalPrice)) * 100).toString()
    : discount;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group scale-[0.85] transform-gpu">
      {/* Image Container */}
      <div className="relative">
        <img 
          src={getImageWithFallback(image, 'medical')} 
          alt={title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => handleImageError(e, 'medical')}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent && (
            <Badge className="bg-emergency text-white text-xs px-2 py-1">
              {discountPercent}% OFF
            </Badge>
          )}
          {prescription && (
            <Badge variant="outline" className="bg-warning text-white text-xs px-2 py-1">
              RX
            </Badge>
          )}
          {badges && badges.map((badge, index) => (
            <Badge key={index} variant="outline" className="bg-health-green text-white text-xs px-2 py-1">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(id);
          }}
        >
          <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-emergency text-emergency' : 'text-muted-foreground hover:text-emergency'}`} />
        </Button>

        {/* Stock Status */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium bg-red-600 px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex flex-col gap-1 mb-2">
          {subtitle && (
            <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
          {brand && (
            <p className="text-xs text-primary font-medium">by {brand}</p>
          )}
          {center && (
            <p className="text-xs text-primary font-medium">{center}</p>
          )}
          {experience && (
            <p className="text-xs text-health-green font-medium">{experience} experience</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Variants/Centers/Duration Selector */}
        {variants && variants.length > 0 && (
          <div className="mb-3">
            <Select value={selectedVariant} onValueChange={handleVariantChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select pack size" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id} className="text-xs">
                    {variant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {centers && centers.length > 0 && (
          <div className="mb-3">
            <Select value={selectedCenter} onValueChange={handleCenterChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select center" />
              </SelectTrigger>
              <SelectContent>
                {centers.map((centerOption) => (
                  <SelectItem key={centerOption.id} value={centerOption.id} className="text-xs">
                    {centerOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {durations && durations.length > 0 && (
          <div className="mb-3">
            <Select value={selectedDuration} onValueChange={handleDurationChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration.id} value={duration.id} className="text-xs">
                    {duration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">₹{currentPrice}</span>
            {currentOriginalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{currentOriginalPrice}</span>
            )}
          </div>
          {savedAmount && parseInt(savedAmount) > 0 && (
            <span className="text-xs text-health-green font-medium">Save ₹{savedAmount}</span>
          )}
        </div>

        {/* Action Button */}
        <Button
          className="w-full transition-all duration-200 hover:scale-105"
          disabled={!inStock}
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(id);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inStock ? (subtitle?.includes('Consultation') || subtitle?.includes('Care') ? 'Book Now' : 'Add to Cart') : 'Notify Me'}
        </Button>
      </div>
    </div>
  );
};
