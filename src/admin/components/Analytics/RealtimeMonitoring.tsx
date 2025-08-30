import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Activity, Users, ShoppingCart, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface RealtimeEvent {
  id: string;
  type: 'order' | 'user' | 'payment' | 'error';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export function RealtimeMonitoring() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const [currentMetrics] = useState<SystemMetric[]>([
    { name: 'Active Users', value: 156, unit: 'users', status: 'good', trend: 'up' },
    { name: 'Orders/Hour', value: 23, unit: 'orders', status: 'good', trend: 'stable' },
    { name: 'API Response Time', value: 245, unit: 'ms', status: 'warning', trend: 'up' },
    { name: 'Success Rate', value: 99.2, unit: '%', status: 'good', trend: 'stable' },
    { name: 'Database Load', value: 67, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Storage Usage', value: 34, unit: '%', status: 'good', trend: 'up' },
  ]);

  // Simulate real-time events
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const eventTypes = ['order', 'user', 'payment', 'error'] as const;
      const severities = ['info', 'warning', 'error', 'success'] as const;
      
      const messages = {
        order: ['New order placed: OM240115001', 'Order completed: OM240115002', 'Order cancelled: OM240115003'],
        user: ['New user registered', 'User logged in', 'Password reset requested'],
        payment: ['Payment successful: ₹1,250', 'Payment failed: Invalid card', 'Refund processed: ₹890'],
        error: ['Database connection timeout', '404 error on /medicines', 'High memory usage detected'],
      };

      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const newEvent: RealtimeEvent = {
        id: Date.now().toString(),
        type,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date(),
        severity: type === 'error' ? 'error' : severities[Math.floor(Math.random() * severities.length)],
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'payment': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                {getStatusBadge(metric.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}{metric.unit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="events">Real-time Events</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <Button
            variant={isMonitoring ? "secondary" : "default"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
          </Button>
        </div>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Live Event Stream</CardTitle>
              <CardDescription>
                Real-time system events and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No events yet. Events will appear here in real-time.
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className={getSeverityColor(event.severity)}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {event.timestamp.toLocaleTimeString()}
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Active alerts and warnings requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: 'High API Response Time',
                    description: 'Average response time is above 200ms threshold',
                    severity: 'warning',
                    timestamp: '2 minutes ago',
                  },
                  {
                    id: 2,
                    title: 'Database Load Warning',
                    description: 'Database CPU usage is at 67%, approaching limit',
                    severity: 'warning',
                    timestamp: '5 minutes ago',
                  },
                  {
                    id: 3,
                    title: 'Payment Gateway Latency',
                    description: 'Payment processing is slower than usual',
                    severity: 'info',
                    timestamp: '12 minutes ago',
                  },
                ].map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <div className={`mt-1 ${getSeverityColor(alert.severity)}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{alert.title}</h4>
                        {getStatusBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {alert.timestamp}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Server Performance</CardTitle>
                <CardDescription>
                  Current server resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'CPU Usage', value: 45, max: 100 },
                  { name: 'Memory Usage', value: 67, max: 100 },
                  { name: 'Disk I/O', value: 23, max: 100 },
                  { name: 'Network Usage', value: 12, max: 100 },
                ].map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metric.name}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.value > 80 ? 'bg-red-500' :
                          metric.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
                <CardDescription>
                  Database query performance and connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Active Connections</p>
                    <p className="text-2xl font-bold">23/100</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avg Query Time</p>
                    <p className="text-2xl font-bold">45ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Slow Queries</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cache Hit Rate</p>
                    <p className="text-2xl font-bold">94.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}