import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Badge } from '@/shared/components/ui/badge';
import { PaymentMethod } from '@/frontend/data/mockCheckoutData';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  Banknote, 
  Shield, 
  Calculator,
  CheckCircle,
  Gift,
  Percent
} from 'lucide-react';

interface PaymentAccordionProps {
  paymentMethods: PaymentMethod[];
  selectedMethod?: string;
  onMethodSelect: (methodId: string) => void;
  walletBalance?: number;
  loyaltyPoints?: number;
}

export const PaymentAccordion: React.FC<PaymentAccordionProps> = ({
  paymentMethods,
  selectedMethod,
  onMethodSelect,
  walletBalance = 0,
  loyaltyPoints = 0
}) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');

  const getMethodIcon = (type: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'upi': return <Smartphone {...iconProps} />;
      case 'card': return <CreditCard {...iconProps} />;
      case 'netbanking': return <Building {...iconProps} />;
      case 'wallet': return <Wallet {...iconProps} />;
      case 'cod': return <Banknote {...iconProps} />;
      case 'insurance': return <Shield {...iconProps} />;
      case 'emi': return <Calculator {...iconProps} />;
      default: return <CreditCard {...iconProps} />;
    }
  };

  const enabledMethods = paymentMethods.filter(method => method.enabled);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Method
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" value={selectedMethod} onValueChange={onMethodSelect}>
          {enabledMethods.map((method) => (
            <AccordionItem key={method.id} value={method.id} className="border-border">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3 flex-1">
                  {getMethodIcon(method.type)}
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  {method.type === 'cod' && (
                    <Badge variant="outline" className="text-xs">
                      +₹15 fee
                    </Badge>
                  )}
                  {method.type === 'emi' && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      No Cost
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pt-0 pb-4">
                {method.type === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        placeholder="Name on card"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {method.type === 'upi' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Google Pay
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        PhonePe
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Paytm
                      </Button>
                    </div>
                  </div>
                )}

                {method.type === 'netbanking' && (
                  <div className="space-y-2">
                    <Label>Select Your Bank</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'BOI'].map((bank) => (
                        <Button key={bank} variant="outline" size="sm" className="text-xs">
                          {bank}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {method.type === 'wallet' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Paytm Wallet
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Amazon Pay
                      </Button>
                    </div>
                    {walletBalance > 0 && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-700 dark:text-blue-300">
                            ONE MEDI Wallet: ₹{walletBalance} available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {method.type === 'emi' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        No Cost EMI Available
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Convert to 3, 6, 9, 12 months EMI with 0% interest
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        3 Months
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        6 Months
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        9 Months
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        12 Months
                      </Button>
                    </div>
                  </div>
                )}

                {method.type === 'cod' && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Additional ₹15 fee applies. Please keep exact change ready.
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Loyalty Points Section */}
        {loyaltyPoints > 0 && (
          <div className="mt-4 p-3 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Use Loyalty Points</p>
                  <p className="text-xs text-muted-foreground">
                    {loyaltyPoints} points = ₹{loyaltyPoints} (Max ₹100)
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </CardContent>
    </Card>
  );
};