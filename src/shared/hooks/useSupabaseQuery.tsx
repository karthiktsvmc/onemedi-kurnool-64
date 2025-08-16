
import { useState, useEffect, useCallback } from 'react';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { supabaseClient } from '@/shared/lib/supabase-client';
import { useToast } from '@/shared/hooks/use-toast';
import type { QueryOptions, LocationFilterOptions } from '@/shared/types/database';

interface UseSupabaseQueryOptions<T> extends QueryOptions {
  table: string;
  select?: string;
  autoFetch?: boolean;
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
}

export function useSupabaseQuery<T = any>({
  table,
  select = '*',
  autoFetch = true,
  limit,
  offset,
  orderBy,
  ascending = true,
  filters,
  locationFilter,
  onSuccess,
  onError,
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const buildQuery = useCallback(() => {
    let query = supabaseClient.from(table).select(select) as PostgrestFilterBuilder<any, T[], any>;

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    // Apply location filters
    if (locationFilter) {
      if (locationFilter.city) {
        query = query.eq('city', locationFilter.city);
      }
      if (locationFilter.state) {
        query = query.eq('state', locationFilter.state);
      }
      if (locationFilter.pincode) {
        query = query.eq('pincode', locationFilter.pincode);
      }
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }

    return query;
  }, [table, select, filters, locationFilter, orderBy, ascending, limit, offset]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query = buildQuery();
      const { data: result, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setData(result || []);
      onSuccess?.(result || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorMessage);
      onError?.(errorMessage);
      toast({
        title: "Error",
        description: errorMessage.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [buildQuery, onSuccess, onError, toast]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    fetchData,
  };
}
