import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { CustomerDetails } from '@/frontend/components/Checkout/CustomerDetails';
import { AddressBlock } from '@/frontend/components/Checkout/AddressBlock';
import { SlotSelector } from '@/frontend/components/Checkout/SlotSelector';
import { PrescriptionUpload } from '@/frontend/components/Checkout/PrescriptionUpload';
import { PaymentAccordion } from '@/frontend/components/Checkout/PaymentAccordion';
import { TrustBadgeRow } from '@/frontend/components/Cart/TrustBadgeRow';
import { 
  mockUser, 
  mockAddresses, 
  mockDateSlots, 
  mockPaymentMethods,
  trustBadges,
  CheckoutUser,
  Address,
  TimeSlot
} from '@/frontend/data/mockCheckoutData';
import { mockCartItems } from '@/frontend/data/mockCartData';
import { 
  ShoppingCart, 
  Clock, 
  Shield, 
  Phone,
  CheckCircle,
  AlertTriangle,
  Timer,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(true); // Mock login state
  const [user, setUser] = useState<CheckoutUser>(mockUser);
  const [selectedAddress, setSelectedAddress] = useState<Address>(mockAddresses[0]);
  const [serviceType, setServiceType] = useState<'delivery' | 'home-visit' | 'clinic' | 'online'>('delivery');
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string }>();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const gstAmount = Math.round(subtotal * 0.12);
  const total = subtotal + gstAmount + deliveryFee;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Redirect to cart on timeout
          navigate('/cart');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      user.name && 
      user.email && 
      user.phone &&
      selectedAddress &&
      selectedSlot &&
      selectedPayment
    );
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // In real app, redirect to order confirmation
      navigate('/order-confirmation');
    }, 2000);
  };

  // Check if prescription is required
  const prescriptionRequired = mockCartItems.some(item => 
    item.prescriptionRequired === true
  );

  const prescriptionItems = mockCartItems
    .filter(item => item.prescriptionRequired === true)
    .map(item => item.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/cart')}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">Secure Checkout</h1>
                <p className="text-xs text-muted-foreground">
                  {mockCartItems.length} items • ₹{total}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-orange-500" />
              <span className={`font-mono ${timeLeft < 120 ? 'text-destructive' : 'text-orange-500'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <CustomerDetails
              user={user}
              isLoggedIn={isLoggedIn}
              onUpdate={setUser}
            />

            {/* Address & Service Type */}
            <AddressBlock
              addresses={mockAddresses}
              selectedAddress={selectedAddress}
              serviceType={serviceType}
              onAddressSelect={setSelectedAddress}
              onServiceTypeChange={setServiceType}
            />

            {/* Appointment Slots */}
            {(serviceType !== 'online') && (
              <SlotSelector
                dateSlots={mockDateSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={(date, slot) => setSelectedSlot({ date, time: slot.time })}
                serviceType="lab"
              />
            )}

            {/* Prescription Upload */}
            {prescriptionRequired && (
              <PrescriptionUpload
                prescriptionReq={{
                  required: true,
                  items: prescriptionItems,
                  uploaded: false
                }}
                onUpload={(files) => console.log('Files uploaded:', files)}
              />
            )}

            {/* Payment Methods */}
            <PaymentAccordion
              paymentMethods={mockPaymentMethods}
              selectedMethod={selectedPayment}
              onMethodSelect={setSelectedPayment}
              walletBalance={250}
              loyaltyPoints={150}
            />
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-24">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Order Summary</span>
                </div>

                {/* Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockCartItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-xs">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-xs">{item.name}</p>
                        <p className="text-xs text-muted-foreground">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {mockCartItems.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{mockCartItems.length - 3} more items
                    </p>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (12%)</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!isFormValid() || isProcessing}
                  onClick={handlePlaceOrder}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Place Order Securely
                    </>
                  )}
                </Button>

                {/* Form Validation Messages */}
                {!isFormValid() && (
                  <div className="space-y-1">
                    {!user.name && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Name is required
                      </p>
                    )}
                    {!selectedSlot && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Please select a time slot
                      </p>
                    )}
                    {!selectedPayment && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Please select payment method
                      </p>
                    )}
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        Need Help?
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Call 1800-123-4567 (24/7)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <TrustBadgeRow badges={trustBadges} variant="grid" />

            {/* Selected Slot Info */}
            {selectedSlot && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Appointment Booked</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockDateSlots.find(d => d.date === selectedSlot.date)?.day} at {selectedSlot.time}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Confirmation will be sent via SMS
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};