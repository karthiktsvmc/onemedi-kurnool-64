import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { CartItem } from '@/shared/hooks/useCart';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  Edit3,
  Clock,
  MapPin,
  Truck,
  Shield,
  Star,
  Calendar
} from 'lucide-react';

interface RealCartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onEditItem?: (id: string) => void;
}

export const RealCartItemCard = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem,
  onEditItem 
}: RealCartItemCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="flex-shrink-0">
          <img 
            src={item.item_image || '/placeholder-medical.jpg'} 
            alt={item.item_name || 'Item'}
            className="w-20 h-20 object-cover rounded-lg border border-border"
          />
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                {item.item_name || 'Unknown Item'}
              </h3>
              {item.item_description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {item.item_description}
                </p>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {item.item_type?.replace('_', ' ').toUpperCase() || 'ITEM'}
                </Badge>
                {item.prescription_required && (
                  <Badge variant="destructive" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Prescription Required
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-start gap-1 ml-4">
              {onEditItem && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditItem(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRemoveItem(item.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-bold text-lg text-primary">
                  ₹{item.unit_price.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">per unit</div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-medium text-foreground min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <div className="font-bold text-xl text-primary">
                ₹{item.total_price.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">total</div>
            </div>
          </div>

          {/* Additional Info */}
          {item.vendor_id && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Vendor: {item.vendor_id}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};