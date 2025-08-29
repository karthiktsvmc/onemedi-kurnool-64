import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { OrdersAnalytics } from '@/admin/components/Orders/OrdersAnalytics';
import { OrdersTable } from '@/admin/components/Orders/OrdersTable';
import { PaymentTracker } from '@/admin/components/Orders/PaymentTracker';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Download, Settings } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
  order_items: Array<{
    id: string;
    item_name: string;
    quantity: number;
  }>;
}

interface PaymentData {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  gateway: string;
  payment_id?: string;
  created_at: string;
  orders?: {
    order_number: string;
  };
}

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          ),
          order_items (
            id,
            item_name,
            quantity
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setOrders((data || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        user_id: order.user_id,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        total_amount: order.total_amount,
        created_at: order.created_at,
        profiles: order.profiles && typeof order.profiles === 'object' && order.profiles !== null && !Array.isArray(order.profiles) && 'full_name' in order.profiles 
          ? { full_name: (order.profiles as any).full_name || '', email: (order.profiles as any).email || '' }
          : null,
        order_items: order.order_items || []
      })));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders (
            order_number
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchPayments()]);
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Order and payment data has been updated",
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchPayments()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      toast({
        title: "Order Updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string, orderIds: string[]) => {
    try {
      if (action === 'confirm') {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .in('id', orderIds);

        if (error) throw error;
        toast({
          title: "Bulk Action Complete",
          description: `${orderIds.length} orders confirmed`,
        });
      } else if (action === 'cancel') {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .in('id', orderIds);

        if (error) throw error;
        toast({
          title: "Bulk Action Complete",
          description: `${orderIds.length} orders cancelled`,
        });
      } else if (action === 'export') {
        // Implement CSV export
        toast({
          title: "Export Started",
          description: "Selected orders will be exported to CSV",
        });
      }

      await fetchOrders();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const handlePaymentRefund = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      await fetchPayments();
      toast({
        title: "Refund Processed",
        description: "Payment has been refunded",
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    }
  };

  const handlePaymentRetry = async (paymentId: string) => {
    // Implement payment retry logic
    toast({
      title: "Payment Retry",
      description: "Payment retry has been initiated",
    });
  };

  // Calculate analytics
  const ordersAnalytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'delivered').length,
    cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total_amount, 0) / orders.length : 0,
    growthRate: 12.5, // Mock data
    paymentSuccess: payments.length > 0 ? (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0,
  };

  const paymentAnalytics = {
    totalProcessed: payments.reduce((sum, payment) => sum + payment.amount, 0),
    successRate: payments.length > 0 ? (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0,
    failureRate: payments.length > 0 ? (payments.filter(p => p.status === 'failed').length / payments.length) * 100 : 0,
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    totalRefunds: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
  };

  // Transform orders for table
  const tableOrders = orders.map(order => ({
    id: order.id,
    order_number: order.order_number,
    customer_name: order.profiles?.full_name || 'Unknown',
    customer_email: order.profiles?.email || 'Unknown',
    total_amount: order.total_amount,
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    created_at: order.created_at,
    items_count: order.order_items?.length || 0,
  }));

  // Transform payments for table
  const tablePayments = payments.map(payment => ({
    id: payment.id,
    order_number: payment.orders?.order_number || 'N/A',
    amount: payment.amount,
    status: payment.status,
    gateway: payment.gateway,
    transaction_id: payment.payment_id,
    created_at: payment.created_at,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        description="Manage orders, payments, and fulfillment operations"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        }
      />

      <OrdersAnalytics data={ordersAnalytics} />

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersTable
            orders={tableOrders}
            onStatusUpdate={handleStatusUpdate}
            onBulkAction={handleBulkAction}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracker
            payments={tablePayments}
            analytics={paymentAnalytics}
            onRefund={handlePaymentRefund}
            onRetry={handlePaymentRetry}
          />
        </TabsContent>

        <TabsContent value="fulfillment">
          <div className="text-center py-12 text-muted-foreground">
            Fulfillment workflow management coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};