import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeDataHookProps {
  table: string;
  initialFetch?: boolean;
  filters?: Record<string, any>;
}

export const useRealtimeData = <T extends Record<string, any>>({
  table,
  initialFetch = true,
  filters = {}
}: RealtimeDataHookProps) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (!initialFetch) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { data: result, error: fetchError } = await supabase
          .from(table as any)
          .select('*');
        
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setData(result ? result as any[] : []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [table, initialFetch]);

  // Real-time subscriptions
  useRealtimeSubscription({
    table,
    onInsert: (payload) => {
      if (payload.new) {
        setData(prev => [...prev, payload.new as T]);
      }
    },
    onUpdate: (payload) => {
      if (payload.new) {
        setData(prev => prev.map(item => 
          item.id === payload.new!.id ? payload.new as T : item
        ));
      }
    },
    onDelete: (payload) => {
      if (payload.old) {
        setData(prev => prev.filter(item => item.id !== payload.old!.id));
      }
    }
  });

  const refetch = async () => {
    setLoading(true);
    try {
      const { data: result, error: fetchError } = await supabase
        .from(table as any)
        .select('*');
      
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setData(result ? result as any[] : []);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};