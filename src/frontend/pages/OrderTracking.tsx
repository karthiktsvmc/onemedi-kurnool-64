import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  MapPin,
  Phone,
  MessageCircle,
  ArrowLeft,
  User,
  Calendar,
  Star,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/shared/hooks/useOrders';

interface OrderTrackingStep {
  status: string;
  title: string;
  description: string;
  timestamp?: string;
  location?: string;
  completed: boolean;
  current: boolean;
}

export const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, loading } = useOrders();
  const [order, setOrder] = useState<any>(null);

  // Find the order by ID
  useEffect(() => {
    if (orderId && orders.length > 0) {
      const foundOrder = orders.find(o => o.id === orderId);
      setOrder(foundOrder);
    }
  }, [orderId, orders]);

  const getTrackingSteps = (currentStatus: string): OrderTrackingStep[] => {
    const allSteps = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received and is being processed',
        completed: true,
        current: false
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(currentStatus.toLowerCase()),
        current: currentStatus.toLowerCase() === 'confirmed'
      },
      {
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared for dispatch',
        completed: ['processing', 'shipped', 'delivered'].includes(currentStatus.toLowerCase()),
        current: currentStatus.toLowerCase() === 'processing'
      },
      {
        status: 'shipped',
        title: 'Out for Delivery',
        description: 'Your order is on the way to your delivery address',
        completed: ['shipped', 'delivered'].includes(currentStatus.toLowerCase()),
        current: currentStatus.toLowerCase() === 'shipped'
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been successfully delivered',
        completed: currentStatus.toLowerCase() === 'delivered',
        current: currentStatus.toLowerCase() === 'delivered'
      }
    ];

    return allSteps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate('/orders')}>
              View All Orders
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-6 px-4 border-b border-border">
          <div className="container mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/orders')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Order #{order.order_number}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Tracking Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Current Status
                    </CardTitle>
                    <Badge className={`capitalize ${
                      order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status.toLowerCase() === 'processing' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {order.status.toLowerCase() === 'delivered' ? <CheckCircle className="h-6 w-6 text-green-600" /> :
                       order.status.toLowerCase() === 'shipped' ? <Truck className="h-6 w-6 text-blue-600" /> :
                       order.status.toLowerCase() === 'processing' ? <Package className="h-6 w-6 text-orange-600" /> :
                       <Clock className="h-6 w-6 text-gray-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {trackingSteps.find(step => step.current)?.title || 'Order Processing'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {trackingSteps.find(step => step.current)?.description || 'Your order is being processed'}
                      </p>
                      {order.delivery_date && (
                        <p className="text-sm text-primary mt-1">
                          Expected delivery: {new Date(order.delivery_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {trackingSteps.map((step, index) => (
                      <div key={step.status} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-100 text-green-600' :
                            step.current ? 'bg-primary text-primary-foreground' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-current" />
                            )}
                          </div>
                          {index < trackingSteps.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              step.completed ? 'bg-green-200' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            step.current ? 'text-primary' : 
                            step.completed ? 'text-foreground' : 
                            'text-muted-foreground'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                          {step.timestamp && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {step.timestamp}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.item_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.unit_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{item.total_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Support */}
            <div className="space-y-6">
              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.shipping_address && (
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <User className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{order.shipping_address.full_name}</p>
                          <p className="text-sm text-muted-foreground">{order.shipping_address.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm">
                            {order.shipping_address.address_line_1}
                            {order.shipping_address.address_line_2 && `, ${order.shipping_address.address_line_2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.delivery_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Expected Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.delivery_date).toLocaleDateString()}
                          {order.delivery_slot && ` • ${order.delivery_slot}`}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST</span>
                    <span>₹{(order.gst_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Charges</span>
                    <span>₹{(order.delivery_charges || 0).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Support Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with Us
                  </Button>

                  {order.status.toLowerCase() === 'delivered' && (
                    <Button className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Rate Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};