import React, { useState } from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { BulkImportExport } from '@/admin/components/shared/BulkImportExport';
import { Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

// Initialize inventory tables
const medicinesTable = new SupabaseTable('medicines');
const inventoryAlertsTable = new SupabaseTable('inventory_alerts');
const stockMovementsTable = new SupabaseTable('stock_movements');

export default function InventoryManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'medicines' | 'alerts' | 'movements'>('overview');

  // Hooks for data management
  const medicines = useSupabaseTable(medicinesTable, { realtime: true });
  const alerts = useSupabaseTable(inventoryAlertsTable, { realtime: true });
  const movements = useSupabaseTable(stockMovementsTable, { realtime: true });

  // Medicine inventory columns
  const medicineColumns = [
    { key: 'name', label: 'Medicine Name', sortable: true },
    { key: 'brand', label: 'Brand' },
    { 
      key: 'stock_qty', 
      label: 'Stock',
      render: (value: number) => (
        <Badge variant={value > 50 ? 'default' : value > 10 ? 'secondary' : 'destructive'}>
          {value} units
        </Badge>
      )
    },
    { 
      key: 'mrp', 
      label: 'MRP',
      render: (value: number) => `₹${value}`
    },
    { 
      key: 'sale_price', 
      label: 'Sale Price',
      render: (value: number) => `₹${value}`
    },
    { 
      key: 'expiry_date', 
      label: 'Expiry',
      render: (value: string) => {
        if (!value) return 'N/A';
        const expiryDate = new Date(value);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <Badge variant={daysUntilExpiry < 30 ? 'destructive' : daysUntilExpiry < 90 ? 'secondary' : 'default'}>
            {new Date(value).toLocaleDateString()}
          </Badge>
        );
      }
    },
    { key: 'pharmacy_name', label: 'Pharmacy' },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    }
  ];

  // Stock movement columns
  const movementColumns = [
    { key: 'medicine_name', label: 'Medicine' },
    { 
      key: 'movement_type', 
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'in' ? 'default' : 'destructive'}>
          {value === 'in' ? 'Stock In' : 'Stock Out'}
        </Badge>
      )
    },
    { 
      key: 'quantity', 
      label: 'Quantity',
      render: (value: number, row: any) => (
        <span className={row.movement_type === 'in' ? 'text-green-600' : 'text-red-600'}>
          {row.movement_type === 'in' ? '+' : '-'}{value}
        </span>
      )
    },
    { key: 'reason', label: 'Reason' },
    { key: 'reference_number', label: 'Reference' },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleString()
    }
  ];

  // Alert columns
  const alertColumns = [
    { 
      key: 'alert_type', 
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'low_stock' ? 'destructive' : value === 'expiry_soon' ? 'secondary' : 'default'}>
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    { key: 'medicine_name', label: 'Medicine' },
    { key: 'message', label: 'Message' },
    { key: 'current_stock', label: 'Current Stock' },
    { 
      key: 'threshold', 
      label: 'Threshold',
      render: (value: number) => `${value} units`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'destructive' : 'default'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  // Stock adjustment form
  const stockAdjustmentFields = [
    { 
      name: 'medicine_id', 
      label: 'Medicine', 
      type: 'select' as const, 
      required: true,
      options: medicines.data.map(med => ({ value: med.id, label: `${med.name} (${med.brand || 'Generic'})` }))
    },
    { 
      name: 'movement_type', 
      label: 'Adjustment Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'in', label: 'Stock In' },
        { value: 'out', label: 'Stock Out' }
      ]
    },
    { name: 'quantity', label: 'Quantity', type: 'number' as const, required: true, min: 1 },
    { 
      name: 'reason', 
      label: 'Reason', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'purchase', label: 'Purchase' },
        { value: 'sale', label: 'Sale' },
        { value: 'return', label: 'Return' },
        { value: 'damage', label: 'Damage' },
        { value: 'expiry', label: 'Expiry' },
        { value: 'theft', label: 'Theft' },
        { value: 'adjustment', label: 'Manual Adjustment' }
      ]
    },
    { name: 'reference_number', label: 'Reference Number', type: 'text' as const },
    { name: 'notes', label: 'Notes', type: 'textarea' as const }
  ];

  // Calculate inventory metrics
  const inventoryMetrics = {
    totalItems: medicines.data.length,
    lowStock: medicines.data.filter(med => med.stock_qty <= 10).length,
    expiringSoon: medicines.data.filter(med => {
      if (!med.expiry_date) return false;
      const expiryDate = new Date(med.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30;
    }).length,
    totalValue: medicines.data.reduce((sum, med) => sum + (med.stock_qty * med.sale_price), 0),
    activeAlerts: alerts.data.filter(alert => alert.status === 'active').length
  };

  // Handle stock adjustment
  const handleStockAdjustment = async (data: any): Promise<void> => {
    try {
      // Create stock movement record
      await movements.createItem({
        medicine_id: data.medicine_id,
        movement_type: data.movement_type,
        quantity: data.quantity,
        reason: data.reason,
        reference_number: data.reference_number,
        notes: data.notes
      });

      // Update medicine stock
      const medicine = medicines.data.find(med => med.id === data.medicine_id);
      if (medicine) {
        const newStock = data.movement_type === 'in' 
          ? medicine.stock_qty + data.quantity 
          : medicine.stock_qty - data.quantity;
        
        await medicines.updateItem(medicine.id, { stock_qty: Math.max(0, newStock) });
      }

      // Refresh data
      await medicines.fetchData();
      await movements.fetchData();
    } catch (error) {
      console.error('Stock adjustment failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Monitor stock levels, track movements, and manage inventory alerts"
      />

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryMetrics.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryMetrics.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryMetrics.expiringSoon}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{inventoryMetrics.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inventoryMetrics.activeAlerts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {inventoryMetrics.activeAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have {inventoryMetrics.activeAlerts} active inventory alerts requiring attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medicines">Medicine Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="bulk-ops">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {movements.data.slice(0, 5).map((movement, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium">{movement.medicine_name}</span>
                        <p className="text-sm text-muted-foreground">{movement.reason}</p>
                      </div>
                      <Badge variant={movement.movement_type === 'in' ? 'default' : 'destructive'}>
                        {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {medicines.data
                    .filter(med => med.stock_qty <= 10)
                    .slice(0, 5)
                    .map((medicine, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <span className="font-medium">{medicine.name}</span>
                          <p className="text-sm text-muted-foreground">{medicine.brand}</p>
                        </div>
                        <Badge variant="destructive">
                          {medicine.stock_qty} left
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-4">
          <DataTable
            title="Medicine Inventory"
            description="Monitor stock levels and manage medicine inventory"
            data={medicines.data}
            columns={medicineColumns}
            loading={medicines.loading}
            onSearch={(query) => medicines.searchItems(query, ['name', 'brand', 'pharmacy_name'])}
            onRefresh={() => medicines.fetchData()}
            searchPlaceholder="Search medicines..."
            actions={
              <FormDialog
                title="Stock Adjustment"
                fields={stockAdjustmentFields}
                onSubmit={handleStockAdjustment}
                trigger={<Button size="sm">Adjust Stock</Button>}
              />
            }
          />
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <DataTable
            title="Stock Movements"
            description="Track all inventory movements and transactions"
            data={movements.data}
            columns={movementColumns}
            loading={movements.loading}
            onSearch={(query) => movements.searchItems(query, ['medicine_name', 'reason', 'reference_number'])}
            onRefresh={() => movements.fetchData()}
            searchPlaceholder="Search movements..."
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <DataTable
            title="Inventory Alerts"
            description="Manage stock alerts and notifications"
            data={alerts.data}
            columns={alertColumns}
            loading={alerts.loading}
            onSearch={(query) => alerts.searchItems(query, ['medicine_name', 'message', 'alert_type'])}
            onRefresh={() => alerts.fetchData()}
            searchPlaceholder="Search alerts..."
            renderActions={(item) => (
              <div className="flex gap-2">
                {item.status === 'active' && (
                  <button 
                    className="text-green-600 hover:text-green-800"
                    onClick={() => alerts.updateItem(item.id, { status: 'resolved' })}
                  >
                    Resolve
                  </button>
                )}
              </div>
            )}
          />
        </TabsContent>

        <TabsContent value="bulk-ops" className="space-y-4">
          <BulkImportExport onDataUpdate={() => medicines.fetchData()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}