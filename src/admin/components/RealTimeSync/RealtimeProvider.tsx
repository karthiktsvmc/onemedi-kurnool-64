import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscriptions: string[];
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  connectionStatus: 'disconnected',
  subscriptions: []
});

export const useRealtime = () => useContext(RealtimeContext);

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<RealtimeContextType['connectionStatus']>('connecting');
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const { toast } = useToast();

  // Monitor connection status
  useEffect(() => {
    const channel = supabase.channel('admin-realtime-status');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        setConnectionStatus('connected');
      })
      .on('broadcast', { event: 'connection' }, ({ payload }) => {
        setConnectionStatus(payload.status);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CLOSED') {
          setConnectionStatus('disconnected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Subscribe to critical tables for admin monitoring
  useRealtimeSubscription({
    table: 'orders',
    onInsert: (payload) => {
      toast({
        title: "New Order Received",
        description: `Order ${payload.new?.order_number || 'N/A'} has been placed`,
      });
      setSubscriptions(prev => [...prev, 'orders']);
    },
    onUpdate: (payload) => {
      if (payload.new?.status === 'completed') {
        toast({
          title: "Order Completed",
          description: `Order ${payload.new?.order_number || 'N/A'} has been completed`,
        });
      }
    }
  });

  useRealtimeSubscription({
    table: 'inventory_alerts',
    onInsert: (payload) => {
      if (payload.new?.status === 'active') {
        toast({
          title: "Inventory Alert",
          description: "Low stock detected - Check inventory management",
          variant: "destructive",
        });
      }
    }
  });

  useRealtimeSubscription({
    table: 'payments',
    onUpdate: (payload) => {
      if (payload.new?.status === 'completed') {
        toast({
          title: "Payment Received",
          description: `Payment of ₹${payload.new?.amount || 0} received`,
        });
      }
    }
  });

  const contextValue: RealtimeContextType = {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    subscriptions
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};