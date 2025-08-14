import React, { useState } from 'react';
import { Star, Heart, Plus, MapPin, Clock, Video, Building, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { getImageWithFallback, handleImageError } from '@/frontend/utils/imageUtils';

interface DoctorServiceCardProps {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  specialization?: string;
  experience?: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  discount?: string;
  savedAmount?: string;
  inStock?: boolean;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  visitTypes?: {
    online?: { available: boolean; price: string; originalPrice?: string };
    clinic?: { available: boolean; price: string; originalPrice?: string; address?: string };
    home?: { available: boolean; price: string; originalPrice?: string };
  };
}

export const DoctorServiceCard: React.FC<DoctorServiceCardProps> = ({
  id,
  image,
  title,
  subtitle,
  specialization,
  experience,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
  savedAmount,
  inStock = true,
  onAddToCart,
  onToggleFavorite,
  visitTypes = {
    online: { available: true, price, originalPrice },
    clinic: { available: true, price, originalPrice },
    home: { available: true, price: (parseInt(price) + 200).toString(), originalPrice: originalPrice ? (parseInt(originalPrice) + 200).toString() : undefined }
  }
}) => {
  const [selectedVisitType, setSelectedVisitType] = useState<'online' | 'clinic' | 'home'>('online');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite(id);
  };

  const handleAddToCart = () => {
    onAddToCart(`${id}-${selectedVisitType}`);
  };

  const currentVisitType = visitTypes[selectedVisitType];
  const currentPrice = currentVisitType?.price || price;
  const currentOriginalPrice = currentVisitType?.originalPrice || originalPrice;

  return (
    <div className="bg-card rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 border border-border group overflow-hidden h-full flex flex-col scale-[0.85] transform-gpu">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={getImageWithFallback(image, 'doctor')} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => handleImageError(e, 'doctor')}
        />
        
        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <Badge variant="destructive" className="text-xs font-bold animate-pulse">
              {discount}% OFF
            </Badge>
          )}
          {specialization && (
            <Badge variant="secondary" className="text-xs">
              {specialization}
            </Badge>
          )}
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-foreground p-2 rounded-full shadow-md"
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>

        {/* Stock Status */}
        <div className="absolute bottom-3 right-3">
          <Badge variant={inStock ? "default" : "secondary"} className="text-xs">
            {inStock ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Doctor Info */}
        <div className="mb-3">
          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mb-1">{subtitle}</p>
          )}
          {experience && (
            <p className="text-xs text-primary font-medium">{experience} experience</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
        </div>

        {/* Visit Type Tabs */}
        <Tabs value={selectedVisitType} onValueChange={(value) => setSelectedVisitType(value as 'online' | 'clinic' | 'home')} className="mb-3">
          <TabsList className="grid w-full grid-cols-3 h-7">
            <TabsTrigger value="online" className="text-xs p-1 flex items-center gap-1">
              <Video className="h-3 w-3" />
              Online
            </TabsTrigger>
            <TabsTrigger value="clinic" className="text-xs p-1 flex items-center gap-1">
              <Building className="h-3 w-3" />
              Clinic
            </TabsTrigger>
            <TabsTrigger value="home" className="text-xs p-1 flex items-center gap-1">
              <Home className="h-3 w-3" />
              Home
            </TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-2">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                Video consultation available
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clinic" className="mt-2">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                In-clinic visit
              </div>
            </div>
          </TabsContent>

          <TabsContent value="home" className="mt-2">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Doctor visits you
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pricing */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-foreground">₹{currentPrice}</span>
            {currentOriginalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{currentOriginalPrice}</span>
            )}
          </div>
          {savedAmount && (
            <p className="text-xs text-green-600">You save ₹{savedAmount}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Button 
            onClick={handleAddToCart}
            disabled={!inStock}
            size="sm"
            className="w-full text-xs h-8 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-3 w-3 mr-1" />
            {selectedVisitType === 'online' ? 'Book Online' : 
             selectedVisitType === 'clinic' ? 'Book Clinic' : 'Book Home Visit'}
          </Button>
        </div>
      </div>
    </div>
  );
};