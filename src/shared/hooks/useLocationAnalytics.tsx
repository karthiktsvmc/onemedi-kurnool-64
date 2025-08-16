import { useCallback } from 'react';
import { useLocation } from '@/shared/contexts/LocationContext';

export interface LocationAnalyticsData {
  action: 'search' | 'order' | 'view_service';
  service_type?: string;
  service_id?: string;
}

export function useLocationAnalytics() {
  const { currentLocation } = useLocation();

  const trackLocationAction = useCallback(async (data: LocationAnalyticsData) => {
    if (!currentLocation) return;

    try {
      // TODO: Implement analytics tracking once Supabase types are regenerated
      console.log('Location analytics:', {
        location: currentLocation,
        action: data.action,
        service_type: data.service_type,
        service_id: data.service_id,
      });
    } catch (error) {
      console.error('Failed to track location analytics:', error);
    }
  }, [currentLocation]);

  return {
    trackLocationAction,
  };
}