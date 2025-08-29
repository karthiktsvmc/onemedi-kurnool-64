// Order Details Component
// Displays comprehensive prescription order information with workflow tracking

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import PrescriptionOrderService, { 
  PrescriptionOrder, 
  OrderWorkflowStep,
  PrescriptionOrderStatus 
} from '@/shared/services/prescriptionOrderService';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Download,
  MapPin,
  Calendar,
  User,
  Pill,
  FileText,
  RefreshCw,
  X,
  Eye,
  MessageSquare,
  Star,
  ChevronRight,
  Shield,
  Loader2
} from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [order, setOrder] = useState<PrescriptionOrder | null>(null);
  const [workflow, setWorkflow] = useState<OrderWorkflowStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
      loadWorkflow();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    if (!orderId) return;

    try {
      const result = await PrescriptionOrderService.getOrderDetails(orderId);
      if (result.success && result.order) {
        setOrder(result.order);
      } else {
        toast({
          title: "Error loading order",
          description: result.error || "Failed to load order details",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkflow = async () => {
    if (!orderId) return;

    try {
      const workflowSteps = await PrescriptionOrderService.getOrderWorkflow(orderId);
      setWorkflow(workflowSteps);
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId || !user || !cancelReason.trim()) return;

    setIsCancelling(true);
    try {
      const result = await PrescriptionOrderService.cancelOrder(
        orderId,
        cancelReason,
        user.id
      );

      if (result.success) {
        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled successfully",
        });
        setShowCancelDialog(false);
        loadOrderDetails();
        loadWorkflow();
      } else {
        toast({
          title: "Error cancelling order",
          description: result.error || "Failed to cancel order",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = () => {
    if (!order) return false;
    const cancellableStatuses = ['placed', 'prescription_review', 'pharmacist_verification', 'approved'];
    return cancellableStatuses.includes(order.status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Loading Order Details
              </h2>
              <p className="text-muted-foreground">
                Please wait while we fetch your order information...
              </p>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Order Not Found
              </h2>
              <p className="text-muted-foreground mb-4">
                The order you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
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
            { label: 'Orders', href: '/orders' },
            { label: `Order #${order.order_number}` }
          ]} 
        />

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Order #{order.order_number}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Placed on {formatDate(order.created_at)}</span>
                <span>•</span>
                <span>{getStatusBadge(order.status)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {canCancelOrder() && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(true)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          {/* Status Alert */}
          {order.status === 'rejected' && (
            <Alert className="mb-6 border-destructive bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <p className="font-medium text-destructive">Order Rejected</p>
                  <p className="text-sm">
                    {order.pharmacist_notes || 'Your prescription could not be verified. Please contact support for assistance.'}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {order.status === 'cancelled' && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <p className="font-medium text-yellow-800">Order Cancelled</p>
                <p className="text-sm text-yellow-700">
                  This order has been cancelled. Refund will be processed within 3-5 business days.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
              <TabsTrigger value="prescription">Prescription</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.prescription_order_items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{item.medicine.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.medicine.brand} • {item.medicine.strength}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Qty: {item.quantity}
                            </Badge>
                            {item.substituted && (
                              <Badge variant="secondary" className="text-xs">
                                Substituted
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {item.fulfillment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.total_price)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.unit_price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total_amount + order.prescription_discount - order.delivery_charges)}</span>
                  </div>
                  {order.prescription_discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Prescription Discount</span>
                      <span>-{formatPrice(order.prescription_discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className={order.delivery_charges === 0 ? 'text-green-600' : ''}>
                      {order.delivery_charges === 0 ? 'FREE' : formatPrice(order.delivery_charges)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary">{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-6">
              {/* Order Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Order Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflow.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center border-2 
                          ${step.completed ? 'bg-primary border-primary text-white' : 
                            step.active ? 'bg-primary/10 border-primary text-primary' : 
                            'bg-gray-100 border-gray-300 text-gray-400'}
                        `}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : step.active ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.title}
                            </h4>
                            {step.timestamp && (
                              <span className="text-xs text-muted-foreground">
                                {formatDate(step.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${step.completed || step.active ? 'text-muted-foreground' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                          {step.notes && (
                            <p className="text-xs text-blue-600 mt-1">{step.notes}</p>
                          )}
                          {step.estimated_time && !step.completed && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Estimated: {step.estimated_time}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescription" className="space-y-6">
              {/* Prescription Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Prescription Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Doctor Name</p>
                      <p className="text-sm text-muted-foreground">
                        {order.prescriptions?.[0]?.doctor_name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Prescription Number</p>
                      <p className="text-sm text-muted-foreground">
                        {order.prescriptions?.[0]?.prescription_number || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Verification Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {order.pharmacist_verified ? (
                          <Badge className="bg-green-500">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Verification
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Verified By</p>
                      <p className="text-sm text-muted-foreground">
                        {order.pharmacist_verified_by ? `Pharmacist ID: ${order.pharmacist_verified_by}` : 'Not yet verified'}
                      </p>
                    </div>
                  </div>
                  
                  {order.pharmacist_notes && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Pharmacist Notes</p>
                      <p className="text-sm text-blue-700">{order.pharmacist_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Delivery Address</p>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm">{order.delivery_address?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.delivery_address?.address_line_1}
                      </p>
                      {order.delivery_address?.address_line_2 && (
                        <p className="text-sm text-muted-foreground">
                          {order.delivery_address.address_line_2}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}
                      </p>
                      {order.delivery_address?.phone && (
                        <p className="text-sm text-muted-foreground">
                          Phone: {order.delivery_address.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Delivery Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {order.delivery_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.estimated_delivery)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Delivery Charges</p>
                      <p className={`text-sm ${order.delivery_charges === 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {order.delivery_charges === 0 ? 'FREE' : formatPrice(order.delivery_charges)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />

      {/* Cancel Order Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Cancel Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div>
                <label className="text-sm font-medium">Reason for cancellation</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={3}
                  placeholder="Please provide a reason for cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1"
                >
                  Keep Order
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelOrder}
                  disabled={!cancelReason.trim() || isCancelling}
                  className="flex-1"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};