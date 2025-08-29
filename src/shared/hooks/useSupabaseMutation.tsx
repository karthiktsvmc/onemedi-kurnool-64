import { useState } from 'react';
import { supabaseClient } from '@/shared/lib/supabase-client';
import { useToast } from '@/shared/hooks/use-toast';

interface UseSupabaseMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSupabaseMutation(table: string, options: UseSupabaseMutationOptions = {}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { onSuccess, onError } = options;

  const mutate = async (data: any) => {
    try {
      setLoading(true);
      
      if (data.id) {
        const { id, ...updateData } = data;
        await supabaseClient.from(table).update(updateData).eq('id', id);
      } else {
        await supabaseClient.from(table).insert(data);
      }
      
      onSuccess?.();
      toast({ title: "Success", description: "Operation completed successfully" });
    } catch (error) {
      onError?.(error as Error);
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const remove = async ({ id }: { id: string }) => {
    try {
      setLoading(true);
      await supabaseClient.from(table).delete().eq('id', id);
      onSuccess?.();
      toast({ title: "Success", description: "Deleted successfully" });
    } catch (error) {
      onError?.(error as Error);
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return { mutate, remove, loading };
}