
import { useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabaseClient } from '@/shared/lib/supabase-client';
import type { RealtimePayload } from '@/shared/types/database';

interface UseRealtimeSubscriptionOptions<T> {
  table: string;
  onInsert?: (payload: RealtimePayload<T>) => void;
  onUpdate?: (payload: RealtimePayload<T>) => void;
  onDelete?: (payload: RealtimePayload<T>) => void;
  filter?: string;
  enabled?: boolean;
}

export function useRealtimeSubscription<T = any>({
  table,
  onInsert,
  onUpdate,
  onDelete,
  filter,
  enabled = true,
}: UseRealtimeSubscriptionOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const channel = supabaseClient
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          onInsert?.({
            eventType: 'INSERT',
            new: payload.new as T,
            old: payload.old as T,
            errors: payload.errors,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          onUpdate?.({
            eventType: 'UPDATE',
            new: payload.new as T,
            old: payload.old as T,
            errors: payload.errors,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          onDelete?.({
            eventType: 'DELETE',
            new: payload.new as T,
            old: payload.old as T,
            errors: payload.errors,
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, filter, enabled, onInsert, onUpdate, onDelete]);

  return channelRef.current;
}
