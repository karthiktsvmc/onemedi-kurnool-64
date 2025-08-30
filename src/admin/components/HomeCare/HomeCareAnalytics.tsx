import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  IndianRupee,
  Star,
  MapPin,
  Activity,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeCareTakers: number;
  completionRate: number;
  popularServices: Array<{ name: string; count: number }>;
  monthlyTrends: Array<{ month: string; bookings: number; revenue: number }>;
  locationStats: Array<{ city: string; bookings: number }>;
}

export function HomeCareAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeCareTakers: 0,
    completionRate: 0,
    popularServices: [],
    monthlyTrends: [],
    locationStats: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch total bookings and revenue
      const { data: bookings, error: bookingsError } = await supabase
        .from('homecare_bookings')
        .select('final_amount, status, created_at, service_id, homecare_services(name)');

      if (bookingsError) throw bookingsError;

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.final_amount || 0), 0) || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

      // Fetch active care takers
      const { count: activeCareTakers } = await supabase
        .from('care_takers')
        .select('*', { count: 'exact', head: true })
        .eq('available', true);

      // Calculate average rating
      const { data: careTakersRating } = await supabase
        .from('care_takers')
        .select('rating, review_count')
        .gt('review_count', 0);

      const averageRating = careTakersRating?.length > 0
        ? careTakersRating.reduce((sum, ct) => sum + (ct.rating || 0), 0) / careTakersRating.length
        : 0;

      // Popular services
      const serviceStats = bookings?.reduce((acc: any, booking) => {
        const serviceName = booking.homecare_services?.name || 'Unknown';
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      }, {}) || {};

      const popularServices = Object.entries(serviceStats)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Monthly trends (last 6 months)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthBookings = bookings?.filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        }) || [];

        const monthRevenue = monthBookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0);

        monthlyTrends.push({
          month: date.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
          bookings: monthBookings.length,
          revenue: monthRevenue
        });
      }

      // Location stats
      const { data: services } = await supabase
        .from('homecare_services')
        .select('city');

      const locationStats = services?.reduce((acc: any, service) => {
        if (service.city) {
          acc[service.city] = (acc[service.city] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const topLocations = Object.entries(locationStats)
        .map(([city, bookings]) => ({ city, bookings: bookings as number }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      setAnalytics({
        totalBookings,
        totalRevenue,
        averageRating,
        activeCareTakers: activeCareTakers || 0,
        completionRate,
        popularServices,
        monthlyTrends,
        locationStats: topLocations
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Bookings"
          value={analytics.totalBookings}
          icon={Calendar}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
        />
        <StatCard
          title="Active Care Takers"
          value={analytics.activeCareTakers}
          icon={Users}
        />
        <StatCard
          title="Average Rating"
          value={analytics.averageRating.toFixed(1)}
          icon={Star}
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate.toFixed(1)}%`}
          icon={CheckCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <AdminCard title="Popular Services" description="Most booked home care services">
          <div className="space-y-4">
            {analytics.popularServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No booking data available</p>
              </div>
            ) : (
              analytics.popularServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <Badge variant="secondary">{service.count} bookings</Badge>
                </div>
              ))
            )}
          </div>
        </AdminCard>

        {/* Monthly Trends */}
        <AdminCard title="Monthly Trends" description="Booking and revenue trends over time">
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend, index) => (
              <div key={trend.month} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{trend.month}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {trend.bookings} bookings
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    ₹{trend.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Top Locations */}
        <AdminCard title="Top Locations" description="Cities with most service availability">
          <div className="space-y-4">
            {analytics.locationStats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No location data available</p>
              </div>
            ) : (
              analytics.locationStats.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{location.city}</span>
                  </div>
                  <Badge variant="outline">{location.bookings} services</Badge>
                </div>
              ))
            )}
          </div>
        </AdminCard>

        {/* Performance Metrics */}
        <AdminCard title="Performance Metrics" description="Key performance indicators">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Completion Rate</span>
                <span className="text-sm text-muted-foreground">{analytics.completionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(analytics.completionRate, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Service Rating</span>
                <span className="text-sm text-muted-foreground">{analytics.averageRating.toFixed(1)}/5.0</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(analytics.averageRating / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{analytics.activeCareTakers}</div>
                  <div className="text-xs text-muted-foreground">Active Care Takers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    ₹{Math.round(analytics.totalRevenue / Math.max(analytics.totalBookings, 1)).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg. Booking Value</div>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}