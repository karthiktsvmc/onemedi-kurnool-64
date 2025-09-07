import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

export interface PaymentGateway {
  id: string;
  name: string;
  gateway_key: string;
  is_active: boolean;
  test_mode: boolean;
  config: {
    key_id?: string;
    key_secret?: string;
    webhook_secret?: string;
    merchant_id?: string;
    salt_key?: string;
    salt_index?: number;
    merchant_key?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaymentInitRequest {
  order_id: string;
  amount: number;
  currency: string;
  gateway: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
  };
  order_details: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface PaymentResponse {
  success: boolean;
  payment_url?: string;
  transaction_id?: string;
  gateway_response?: any;
  error?: string;
}

export function usePaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('name');

      if (error) throw error;
      setGateways((data || []) as PaymentGateway[]);
    } catch (error) {
      console.error('Error fetching payment gateways:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment gateways",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGateway = async (id: string, updates: Partial<PaymentGateway>) => {
    try {
      const { error } = await supabase
        .from('payment_gateways')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchGateways();
      toast({
        title: "Success",
        description: "Payment gateway updated successfully",
      });
    } catch (error) {
      console.error('Error updating payment gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update payment gateway",
        variant: "destructive",
      });
    }
  };

  const initiatePayment = async (request: PaymentInitRequest): Promise<PaymentResponse> => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: request
      });

      if (error) throw error;
      
      return data as PaymentResponse;
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: 'Payment initiation failed' };
    } finally {
      setProcessing(false);
    }
  };

  const getActiveGateways = () => {
    return gateways.filter(gateway => gateway.is_active);
  };

  const getGatewayByKey = (key: string) => {
    return gateways.find(gateway => gateway.gateway_key === key);
  };

  return {
    gateways,
    loading,
    processing,
    fetchGateways,
    updateGateway,
    initiatePayment,
    getActiveGateways,
    getGatewayByKey
  };
}