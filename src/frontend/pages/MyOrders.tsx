import { useState } from 'react';
import { Calendar, Download, Eye, Package, RefreshCw, X, Clock, CheckCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockOrders } from '@/frontend/data/mockProfileData';
import { useToast } from '@/shared/hooks/use-toast';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Active':
    case 'Processing':
    case 'Confirmed':
      return <Clock className="h-4 w-4" />;
    case 'Delivered':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
    case 'Processing':
      return 'default';
    case 'Confirmed':
      return 'secondary';
    case 'Delivered':
      return 'default';
    case 'Canceled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();

  const activeOrders = mockOrders.filter(order => 
    order.status === 'Active' || order.status === 'Processing' || order.status === 'Confirmed'
  );
  const pastOrders = mockOrders.filter(order => order.status === 'Delivered');
  const canceledOrders = mockOrders.filter(order => order.status === 'Canceled');

  const handleTrackOrder = (orderId: string) => {
    toast({
      title: "Order Tracking",
      description: "Redirecting to tracking page...",
    });
  };

  const handleViewInvoice = (orderId: string) => {
    toast({
      title: "Download Invoice",
      description: "Invoice download started.",
    });
  };

  const handleReorder = (orderId: string) => {
    toast({
      title: "Added to Cart",
      description: "Items from this order have been added to your cart.",
    });
  };

  const handleCancelOrder = (orderId: string) => {
    toast({
      title: "Order Canceled",
      description: "Your order has been successfully canceled.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              #{order.orderNumber}
              <Badge variant={getStatusColor(order.status)} className="gap-1">
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ordered on {formatDate(order.date)} • {order.category}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{order.total}</p>
            <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
              <div className="text-2xl">{item.image}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                {item.quantity && (
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                )}
              </div>
              <p className="font-medium">₹{item.price}</p>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-muted-foreground text-center">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>

        {/* Delivery/Appointment Info */}
        {order.deliveryDate && (
          <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg">
            <Truck className="h-4 w-4 text-green-600" />
            <span>Delivered on {formatDate(order.deliveryDate)}</span>
          </div>
        )}
        {order.appointmentDate && (
          <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>
              Appointment: {formatDate(order.appointmentDate)} at {formatTime(order.appointmentDate)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {order.status !== 'Canceled' && order.status !== 'Delivered' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTrackOrder(order.id)}
              className="flex-1 min-w-0"
            >
              <Eye className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          )}
          
          {order.invoiceUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewInvoice(order.id)}
              className="flex-1 min-w-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Invoice
            </Button>
          )}
          
          {order.status === 'Delivered' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReorder(order.id)}
              className="flex-1 min-w-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reorder
            </Button>
          )}
          
          {(order.status === 'Active' || order.status === 'Processing') && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancelOrder(order.id)}
              className="flex-1 min-w-0"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        {/* Prescription Reminder */}
        {order.prescriptionRequired && order.status !== 'Delivered' && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              ⚠️ Prescription required for this order. Please upload to avoid delays.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastOrders.length})
              </TabsTrigger>
              <TabsTrigger value="canceled">
                Canceled ({canceledOrders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              {activeOrders.length > 0 ? (
                <div>
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Active Orders</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any active orders right now.
                    </p>
                    <Button>Start Shopping</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-6">
              {pastOrders.length > 0 ? (
                <div>
                  {pastOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Past Orders</h3>
                    <p className="text-muted-foreground">
                      Your completed orders will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="canceled" className="mt-6">
              {canceledOrders.length > 0 ? (
                <div>
                  {canceledOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <X className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Canceled Orders</h3>
                    <p className="text-muted-foreground">
                      Your canceled orders will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};