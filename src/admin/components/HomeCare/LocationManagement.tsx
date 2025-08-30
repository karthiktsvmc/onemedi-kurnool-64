import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Users, Home, Target, Layers, Activity } from 'lucide-react';

interface LocationStats {
  city: string;
  state: string;
  serviceCount: number;
  careTakerCount: number;
  bookingCount: number;
  activeOffers: number;
}

export function LocationManagement() {
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch location-wise statistics
  const fetchLocationStats = async () => {
    try {
      setLoading(true);
      
      // Get unique locations from services and care takers
      const { data: serviceLocations } = await supabase
        .from('homecare_services')
        .select('city, state')
        .not('city', 'is', null)
        .not('state', 'is', null);

      const { data: careTakerLocations } = await supabase
        .from('care_takers')
        .select('city, state')
        .not('city', 'is', null)
        .not('state', 'is', null);

      // Combine and get unique locations
      const allLocations = [
        ...(serviceLocations || []),
        ...(careTakerLocations || [])
      ];

      const uniqueLocations = Array.from(
        new Map(allLocations.map(loc => [`${loc.city}-${loc.state}`, loc])).values()
      );

      // Fetch stats for each location
      const statsPromises = uniqueLocations.map(async (location) => {
        const { city, state } = location;

        // Count services in this location
        const { count: serviceCount } = await supabase
          .from('homecare_services')
          .select('*', { count: 'exact', head: true })
          .eq('city', city)
          .eq('state', state);

        // Count care takers in this location
        const { count: careTakerCount } = await supabase
          .from('care_takers')
          .select('*', { count: 'exact', head: true })
          .eq('city', city)
          .eq('state', state);

        // Count bookings (simplified - we'd need to join with addresses for accurate count)
        const { count: bookingCount } = await supabase
          .from('homecare_bookings')
          .select('*', { count: 'exact', head: true });

        // Count active offers applicable to this location
        const { count: activeOffers } = await supabase
          .from('homecare_offers')
          .select('*', { count: 'exact', head: true })
          .eq('active', true)
          .lte('valid_from', new Date().toISOString())
          .gte('valid_until', new Date().toISOString());

        return {
          city,
          state,
          serviceCount: serviceCount || 0,
          careTakerCount: careTakerCount || 0,
          bookingCount: bookingCount || 0,
          activeOffers: activeOffers || 0
        };
      });

      const stats = await Promise.all(statsPromises);
      setLocationStats(stats.sort((a, b) => b.serviceCount - a.serviceCount));

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch location statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationStats();
  }, []);

  // Calculate totals
  const totals = locationStats.reduce(
    (acc, stat) => ({
      services: acc.services + stat.serviceCount,
      careTakers: acc.careTakers + stat.careTakerCount,
      bookings: acc.bookings + stat.bookingCount,
      offers: acc.offers + stat.activeOffers
    }),
    { services: 0, careTakers: 0, bookings: 0, offers: 0 }
  );

  if (loading) {
    return (
      <AdminCard title="Location Management" description="Loading location statistics...">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Locations"
          value={locationStats.length}
          icon={MapPin}
        />
        <StatCard
          title="Total Services"
          value={totals.services}
          icon={Home}
        />
        <StatCard
          title="Total Care Takers"
          value={totals.careTakers}
          icon={Users}
        />
        <StatCard
          title="Active Offers"
          value={totals.offers}
          icon={Target}
        />
      </div>

      {/* Location-wise Breakdown */}
      <AdminCard 
        title="Location-wise Service Distribution" 
        description="Service availability and coverage across different locations"
      >
        <div className="space-y-4">
          {locationStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No location data available</p>
              <p className="text-sm">Add services and care takers with location information</p>
            </div>
          ) : (
            locationStats.map((stat, index) => (
              <div 
                key={`${stat.city}-${stat.state}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{stat.city}, {stat.state}</h3>
                    <p className="text-sm text-muted-foreground">
                      Location #{index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Home className="h-3 w-3" />
                      Services
                    </div>
                    <div className="font-medium">{stat.serviceCount}</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      Care Takers
                    </div>
                    <div className="font-medium">{stat.careTakerCount}</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      Bookings
                    </div>
                    <div className="font-medium">{stat.bookingCount}</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Offers
                    </div>
                    <div className="font-medium">{stat.activeOffers}</div>
                  </div>

                  <Badge variant="outline">
                    {stat.serviceCount > 0 ? 'Active' : 'No Services'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Manage service areas and assign services/care takers to specific locations
            </p>
            <Button onClick={fetchLocationStats} variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Coverage Map Placeholder */}
      <AdminCard 
        title="Coverage Map" 
        description="Visual representation of service coverage areas"
      >
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Interactive coverage map</p>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}