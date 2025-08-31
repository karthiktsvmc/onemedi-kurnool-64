import { useState } from 'react';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertTriangle, Package, Calendar, MapPin } from 'lucide-react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';

const batchesTable = new SupabaseTable('medicine_inventory_batches');
const locationsTable = new SupabaseTable('medicine_locations');

interface InventoryManagementProps {
  medicines: any[];
  variants: any[];
}

export const InventoryManagement = ({ medicines, variants }: InventoryManagementProps) => {
  const [activeView, setActiveView] = useState<'batches' | 'locations' | 'alerts'>('batches');

  // Batches
  const {
    data: batches,
    loading: batchesLoading,
    createItem: createBatch,
    updateItem: updateBatch,
    deleteItem: deleteBatch,
    refetch: refetchBatches
  } = useSupabaseTable(batchesTable, { realtime: true });

  // Locations
  const {
    data: locations,
    loading: locationsLoading,
    createItem: createLocation,
    updateItem: updateLocation,
    deleteItem: deleteLocation,
    refetch: refetchLocations
  } = useSupabaseTable(locationsTable, { realtime: true });

  // Batch columns
  const batchColumns = [
    {
      key: 'variant_id',
      label: 'Product Variant',
      render: (value: any) => {
        const variant = variants.find(v => v.id === value);
        return variant ? `${variant.name}` : 'Unknown';
      }
    },
    { key: 'batch_number', label: 'Batch Number', sortable: true },
    { key: 'manufacturer', label: 'Manufacturer' },
    { 
      key: 'quantity', 
      label: 'Quantity',
      render: (value: any) => (
        <Badge variant={value > 50 ? 'default' : value > 10 ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'expiry_date', 
      label: 'Expiry Date',
      render: (value: any) => {
        const date = new Date(value);
        const today = new Date();
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <Badge variant={diffDays < 30 ? 'destructive' : diffDays < 90 ? 'secondary' : 'default'}>
            {date.toLocaleDateString()}
          </Badge>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: any) => (
        <Badge variant={value === 'active' ? 'default' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'location_id',
      label: 'Location',
      render: (value: any) => {
        const location = locations.find(l => l.id === value);
        return location ? location.name : 'Central';
      }
    }
  ];

  // Location columns
  const locationColumns = [
    { key: 'name', label: 'Location Name', sortable: true },
    { key: 'code', label: 'Code' },
    { key: 'city', label: 'City' },
    { key: 'contact', label: 'Contact' },
    { 
      key: 'active', 
      label: 'Status',
      render: (value: any) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  // Form fields
  const batchFields = [
    { 
      name: 'variant_id', 
      label: 'Product Variant', 
      type: 'select' as const, 
      required: true,
      options: variants.map(v => ({ value: v.id, label: v.name }))
    },
    { name: 'batch_number', label: 'Batch Number', type: 'text' as const, required: true },
    { name: 'manufacturer', label: 'Manufacturer', type: 'text' as const },
    { name: 'manufacturing_date', label: 'Manufacturing Date', type: 'date' as const },
    { name: 'expiry_date', label: 'Expiry Date', type: 'date' as const, required: true },
    { name: 'quantity', label: 'Quantity', type: 'number' as const, required: true, min: 0 },
    { name: 'cost_price', label: 'Cost Price (₹)', type: 'number' as const, min: 0, step: 0.01 },
    { 
      name: 'location_id', 
      label: 'Location', 
      type: 'select' as const,
      options: [
        { value: '', label: 'Central Warehouse' },
        ...locations.map(l => ({ value: l.id, label: l.name }))
      ]
    },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'recalled', label: 'Recalled' },
        { value: 'damaged', label: 'Damaged' }
      ]
    }
  ];

  const locationFields = [
    { name: 'name', label: 'Location Name', type: 'text' as const, required: true },
    { name: 'code', label: 'Location Code', type: 'text' as const, required: true },
    { name: 'address', label: 'Address', type: 'textarea' as const },
    { name: 'city', label: 'City', type: 'text' as const },
    { name: 'state', label: 'State', type: 'text' as const },
    { name: 'pincode', label: 'Pincode', type: 'text' as const },
    { name: 'contact', label: 'Contact', type: 'text' as const },
    { name: 'email', label: 'Email', type: 'email' as const },
    { name: 'active', label: 'Active', type: 'boolean' as const }
  ];

  // Calculate alerts
  const getExpiryAlerts = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return batches.filter(batch => {
      const expiryDate = new Date(batch.expiry_date);
      return expiryDate <= thirtyDaysFromNow && batch.status === 'active';
    });
  };

  const getLowStockAlerts = () => {
    return batches.filter(batch => batch.quantity <= 10 && batch.status === 'active');
  };

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiry Alerts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {getExpiryAlerts().length}
            </div>
            <p className="text-xs text-muted-foreground">
              Expiring in 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {getLowStockAlerts().length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items below threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.filter(l => l.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeView === 'batches' ? 'default' : 'ghost'}
          onClick={() => setActiveView('batches')}
          size="sm"
        >
          Inventory Batches
        </Button>
        <Button
          variant={activeView === 'locations' ? 'default' : 'ghost'}
          onClick={() => setActiveView('locations')}
          size="sm"
        >
          Locations
        </Button>
        <Button
          variant={activeView === 'alerts' ? 'default' : 'ghost'}
          onClick={() => setActiveView('alerts')}
          size="sm"
        >
          Alerts
        </Button>
      </div>

      {/* Content */}
      {activeView === 'batches' && (
        <DataTable
          title="Inventory Batches"
          description="Track medicine batches with expiry and location details"
          data={batches}
          columns={batchColumns}
          loading={batchesLoading}
          onDelete={(item) => deleteBatch(item.id)}
          onRefresh={refetchBatches}
          searchPlaceholder="Search batches..."
          renderActions={(item) => (
            <FormDialog
              title="Edit Batch"
              fields={batchFields}
              initialData={item}
              onSubmit={async (data) => {
                await updateBatch(item.id, data);
              }}
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          )}
          actions={
            <FormDialog
              title="Add Inventory Batch"
              fields={batchFields}
              onSubmit={async (data) => {
                await createBatch(data);
              }}
              trigger={<Button size="sm">Add Batch</Button>}
            />
          }
        />
      )}

      {activeView === 'locations' && (
        <DataTable
          title="Medicine Locations"
          description="Manage pharmacy and warehouse locations"
          data={locations}
          columns={locationColumns}
          loading={locationsLoading}
          onDelete={(item) => deleteLocation(item.id)}
          onRefresh={refetchLocations}
          searchPlaceholder="Search locations..."
          renderActions={(item) => (
            <FormDialog
              title="Edit Location"
              fields={locationFields}
              initialData={item}
              onSubmit={async (data) => {
                await updateLocation(item.id, data);
              }}
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          )}
          actions={
            <FormDialog
              title="Add Location"
              fields={locationFields}
              onSubmit={async (data) => {
                await createLocation(data);
              }}
              trigger={<Button size="sm">Add Location</Button>}
            />
          }
        />
      )}

      {activeView === 'alerts' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getExpiryAlerts().map((batch) => {
                  const variant = variants.find(v => v.id === batch.variant_id);
                  const expiryDate = new Date(batch.expiry_date);
                  const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{variant?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">
                          Batch: {batch.batch_number} | Qty: {batch.quantity}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {diffDays <= 0 ? 'Expired' : `${diffDays} days left`}
                      </Badge>
                    </div>
                  );
                })}
                {getExpiryAlerts().length === 0 && (
                  <p className="text-muted-foreground">No items expiring soon</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getLowStockAlerts().map((batch) => {
                  const variant = variants.find(v => v.id === batch.variant_id);
                  
                  return (
                    <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{variant?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">
                          Batch: {batch.batch_number}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {batch.quantity} remaining
                      </Badge>
                    </div>
                  );
                })}
                {getLowStockAlerts().length === 0 && (
                  <p className="text-muted-foreground">All items well stocked</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};