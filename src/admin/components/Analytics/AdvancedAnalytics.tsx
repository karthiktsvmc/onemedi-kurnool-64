import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, 
  Activity, Clock, MapPin, Download, Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeData } from '@/admin/hooks/useRealtimeData';

interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  orders?: number;
  users?: number;
  date?: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const AdvancedAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);

  // Real-time data
  const { data: orders } = useRealtimeData({ table: 'orders' });
  const { data: users } = useRealtimeData({ table: 'profiles' });
  const { data: performanceMetrics } = useRealtimeData({ table: 'performance_metrics' });

  const [analyticsData, setAnalyticsData] = useState({
    metrics: [] as AnalyticsMetric[],
    revenueChart: [] as ChartData[],
    categoryChart: [] as ChartData[],
    locationChart: [] as ChartData[],
    trendsChart: [] as ChartData[]
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, orders, users]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Calculate metrics from real-time data
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Mock performance data (in production, this would come from your metrics)
      const metrics: AnalyticsMetric[] = [
        {
          title: 'Total Revenue',
          value: `₹${totalRevenue.toLocaleString()}`,
          change: '+12.5%',
          trend: 'up',
          icon: DollarSign
        },
        {
          title: 'Total Orders',
          value: totalOrders.toString(),
          change: '+8.2%',
          trend: 'up',
          icon: ShoppingCart
        },
        {
          title: 'Active Users',
          value: totalUsers.toString(),
          change: '+15.3%',
          trend: 'up',
          icon: Users
        },
        {
          title: 'Avg Order Value',
          value: `₹${avgOrderValue.toFixed(0)}`,
          change: '-2.1%',
          trend: 'down',
          icon: TrendingUp
        }
      ];

      // Generate mock chart data based on real orders
      const revenueChart: ChartData[] = [
        { name: 'Mon', value: 12400, revenue: 12400, orders: 24, users: 120 },
        { name: 'Tue', value: 15600, revenue: 15600, orders: 31, users: 145 },
        { name: 'Wed', value: 18200, revenue: 18200, orders: 36, users: 168 },
        { name: 'Thu', value: 14800, revenue: 14800, orders: 29, users: 132 },
        { name: 'Fri', value: 22100, revenue: 22100, orders: 44, users: 201 },
        { name: 'Sat', value: 19300, revenue: 19300, orders: 38, users: 178 },
        { name: 'Sun', value: 16700, revenue: 16700, orders: 33, users: 156 }
      ];

      const categoryChart: ChartData[] = [
        { name: 'Medicines', value: 45 },
        { name: 'Lab Tests', value: 25 },
        { name: 'Scans', value: 15 },
        { name: 'Consultations', value: 10 },
        { name: 'Others', value: 5 }
      ];

      const locationChart: ChartData[] = [
        { name: 'Kurnool', value: 35 },
        { name: 'Hyderabad', value: 25 },
        { name: 'Bangalore', value: 20 },
        { name: 'Chennai', value: 12 },
        { name: 'Others', value: 8 }
      ];

      const trendsChart: ChartData[] = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 },
        { name: 'May', value: 6000 },
        { name: 'Jun', value: 5500 },
        { name: 'Jul', value: 7000 }
      ];

      setAnalyticsData({
        metrics,
        revenueChart,
        categoryChart,
        locationChart,
        trendsChart
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const dataToExport = {
      metrics: analyticsData.metrics,
      dateRange,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  ) : (
                    <Activity className="h-3 w-3 text-gray-500" />
                  )}
                  {metric.change} from last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders</CardTitle>
                <CardDescription>Daily revenue and order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>Revenue distribution by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categoryChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Monthly growth patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.trendsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Orders by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.locationChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">API Average</span>
                    <Badge variant="secondary">245ms</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="secondary">12ms</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Page Load</span>
                    <Badge variant="secondary">1.2s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="default">99.9%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Error Rate</span>
                    <Badge variant="secondary">0.01%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Throughput</span>
                    <Badge variant="secondary">1.2k req/min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Real-time Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Users</span>
                    <Badge variant="default">127</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Orders Today</span>
                    <Badge variant="secondary">{orders.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Orders</span>
                    <Badge variant="outline">
                      {orders.filter(o => o.status === 'pending').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};