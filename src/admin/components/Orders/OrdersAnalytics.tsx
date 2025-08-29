import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  CreditCard, 
  RefreshCw,
  AlertTriangle,
  Users,
  ShoppingCart
} from 'lucide-react';

interface OrdersAnalyticsProps {
  data: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    avgOrderValue: number;
    growthRate: number;
    paymentSuccess: number;
  };
}

export const OrdersAnalytics: React.FC<OrdersAnalyticsProps> = ({ data }) => {
  const analytics = [
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      change: data.growthRate,
      changeType: data.growthRate >= 0 ? 'positive' : 'negative',
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString()}`,
      change: 12.5,
      changeType: 'positive',
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Orders",
      value: data.pendingOrders.toLocaleString(),
      change: -5.2,
      changeType: 'negative',
      icon: RefreshCw,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Avg Order Value",
      value: `₹${data.avgOrderValue.toFixed(0)}`,
      change: 8.1,
      changeType: 'positive',
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Completed Orders",
      value: data.completedOrders.toLocaleString(),
      change: 15.3,
      changeType: 'positive',
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Payment Success Rate",
      value: `${data.paymentSuccess.toFixed(1)}%`,
      change: 2.1,
      changeType: 'positive',
      icon: CreditCard,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {analytics.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-2xl font-bold">{item.value}</p>
                <div className="flex items-center mt-2">
                  {item.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(item.change)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};