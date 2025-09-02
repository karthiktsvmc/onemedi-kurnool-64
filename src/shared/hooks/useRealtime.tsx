import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorLogger } from '@/shared/contexts/ErrorContext';

export interface UseRealtimeOptions {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  filter?: string;
  enabled?: boolean;
}

export const useRealtime = ({
  table,
  onInsert,
  onUpdate,
  onDelete,
  filter,
  enabled = true
}: UseRealtimeOptions) => {
  const channelRef = useRef<any>(null);
  const { logError } = useErrorLogger();

  useEffect(() => {
    if (!enabled) return;

    try {
      const channel = supabase
        .channel(`realtime:${table}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table,
            filter
          },
          (payload) => {
            try {
              onInsert?.(payload);
            } catch (error) {
              logError(`Real-time INSERT handler error for ${table}`, { error, payload });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table,
            filter
          },
          (payload) => {
            try {
              onUpdate?.(payload);
            } catch (error) {
              logError(`Real-time UPDATE handler error for ${table}`, { error, payload });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table,
            filter
          },
          (payload) => {
            try {
              onDelete?.(payload);
            } catch (error) {
              logError(`Real-time DELETE handler error for ${table}`, { error, payload });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            logError(`Real-time subscription error for ${table}`, { status });
          }
        });

      channelRef.current = channel;
    } catch (error) {
      logError(`Failed to setup real-time subscription for ${table}`, { error });
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, filter, enabled, onInsert, onUpdate, onDelete, logError]);

  return channelRef.current;
};