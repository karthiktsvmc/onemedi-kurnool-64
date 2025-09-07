import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Truck, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { usePaymentGateways } from '@/shared/hooks/usePaymentGateways';
import { useToast } from '@/shared/hooks/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  gateway: string;
  fee: number;
  feeType: 'fixed' | 'percentage';
  description: string;
  popular?: boolean;
  enabled: boolean;
}

interface EnhancedPaymentSelectorProps {
  totalAmount: number;
  onPaymentSelect: (method: PaymentMethod, finalAmount: number) => void;
  onPaymentInitiate: (gateway: string, amount: number) => Promise<void>;
  selectedPayment?: string;
}

export const EnhancedPaymentSelector: React.FC<EnhancedPaymentSelectorProps> = ({
  totalAmount,
  onPaymentSelect,
  onPaymentInitiate,
  selectedPayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>(selectedPayment || '');
  const [processing, setProcessing] = useState(false);
  const { getActiveGateways, loading } = usePaymentGateways();
  const { toast } = useToast();

  const activeGateways = getActiveGateways();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'razorpay_upi',
      name: 'UPI',
      icon: <Smartphone className="h-5 w-5" />,
      gateway: 'razorpay',
      fee: 0,
      feeType: 'fixed',
      description: 'Pay using any UPI app like GPay, PhonePe, Paytm',
      popular: true,
      enabled: activeGateways.some(g => g.gateway_key === 'razorpay')
    },
    {
      id: 'razorpay_card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      gateway: 'razorpay',
      fee: 2.95,
      feeType: 'percentage',
      description: 'Visa, MasterCard, RuPay, American Express',
      enabled: activeGateways.some(g => g.gateway_key === 'razorpay')
    },
    {
      id: 'razorpay_wallet',
      name: 'Digital Wallets',
      icon: <Wallet className="h-5 w-5" />,
      gateway: 'razorpay',
      fee: 1.5,
      feeType: 'percentage',
      description: 'Paytm, PhonePe, Amazon Pay, and more',
      enabled: activeGateways.some(g => g.gateway_key === 'razorpay')
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: <Smartphone className="h-5 w-5" />,
      gateway: 'phonepe',
      fee: 0.5,
      feeType: 'percentage',
      description: 'Pay directly through PhonePe app',
      enabled: activeGateways.some(g => g.gateway_key === 'phonepe')
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: <Wallet className="h-5 w-5" />,
      gateway: 'paytm',
      fee: 1,
      feeType: 'percentage',
      description: 'Pay using Paytm wallet or bank',
      enabled: activeGateways.some(g => g.gateway_key === 'paytm')
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="h-5 w-5" />,
      gateway: 'cod',
      fee: 25,
      feeType: 'fixed',
      description: 'Pay cash when your order is delivered',
      enabled: true
    }
  ];

  const enabledMethods = paymentMethods.filter(method => method.enabled);

  const calculateFinalAmount = (method: PaymentMethod) => {
    if (method.feeType === 'percentage') {
      return totalAmount + (totalAmount * method.fee / 100);
    }
    return totalAmount + method.fee;
  };

  const handleMethodSelect = (methodId: string) => {
    const method = enabledMethods.find(m => m.id === methodId);
    if (method) {
      setSelectedMethod(methodId);
      const finalAmount = calculateFinalAmount(method);
      onPaymentSelect(method, finalAmount);
    }
  };

  const handlePayment = async () => {
    const method = enabledMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    if (method.gateway === 'cod') {
      // Handle COD separately
      toast({
        title: "Order Confirmed",
        description: "Your order has been placed. Pay cash on delivery.",
      });
      return;
    }

    setProcessing(true);
    try {
      const finalAmount = calculateFinalAmount(method);
      await onPaymentInitiate(method.gateway, finalAmount);
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedMethod} onValueChange={handleMethodSelect}>
          {enabledMethods.map((method) => {
            const finalAmount = calculateFinalAmount(method);
            const fee = finalAmount - totalAmount;
            
            return (
              <div key={method.id} className="space-y-2">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                      {fee > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +₹{fee.toFixed(2)} fee
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {method.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{finalAmount.toFixed(2)}</div>
                    {fee > 0 && (
                      <div className="text-xs text-muted-foreground">
                        (incl. ₹{fee.toFixed(2)} fee)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {selectedMethod && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              {(() => {
                const method = enabledMethods.find(m => m.id === selectedMethod);
                const fee = method ? calculateFinalAmount(method) - totalAmount : 0;
                
                if (fee > 0) {
                  return (
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Payment Fee</span>
                      <span>₹{fee.toFixed(2)}</span>
                    </div>
                  );
                }
                return null;
              })()}
              
              <Separator />
              
              <div className="flex justify-between items-center font-medium text-lg">
                <span>Total Amount</span>
                <span>
                  ₹{(() => {
                    const method = enabledMethods.find(m => m.id === selectedMethod);
                    return method ? calculateFinalAmount(method).toFixed(2) : totalAmount.toFixed(2);
                  })()}
                </span>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {selectedMethod === 'cod' ? 'Confirm Order' : 'Proceed to Payment'}
                </>
              )}
            </Button>
          </>
        )}

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment information is encrypted and secure. We never store your payment details.
          </AlertDescription>
        </Alert>

        {enabledMethods.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No payment methods are currently available. Please contact support.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};