import { useState } from 'react';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DollarSign, Percent, Calendar } from 'lucide-react';

const pricingTiersTable = new SupabaseTable('medicine_pricing_tiers');
const taxConfigurationsTable = new SupabaseTable('tax_configurations');

interface PricingManagementProps {
  medicines: any[];
  locations: any[];
}

export const PricingManagement = ({ medicines, locations }: PricingManagementProps) => {
  const [activeView, setActiveView] = useState<'tiers' | 'tax'>('tiers');

  // Pricing Tiers
  const {
    data: pricingTiers,
    loading: tiersLoading,
    createItem: createTier,
    updateItem: updateTier,
    deleteItem: deleteTier,
    refetch: refetchTiers
  } = useSupabaseTable(pricingTiersTable, { realtime: true });

  // Tax Configurations
  const {
    data: taxConfigurations,
    loading: taxLoading,
    createItem: createTaxConfig,
    updateItem: updateTaxConfig,
    deleteItem: deleteTaxConfig,
    refetch: refetchTaxConfigs
  } = useSupabaseTable(taxConfigurationsTable, { realtime: true });

  // Pricing tier columns
  const tierColumns = [
    {
      key: 'medicine_id',
      label: 'Medicine',
      render: (value: any) => {
        const medicine = medicines.find(m => m.id === value);
        return medicine ? medicine.name : 'Unknown';
      }
    },
    { key: 'min_quantity', label: 'Min Qty', sortable: true },
    { 
      key: 'max_quantity', 
      label: 'Max Qty',
      render: (value: any) => value || 'Unlimited'
    },
    { 
      key: 'price', 
      label: 'Price (₹)',
      render: (value: any) => `₹${value}`
    },
    {
      key: 'location_id',
      label: 'Location',
      render: (value: any) => {
        if (!value) return 'All Locations';
        const location = locations.find(l => l.id === value);
        return location ? location.name : 'Unknown';
      }
    },
    { 
      key: 'valid_until', 
      label: 'Valid Until',
      render: (value: any) => {
        if (!value) return 'Indefinite';
        const date = new Date(value);
        const today = new Date();
        const isExpired = date < today;
        return (
          <Badge variant={isExpired ? 'destructive' : 'default'}>
            {date.toLocaleDateString()}
          </Badge>
        );
      }
    }
  ];

  // Tax configuration columns
  const taxColumns = [
    { key: 'name', label: 'Tax Name', sortable: true },
    { 
      key: 'rate', 
      label: 'Rate',
      render: (value: any, item: any) => `${value}${item.type === 'percentage' ? '%' : ' ₹'}`
    },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: any) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    { key: 'hsn_code', label: 'HSN Code' },
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
  const tierFields = [
    { 
      name: 'medicine_id', 
      label: 'Medicine', 
      type: 'select' as const, 
      required: true,
      options: medicines.map(m => ({ value: m.id, label: m.name }))
    },
    { name: 'min_quantity', label: 'Minimum Quantity', type: 'number' as const, required: true, min: 1 },
    { name: 'max_quantity', label: 'Maximum Quantity (optional)', type: 'number' as const, min: 1 },
    { name: 'price', label: 'Price per Unit (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { 
      name: 'location_id', 
      label: 'Location (optional)', 
      type: 'select' as const,
      options: [
        { value: '', label: 'All Locations' },
        ...locations.map(l => ({ value: l.id, label: l.name }))
      ]
    },
    { name: 'valid_from', label: 'Valid From', type: 'date' as const },
    { name: 'valid_until', label: 'Valid Until (optional)', type: 'date' as const }
  ];

  const taxFields = [
    { name: 'name', label: 'Tax Configuration Name', type: 'text' as const, required: true },
    { name: 'rate', label: 'Tax Rate', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { 
      name: 'type', 
      label: 'Tax Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed', label: 'Fixed Amount' }
      ]
    },
    { name: 'hsn_code', label: 'HSN/SAC Code', type: 'text' as const },
    { name: 'applicable_states', label: 'Applicable States', type: 'array' as const },
    { name: 'active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pricing Tiers</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pricingTiers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active pricing rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Configurations</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taxConfigurations.filter(t => t.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active tax rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {pricingTiers.filter(tier => {
                if (!tier.valid_until) return false;
                const expiryDate = new Date(tier.valid_until);
                const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                return expiryDate <= thirtyDaysFromNow;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pricing rules expiring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeView === 'tiers' ? 'default' : 'ghost'}
          onClick={() => setActiveView('tiers')}
          size="sm"
        >
          Pricing Tiers
        </Button>
        <Button
          variant={activeView === 'tax' ? 'default' : 'ghost'}
          onClick={() => setActiveView('tax')}
          size="sm"
        >
          Tax Configuration
        </Button>
      </div>

      {/* Content */}
      {activeView === 'tiers' && (
        <DataTable
          title="Pricing Tiers"
          description="Set up bulk pricing and location-specific rates"
          data={pricingTiers}
          columns={tierColumns}
          loading={tiersLoading}
          onDelete={(item) => deleteTier(item.id)}
          onRefresh={refetchTiers}
          searchPlaceholder="Search pricing tiers..."
          renderActions={(item) => (
            <FormDialog
              title="Edit Pricing Tier"
              fields={tierFields}
              initialData={item}
              onSubmit={async (data) => {
                await updateTier(item.id, data);
              }}
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          )}
          actions={
            <FormDialog
              title="Add Pricing Tier"
              fields={tierFields}
              onSubmit={async (data) => {
                await createTier(data);
              }}
              trigger={<Button size="sm">Add Pricing Tier</Button>}
            />
          }
        />
      )}

      {activeView === 'tax' && (
        <DataTable
          title="Tax Configurations"
          description="Manage GST and other tax settings for medicines"
          data={taxConfigurations}
          columns={taxColumns}
          loading={taxLoading}
          onDelete={(item) => deleteTaxConfig(item.id)}
          onRefresh={refetchTaxConfigs}
          searchPlaceholder="Search tax configurations..."
          renderActions={(item) => (
            <FormDialog
              title="Edit Tax Configuration"
              fields={taxFields}
              initialData={item}
              onSubmit={async (data) => {
                await updateTaxConfig(item.id, data);
              }}
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          )}
          actions={
            <FormDialog
              title="Add Tax Configuration"
              fields={taxFields}
              onSubmit={async (data) => {
                await createTaxConfig(data);
              }}
              trigger={<Button size="sm">Add Tax Configuration</Button>}
            />
          }
        />
      )}
    </div>
  );
};