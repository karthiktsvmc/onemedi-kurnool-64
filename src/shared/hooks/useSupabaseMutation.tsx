import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

interface MutationOptions {
  table: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: any) => void;
}

export function useSupabaseMutation({ table, onSuccess, onError }: MutationOptions) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const create = async (data: any) => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from(table)
        .insert(data);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Record created successfully',
      });

      if (onSuccess) await onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create record',
        variant: 'destructive',
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: any) => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from(table)
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Record updated successfully',
      });

      if (onSuccess) await onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update record',
        variant: 'destructive',
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string | { id: string }) => {
    const deleteId = typeof id === 'string' ? id : id.id;
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from(table)
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Record deleted successfully',
      });

      if (onSuccess) await onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete record',
        variant: 'destructive',
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const mutate = async (data: any) => {
    await create(data);
  };

  return {
    create,
    update,
    remove,
    mutate,
    loading,
  };
}