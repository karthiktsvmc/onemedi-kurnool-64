import React, { useEffect } from 'react';
import { useRealtimeOrders } from '@/shared/hooks/useRealtimeOrders';
import { useRealtimeInventory } from '@/shared/hooks/useRealtimeInventory';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Bell, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

export const RealTimeOrderUpdates: React.FC = () => {
  const { orders } = useRealtimeOrders();
  const { alerts } = useRealtimeInventory();
  const { notificationState, requestPermission, sendOrderNotification, sendInventoryNotification } = useNotifications();
  const { user } = useAuth();

  // Auto-request notification permission when component mounts
  useEffect(() => {
    if (notificationState.supported && notificationState.permission === 'default') {
      requestPermission();
    }
  }, [notificationState, requestPermission]);

  // Send notifications for order updates
  useEffect(() => {
    orders.forEach(order => {
      // Check if order was recently updated (within last 5 minutes)
      const updatedAt = new Date(order.updated_at);
      const now = new Date();
      const timeDiff = now.getTime() - updatedAt.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff <= 5 && order.status !== 'pending') {
        sendOrderNotification({
          orderId: order.id,
          orderNumber: order.order_number,
          status: order.status,
        });
      }
    });
  }, [orders, sendOrderNotification]);

  // Send notifications for inventory alerts
  useEffect(() => {
    alerts.forEach(alert => {
      if (alert.alert_type === 'low_stock' && alert.status === 'active') {
        sendInventoryNotification({
          medicineName: alert.medicine_name || 'Medicine',
          currentStock: alert.current_stock || 0,
          threshold: alert.threshold || 10,
        });
      }
    });
  }, [alerts, sendInventoryNotification]);

  const recentOrders = orders
    .filter(order => {
      const updatedAt = new Date(order.updated_at);
      const now = new Date();
      const timeDiff = now.getTime() - updatedAt.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff <= 24; // Orders updated in last 24 hours
    })
    .slice(0, 3);

  const activeAlerts = alerts.filter(alert => alert.status === 'active').slice(0, 3);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Notification Permission Request */}
      {notificationState.supported && notificationState.permission !== 'granted' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-800">Enable Notifications</h4>
                <p className="text-sm text-orange-700">
                  Get real-time updates about your orders and important alerts.
                </p>
              </div>
              <Button size="sm" onClick={requestPermission} className="bg-orange-600 hover:bg-orange-700">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Order Updates */}
      {recentOrders.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Recent Order Updates</h3>
            </div>
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div>
                    <div className="font-medium">Order #{order.order_number}</div>
                    <div className="text-sm text-muted-foreground">
                      Updated {new Date(order.updated_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={`capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Inventory Alerts</h3>
            </div>
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-red-800">{alert.medicine_name}</div>
                    <div className="text-sm text-red-600">{alert.message}</div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    {alert.alert_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Status Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Real-time updates enabled</span>
      </div>
    </div>
  );
};