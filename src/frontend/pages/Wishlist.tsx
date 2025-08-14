import { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockWishlistItems } from '@/frontend/data/mockProfileData';
import { useToast } from '@/shared/hooks/use-toast';

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const { toast } = useToast();

  const handleRemoveItem = (itemId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const handleMoveToCart = (itemId: string) => {
    const item = wishlistItems.find(item => item.id === itemId);
    if (item) {
      handleRemoveItem(itemId);
      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Medicine':
        return 'bg-green-100 text-green-800';
      case 'Lab Test':
        return 'bg-blue-100 text-blue-800';
      case 'Service':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} items
            </p>
          </div>
          
          {wishlistItems.length > 0 ? (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg bg-muted"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm leading-tight mb-1">
                              {item.name}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getTypeColor(item.type)}`}
                            >
                              {item.type}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg">₹{item.price}</span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.originalPrice}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                              </Badge>
                            </>
                          )}
                        </div>
                        
                        {/* Stock Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-xs ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Added {formatDate(item.addedDate)}
                          </span>
                        </div>
                        
                        {/* Action Button */}
                        <Button
                          onClick={() => handleMoveToCart(item.id)}
                          disabled={!item.inStock}
                          className="w-full mt-3 h-9"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {item.inStock ? 'Move to Cart' : 'Notify When Available'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Bulk Actions */}
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        const inStockItems = wishlistItems.filter(item => item.inStock);
                        if (inStockItems.length > 0) {
                          setWishlistItems([]);
                          toast({
                            title: "Added to Cart",
                            description: `${inStockItems.length} items added to your cart.`,
                          });
                        }
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setWishlistItems([]);
                        toast({
                          title: "Wishlist Cleared",
                          description: "All items have been removed from your wishlist.",
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Your Wishlist is Empty</h3>
                <p className="text-muted-foreground mb-4">
                  Save items you love by tapping the heart icon
                </p>
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};