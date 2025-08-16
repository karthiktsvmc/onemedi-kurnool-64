
import { supabaseClient } from '@/shared/lib/supabase-client';
import { useLocation } from '@/shared/contexts/LocationContext';

interface LocationAnalyticsData {
  action: string;
  service_type?: string;
  service_id?: string;
}

export function useLocationAnalytics() {
  const { currentLocation } = useLocation();

  const trackLocationEvent = async (data: LocationAnalyticsData) => {
    if (!currentLocation) return;

    try {
      await supabaseClient.from('location_analytics').insert({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        city: currentLocation.city,
        state: currentLocation.state,
        pincode: currentLocation.pincode,
        ...data,
      });
    } catch (error) {
      console.error('Failed to track location event:', error);
    }
  };

  return { trackLocationEvent };
}
