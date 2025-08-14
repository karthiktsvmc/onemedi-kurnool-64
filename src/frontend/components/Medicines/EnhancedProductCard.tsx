import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Clock, Truck, Star, Plus, Minus } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { EnhancedMedicineProduct } from '@/frontend/data/mockCategoryProductsData';

interface EnhancedProductCardProps {
  product: EnhancedMedicineProduct;
  onAddToCart?: (productId: string, quantity: number) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const primaryPackSize = product.packSizes[0];
  const hasDiscount = primaryPackSize.originalPrice > primaryPackSize.price;
  const discountPercentage = Math.round(((primaryPackSize.originalPrice - primaryPackSize.price) / primaryPackSize.originalPrice) * 100);

  const handleProductClick = () => {
    navigate(`/medicine/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onAddToCart(product.id, quantity);
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const adjustQuantity = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <Card className="group relative bg-card hover:bg-accent/30 border border-border hover:border-primary/20 transition-all duration-300 cursor-pointer hover:shadow-lg overflow-hidden">
      <div onClick={handleProductClick}>
        {/* Image Section */}
        <div className="relative aspect-square p-4 bg-gradient-to-br from-background to-muted/30">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/300/300';
            }}
          />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs px-2 py-1 bg-red-500 text-white font-semibold">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.bestSeller && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-orange-500 text-white">
                Bestseller
              </Badge>
            )}
            {product.trending && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-green-500 text-white border-green-500">
                Trending
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
              isFavorite ? 'text-red-500 bg-red-50' : 'text-muted-foreground bg-background/80'
            } hover:text-red-500 hover:bg-red-50 transition-colors`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>

          {/* Delivery Info */}
          {product.fastDelivery && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                product.sameDay 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                <Truck className="h-3 w-3" />
                <span>{product.deliveryDate || (product.sameDay ? 'Today' : 'Tomorrow')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Brand & Prescription */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              {product.brand}
            </span>
            {product.prescriptionRequired && (
              <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                Rx Required
              </Badge>
            )}
          </div>

          {/* Product Name */}
          <div>
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.genericName && (
              <p className="text-xs text-muted-foreground mt-1">
                {product.genericName}
              </p>
            )}
          </div>

          {/* Pack Size & Composition */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {primaryPackSize.name}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {product.composition}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-foreground">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Alternatives */}
          <div className="flex gap-2">
            {product.genericAlternatives && product.genericAlternatives.length > 0 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                Generic Available
              </Badge>
            )}
            {product.brandedAlternatives && product.brandedAlternatives.length > 0 && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                Branded Options
              </Badge>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                ₹{primaryPackSize.price}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{primaryPackSize.originalPrice}
                </span>
              )}
            </div>
            {product.freeDelivery && (
              <div className="flex items-center gap-1 text-green-600">
                <Truck className="h-3 w-3" />
                <span className="text-xs font-medium">Free Delivery</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="p-4 pt-0 space-y-3">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={(e) => adjustQuantity(-1, e)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={(e) => adjustQuantity(1, e)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              primaryPackSize.inStock ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-xs font-medium ${
              primaryPackSize.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {primaryPackSize.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!primaryPackSize.inStock || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </div>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default EnhancedProductCard;