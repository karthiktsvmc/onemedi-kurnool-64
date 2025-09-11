import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BarChart3,
  Zap,
  Target,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DataTable } from '@/admin/components/shared/DataTable';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number;
  lastRestocked: Date;
  expiryDate?: Date;
  supplier: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
  demandTrend: 'up' | 'down' | 'stable';
  predictedRunOut?: Date;
  suggestedReorder?: number;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: Date;
  user: string;
}

export const SmartInventorySystem: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock data
  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      sku: 'MED001',
      category: 'Pain Relief',
      currentStock: 50,
      reorderPoint: 100,
      maxStock: 500,
      unitCost: 2.5,
      lastRestocked: new Date('2024-01-15'),
      expiryDate: new Date('2025-12-31'),
      supplier: 'PharmaCorp',
      location: 'Warehouse A',
      status: 'low_stock',
      demandTrend: 'up',
      predictedRunOut: new Date('2024-02-15'),
      suggestedReorder: 300
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      sku: 'MED002',
      category: 'Antibiotics',
      currentStock: 0,
      reorderPoint: 50,
      maxStock: 200,
      unitCost: 5.0,
      lastRestocked: new Date('2024-01-10'),
      expiryDate: new Date('2025-06-30'),
      supplier: 'MediSupply',
      location: 'Warehouse B',
      status: 'out_of_stock',
      demandTrend: 'stable',
      predictedRunOut: new Date('2024-01-20'),
      suggestedReorder: 100
    }
  ];

  const mockStockData = [
    { name: 'Jan', inbound: 400, outbound: 240, adjustment: 24 },
    { name: 'Feb', inbound: 300, outbound: 198, adjustment: 18 },
    { name: 'Mar', inbound: 600, outbound: 480, adjustment: 40 },
    { name: 'Apr', inbound: 800, outbound: 680, adjustment: 35 },
    { name: 'May', inbound: 700, outbound: 590, adjustment: 28 },
    { name: 'Jun', inbound: 900, outbound: 720, adjustment: 45 },
  ];

  useEffect(() => {
    setInventoryItems(mockInventoryItems);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = !showLowStockOnly || 
                           item.status === 'low_stock' || 
                           item.status === 'out_of_stock';

    return matchesCategory && matchesLocation && matchesSearch && matchesLowStock;
  });

  const inventoryColumns = [
    {
      key: 'name',
      label: 'Product Name',
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-muted-foreground">{row.original.sku}</div>
        </div>
      ),
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      accessorKey: 'currentStock',
      header: 'Current Stock',
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <div className="text-right">
            <div className="font-medium">{item.currentStock}</div>
            <div className="text-xs text-muted-foreground">
              Min: {item.reorderPoint} | Max: {item.maxStock}
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge className={getStatusColor(row.getValue('status'))}>
          {row.getValue('status').replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'demandTrend',
      label: 'Trend',
      accessorKey: 'demandTrend',
      header: 'Trend',
      cell: ({ row }: any) => getTrendIcon(row.getValue('demandTrend')),
    },
    {
      key: 'predictedRunOut',
      label: 'Predicted Run Out',
      accessorKey: 'predictedRunOut',
      header: 'Predicted Run Out',
      cell: ({ row }: any) => {
        const date = row.getValue('predictedRunOut');
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    {
      key: 'suggestedReorder',
      label: 'Suggested Reorder',
      accessorKey: 'suggestedReorder',
      header: 'Suggested Reorder',
      cell: ({ row }: any) => {
        const amount = row.getValue('suggestedReorder');
        return amount ? (
          <div className="text-right">
            <div className="font-medium">{amount} units</div>
            <div className="text-xs text-muted-foreground">
              ₹{(amount * row.original.unitCost).toFixed(2)}
            </div>
          </div>
        ) : '-';
      },
    },
  ];

  const handleBulkReorder = () => {
    // Implement bulk reorder logic
    console.log('Bulk reorder for items:', selectedItems);
    setBulkActionDialog(false);
  };

  const generateReorderReport = () => {
    // Generate and download reorder report
    const lowStockItems = inventoryItems.filter(item => 
      item.status === 'low_stock' || item.status === 'out_of_stock'
    );
    
    const csvContent = [
      ['Product', 'SKU', 'Current Stock', 'Suggested Reorder', 'Estimated Cost'],
      ...lowStockItems.map(item => [
        item.name,
        item.sku,
        item.currentStock,
        item.suggestedReorder || 0,
        ((item.suggestedReorder || 0) * item.unitCost).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reorder-report.csv';
    a.click();
  };

  const lowStockAlerts = inventoryItems.filter(item => 
    item.status === 'low_stock' || item.status === 'out_of_stock'
  ).length;

  const expiryAlerts = inventoryItems.filter(item => {
    if (!item.expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return item.expiryDate <= thirtyDaysFromNow;
  }).length;

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      {(lowStockAlerts > 0 || expiryAlerts > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockAlerts > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {lowStockAlerts} items are low on stock or out of stock. Consider reordering.
              </AlertDescription>
            </Alert>
          )}
          {expiryAlerts > 0 && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                {expiryAlerts} items are expiring within 30 days. Review inventory.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{inventoryItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">₹{inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0).toFixed(0)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Auto-Reorder</p>
              <p className="text-2xl font-bold text-blue-600">
                {inventoryItems.filter(item => item.suggestedReorder).length}
              </p>
            </div>
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Forecasting</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="reorders">Smart Reorders</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters and Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                <SelectItem value="Vitamins">Vitamins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                <SelectItem value="Warehouse B">Warehouse B</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showLowStockOnly ? "default" : "outline"}
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Low Stock Only
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
                <DialogTrigger asChild>
                  <Button disabled={selectedItems.length === 0}>
                    <Target className="h-4 w-4 mr-2" />
                    Bulk Actions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Actions</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Selected {selectedItems.length} items</p>
                    <div className="flex gap-2">
                      <Button onClick={handleBulkReorder}>
                        Auto Reorder Selected
                      </Button>
                      <Button variant="outline">
                        Update Locations
                      </Button>
                      <Button variant="outline">
                        Adjust Stock
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={generateReorderReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <Card>
            <DataTable
              columns={inventoryColumns}
              data={filteredItems}
            />
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Stock Movement Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockStockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="inbound" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="outbound" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Demand Forecasting</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockStockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="outbound" stroke="#8884d8" name="Actual Demand" />
                  <Line type="monotone" dataKey="inbound" stroke="#82ca9d" strokeDasharray="5 5" name="Predicted Demand" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Stock Movements</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Import Movements
            </Button>
          </div>
          
          {/* Stock movements would be implemented here */}
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Stock movements tracking will be implemented here
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reorders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Smart Reorder Suggestions</h3>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh AI Predictions
            </Button>
          </div>
          
          {/* Smart reorder suggestions would be implemented here */}
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              AI-powered reorder suggestions will be implemented here
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};