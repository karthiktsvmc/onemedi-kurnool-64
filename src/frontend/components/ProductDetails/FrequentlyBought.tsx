import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Plus, ShoppingCart } from 'lucide-react';

interface BundleItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  category: 'medicine' | 'device' | 'supplement' | 'test-strip';
}

interface FrequentlyBoughtProps {
  currentProduct: BundleItem;
  bundleItems: BundleItem[];
  onAddBundle: (selectedItems: string[]) => void;
}

export const FrequentlyBought: React.FC<FrequentlyBoughtProps> = ({
  currentProduct,
  bundleItems,
  onAddBundle
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([currentProduct.id]);

  const allItems = [currentProduct, ...bundleItems];
  
  const selectedProducts = allItems.filter(item => selectedItems.includes(item.id));
  const totalOriginalPrice = selectedProducts.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = totalOriginalPrice - totalPrice;
  const savingsPercent = Math.round((totalSavings / totalOriginalPrice) * 100);

  const handleItemToggle = (itemId: string) => {
    if (itemId === currentProduct.id) return; // Current product always selected
    
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medicine':
        return '💊';
      case 'device':
        return '🩺';
      case 'supplement':
        return '🌿';
      case 'test-strip':
        return '🧪';
      default:
        return '📦';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Frequently Bought Together
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customers who bought this item also bought
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bundle Items */}
        <div className="space-y-3">
          {allItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => handleItemToggle(item.id)}
                disabled={item.id === currentProduct.id}
              />
              
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <span className="absolute -top-1 -right-1 text-xs">
                    {getCategoryIcon(item.category)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-primary">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {item.id === currentProduct.id && (
                  <Badge variant="secondary" className="text-xs">
                    This item
                  </Badge>
                )}
              </div>

              {index < allItems.length - 1 && (
                <Plus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Bundle Summary */}
        <div className="border-t pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Bundle Price:</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">₹{totalPrice}</span>
                {totalSavings > 0 && (
                  <span className="text-sm text-muted-foreground line-through">₹{totalOriginalPrice}</span>
                )}
              </div>
            </div>
            
            {totalSavings > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">You Save:</span>
                <span className="text-sm font-medium text-green-600">
                  ₹{totalSavings} ({savingsPercent}% off)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Add Bundle Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => onAddBundle(selectedItems)}
          disabled={selectedItems.length === 0}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add {selectedItems.length} Item{selectedItems.length > 1 ? 's' : ''} to Cart
          {totalSavings > 0 && (
            <span className="ml-2 text-sm">- Save ₹{totalSavings}</span>
          )}
        </Button>

        {/* Individual Add Buttons */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Or add items individually:</p>
          <div className="flex flex-wrap gap-2">
            {bundleItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => onAddBundle([item.id])}
              >
                Add {item.name.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};