import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw
} from 'lucide-react';

interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  todaysRevenue: number;
  orderGrowth: number;
}

interface RecentOrderActivity {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  updated_at: string;
  customer_name?: string;
}

export const RealTimeOrderMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<OrderMetrics>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    todaysRevenue: 0,
    orderGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentOrderActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch initial metrics
  const fetchMetrics = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at, updated_at, order_number');

      if (error) throw error;

      if (orders) {
        const today = new Date().toDateString();
        const todaysOrders = orders.filter(order => 
          new Date(order.created_at).toDateString() === today
        );

        const newMetrics: OrderMetrics = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          processingOrders: orders.filter(o => o.status === 'processing').length,
          shippedOrders: orders.filter(o => o.status === 'shipped').length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
          todaysRevenue: todaysOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
          orderGrowth: calculateGrowth(orders),
        };

        setMetrics(newMetrics);

        // Set recent activity (last 10 orders)
        const recent = orders
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 10)
          .map((order, index) => ({
            id: `order-${index}`,
            order_number: order.order_number || '',
            status: order.status || '',
            total_amount: order.total_amount || 0,
            updated_at: order.updated_at || '',
          }));

        setRecentActivity(recent);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load order metrics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (orders: any[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todaysOrders = orders.filter(order => 
      new Date(order.created_at).toDateString() === today.toDateString()
    ).length;

    const yesterdaysOrders = orders.filter(order => 
      new Date(order.created_at).toDateString() === yesterday.toDateString()
    ).length;

    if (yesterdaysOrders === 0) return todaysOrders > 0 ? 100 : 0;
    return Math.round(((todaysOrders - yesterdaysOrders) / yesterdaysOrders) * 100);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Subscribe to real-time order updates
  useRealtimeSubscription({
    table: 'orders',
    onInsert: (payload) => {
      console.log('New order received:', payload.new);
      fetchMetrics(); // Refresh metrics when new order is created
      
      toast({
        title: "New Order",
        description: `Order ${payload.new.order_number} has been placed.`,
      });
    },
    onUpdate: (payload) => {
      console.log('Order updated:', payload.new);
      fetchMetrics(); // Refresh metrics when order is updated
      
      // Show notification for status changes
      if (payload.old.status !== payload.new.status) {
        toast({
          title: "Order Status Updated",
          description: `Order ${payload.new.order_number} is now ${payload.new.status}.`,
        });
      }
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-orange-100 text-orange-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      shipped: <Package className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertTriangle className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {metrics.orderGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${metrics.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.orderGrowth >= 0 ? '+' : ''}{metrics.orderGrowth}% from yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{metrics.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">{metrics.shippedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">₹{metrics.todaysRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Status Breakdown</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchMetrics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Pending', count: metrics.pendingOrders, status: 'pending' },
                { label: 'Processing', count: metrics.processingOrders, status: 'processing' },
                { label: 'Shipped', count: metrics.shippedOrders, status: 'shipped' },
                { label: 'Delivered', count: metrics.deliveredOrders, status: 'delivered' },
                { label: 'Cancelled', count: metrics.cancelledOrders, status: 'cancelled' },
              ].map(item => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ 
                          width: `${metrics.totalOrders > 0 ? (item.count / metrics.totalOrders) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Order Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Order Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent orders</p>
              ) : (
                recentActivity.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{order.order_number}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total_amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Updates Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Live updates enabled</span>
      </div>
    </div>
  );
};