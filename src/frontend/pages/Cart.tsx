import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/shared/components/AuthGuard';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { FloatingHelp } from '@/frontend/components/Common/FloatingHelp';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { CartItemCard } from '@/frontend/components/Cart/CartItemCard';
import { PriceBreakdown } from '@/frontend/components/Cart/PriceBreakdown';
import { CrossSellGrid } from '@/frontend/components/Cart/CrossSellGrid';
import { TrustBadgeRow } from '@/frontend/components/Cart/TrustBadgeRow';
import { useAuth } from '@/shared/hooks/useAuth';
import { useToast } from '@/shared/hooks/use-toast';
import PrescriptionCartService, { 
  PrescriptionCartItem, 
  CartPrescriptionInfo,
  CartValidationResult 
} from '@/shared/services/prescriptionCartService';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [prescriptionCartItems, setPrescriptionCartItems] = useState<PrescriptionCartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [prescriptionInfo, setPrescriptionInfo] = useState<CartPrescriptionInfo[]>([]);
  const [validationResult, setValidationResult] = useState<CartValidationResult | null>(null);
  const [isLoadingPrescriptionItems, setIsLoadingPrescriptionItems] = useState(false);
  const [isValidatingCart, setIsValidatingCart] = useState(false);

  // Handle prescription items from navigation state
  useEffect(() => {
    const state = location.state as {
      prescriptionItems?: Array<{
        medicine_id: string;
        prescription_id: string;
        quantity: number;
        price: number;
      }>;
      prescriptionId?: string;
    };

    if (state?.prescriptionItems && user) {
      handleAddPrescriptionItems(state.prescriptionItems, state.prescriptionId!);
    }
  }, [location.state, user]);

  // Load user's existing prescription cart items
  useEffect(() => {
    if (user) {
      loadUserPrescriptionCartItems();
    }
  }, [user]);

  // Validate cart when prescription items change
  useEffect(() => {
    if (prescriptionCartItems.length > 0) {
      validatePrescriptionCart();
    }
  }, [prescriptionCartItems]);

  const handleAddPrescriptionItems = async (
    items: Array<{
      medicine_id: string;
      prescription_id: string;
      quantity: number;
      price: number;
    }>,
    prescriptionId: string
  ) => {
    if (!user) return;

    setIsLoadingPrescriptionItems(true);
    try {
      const result = await PrescriptionCartService.addPrescriptionItemsToCart(
        user.id,
        prescriptionId,
        items
      );

      if (result.success && result.cart_items) {
        setPrescriptionCartItems(prev => [...prev, ...result.cart_items!]);
        
        toast({
          title: "Medicines added to cart",
          description: `${result.cart_items.length} prescription medicines added successfully`,
        });

        // Load prescription info
        const prescInfo = await PrescriptionCartService.getCartPrescriptionInfo(result.cart_items);
        setPrescriptionInfo(prescInfo);
      } else {
        toast({
          title: "Error adding to cart",
          description: result.error || "Failed to add prescription items",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding prescription items:', error);
      toast({
        title: "Error",
        description: "Failed to add prescription items to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPrescriptionItems(false);
    }
  };

  const loadUserPrescriptionCartItems = async () => {
    if (!user) return;

    try {
      const result = await PrescriptionCartService.getUserCartItems(user.id);
      if (result.success && result.items) {
        setPrescriptionCartItems(result.items);
        
        // Load prescription info
        const prescInfo = await PrescriptionCartService.getCartPrescriptionInfo(result.items);
        setPrescriptionInfo(prescInfo);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const validatePrescriptionCart = async () => {
    setIsValidatingCart(true);
    try {
      const result = await PrescriptionCartService.validateCartForCheckout(prescriptionCartItems);
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating cart:', error);
    } finally {
      setIsValidatingCart(false);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    // Check if it's a prescription item
    const prescriptionItem = prescriptionCartItems.find(item => item.id === id);
    
    if (prescriptionItem && user) {
      const newQuantity = Math.max(1, prescriptionItem.quantity + change);
      
      // Update in database for prescription items
      PrescriptionCartService.updateCartItemQuantity(
        user.id,
        prescriptionItem.prescription_item_id!,
        newQuantity
      ).then(result => {
        if (result.success) {
          setPrescriptionCartItems(items =>
            items.map(item =>
              item.id === id
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        } else {
          toast({
            title: "Error updating quantity",
            description: result.error,
            variant: "destructive"
          });
        }
      });
    } else {
      // Handle regular items
      setCartItems(items =>
        items.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    // Check if it's a prescription item
    const prescriptionItem = prescriptionCartItems.find(item => item.id === id);
    
    if (prescriptionItem && user) {
      // Remove from database for prescription items
      PrescriptionCartService.removeCartItem(
        user.id,
        prescriptionItem.prescription_item_id!
      ).then(result => {
        if (result.success) {
          setPrescriptionCartItems(items => items.filter(item => item.id !== id));
          toast({
            title: "Item removed",
            description: "Prescription item removed from cart"
          });
        } else {
          toast({
            title: "Error removing item",
            description: result.error,
            variant: "destructive"
          });
        }
      });
    } else {
      // Handle regular items
      const itemToRemove = cartItems.find(item => item.id === id);
      if (itemToRemove) {
        setSavedItems(prev => [...prev, itemToRemove]);
      }
      setCartItems(items => items.filter(item => item.id !== id));
    }
  };

  const saveForLater = (id: string) => {
    const prescriptionItem = prescriptionCartItems.find(item => item.id === id);
    
    if (prescriptionItem && user) {
      // Update status to 'saved_for_later' for prescription items
      // For now, just remove from active cart
      setPrescriptionCartItems(items => items.filter(item => item.id !== id));
      toast({
        title: "Item saved",
        description: "Prescription item saved for later"
      });
    } else {
      const itemToSave = cartItems.find(item => item.id === id);
      if (itemToSave) {
        setSavedItems(prev => [...prev, itemToSave]);
        setCartItems(items => items.filter(item => item.id !== id));
      }
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
    // Combine regular cart items with prescription cart items
    const allItems = [...cartItems, ...prescriptionCartItems];
    
    const groups = {
      services: allItems.filter(item => item.type === 'service'),
      products: allItems.filter(item => item.type === 'product'),
      subscriptions: allItems.filter(item => item.type === 'subscription' || item.type === 'package'),
      prescriptions: prescriptionCartItems // Separate group for prescription items
    };
    return groups;
  }, [cartItems, prescriptionCartItems]);

  const allCartItems = [...cartItems, ...prescriptionCartItems];
  const hasPrescriptionItems = prescriptionCartItems.length > 0;
  const hasServices = allCartItems.some(item => item.type === 'service');
  
  // Calculate pricing using prescription service
  const pricingInfo = useMemo(() => {
    if (prescriptionCartItems.length > 0) {
      return PrescriptionCartService.calculatePrescriptionPricing(prescriptionCartItems);
    }
    
    // Regular pricing calculation for non-prescription items
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal >= 499 ? 0 : 40;
    return {
      subtotal,
      prescription_discount: 0,
      delivery_charges: deliveryCharges,
      total: subtotal + deliveryCharges
    };
  }, [cartItems, prescriptionCartItems]);

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
          {allCartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start shopping for medicines, lab tests, and healthcare services to build your health journey.
              </p>
              <div className="space-y-3">
                <Button size="lg" className="px-8" onClick={() => navigate('/medicines')}>
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
                      {allCartItems.length} items • Review and checkout
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

                {/* Prescription Validation Alerts */}
                {validationResult && !validationResult.valid && (
                  <Alert className="border-destructive bg-destructive/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Cart validation issues:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.errors.map((error, index) => (
                            <li key={index} className="text-sm">{error}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult && validationResult.warnings.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium text-yellow-800">Please note:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index} className="text-sm text-yellow-700">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Prescription Information Cards */}
                {prescriptionInfo.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Prescription Information</h3>
                    {prescriptionInfo.map((prescription) => (
                      <Card key={prescription.prescription_id} className="border border-primary/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">
                                Prescription by Dr. {prescription.doctor_name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                Date: {new Date(prescription.prescription_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge 
                              variant={prescription.status === 'verified' ? 'default' : 'secondary'}
                              className={prescription.status === 'verified' ? 'bg-green-500' : ''}
                            >
                              {prescription.status === 'verified' ? 'Verified' : 
                               prescription.status === 'uploaded' ? 'Under Review' : 
                               prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {prescription.items_count} medicine{prescription.items_count !== 1 ? 's' : ''} in cart
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/prescriptions')}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

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
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({allCartItems.length})</TabsTrigger>
                    <TabsTrigger value="prescriptions" className={hasPrescriptionItems ? '' : 'text-muted-foreground'}>
                      Prescriptions ({groupedItems.prescriptions.length})
                    </TabsTrigger>
                    <TabsTrigger value="services">Services ({groupedItems.services.length})</TabsTrigger>
                    <TabsTrigger value="products">Products ({groupedItems.products.filter(item => !prescriptionCartItems.find(p => p.id === item.id)).length})</TabsTrigger>
                    <TabsTrigger value="subscriptions">Plans ({groupedItems.subscriptions.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-6">
                      {/* Prescription Items Group */}
                      {groupedItems.prescriptions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              📋 Prescription Medicines
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({groupedItems.prescriptions.length} items)
                            </span>
                          </h3>
                          <div className="space-y-3">
                            {groupedItems.prescriptions.map((item) => (
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

                      {/* Products Group (excluding prescription items) */}
                      {groupedItems.products.filter(item => !prescriptionCartItems.find(p => p.id === item.id)).length > 0 && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Badge variant="secondary">💊 Healthcare Products</Badge>
                            <span className="text-sm text-muted-foreground">
                              ({groupedItems.products.filter(item => !prescriptionCartItems.find(p => p.id === item.id)).length} items)
                            </span>
                          </h3>
                          <div className="space-y-3">
                            {groupedItems.products.filter(item => !prescriptionCartItems.find(p => p.id === item.id)).map((item) => (
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

                  <TabsContent value="prescriptions" className="mt-6">
                    {groupedItems.prescriptions.length > 0 ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Upload className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Prescription Medicines</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            These medicines are from your uploaded prescription and have been verified by our pharmacists.
                          </p>
                        </div>
                        <div className="space-y-3">
                          {groupedItems.prescriptions.map((item) => (
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
                    ) : (
                      <div className="text-center py-12">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No prescription items</h3>
                        <p className="text-muted-foreground mb-4">
                          Upload your prescription to add medicines to cart
                        </p>
                        <Button onClick={() => navigate('/medicines/upload-prescription')}>
                          Upload Prescription
                        </Button>
                      </div>
                    )}
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
                      {groupedItems.products.filter(item => !prescriptionCartItems.find(p => p.id === item.id)).map((item) => (
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

                  {/* Enhanced Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{pricingInfo.subtotal.toFixed(2)}</span>
                    </div>
                    
                    {pricingInfo.prescription_discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Prescription Discount (5%)</span>
                        <span>-₹{pricingInfo.prescription_discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charges</span>
                      <span className={pricingInfo.delivery_charges === 0 ? 'text-green-600' : ''}>
                        {pricingInfo.delivery_charges === 0 ? 'FREE' : `₹${pricingInfo.delivery_charges.toFixed(2)}`}
                      </span>
                    </div>
                    
                    {pricingInfo.delivery_charges === 0 && hasPrescriptionItems && (
                      <div className="text-xs text-green-600">
                        Free delivery on prescription orders ₹200+
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">₹{pricingInfo.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Validation Messages */}
                  {validationResult && !validationResult.valid && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-medium mb-1">Cannot proceed to checkout:</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isValidatingCart && (
                    <div className="flex items-center justify-center p-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent mr-2" />
                      <span className="text-sm text-muted-foreground">Validating cart...</span>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <TrustBadgeRow badges={trustBadges} />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={!validationResult?.valid || isValidatingCart || allCartItems.length === 0}
                      onClick={() => {
                        if (validationResult?.valid) {
                          navigate('/checkout', {
                            state: {
                              cartItems: allCartItems,
                              prescriptionInfo,
                              pricingInfo
                            }
                          });
                        }
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {!validationResult?.valid && allCartItems.length > 0 ? 'Fix Issues to Checkout' : 'Proceed to Checkout'}
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
                    
                    <Button variant="ghost" className="w-full text-primary" onClick={() => navigate('/medicines')}>
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