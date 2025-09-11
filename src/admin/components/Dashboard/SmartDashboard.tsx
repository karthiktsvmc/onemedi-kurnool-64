import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { 
  LayoutGrid, 
  Settings, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Clock,
  AlertTriangle,
  Plus,
  Grip
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'activity' | 'alert';
  title: string;
  data: any;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}

interface SmartDashboardProps {
  userRole: string;
}

export const SmartDashboard: React.FC<SmartDashboardProps> = ({ userRole }) => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [newWidgetDialog, setNewWidgetDialog] = useState(false);

  // Mock data for demonstration
  const mockChartData = [
    { name: 'Jan', value: 400, orders: 240, revenue: 2400 },
    { name: 'Feb', value: 300, orders: 180, revenue: 1800 },
    { name: 'Mar', value: 600, orders: 360, revenue: 3600 },
    { name: 'Apr', value: 800, orders: 480, revenue: 4800 },
    { name: 'May', value: 700, orders: 420, revenue: 4200 },
    { name: 'Jun', value: 900, orders: 540, revenue: 5400 },
  ];

  const mockPieData = [
    { name: 'Medicines', value: 45, color: '#8884d8' },
    { name: 'Lab Tests', value: 25, color: '#82ca9d' },
    { name: 'Consultations', value: 20, color: '#ffc658' },
    { name: 'Home Care', value: 10, color: '#ff7c7c' },
  ];

  const defaultWidgets: DashboardWidget[] = [
    {
      id: 'revenue-trend',
      type: 'chart',
      title: 'Revenue Trend',
      data: { chartData: mockChartData, type: 'area' },
      size: 'large',
      position: { x: 0, y: 0 }
    },
    {
      id: 'total-orders',
      type: 'metric',
      title: 'Total Orders',
      data: { value: '2,847', change: '+12.5%', changeType: 'positive' },
      size: 'small',
      position: { x: 2, y: 0 }
    },
    {
      id: 'service-distribution',
      type: 'chart',
      title: 'Service Distribution',
      data: { chartData: mockPieData, type: 'pie' },
      size: 'medium',
      position: { x: 0, y: 1 }
    },
    {
      id: 'recent-alerts',
      type: 'alert',
      title: 'System Alerts',
      data: {
        alerts: [
          { message: 'Low stock: Paracetamol', severity: 'warning', time: '2m ago' },
          { message: 'Payment gateway issue', severity: 'error', time: '15m ago' },
          { message: 'High traffic detected', severity: 'info', time: '1h ago' }
        ]
      },
      size: 'medium',
      position: { x: 1, y: 1 }
    }
  ];

  useEffect(() => {
    // Load user's custom dashboard layout
    const savedLayout = localStorage.getItem(`dashboard-layout-${userRole}`);
    if (savedLayout) {
      setWidgets(JSON.parse(savedLayout));
    } else {
      setWidgets(defaultWidgets);
    }
  }, [userRole]);

  const saveLayout = (newWidgets: DashboardWidget[]) => {
    localStorage.setItem(`dashboard-layout-${userRole}`, JSON.stringify(newWidgets));
    setWidgets(newWidgets);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newWidgets = Array.from(widgets);
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedWidget);

    saveLayout(newWidgets);
  };

  const renderWidget = (widget: DashboardWidget) => {
    const getSizeClass = (size: string) => {
      switch (size) {
        case 'small': return 'col-span-1 row-span-1';
        case 'medium': return 'col-span-1 row-span-2 md:col-span-2 md:row-span-1';
        case 'large': return 'col-span-1 row-span-2 md:col-span-2 lg:col-span-3';
        default: return 'col-span-1 row-span-1';
      }
    };

    return (
      <Card key={widget.id} className={`p-4 ${getSizeClass(widget.size)} relative group`}>
        {isCustomizing && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Grip className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{widget.title}</h3>
          {widget.type === 'metric' && widget.data.change && (
            <Badge variant={widget.data.changeType === 'positive' ? 'default' : 'destructive'}>
              {widget.data.change}
            </Badge>
          )}
        </div>

        {widget.type === 'metric' && (
          <div>
            <p className="text-2xl font-bold text-foreground">{widget.data.value}</p>
          </div>
        )}

        {widget.type === 'chart' && widget.data.type === 'area' && (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={widget.data.chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {widget.type === 'chart' && widget.data.type === 'pie' && (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <RechartsPieChart dataKey="value" data={widget.data.chartData} cx="50%" cy="50%" outerRadius={60}>
                {widget.data.chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}

        {widget.type === 'alert' && (
          <div className="space-y-2">
            {widget.data.alerts.map((alert: any, index: number) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                  alert.severity === 'error' ? 'text-destructive' : 
                  alert.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {widget.type === 'activity' && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {widget.data.activities?.map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="flex-1">{activity.message}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Smart Dashboard</h2>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Customize
          </Button>
          
          <Dialog open={newWidgetDialog} onOpenChange={setNewWidgetDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Widget</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {[
                  { type: 'metric', icon: Target, title: 'Metric Widget' },
                  { type: 'chart', icon: BarChart3, title: 'Chart Widget' },
                  { type: 'activity', icon: Activity, title: 'Activity Feed' },
                  { type: 'alert', icon: AlertTriangle, title: 'Alert Panel' }
                ].map((widgetType) => (
                  <Button
                    key={widgetType.type}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => {
                      // Add new widget logic
                      setNewWidgetDialog(false);
                    }}
                  >
                    <widgetType.icon className="h-6 w-6" />
                    {widgetType.title}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isCustomizing}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {renderWidget(widget)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};