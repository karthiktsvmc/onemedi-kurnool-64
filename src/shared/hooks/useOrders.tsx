import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  delivery_date?: string;
  prescription_urls?: string[];
  special_instructions?: string;
  order_items?: OrderItem[];
  shipping_address?: any;
}

export interface OrderItem {
  id: string;
  item_type: string;
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  vendor_id?: string;
  status: string;
}

export interface CreateOrderData {
  total_amount: number;
  gst_amount?: number;
  delivery_charges?: number;
  discount_amount?: number;
  payment_method: string;
  delivery_address_id: string;
  delivery_date?: string;
  delivery_slot?: string;
  special_instructions?: string;
  items: Omit<OrderItem, 'id' | 'status'>[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          shipping_address:addresses!delivery_address_id (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: CreateOrderData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: orderData.total_amount,
          subtotal: orderData.total_amount - (orderData.gst_amount || 0) - (orderData.delivery_charges || 0),
          gst_amount: orderData.gst_amount || 0,
          delivery_charges: orderData.delivery_charges || 0,
          discount_amount: orderData.discount_amount || 0,
          payment_method: orderData.payment_method,
          delivery_address_id: orderData.delivery_address_id,
          delivery_date: orderData.delivery_date,
          delivery_slot: orderData.delivery_slot,
          special_instructions: orderData.special_instructions,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        ...item,
        order_id: orderResult.id,
        status: 'pending',
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Placed Successfully",
        description: `Order ${orderResult.order_number} has been placed.`,
      });

      // Refresh orders list
      await fetchOrders();
      
      return orderResult.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error creating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: "Order status has been updated.",
      });

      await fetchOrders();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error updating order:', err);
    }
  };

  const cancelOrder = async (orderId: string) => {
    return updateOrderStatus(orderId, 'cancelled');
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
  };
};