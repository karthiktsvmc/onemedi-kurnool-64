import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useOrders, Order } from './useOrders';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from './use-toast';

export const useRealtimeOrders = () => {
  const { orders, loading, error, fetchOrders, ...orderMethods } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const [realtimeOrders, setRealtimeOrders] = useState<Order[]>(orders);

  // Update local state when orders change
  useEffect(() => {
    setRealtimeOrders(orders);
  }, [orders]);

  // Subscribe to real-time order updates
  useRealtimeSubscription<Order>({
    table: 'orders',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    enabled: !!user,
    onInsert: (payload) => {
      console.log('New order created:', payload.new);
      setRealtimeOrders(prev => [payload.new, ...prev]);
      
      toast({
        title: "New Order",
        description: `Order ${payload.new.order_number} has been created.`,
      });
    },
    onUpdate: (payload) => {
      console.log('Order updated:', payload.new);
      setRealtimeOrders(prev => 
        prev.map(order => 
          order.id === payload.new.id ? payload.new : order
        )
      );

      // Show notification for status changes
      if (payload.old.status !== payload.new.status) {
        const statusMessages = {
          confirmed: "Your order has been confirmed!",
          processing: "Your order is being processed.",
          shipped: "Your order is out for delivery!",
          delivered: "Your order has been delivered!",
          cancelled: "Your order has been cancelled."
        };

        toast({
          title: "Order Status Updated",
          description: statusMessages[payload.new.status as keyof typeof statusMessages] || 
                      `Order ${payload.new.order_number} status changed to ${payload.new.status}`,
        });
      }
    },
    onDelete: (payload) => {
      console.log('Order deleted:', payload.old);
      setRealtimeOrders(prev => 
        prev.filter(order => order.id !== payload.old.id)
      );
      
      toast({
        title: "Order Removed",
        description: "An order has been removed from your list.",
        variant: "destructive",
      });
    }
  });

  return {
    orders: realtimeOrders,
    loading,
    error,
    fetchOrders,
    ...orderMethods,
  };
};