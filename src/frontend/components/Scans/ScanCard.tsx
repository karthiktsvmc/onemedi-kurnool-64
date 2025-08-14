import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Shield, 
  Award,
  Star,
  Plus,
  Eye,
  Zap
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface DiagnosticCenter {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  deliveryTime: string;
  homePickup: boolean;
  nabl: boolean;
  offers?: string;
}

interface ScanCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  fastingRequired: boolean;
  parameters: number;
  centers: DiagnosticCenter[];
  tags: string[];
  onAddToCart: (id: string, centerId: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
  onBookNow: (id: string, centerId: string) => void;
  isFavorite?: boolean;
}

export const ScanCard = ({
  id,
  image,
  title,
  description,
  category,
  duration,
  fastingRequired,
  parameters,
  centers,
  tags,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  onBookNow,
  isFavorite = false
}: ScanCardProps) => {
  const [selectedCenter, setSelectedCenter] = useState<DiagnosticCenter>(centers[0]);

  const discount = Math.round(((selectedCenter.originalPrice - selectedCenter.price) / selectedCenter.originalPrice) * 100);

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'nabl':
        return <Shield className="h-3 w-3 mr-1" />;
      case 'expert radiologist':
      case 'specialist care':
      case 'cancer specialist':
        return <Award className="h-3 w-3 mr-1" />;
      case 'home pickup':
      case 'home service':
        return <MapPin className="h-3 w-3 mr-1" />;
      case 'urgent':
      case 'instant results':
        return <Zap className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden cursor-pointer hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-32 object-cover"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-emergency text-white">
            {discount}% OFF
          </Badge>
        )}
        
        {/* Category Badge */}
        <Badge className="absolute top-2 right-10 bg-primary/90 text-white text-xs">
          {category.toUpperCase()}
        </Badge>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white"
          onClick={() => onToggleFavorite(id)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {getTagIcon(tag)}
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        {/* Scan Info */}
        <div className="space-y-1 mb-3 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{duration}</span>
          </div>
          <div className="flex justify-between">
            <span>Fasting:</span>
            <span className="font-medium">{fastingRequired ? 'Required' : 'Not Required'}</span>
          </div>
          <div className="flex justify-between">
            <span>Parameters:</span>
            <span className="font-medium">{parameters}</span>
          </div>
        </div>

        {/* Center Selection */}
        <div className="mb-3">
          <Select 
            value={selectedCenter.id} 
            onValueChange={(value) => setSelectedCenter(centers.find(c => c.id === value) || centers[0])}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {centers.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{center.name}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{center.rating}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Center Info */}
        <div className="mb-3 p-2 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{selectedCenter.rating}</span>
              {selectedCenter.nabl && (
                <Badge variant="outline" className="text-xs ml-1">
                  <Shield className="h-2 w-2 mr-1" />
                  NABL
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {selectedCenter.deliveryTime}
            </div>
          </div>
          
          {selectedCenter.homePickup && (
            <div className="flex items-center gap-1 text-xs text-health-green mb-1">
              <MapPin className="h-3 w-3" />
              Home pickup available
            </div>
          )}
          
          {selectedCenter.offers && (
            <p className="text-xs text-health-green font-medium">{selectedCenter.offers}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-primary">₹{selectedCenter.price}</span>
            {selectedCenter.originalPrice > selectedCenter.price && (
              <span className="text-sm text-muted-foreground line-through ml-2">₹{selectedCenter.originalPrice}</span>
            )}
          </div>
          {selectedCenter.originalPrice > selectedCenter.price && (
            <span className="text-xs text-health-green font-medium">Save ₹{selectedCenter.originalPrice - selectedCenter.price}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(id, selectedCenter.id);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Book Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(id, selectedCenter.id);
            }}
            className="flex-1"
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(id);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};