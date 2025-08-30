import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface InventoryItem {
  id: string;
  name: string;
  stock_qty: number;
  mrp: number;
  sale_price: number;
  category_id: string;
  updated_at: string;
}

interface InventoryAlert {
  id: string;
  medicine_id: string;
  medicine_name: string;
  current_stock: number;
  threshold: number;
  alert_type: string;
  message: string;
  status: string;
  created_at: string;
}

export const useRealtimeInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch initial inventory data
  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('id, name, stock_qty, mrp, sale_price, category_id, updated_at')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory alerts
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchAlerts();
  }, []);

  // Subscribe to inventory updates
  useRealtimeSubscription<InventoryItem>({
    table: 'medicines',
    onUpdate: (payload) => {
      console.log('Inventory updated:', payload.new);
      setInventory(prev => 
        prev.map(item => 
          item.id === payload.new.id ? payload.new : item
        )
      );

      // Check for low stock alerts
      if (payload.new.stock_qty <= 10 && payload.old.stock_qty > 10) {
        toast({
          title: "Low Stock Alert",
          description: `${payload.new.name} is running low (${payload.new.stock_qty} left)`,
          variant: "destructive",
        });
      }

      // Check for stock updates
      if (payload.old.stock_qty !== payload.new.stock_qty) {
        toast({
          title: "Stock Updated",
          description: `${payload.new.name} stock updated to ${payload.new.stock_qty}`,
        });
      }
    },
    onInsert: (payload) => {
      console.log('New medicine added:', payload.new);
      setInventory(prev => [payload.new, ...prev]);
      
      toast({
        title: "New Medicine Added",
        description: `${payload.new.name} has been added to inventory.`,
      });
    }
  });

  // Subscribe to inventory alerts
  useRealtimeSubscription<InventoryAlert>({
    table: 'inventory_alerts',
    onInsert: (payload) => {
      console.log('New inventory alert:', payload.new);
      setAlerts(prev => [payload.new, ...prev]);
      
      toast({
        title: "Inventory Alert",
        description: payload.new.message,
        variant: payload.new.alert_type === 'low_stock' ? 'destructive' : 'default',
      });
    },
    onUpdate: (payload) => {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === payload.new.id ? payload.new : alert
        )
      );
    }
  });

  const updateStock = async (medicineId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .update({ 
          stock_qty: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', medicineId);

      if (error) throw error;
      
      toast({
        title: "Stock Updated",
        description: "Medicine stock has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('inventory_alerts')
        .update({ status: 'dismissed' })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  return {
    inventory,
    alerts,
    loading,
    updateStock,
    dismissAlert,
    fetchInventory,
    fetchAlerts,
  };
};