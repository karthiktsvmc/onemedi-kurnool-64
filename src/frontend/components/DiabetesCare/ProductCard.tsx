import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DiabetesProduct } from '@/frontend/data/mockDiabetesCareData';

interface ProductCardProps {
  product: DiabetesProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badges.slice(0, 2).map((badge, index) => (
            <Badge key={index} variant="destructive" className="text-xs bg-accent text-accent-foreground">
              {badge}
            </Badge>
          ))}
        </div>
        
        {/* Favorite Button */}
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
          <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
        </button>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        
        {/* Name */}
        <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <span className="text-sm text-green-600 font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full" 
          disabled={!product.inStock}
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};