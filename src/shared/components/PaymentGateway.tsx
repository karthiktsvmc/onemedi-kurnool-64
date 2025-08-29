import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Separator } from '@/shared/components/ui/separator';
import { usePayments } from '@/shared/hooks/usePayments';
import { CreditCard, Smartphone, Truck, Zap, Wallet, Building } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

export interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface PaymentConfig {
  razorpayKeyId?: string;
  paytmMerchantId?: string;
  webhookUrl?: string;
}

interface PaymentGatewayProps {
  paymentData: PaymentData;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI Payment',
    description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
    icon: Smartphone,
    enabled: true,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Rupay cards accepted',
    icon: CreditCard,
    enabled: true,
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Secure payment gateway',
    icon: Zap,
    enabled: true,
  },
  {
    id: 'paytm',
    name: 'Paytm',
    description: 'Pay with Paytm wallet or bank',
    icon: Wallet,
    enabled: true,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'Direct bank transfer',
    icon: Building,
    enabled: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: Truck,
    enabled: true,
  },
];

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  paymentData,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [config, setConfig] = useState<PaymentConfig>({});
  const [showConfig, setShowConfig] = useState(false);
  const { loading, processOnlinePayment, processCODPayment } = usePayments();
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      let result;
      
      if (selectedMethod === 'cod') {
        result = await processCODPayment(paymentData.orderId, paymentData.amount);
      } else {
        result = await processOnlinePayment(paymentData.orderId, paymentData.amount);
      }

      if (result) {
        onPaymentSuccess({ 
          success: true, 
          paymentId: result,
          transactionId: `txn_${Date.now()}` 
        });
        
        // Trigger webhook if configured
        if (config.webhookUrl) {
          try {
            await fetch(config.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              mode: 'no-cors',
              body: JSON.stringify({
                event: 'payment_success',
                order_id: paymentData.orderId,
                payment_id: result,
                amount: paymentData.amount,
                timestamp: new Date().toISOString(),
              }),
            });
          } catch (error) {
            console.error('Webhook error:', error);
          }
        }
      }
    } catch (error: any) {
      onPaymentError(error.message || 'Payment processing failed');
    }
  };

  const handleConfigUpdate = (field: keyof PaymentConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="grid gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                      selectedMethod === method.id 
                        ? 'bg-primary/5 border-primary' 
                        : 'hover:bg-muted/50'
                    } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => method.enabled && setSelectedMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} disabled={!method.enabled} />
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                    {!method.enabled && (
                      <span className="text-xs text-muted-foreground">Coming Soon</span>
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Configuration (for testing) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gateway Configuration
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              {showConfig ? 'Hide' : 'Show'} Config
            </Button>
          </CardTitle>
        </CardHeader>
        {showConfig && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
              <Input
                id="razorpay-key"
                placeholder="rzp_test_..."
                value={config.razorpayKeyId || ''}
                onChange={(e) => handleConfigUpdate('razorpayKeyId', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="paytm-merchant">Paytm Merchant ID</Label>
              <Input
                id="paytm-merchant"
                placeholder="Your Paytm Merchant ID"
                value={config.paytmMerchantId || ''}
                onChange={(e) => handleConfigUpdate('paytmMerchantId', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="webhook-url">Zapier Webhook URL (Optional)</Label>
              <Input
                id="webhook-url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={config.webhookUrl || ''}
                onChange={(e) => handleConfigUpdate('webhookUrl', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Configure a Zapier webhook to receive payment notifications
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-sm">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{paymentData.items.length} item(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Currency:</span>
              <span>{paymentData.currency}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount:</span>
              <span>₹{paymentData.amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={disabled || loading}
        className="w-full h-12 text-lg"
        size="lg"
      >
        {loading ? 'Processing...' : `Pay ₹${paymentData.amount.toFixed(2)}`}
      </Button>

      {/* Payment Method Info */}
      {selectedMethod === 'cod' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Cash on Delivery:</strong> You can pay when you receive your order. 
            Please keep the exact amount ready for delivery.
          </p>
        </div>
      )}

      {(selectedMethod === 'razorpay' || selectedMethod === 'paytm') && !config.razorpayKeyId && !config.paytmMerchantId && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a demo payment. In production, 
            configure your payment gateway credentials above.
          </p>
        </div>
      )}
    </div>
  );
};