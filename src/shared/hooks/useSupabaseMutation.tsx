
import { useState, useCallback } from 'react';
import { supabaseClient } from '@/shared/lib/supabase-client';
import { useToast } from '@/shared/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

interface UseSupabaseMutationOptions<T> {
  table: keyof Database['public']['Tables'];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useSupabaseMutation<T = any>({
  table,
  onSuccess,
  onError,
}: UseSupabaseMutationOptions<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const create = useCallback(async (data: Partial<T>) => {
    try {
      setLoading(true);
      setError(null);

      // Cast payload to any so this generic hook works for all tables without per-table typing
      const { data: result, error } = await (supabaseClient
        .from(table)
        .insert(data as any)
        .select()
        .single() as any);

      if (error) {
        throw new Error(error.message);
      }

      onSuccess?.(result as T);
      toast({
        title: "Success",
        description: "Item created successfully",
      });

      return result as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to create item');
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Error",
        description: errorMessage.message,
        variant: "destructive",
      });
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, [table, onSuccess, onError, toast]);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await (supabaseClient
        .from(table)
        .update(data as any)
        .eq('id', id)
        .select()
        .single() as any);

      if (error) {
        throw new Error(error.message);
      }

      onSuccess?.(result as T);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      return result as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to update item');
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Error",
        description: errorMessage.message,
        variant: "destructive",
      });
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, [table, onSuccess, onError, toast]);

  const remove = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to delete item');
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Error",
        description: errorMessage.message,
        variant: "destructive",
      });
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, [table, onError, toast]);

  return {
    create,
    update,
    remove,
    loading,
    error,
  };
}

