import { useState, useMemo } from 'react';
import { AuthGuard } from '@/shared/components/AuthGuard';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { FloatingHelp } from '@/frontend/components/Common/FloatingHelp';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { CartItemCard } from '@/frontend/components/Cart/CartItemCard';
import { PriceBreakdown } from '@/frontend/components/Cart/PriceBreakdown';
import { CrossSellGrid } from '@/frontend/components/Cart/CrossSellGrid';
import { TrustBadgeRow } from '@/frontend/components/Cart/TrustBadgeRow';
import { 
  mockCartItems, 
  crossSellItems, 
  trustBadges,
  CartItem 
} from '@/frontend/data/mockCartData';
import { 
  ShoppingCart, 
  Upload,
  MapPin,
  Truck,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Percent,
  Clock,
  Users,
  ArrowRight,
  CreditCard
} from 'lucide-react';

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (itemToRemove) {
      setSavedItems(prev => [...prev, itemToRemove]);
    }
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const saveForLater = (id: string) => {
    const itemToSave = cartItems.find(item => item.id === id);
    if (itemToSave) {
      setSavedItems(prev => [...prev, itemToSave]);
      setCartItems(items => items.filter(item => item.id !== id));
    }
  };

  const moveToCart = (id: string) => {
    const itemToMove = savedItems.find(item => item.id === id);
    if (itemToMove) {
      setCartItems(prev => [...prev, itemToMove]);
      setSavedItems(items => items.filter(item => item.id !== id));
    }
  };

  const addCrossSellItem = (itemId: string) => {
    // Mock adding cross-sell item to cart
    console.log('Adding cross-sell item:', itemId);
  };

  const editItem = (id: string) => {
    // Mock edit functionality
    console.log('Editing item:', id);
  };

  // Group items by type
  const groupedItems = useMemo(() => {
    const groups = {
      services: cartItems.filter(item => item.type === 'service'),
      products: cartItems.filter(item => item.type === 'product'),
      subscriptions: cartItems.filter(item => item.type === 'subscription' || item.type === 'package')
    };
    return groups;
  }, [cartItems]);

  const hasPrescriptionItems = cartItems.some(item => item.prescriptionRequired);
  const hasServices = cartItems.some(item => item.type === 'service');

  // Handle page exit (for abandonment reduction)
  const handlePageExit = () => {
    if (cartItems.length > 0) {
      setShowExitModal(true);
    }
  };

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pb-20 md:pb-8">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-3 px-4 border-b border-border">
          <div className="container mx-auto">
            <div className="text-sm text-muted-foreground">
              <span>Home</span> / <span className="text-primary font-medium">Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start shopping for medicines, lab tests, and healthcare services to build your health journey.
              </p>
              <div className="space-y-3">
                <Button size="lg" className="px-8">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
                {savedItems.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have {savedItems.length} saved items
                    </p>
                    <Button variant="outline">View Saved Items</Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Cart Content */}
              <div className="xl:col-span-3 space-y-8">
                {/* Cart Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Shopping Cart
                    </h1>
                    <p className="text-muted-foreground">
                      {cartItems.length} items • Review and checkout
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save Cart
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Critical Actions Banner */}
                <div className="space-y-4">
                  {hasPrescriptionItems && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Upload className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                            Prescription Upload Required
                          </h3>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                            Items in your cart require a valid prescription. Upload now or consult our doctors.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                              <Upload className="h-3 w-3 mr-2" />
                              Upload Prescription
                            </Button>
                            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                              <Phone className="h-3 w-3 mr-2" />
                              Consult Doctor
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Health Score Tracker Prompt */}
                  {hasServices && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                            Track Your Health Progress
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                            Get a personalized health score and recommendations based on your tests and consultations.
                          </p>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                            Enable Health Tracking
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Items - Grouped by Type */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({cartItems.length})</TabsTrigger>
                    <TabsTrigger value="services">Services ({groupedItems.services.length})</TabsTrigger>
                    <TabsTrigger value="products">Products ({groupedItems.products.length})</TabsTrigger>
                    <TabsTrigger value="subscriptions">Plans ({groupedItems.subscriptions.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-6">
                      {/* Services Group */}
                      {groupedItems.services.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Badge variant="secondary">🩺 Healthcare Services</Badge>
                            <span className="text-sm text-muted-foreground">
                              ({groupedItems.services.length} items)
                            </span>
                          </h3>
                          <div className="space-y-3">
                            {groupedItems.services.map((item) => (
                              <CartItemCard
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeItem}
                                onEditItem={editItem}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Products Group */}
                      {groupedItems.products.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Badge variant="secondary">💊 Healthcare Products</Badge>
                            <span className="text-sm text-muted-foreground">
                              ({groupedItems.products.length} items)
                            </span>
                          </h3>
                          <div className="space-y-3">
                            {groupedItems.products.map((item) => (
                              <CartItemCard
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeItem}
                                onEditItem={editItem}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subscriptions Group */}
                      {groupedItems.subscriptions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Badge variant="secondary">📦 Care Plans & Subscriptions</Badge>
                            <span className="text-sm text-muted-foreground">
                              ({groupedItems.subscriptions.length} items)
                            </span>
                          </h3>
                          <div className="space-y-3">
                            {groupedItems.subscriptions.map((item) => (
                              <CartItemCard
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeItem}
                                onEditItem={editItem}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="mt-6">
                    <div className="space-y-3">
                      {groupedItems.services.map((item) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemoveItem={removeItem}
                          onEditItem={editItem}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="products" className="mt-6">
                    <div className="space-y-3">
                      {groupedItems.products.map((item) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemoveItem={removeItem}
                          onEditItem={editItem}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="subscriptions" className="mt-6">
                    <div className="space-y-3">
                      {groupedItems.subscriptions.map((item) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemoveItem={removeItem}
                          onEditItem={editItem}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Cross-sell Recommendations */}
                <CrossSellGrid items={crossSellItems} onAddToCart={addCrossSellItem} />

                {/* Saved Items */}
                {savedItems.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Saved for Later ({savedItems.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedItems.map((item) => (
                        <div key={item.id} className="bg-card border border-border rounded-lg p-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-24 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-medium text-sm mb-2">{item.name}</h4>
                          <p className="font-bold text-primary text-sm mb-3">₹{item.price}</p>
                          <Button size="sm" className="w-full" onClick={() => moveToCart(item.id)}>
                            Move to Cart
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Need Help Section */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Need Help with Your Order?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our health advisors are here to help you make the right choices for your health.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="border-green-300">
                          <Phone className="h-3 w-3 mr-2" />
                          Call Expert
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-300">
                          <MessageCircle className="h-3 w-3 mr-2" />
                          Chat Support
                        </Button>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <Users className="h-16 w-16 text-green-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="xl:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-6 space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                  {/* Price Breakdown */}
                  <PriceBreakdown items={cartItems} />

                  {/* Trust Badges */}
                  <TrustBadgeRow badges={trustBadges} />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    
                    <Button variant="ghost" className="w-full text-primary">
                      Continue Shopping
                    </Button>
                  </div>

                  {/* Emergency Contact */}
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        Medical Emergency?
                      </span>
                    </div>
                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Phone className="h-3 w-3 mr-2" />
                      Call 108 (Ambulance)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

        <BottomNav />
        <FloatingHelp />
      </div>
    </AuthGuard>
  );
};