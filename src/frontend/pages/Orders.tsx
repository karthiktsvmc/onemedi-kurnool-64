// Orders List Page
// Displays all user orders with filtering and status tracking

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import PrescriptionOrderService, { 
  PrescriptionOrder, 
  PrescriptionOrderStatus 
} from '@/shared/services/prescriptionOrderService';
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
  Loader2,
  ShoppingBag,
  FileText,
  Truck
} from 'lucide-react';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState<PrescriptionOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PrescriptionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, activeFilter]);

  const loadOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await PrescriptionOrderService.getUserOrders(user.id, {
        limit: 50
      });

      if (result.success && result.orders) {
        setOrders(result.orders);
      } else {
        toast({
          title: "Error loading orders",
          description: result.error || "Failed to load orders",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.prescription_order_items?.some(item => 
          item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        order.prescriptions?.[0]?.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    switch (activeFilter) {
      case 'active':
        filtered = filtered.filter(order => 
          !['delivered', 'cancelled', 'refunded'].includes(order.status)
        );
        break;
      case 'completed':
        filtered = filtered.filter(order => 
          ['delivered'].includes(order.status)
        );
        break;
      case 'cancelled':
        filtered = filtered.filter(order => 
          ['cancelled', 'refunded', 'rejected'].includes(order.status)
        );
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: PrescriptionOrderStatus) => {
    const statusConfig = {
      placed: { variant: 'secondary' as const, color: 'bg-blue-500', label: 'Order Placed' },
      prescription_review: { variant: 'secondary' as const, color: 'bg-yellow-500', label: 'Under Review' },
      pharmacist_verification: { variant: 'secondary' as const, color: 'bg-yellow-500', label: 'Being Verified' },
      approved: { variant: 'default' as const, color: 'bg-green-500', label: 'Approved' },
      rejected: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Rejected' },
      preparing: { variant: 'secondary' as const, color: 'bg-blue-500', label: 'Preparing' },
      quality_check: { variant: 'secondary' as const, color: 'bg-purple-500', label: 'Quality Check' },
      packed: { variant: 'default' as const, color: 'bg-green-500', label: 'Packed' },
      dispatched: { variant: 'default' as const, color: 'bg-blue-600', label: 'Dispatched' },
      in_transit: { variant: 'default' as const, color: 'bg-blue-600', label: 'In Transit' },
      out_for_delivery: { variant: 'default' as const, color: 'bg-orange-500', label: 'Out for Delivery' },
      delivered: { variant: 'default' as const, color: 'bg-green-600', label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, color: 'bg-red-500', label: 'Cancelled' },
      refunded: { variant: 'secondary' as const, color: 'bg-gray-500', label: 'Refunded' },
    };

    const config = statusConfig[status] || statusConfig.placed;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: PrescriptionOrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      active: orders.filter(order => !['delivered', 'cancelled', 'refunded'].includes(order.status)).length,
      completed: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => ['cancelled', 'refunded', 'rejected'].includes(order.status)).length
    };
  };

  const orderCounts = getOrderCounts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Loading Your Orders
              </h2>
              <p className="text-muted-foreground">
                Please wait while we fetch your order history...
              </p>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        {/* Breadcrumb */}
        <NavigationBreadcrumb 
          items={[
            { label: 'My Orders' }
          ]} 
        />

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                My Orders
              </h1>
              <p className="text-muted-foreground">
                Track and manage your prescription orders
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => navigate('/medicines')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search orders by order number, medicine, or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
                <TabsTrigger value="active">Active ({orderCounts.active})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({orderCounts.completed})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({orderCounts.cancelled})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchQuery.trim() ? 'No orders found' : 'No orders yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery.trim() 
                    ? 'Try adjusting your search terms or filters'
                    : 'Start by placing your first prescription order'
                  }
                </p>
                {!searchQuery.trim() && (
                  <Button onClick={() => navigate('/medicines')}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Medicines
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            Order #{order.order_number}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          {order.prescriptions?.[0] && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>Dr. {order.prescriptions[0].doctor_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">
                          {formatPrice(order.total_amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.prescription_order_items?.length || 0} item(s)
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.prescription_order_items && order.prescription_order_items.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {order.prescription_order_items.slice(0, 3).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item.medicine.name} (x{item.quantity})
                            </Badge>
                          ))}
                          {order.prescription_order_items.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{order.prescription_order_items.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm text-muted-foreground">
                          {order.status === 'delivered' && 'Delivered successfully'}
                          {order.status === 'in_transit' && 'On the way'}
                          {order.status === 'out_for_delivery' && 'Out for delivery'}
                          {order.status === 'cancelled' && 'Order cancelled'}
                          {order.status === 'rejected' && 'Prescription rejected'}
                          {['placed', 'prescription_review', 'pharmacist_verification', 'approved', 'preparing', 'quality_check', 'packed', 'dispatched'].includes(order.status) && 'In progress'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination could be added here if needed */}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};