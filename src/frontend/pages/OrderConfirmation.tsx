import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  MessageSquare,
  Share2,
  Star,
  Upload,
  Truck,
  Shield,
  Award,
  Users,
  Gift,
  ExternalLink,
  Copy,
  Heart,
  ArrowRight
} from 'lucide-react';
import { 
  mockOrder, 
  testimonials, 
  recommendedProducts, 
  supportOptions 
} from '@/frontend/data/mockOrderData';
import { useNavigate } from 'react-router-dom';

export const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);
  const order = mockOrder;

  const getOrderTypeMessage = () => {
    const hasLabTests = order.items.some(item => item.type === 'lab-test');
    const hasMedicines = order.items.some(item => item.type === 'medicine');
    const hasConsults = order.items.some(item => item.type === 'doctor-consult');

    if (hasLabTests && hasMedicines && hasConsults) {
      return 'Your health package is confirmed! We\'ll take care of everything.';
    } else if (hasLabTests) {
      return 'Your lab test is booked and confirmed.';
    } else if (hasMedicines) {
      return 'Your medicine order is confirmed and being prepared.';
    } else if (hasConsults) {
      return 'Your doctor consultation is scheduled and confirmed.';
    }
    return 'Your order is confirmed and being processed.';
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const addToCalendar = (item: any) => {
    if (item.slotInfo) {
      const startDate = new Date(`${item.slotInfo.date}T${item.slotInfo.time}`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`;
      window.open(calendarUrl, '_blank');
    }
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (order.prescriptionStatus.required && !order.prescriptionStatus.uploaded) {
      steps.push({
        icon: Upload,
        title: 'Upload Prescription',
        description: 'Upload prescription for medicines to avoid delivery delays',
        action: 'Upload Now',
        urgent: true
      });
    }

    const appointmentItems = order.items.filter(item => item.slotInfo);
    if (appointmentItems.length > 0) {
      steps.push({
        icon: Calendar,
        title: 'Add to Calendar',
        description: 'Don\'t miss your appointments - add them to your calendar',
        action: 'Add All',
        urgent: false
      });
    }

    const deliveryItems = order.items.filter(item => item.deliveryInfo);
    if (deliveryItems.length > 0) {
      steps.push({
        icon: Truck,
        title: 'Track Delivery',
        description: 'Get real-time updates on your medicine delivery',
        action: 'Track Now',
        urgent: false
      });
    }

    return steps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Thank you, {order.customer.name}!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            {getOrderTypeMessage()}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Order ID:</span>
            <code className="bg-secondary px-2 py-1 rounded font-mono">
              {order.orderNumber}
            </code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyOrderNumber}
              className="p-1 h-auto"
            >
              {copySuccess ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.type.replace('-', ' ')}
                        </Badge>
                        {item.quantity > 1 && (
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                        )}
                      </div>
                      
                      {item.slotInfo && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{item.slotInfo.date} at {item.slotInfo.time}</span>
                          <Badge variant={item.slotInfo.type === 'online' ? 'default' : 'secondary'} className="text-xs ml-2">
                            {item.slotInfo.type === 'online' ? 'Video Call' : 
                             item.slotInfo.type === 'home-visit' ? 'Home Visit' : 'Clinic'}
                          </Badge>
                        </div>
                      )}
                      
                      {item.deliveryInfo && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Truck className="h-3 w-3" />
                          <span>Delivery by {item.deliveryInfo.eta}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                      {item.slotInfo && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => addToCalendar(item)}
                          className="text-xs mt-1"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.pricing.subtotal}</span>
                  </div>
                  {order.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.pricing.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{order.pricing.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={order.pricing.deliveryFee === 0 ? 'text-green-600' : ''}>
                      {order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span className="text-primary">₹{order.pricing.total}</span>
                  </div>
                  {order.pricing.discount > 0 && (
                    <p className="text-xs text-green-600 text-center">
                      🎉 You saved ₹{order.pricing.discount} on this order!
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Order
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {getNextSteps().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getNextSteps().map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            step.urgent ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20' : 
                            'border-border bg-secondary/30'
                          }`}
                        >
                          <div className={`flex-shrink-0 ${step.urgent ? 'text-orange-600' : 'text-primary'}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                          <Button size="sm" variant={step.urgent ? "default" : "outline"}>
                            {step.action}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedProducts.map((product, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-muted-foreground line-through ml-2">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        {product.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportOptions.map((option, index) => {
                  const IconComponent = option.icon === 'Phone' ? Phone : 
                                        option.icon === 'MessageCircle' ? MessageCircle : MessageSquare;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.value}</p>
                        <p className="text-xs text-green-600">{option.available}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })}
                
                <div className="pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Help Center
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Referral Program */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Refer & Earn ₹100</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share ONE MEDI with friends and family. You both get ₹100 credits!
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Refer Now
                </Button>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-center">Why Choose ONE MEDI?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">100% Genuine Medicines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">NABL Certified Labs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">50,000+ Happy Customers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">4.8★ Rating (1,200+ reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What Our Customers Say</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">"{testimonial.text}"</p>
                    <p className="text-xs font-medium">- {testimonial.name}, {testimonial.location}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Read More Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button variant="outline" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button onClick={() => navigate('/profile/orders')}>
              View All Orders
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Order confirmation sent to {order.customer.email} • SMS sent to {order.customer.phone}
          </p>
        </div>
      </div>
    </div>
  );
};