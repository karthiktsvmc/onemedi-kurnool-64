import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Globe,
  Server,
  Database,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RealtimeMonitoring() {
  const [activeUsers, setActiveUsers] = useState(247);
  const [currentOrders, setCurrentOrders] = useState(12);
  const [systemStatus, setSystemStatus] = useState('healthy');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Real-time subscriptions
  useRealtimeSubscription({
    table: 'orders',
    onInsert: (payload) => {
      setActivityFeed(prev => [{
        id: Date.now(),
        type: 'order',
        message: `New order #${payload.new.order_number} placed`,
        timestamp: new Date(),
        severity: 'info'
      }, ...prev.slice(0, 19)]);
      setCurrentOrders(prev => prev + 1);
    },
    onUpdate: (payload) => {
      setActivityFeed(prev => [{
        id: Date.now(),
        type: 'order',
        message: `Order #${payload.new.order_number} status updated to ${payload.new.status}`,
        timestamp: new Date(),
        severity: 'info'
      }, ...prev.slice(0, 19)]);
    }
  });

  useRealtimeSubscription({
    table: 'payments',
    onInsert: (payload) => {
      setActivityFeed(prev => [{
        id: Date.now(),
        type: 'payment',
        message: `Payment of ₹${payload.new.amount} received`,
        timestamp: new Date(),
        severity: 'success'
      }, ...prev.slice(0, 19)]);
    }
  });

  useRealtimeSubscription({
    table: 'inventory_alerts',
    onInsert: (payload) => {
      const newAlert = {
        id: payload.new.id,
        type: payload.new.alert_type,
        message: payload.new.message,
        timestamp: new Date(),
        severity: 'warning'
      };
      setAlerts(prev => [newAlert, ...prev]);
      setActivityFeed(prev => [newAlert, ...prev.slice(0, 19)]);
    }
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate user activity changes
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
      
      // Simulate system health checks
      const healthScore = Math.random();
      if (healthScore > 0.9) {
        setSystemStatus('healthy');
      } else if (healthScore > 0.7) {
        setSystemStatus('warning');
      } else {
        setSystemStatus('critical');
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const realtimeMetrics = [
    { time: '10:00', users: 180, orders: 8, revenue: 12500 },
    { time: '10:15', users: 195, orders: 12, revenue: 18600 },
    { time: '10:30', users: 220, orders: 15, revenue: 24800 },
    { time: '10:45', users: 247, orders: 18, revenue: 31200 },
    { time: '11:00', users: 235, orders: 16, revenue: 28900 }
  ];

  const systemMetrics = [
    { name: 'API Response Time', value: '145ms', status: 'good', icon: Zap },
    { name: 'Database Queries', value: '2.3s avg', status: 'good', icon: Database },
    { name: 'Server Load', value: '67%', status: 'warning', icon: Server },
    { name: 'Network Latency', value: '23ms', status: 'good', icon: Wifi }
  ];

  const activeConnections = [
    { type: 'Web Users', count: 156, percentage: 63 },
    { type: 'Mobile Users', count: 91, percentage: 37 },
    { type: 'Admin Users', count: 8, percentage: 3 },
    { type: 'API Calls', count: 1247, percentage: 100 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Real-time Monitoring"
        description="Live system monitoring, user activity, and performance metrics"
        actions={
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(systemStatus)}>
              {systemStatus.toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Users"
          value={activeUsers.toString()}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Current Orders"
          value={currentOrders.toString()}
          icon={ShoppingCart}
          iconColor="text-green-600"
        />
        <StatCard
          title="Active Alerts"
          value={alerts.length.toString()}
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <StatCard
          title="System Health"
          value="98.5%"
          icon={Activity}
          iconColor="text-purple-600"
        />
      </div>

      {/* Monitoring Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Metrics Chart */}
            <AdminCard title="Live Metrics" description="Real-time user and order tracking">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realtimeMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </AdminCard>

            {/* Active Connections */}
            <AdminCard title="Active Connections" description="Current user sessions and API usage">
              <div className="space-y-4">
                {activeConnections.map((connection) => (
                  <div key={connection.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{connection.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{connection.count}</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min(connection.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>

          {/* System Health */}
          <AdminCard title="System Health" description="Real-time performance indicators">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <metric.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{metric.name}</span>
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <AdminCard title="Live Activity Feed" description="Real-time system events and user actions">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getSeverityIcon(activity.severity)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard title="Response Times" description="API and database performance">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>API Endpoints</span>
                  <span className="font-mono">145ms avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Queries</span>
                  <span className="font-mono">2.3s avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Page Load Time</span>
                  <span className="font-mono">1.8s avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CDN Response</span>
                  <span className="font-mono">89ms avg</span>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Resource Usage" description="Server and infrastructure metrics">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>CPU Usage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Memory Usage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '67%' }} />
                    </div>
                    <span className="text-sm">67%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Disk Usage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '34%' }} />
                    </div>
                    <span className="text-sm">34%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Network I/O</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '23%' }} />
                    </div>
                    <span className="text-sm">23%</span>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AdminCard title="System Alerts" description="Active alerts and warnings">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium">All systems operational</p>
                <p className="text-muted-foreground">No active alerts at this time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border-l-4 border-l-orange-500 bg-orange-50">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}