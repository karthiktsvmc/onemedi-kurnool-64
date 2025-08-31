import { useState } from 'react';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';

const shippingZonesTable = new SupabaseTable('shipping_zones');
const shippingMethodsTable = new SupabaseTable('shipping_methods');

export const ShippingManagement = () => {
  const [activeView, setActiveView] = useState<'zones' | 'methods'>('zones');

  // Shipping Zones
  const {
    data: zones,
    loading: zonesLoading,
    createItem: createZone,
    updateItem: updateZone,
    deleteItem: deleteZone,
    refetch: refetchZones
  } = useSupabaseTable(shippingZonesTable, { realtime: true });

  // Shipping Methods
  const {
    data: methods,
    loading: methodsLoading,
    createItem: createMethod,
    updateItem: updateMethod,
    deleteItem: deleteMethod,
    refetch: refetchMethods
  } = useSupabaseTable(shippingMethodsTable, { realtime: true });

  // Zone columns
  const zoneColumns = [
    { key: 'name', label: 'Zone Name', sortable: true },
    {
      key: 'states',
      label: 'States',
      render: (value: any) => {
        if (!value || !Array.isArray(value) || value.length === 0) return 'N/A';
        return value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '');
      }
    },
    {
      key: 'cities',
      label: 'Cities',
      render: (value: any) => {
        if (!value || !Array.isArray(value) || value.length === 0) return 'N/A';
        return value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '');
      }
    },
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

  // Method columns
  const methodColumns = [
    { key: 'name', label: 'Method Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: any) => (
        <Badge variant="outline">{value.replace('_', ' ')}</Badge>
      )
    },
    { 
      key: 'cost', 
      label: 'Cost',
      render: (value: any) => `₹${value}`
    },
    { 
      key: 'min_order_amount', 
      label: 'Min Order',
      render: (value: any) => value ? `₹${value}` : 'N/A'
    },
    { 
      key: 'estimated_days', 
      label: 'Est. Days',
      render: (value: any) => `${value} day(s)`
    },
    {
      key: 'zone_id',
      label: 'Zone',
      render: (value: any) => {
        if (!value) return 'All Zones';
        const zone = zones.find(z => z.id === value);
        return zone ? zone.name : 'Unknown';
      }
    },
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
  const zoneFields = [
    { name: 'name', label: 'Zone Name', type: 'text' as const, required: true },
    { name: 'states', label: 'States', type: 'array' as const, description: 'List of states covered' },
    { name: 'cities', label: 'Cities', type: 'array' as const, description: 'Specific cities (optional)' },
    { name: 'pincodes', label: 'Pincodes', type: 'array' as const, description: 'Specific pincodes (optional)' },
    { name: 'active', label: 'Active', type: 'boolean' as const }
  ];

  const methodFields = [
    { name: 'name', label: 'Shipping Method Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'type', 
      label: 'Shipping Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'flat_rate', label: 'Flat Rate' },
        { value: 'free', label: 'Free Shipping' },
        { value: 'calculated', label: 'Calculated' },
        { value: 'pickup', label: 'Store Pickup' }
      ]
    },
    { name: 'cost', label: 'Shipping Cost (₹)', type: 'number' as const, min: 0, step: 0.01 },
    { name: 'min_order_amount', label: 'Minimum Order Amount (₹)', type: 'number' as const, min: 0, step: 0.01 },
    { name: 'max_weight', label: 'Maximum Weight (kg)', type: 'number' as const, min: 0, step: 0.01 },
    { name: 'estimated_days', label: 'Estimated Delivery Days', type: 'number' as const, min: 1 },
    { 
      name: 'zone_id', 
      label: 'Shipping Zone', 
      type: 'select' as const,
      options: [
        { value: '', label: 'All Zones' },
        ...zones.map(z => ({ value: z.id, label: z.name }))
      ]
    },
    { name: 'active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeView === 'zones' ? 'default' : 'ghost'}
          onClick={() => setActiveView('zones')}
          size="sm"
        >
          Shipping Zones
        </Button>
        <Button
          variant={activeView === 'methods' ? 'default' : 'ghost'}
          onClick={() => setActiveView('methods')}
          size="sm"
        >
          Shipping Methods
        </Button>
      </div>

      {/* Content */}
      {activeView === 'zones' && (
        <DataTable
          title="Shipping Zones"
          description="Define geographical zones for shipping calculations"
          data={zones}
          columns={zoneColumns}
          loading={zonesLoading}
          onDelete={(item) => deleteZone(item.id)}
          onRefresh={refetchZones}
          searchPlaceholder="Search shipping zones..."
          renderActions={(item) => (
            <FormDialog
              title="Edit Shipping Zone"
              fields={zoneFields}
              initialData={item}
              onSubmit={async (data) => {
                await updateZone(item.id, data);
              }}
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          )}
          actions={
            <FormDialog
              title="Add Shipping Zone"
              fields={zoneFields}
              onSubmit={async (data) => {
                await createZone(data);
              }}
              trigger={<Button size="sm">Add Zone</Button>}
            />
          }
        />
      )}

      {activeView === 'methods' && (
        <DataTable
          title="Shipping Methods"
          description="Configure shipping options and rates"
          data={methods}
          columns={methodColumns}
          loading={methodsLoading}
          onDelete={(item) => deleteMethod(item.id)}
          onRefresh={refetchMethods}
          searchPlaceholder="Search shipping methods..."
          renderActions={(item) => (
            <FormDialog
              title="Edit Shipping Method"
              fields={methodFields}
              initialData={item}
              onSubmit={async (data) => {
                await updateMethod(item.id, data);
              }}
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          )}
          actions={
            <FormDialog
              title="Add Shipping Method"
              fields={methodFields}
              onSubmit={async (data) => {
                await createMethod(data);
              }}
              trigger={<Button size="sm">Add Method</Button>}
            />
          }
        />
      )}
    </div>
  );
};