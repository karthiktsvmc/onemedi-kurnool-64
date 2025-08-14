import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { CartItem } from '@/frontend/data/mockCartData';
import { 
  Minus, 
  Plus, 
  Trash2, 
  Upload,
  Clock,
  MapPin,
  Video,
  Home,
  Hospital,
  RefreshCw,
  Edit
} from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onEditItem?: (id: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onEditItem
}) => {
  const getDeliveryTypeIcon = () => {
    switch (item.deliveryType) {
      case 'home': return <Home className="h-3 w-3" />;
      case 'clinic': return <Hospital className="h-3 w-3" />;
      case 'online': return <Video className="h-3 w-3" />;
      case 'lab_visit': return <MapPin className="h-3 w-3" />;
      default: return <Home className="h-3 w-3" />;
    }
  };

  const getDeliveryTypeText = () => {
    switch (item.deliveryType) {
      case 'home': return 'Home Service';
      case 'clinic': return 'Clinic Visit';
      case 'online': return 'Online';
      case 'lab_visit': return 'Lab Visit';
      case 'pickup': return 'Pickup';
      default: return 'Home Delivery';
    }
  };

  const getStockStatusColor = () => {
    if (!item.inStock) return 'destructive';
    if (item.stockLevel === 'low') return 'destructive';
    if (item.stockLevel === 'medium') return 'secondary';
    return 'default';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="relative">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          {item.type === 'subscription' && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5"
            >
              Plan
            </Badge>
          )}
        </div>
        
        <div className="flex-1">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs flex items-center gap-1"
                >
                  {getDeliveryTypeIcon()}
                  {getDeliveryTypeText()}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {item.name}
              </h3>
              
              {item.brand && (
                <p className="text-xs text-muted-foreground">{item.brand}</p>
              )}
              
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              )}
              
              {item.expertAssigned && (
                <p className="text-xs text-primary mt-1">👨‍⚕️ {item.expertAssigned}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 ml-2">
              {onEditItem && (item.type === 'service' || item.availableSlots) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditItem(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-1 mb-2">
            {item.badges?.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
            
            {item.prescriptionRequired && (
              <Badge variant="outline" className="text-xs text-warning border-warning">
                Rx Required
              </Badge>
            )}
            
            {item.autoRefillEligible && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 flex items-center gap-1">
                <RefreshCw className="h-2 w-2" />
                Auto Refill
              </Badge>
            )}
            
            {!item.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Duration & Slots for Services */}
          {item.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>{item.duration}</span>
            </div>
          )}

          {/* Available Slots */}
          {item.availableSlots && item.availableSlots.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground mb-1">Available slots:</p>
              <div className="flex flex-wrap gap-1">
                {item.availableSlots.slice(0, 2).map((slot, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {slot}
                  </Badge>
                ))}
                {item.availableSlots.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.availableSlots.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">₹{item.price}</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{item.originalPrice}
                </span>
              )}
              {item.originalPrice && item.originalPrice > item.price && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                </Badge>
              )}
            </div>

            {/* Quantity Controls */}
            {item.type !== 'service' && (
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="h-7 w-7 p-0"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-2 py-1 text-xs font-medium min-w-[24px] text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="h-7 w-7 p-0"
                  disabled={!item.inStock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Auto Refill Option */}
          {item.autoRefillEligible && item.type === 'product' && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700 dark:text-blue-300">
                    Setup Auto Refill & Save 5%
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                  Setup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Upload Banner */}
      {item.prescriptionRequired && (
        <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning font-medium">
              Prescription required for this item
            </span>
            <Button variant="ghost" size="sm" className="text-warning text-xs ml-auto">
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};