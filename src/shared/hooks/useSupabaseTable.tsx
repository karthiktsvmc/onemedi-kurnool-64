import { useState, useEffect, useCallback } from 'react';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { useToast } from '@/shared/hooks/use-toast';

interface UseSupabaseTableOptions {
  autoFetch?: boolean;
  realtime?: boolean;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  filters?: Record<string, any>;
}

export function useSupabaseTable<T extends Record<string, any>>(
  table: SupabaseTable<T>,
  options: UseSupabaseTableOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    autoFetch = true,
    realtime = false,
    orderBy,
    ascending = true,
    limit,
    filters
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await table.getAll({
        orderBy,
        ascending,
        limit,
        filters
      });
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [table, orderBy, ascending, limit, filters, toast]);

  const createItem = useCallback(async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newItem = await table.create(item);
      setData(prev => [newItem, ...prev]);
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table, toast]);

  const updateItem = useCallback(async (id: string, updates: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setLoading(true);
      const updatedItem = await table.update(id, updates);
      setData(prev => prev.map(item => 
        (item as any).id === id ? updatedItem : item
      ));
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table, toast]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await table.delete(id);
      setData(prev => prev.filter(item => (item as any).id !== id));
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table, toast]);

  const searchItems = useCallback(async (query: string, searchFields: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await table.search(query, searchFields, { limit, filters });
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search items';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [table, limit, filters, toast]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  useEffect(() => {
    if (realtime) {
      const channel = table.subscribe((payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
          case 'INSERT':
            setData(prev => [newRecord as T, ...prev]);
            break;
          case 'UPDATE':
            setData(prev => prev.map(item => 
              (item as any).id === (newRecord as any).id ? newRecord as T : item
            ));
            break;
          case 'DELETE':
            setData(prev => prev.filter(item => (item as any).id !== (oldRecord as any).id));
            break;
        }
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [table, realtime]);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    searchItems,
    refetch: fetchData
  };
}