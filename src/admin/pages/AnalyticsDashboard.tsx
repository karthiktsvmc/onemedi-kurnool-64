import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Package,
  Download,
  Filter,
  Calendar,
  Target,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for charts
  const revenueData = [
    { name: 'Mon', revenue: 45000, orders: 120 },
    { name: 'Tue', revenue: 52000, orders: 140 },
    { name: 'Wed', revenue: 48000, orders: 130 },
    { name: 'Thu', revenue: 61000, orders: 165 },
    { name: 'Fri', revenue: 55000, orders: 150 },
    { name: 'Sat', revenue: 67000, orders: 180 },
    { name: 'Sun', revenue: 59000, orders: 160 }
  ];

  const servicePerformance = [
    { name: 'Medicines', value: 45, revenue: 285000, color: '#3B82F6' },
    { name: 'Lab Tests', value: 25, revenue: 125000, color: '#10B981' },
    { name: 'Consultations', value: 15, revenue: 95000, color: '#8B5CF6' },
    { name: 'Scans', value: 10, revenue: 78000, color: '#F59E0B' },
    { name: 'Home Care', value: 5, revenue: 45000, color: '#EF4444' }
  ];

  const userGrowthData = [
    { month: 'Jan', newUsers: 1200, totalUsers: 8500 },
    { month: 'Feb', newUsers: 1500, totalUsers: 10000 },
    { month: 'Mar', newUsers: 1800, totalUsers: 11800 },
    { month: 'Apr', newUsers: 2100, totalUsers: 13900 },
    { month: 'May', newUsers: 2400, totalUsers: 16300 },
    { month: 'Jun', newUsers: 2200, totalUsers: 18500 }
  ];

  const topProducts = [
    { name: 'Paracetamol 500mg', orders: 1245, revenue: 62250, category: 'Medicine' },
    { name: 'Complete Blood Count', orders: 890, revenue: 44500, category: 'Lab Test' },
    { name: 'Chest X-Ray', orders: 567, revenue: 28350, category: 'Scan' },
    { name: 'Dr. Consultation', orders: 445, revenue: 44500, category: 'Service' },
    { name: 'Blood Sugar Test', orders: 423, revenue: 21150, category: 'Lab Test' }
  ];

  const locationData = [
    { city: 'Kurnool', orders: 2340, revenue: 456000, growth: 12.5 },
    { city: 'Anantapur', orders: 1890, revenue: 378000, growth: 8.3 },
    { city: 'Kadapa', orders: 1245, revenue: 249000, growth: 15.2 },
    { city: 'Nellore', orders: 967, revenue: 193400, growth: 6.7 },
    { city: 'Tirupati', orders: 834, revenue: 166800, growth: 18.9 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Comprehensive business insights and performance metrics"
        actions={
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="₹4,56,789"
          change="+12.5%"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Orders"
          value="2,847"
          change="+8.3%"
          changeType="positive"
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Users"
          value="18,420"
          change="+15.2%"
          changeType="positive"
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change="+0.5%"
          changeType="positive"
          icon={Target}
          iconColor="text-orange-600"
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <AdminCard title="Revenue Trend" description="Daily revenue and order count">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </AdminCard>

            {/* Service Performance */}
            <AdminCard title="Service Performance" description="Revenue distribution by service">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicePerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {servicePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </AdminCard>
          </div>

          {/* Top Performing Products */}
          <AdminCard title="Top Performing Products" description="Best selling products this month">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <AdminCard title="Revenue Analytics" description="Detailed revenue breakdown and trends">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </AdminCard>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <AdminCard title="User Growth" description="New user acquisition and retention metrics">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="newUsers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="New Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalUsers" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Total Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </AdminCard>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <AdminCard title="Product Performance" description="Detailed product analytics and trends">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProducts.map((product) => (
                <Card key={product.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                    <Badge variant="outline" className="w-fit">{product.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Orders</span>
                        <span className="font-medium">{product.orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <span className="font-medium">₹{product.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <AdminCard title="Geographic Performance" description="Sales performance by location">
            <div className="space-y-4">
              {locationData.map((location) => (
                <div key={location.city} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{location.city}</p>
                      <p className="text-sm text-muted-foreground">{location.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{location.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {location.growth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm ${location.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {location.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}