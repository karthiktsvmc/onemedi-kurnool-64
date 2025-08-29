import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useCart } from '@/shared/hooks/useCart';
// import { useAddresses } from '@/shared/hooks/useAddresses';
import { useOrders } from '@/shared/hooks/useOrders';
import { usePayments } from '@/shared/hooks/usePayments';
import { useToast } from '@/shared/hooks/use-toast';
import { 
  ShoppingCart, 
  Phone,
  Timer,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  // const { addresses } = useAddresses();
  const { createOrder, loading: orderLoading } = useOrders();
  const { processOnlinePayment, processCODPayment } = usePayments();
  const { toast } = useToast();

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const addresses = []; // Temporary - will be replaced with real addresses hook
  
  // Set default address when addresses load
  // useEffect(() => {
  //   if (addresses.length > 0 && !selectedAddress) {
  //     const defaultAddr = addresses.find(addr => addr.is_default) || addresses[0];
  //     setSelectedAddress(defaultAddr);
  //   }
  // }, [addresses, selectedAddress]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [cartItems, navigate]);

  // Calculate totals from real cart data
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const gstAmount = Math.round(subtotal * 0.12);
  const total = subtotal + gstAmount + deliveryFee;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "Session Expired",
            description: "Your checkout session has expired. Please try again.",
            variant: "destructive",
          });
          navigate('/cart');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, toast]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      toast({
        title: "Missing Information",
        description: "Please select an address and payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order items from cart
      const orderItems = cartItems.map(item => ({
        item_type: item.item_type,
        item_id: item.item_id,
        item_name: item.item_name || 'Product',
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        vendor_id: item.vendor_id,
      }));

      // Create the order
      const orderId = await createOrder({
        total_amount: total,
        gst_amount: gstAmount,
        delivery_charges: deliveryFee,
        payment_method: selectedPayment,
        delivery_address_id: selectedAddress.id,
        special_instructions: specialInstructions,
        items: orderItems,
      });

      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Process payment based on method
      if (selectedPayment === 'cod') {
        await processCODPayment(orderId, total);
      } else {
        await processOnlinePayment(orderId, total);
      }

      // Clear cart and redirect
      await clearCart();
      navigate(`/order-confirmation?orderId=${orderId}`);

    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!user) return null;
  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Timer */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cart')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Button>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-semibold">Checkout</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Session expires in {formatTime(timeLeft)}
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-lg font-bold text-primary">₹{total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Simple Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Delivery Address</h3>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="font-medium">{address.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {address.address_line_1}, {address.city}, {address.state} - {address.pincode}
                      </div>
                      <div className="text-sm text-muted-foreground">{address.phone}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment('cod')}
                  >
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment('online')}
                  >
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-muted-foreground">UPI, Cards, Net Banking</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Special Instructions (Optional)</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Any special delivery instructions..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.item_name || 'Product'}</div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">₹{item.total_price}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>GST (12%)</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      Delivery Fee
                      {deliveryFee === 0 && (
                        <Badge variant="secondary" className="text-xs">FREE</Badge>
                      )}
                    </span>
                    <span>₹{deliveryFee}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || orderLoading || !selectedAddress || !selectedPayment}
                  className="w-full mt-6"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </div>
                  ) : (
                    `Place Order - ₹${total}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Need Help?</div>
                    <div className="text-sm text-muted-foreground">Call us at 1800-XXX-XXXX</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};