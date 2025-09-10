import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/contexts/AuthContext';

interface EnhancedRealtimeContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  activeChannels: string[];
  subscribedTables: string[];
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  lastSyncTime: Date | null;
  subscribe: (table: string, callbacks?: RealtimeCallbacks) => void;
  unsubscribe: (table: string) => void;
  getChannelStatus: (table: string) => 'active' | 'inactive' | 'error';
  reconnect: () => void;
}

interface RealtimeCallbacks {
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

const EnhancedRealtimeContext = createContext<EnhancedRealtimeContextType>({
  isConnected: false,
  connectionStatus: 'disconnected',
  activeChannels: [],
  subscribedTables: [],
  connectionQuality: 'disconnected',
  lastSyncTime: null,
  subscribe: () => {},
  unsubscribe: () => {},
  getChannelStatus: () => 'inactive',
  reconnect: () => {}
});

export const useEnhancedRealtime = () => useContext(EnhancedRealtimeContext);

interface EnhancedRealtimeProviderProps {
  children: React.ReactNode;
}

export const EnhancedRealtimeProvider: React.FC<EnhancedRealtimeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [activeChannels, setActiveChannels] = useState<string[]>([]);
  const [subscribedTables, setSubscribedTables] = useState<string[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [channels, setChannels] = useState<Map<string, RealtimeChannel>>(new Map());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [connectionLatency, setConnectionLatency] = useState<number>(0);

  // Monitor connection health
  useEffect(() => {
    if (!user) return;

    const startTime = Date.now();
    const healthChannel = supabase.channel('admin-health-check');
    
    healthChannel
      .on('presence', { event: 'sync' }, () => {
        const latency = Date.now() - startTime;
        setConnectionLatency(latency);
        setConnectionStatus('connected');
        setLastSyncTime(new Date());
        updateConnectionQuality(latency);
        setReconnectAttempts(0);
      })
      .on('broadcast', { event: 'ping' }, ({ payload }) => {
        const latency = Date.now() - payload.timestamp;
        setConnectionLatency(latency);
        updateConnectionQuality(latency);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          setActiveChannels(prev => [...prev, 'admin-health-check']);
        } else if (status === 'CLOSED') {
          setConnectionStatus('disconnected');
          setActiveChannels(prev => prev.filter(ch => ch !== 'admin-health-check'));
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error');
          handleConnectionError();
        }
      });

    // Ping server every 30 seconds to monitor latency
    const pingInterval = setInterval(() => {
      if (connectionStatus === 'connected') {
        healthChannel.send({
          type: 'broadcast',
          event: 'ping',
          payload: { timestamp: Date.now() }
        });
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      supabase.removeChannel(healthChannel);
      setActiveChannels(prev => prev.filter(ch => ch !== 'admin-health-check'));
    };
  }, [user, connectionStatus]);

  const updateConnectionQuality = (latency: number) => {
    if (latency < 100) {
      setConnectionQuality('excellent');
    } else if (latency < 300) {
      setConnectionQuality('good');
    } else if (latency < 1000) {
      setConnectionQuality('poor');
    } else {
      setConnectionQuality('disconnected');
    }
  };

  const handleConnectionError = useCallback(() => {
    setConnectionStatus('error');
    setConnectionQuality('disconnected');
    
    if (reconnectAttempts < 5) {
      const delay = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff
      setTimeout(() => {
        setReconnectAttempts(prev => prev + 1);
        reconnect();
      }, delay);
    } else {
      toast({
        title: "Connection Failed",
        description: "Real-time connection failed after multiple attempts. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [reconnectAttempts, toast]);

  const subscribe = useCallback((table: string, callbacks?: RealtimeCallbacks) => {
    if (channels.has(table)) {
      return; // Already subscribed
    }

    const channel = supabase.channel(`admin-${table}`);
    
    // Set up table change listeners
    channel
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table }, 
        (payload) => {
          callbacks?.onInsert?.(payload);
          setLastSyncTime(new Date());
          
          // Show notification for important changes
          if (['orders', 'payments', 'user_roles'].includes(table)) {
            toast({
              title: `New ${table.slice(0, -1)} created`,
              description: `A new record has been added to ${table}`,
            });
          }
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table }, 
        (payload) => {
          callbacks?.onUpdate?.(payload);
          setLastSyncTime(new Date());
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table }, 
        (payload) => {
          callbacks?.onDelete?.(payload);
          setLastSyncTime(new Date());
          
          // Show notification for deletions
          toast({
            title: `${table.slice(0, -1)} deleted`,
            description: `A record has been removed from ${table}`,
            variant: "destructive",
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setActiveChannels(prev => [...prev, `admin-${table}`]);
          setSubscribedTables(prev => [...prev, table]);
        } else if (status === 'CLOSED') {
          setActiveChannels(prev => prev.filter(ch => ch !== `admin-${table}`));
          setSubscribedTables(prev => prev.filter(t => t !== table));
        } else if (status === 'CHANNEL_ERROR') {
          toast({
            title: "Subscription Error",
            description: `Failed to subscribe to ${table} updates`,
            variant: "destructive",
          });
        }
      });

    setChannels(prev => new Map(prev).set(table, channel));
  }, [channels, toast]);

  const unsubscribe = useCallback((table: string) => {
    const channel = channels.get(table);
    if (channel) {
      supabase.removeChannel(channel);
      setChannels(prev => {
        const newMap = new Map(prev);
        newMap.delete(table);
        return newMap;
      });
      setActiveChannels(prev => prev.filter(ch => ch !== `admin-${table}`));
      setSubscribedTables(prev => prev.filter(t => t !== table));
    }
  }, [channels]);

  const getChannelStatus = useCallback((table: string): 'active' | 'inactive' | 'error' => {
    const channel = channels.get(table);
    if (!channel) return 'inactive';
    
    const channelName = `admin-${table}`;
    if (activeChannels.includes(channelName)) {
      return connectionStatus === 'error' ? 'error' : 'active';
    }
    return 'inactive';
  }, [channels, activeChannels, connectionStatus]);

  const reconnect = useCallback(() => {
    setConnectionStatus('connecting');
    
    // Resubscribe to all tables
    const tablesToReconnect = [...subscribedTables];
    
    // Clear existing channels
    channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    setChannels(new Map());
    setActiveChannels([]);
    setSubscribedTables([]);
    
    // Resubscribe after a short delay
    setTimeout(() => {
      tablesToReconnect.forEach(table => subscribe(table));
    }, 1000);
  }, [subscribedTables, channels, subscribe]);

  // Auto-subscribe to critical tables for admin
  useEffect(() => {
    if (user && connectionStatus === 'connected') {
      const criticalTables = [
        'orders',
        'payments', 
        'audit_logs',
        'system_notifications',
        'failed_login_attempts'
      ];

      criticalTables.forEach(table => {
        if (!subscribedTables.includes(table)) {
          subscribe(table);
        }
      });
    }
  }, [user, connectionStatus, subscribe, subscribedTables]);

  // Performance monitoring
  useEffect(() => {
    const performanceInterval = setInterval(() => {
      if (connectionStatus === 'connected') {
        // Mock record performance metrics for now
        console.log('Performance metrics:', {
          latency: connectionLatency,
          quality: connectionQuality,
          channels: activeChannels.length
        });
      }
    }, 60000); // Every minute

    return () => clearInterval(performanceInterval);
  }, [connectionStatus, connectionLatency, connectionQuality, activeChannels.length, subscribedTables.length]);

  const contextValue: EnhancedRealtimeContextType = {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    activeChannels,
    subscribedTables,
    connectionQuality,
    lastSyncTime,
    subscribe,
    unsubscribe,
    getChannelStatus,
    reconnect
  };

  return (
    <EnhancedRealtimeContext.Provider value={contextValue}>
      {children}
    </EnhancedRealtimeContext.Provider>
  );
};