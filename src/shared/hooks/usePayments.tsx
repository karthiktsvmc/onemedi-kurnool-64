import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  gateway: string;
  payment_id?: string;
  gateway_response?: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentData {
  order_id: string;
  amount: number;
  currency?: string;
  gateway: string;
  payment_id?: string;
  gateway_response?: any;
}

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const createPayment = async (paymentData: CreatePaymentData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process payment.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          order_id: paymentData.order_id,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          gateway: paymentData.gateway,
          payment_id: paymentData.payment_id,
          gateway_response: paymentData.gateway_response,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error creating payment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (
    paymentId: string, 
    status: 'pending' | 'completed' | 'failed' | 'cancelled',
    gatewayResponse?: any
  ) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (gatewayResponse) {
        updateData.gateway_response = gatewayResponse;
      }

      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);

      if (error) throw error;

      if (status === 'completed') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment';
      console.error('Error updating payment:', err);
    }
  };

  const processOnlinePayment = async (orderId: string, amount: number) => {
    // This would integrate with Razorpay/Stripe
    // For now, we'll simulate the payment process
    
    setLoading(true);
    
    try {
      // Create payment record
      const paymentId = await createPayment({
        order_id: orderId,
        amount,
        gateway: 'razorpay',
      });

      if (!paymentId) throw new Error('Failed to create payment record');

      // Simulate payment gateway integration
      // In real implementation, this would open Razorpay/Stripe checkout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      await updatePaymentStatus(paymentId, 'completed', {
        transaction_id: `txn_${Date.now()}`,
        gateway: 'razorpay',
        timestamp: new Date().toISOString(),
      });

      // Update order payment status
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', orderId);

      return paymentId;
    } catch (err) {
      console.error('Payment processing error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processCODPayment = async (orderId: string, amount: number) => {
    try {
      const paymentId = await createPayment({
        order_id: orderId,
        amount,
        gateway: 'cod',
      });

      if (!paymentId) throw new Error('Failed to create payment record');

      // Update order status for COD
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'pending',
          status: 'confirmed' 
        })
        .eq('id', orderId);

      toast({
        title: "Order Confirmed",
        description: "Your Cash on Delivery order has been confirmed.",
      });

      return paymentId;
    } catch (err) {
      console.error('COD payment error:', err);
      throw err;
    }
  };

  return {
    loading,
    error,
    createPayment,
    updatePaymentStatus,
    processOnlinePayment,
    processCODPayment,
  };
};