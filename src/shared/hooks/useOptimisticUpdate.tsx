import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorLogger } from '@/shared/contexts/ErrorContext';
import { useToast } from '@/shared/hooks/use-toast';

interface OptimisticUpdateOptions<T> {
  table: string;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useOptimisticUpdate = <T,>({
  table,
  onSuccess,
  onError,
  successMessage,
  errorMessage
}: OptimisticUpdateOptions<T>) => {
  const [loading, setLoading] = useState(false);
  const { logError } = useErrorLogger();
  const { toast } = useToast();

  const executeUpdate = useCallback(async (
    operation: () => Promise<{ data: T | null; error: any }>,
    optimisticUpdate: () => void,
    rollback: () => void
  ) => {
    if (loading) return;

    setLoading(true);
    
    // Apply optimistic update immediately
    optimisticUpdate();

    try {
      const { data, error } = await operation();

      if (error) {
        // Rollback optimistic update on error
        rollback();
        throw error;
      }

      // Success - no need to update UI again since optimistic update already applied
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage
        });
      }

      onSuccess?.(data!);
      return { data, error: null };
    } catch (error: any) {
      // Rollback optimistic update
      rollback();
      
      logError(`Optimistic update failed for ${table}`, { 
        error: error.message, 
        table 
      });

      toast({
        title: 'Error',
        description: errorMessage || error.message || 'Operation failed',
        variant: 'destructive'
      });

      onError?.(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [loading, table, logError, toast, successMessage, errorMessage, onSuccess, onError]);

  const create = useCallback(async (
    newItem: Partial<T>,
    optimisticUpdate: () => void,
    rollback: () => void
  ) => {
    return executeUpdate(
      () => (supabase as any).from(table).insert(newItem).select().single(),
      optimisticUpdate,
      rollback
    );
  }, [executeUpdate, table]);

  const update = useCallback(async (
    id: string,
    updates: Partial<T>,
    optimisticUpdate: () => void,
    rollback: () => void
  ) => {
    return executeUpdate(
      () => (supabase as any).from(table).update(updates).eq('id', id).select().single(),
      optimisticUpdate,
      rollback
    );
  }, [executeUpdate, table]);

  const remove = useCallback(async (
    id: string,
    optimisticUpdate: () => void,
    rollback: () => void
  ) => {
    return executeUpdate(
      () => (supabase as any).from(table).delete().eq('id', id),
      optimisticUpdate,
      rollback
    );
  }, [executeUpdate, table]);

  return {
    create,
    update,
    remove,
    loading
  };
};