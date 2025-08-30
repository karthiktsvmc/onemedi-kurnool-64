import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

interface HomeCareBooking {
  id: string;
  user_id: string;
  service_id: string;
  care_taker_id: string;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  sessions: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  offer_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  customer_address: string;
  customer_phone: string;
  special_instructions: string;
  created_at: string;
  updated_at: string;
  // Joined data
  service_name?: string;
  care_taker_name?: string;
  customer_name?: string;
}

export function HomeCareBookings() {
  const [bookings, setBookings] = useState<HomeCareBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch bookings with related data
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('homecare_bookings')
        .select(`
          *,
          homecare_services(name),
          care_takers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include joined names
      const transformedBookings = data?.map(booking => ({
        ...booking,
        service_name: booking.homecare_services?.name || 'Unknown Service',
        care_taker_name: booking.care_takers?.name || 'Unassigned',
        customer_name: 'Customer', // We'll get this from a separate query if needed
        status: booking.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
      })) || [];

      setBookings(transformedBookings);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { variant: 'outline' as const, icon: AlertCircle };
      case 'confirmed':
        return { variant: 'default' as const, icon: CheckCircle };
      case 'in_progress':
        return { variant: 'secondary' as const, icon: PlayCircle };
      case 'completed':
        return { variant: 'default' as const, icon: CheckCircle };
      case 'cancelled':
        return { variant: 'destructive' as const, icon: XCircle };
      default:
        return { variant: 'outline' as const, icon: AlertCircle };
    }
  };

  // Handle status update
  const handleStatusUpdate = async (booking: HomeCareBooking, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('homecare_bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Booking status updated to ${newStatus}`,
      });

      await fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update booking status',
        variant: 'destructive',
      });
    }
  };

  // Table columns
  const columns = [
    {
      key: 'booking_date',
      label: 'Date & Time',
      render: (value: string, row: HomeCareBooking) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3" />
            {new Date(value).toLocaleDateString()}
          </div>
          {row.start_time && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {row.start_time}
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (value: string, row: HomeCareBooking) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {value}
          </div>
          {row.customer_phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {row.customer_phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'service_name',
      label: 'Service',
      render: (value: string, row: HomeCareBooking) => (
        <div className="space-y-1">
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {row.duration_minutes} mins × {row.sessions} session{row.sessions > 1 ? 's' : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'care_taker_name',
      label: 'Care Taker',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'customer_address',
      label: 'Address',
      render: (value: string) => (
        <div className="max-w-xs">
          <div className="flex items-start gap-1">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm truncate" title={value}>
              {value || 'Not provided'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'final_amount',
      label: 'Amount',
      render: (value: number, row: HomeCareBooking) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 font-medium">
            <IndianRupee className="h-3 w-3" />
            {value.toLocaleString()}
          </div>
          {row.discount_amount > 0 && (
            <div className="text-sm text-green-600">
              ₹{row.discount_amount} saved
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const { variant, icon: Icon } = getStatusBadge(value);
        return (
          <Badge variant={variant} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      },
    },
  ];

  // Custom actions for each row
  const renderActions = (booking: HomeCareBooking) => {
    const statusOptions = [
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
      <div className="flex gap-1">
        {statusOptions
          .filter(option => option.value !== booking.status)
          .map(option => (
            <Button
              key={option.value}
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate(booking, option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
      </div>
    );
  };

  return (
    <AdminCard 
      title="Home Care Bookings" 
      description="Manage and track home care service bookings"
    >
      <DataTable
        title="Home Care Bookings"
        description="Track and manage all home care service bookings"
        data={bookings}
        columns={columns}
        loading={loading}
        onRefresh={fetchBookings}
        searchPlaceholder="Search bookings..."
        renderActions={renderActions}
      />
    </AdminCard>
  );
}