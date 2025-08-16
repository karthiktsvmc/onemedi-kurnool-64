import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, MapPin, Building, Check, Map, Globe } from 'lucide-react';

export const ScanDiagnosticCentres = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCentre, setEditingCentre] = useState<any>(null);

  const { data: centres, loading, refetch } = useSupabaseQuery({
    table: 'diagnostics_centres',
    select: `
      *,
      scan_variants(count)
    `,
    orderBy: 'created_at',
    ascending: false
  });

  const { create: createCentre, update: updateCentre, remove: deleteCentre } = useSupabaseMutation({
    table: 'diagnostics_centres',
    onSuccess: () => {
      refetch();
      setShowAddDialog(false);
      setEditingCentre(null);
    }
  });

  const centreFields = [
    { name: 'name', label: 'Centre Name', type: 'text' as const, required: true },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'state', label: 'State', type: 'text' as const, required: true },
    { name: 'pincode', label: 'Pincode', type: 'text' as const, required: true },
    { name: 'contact', label: 'Contact Number', type: 'text' as const },
    { name: 'lat', label: 'Latitude', type: 'number' as const },
    { name: 'lng', label: 'Longitude', type: 'number' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'active', label: 'Active', type: 'checkbox' as const }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Centre Details',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          {row?.image_url && (
            <img 
              src={row.image_url} 
              alt={row.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{row?.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {row?.city}, {row?.state}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Address',
      render: (_: any, row: any) => (
        <div className="max-w-xs">
          <div className="text-sm line-clamp-2">{row?.address}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {row?.pincode}
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_: any, row: any) => row?.contact || 'N/A'
    },
    {
      key: 'scan_count',
      label: 'Available Scans',
      render: (_: any, row: any) => {
        const count = Array.isArray(row?.scan_variants)
          ? row.scan_variants.length
          : (row?.scan_variants?.[0]?.count ?? row?.scan_variants?.count ?? 0);
        return count;
      }
    },
    {
      key: 'active',
      label: 'Status',
      render: (_: any, row: any) => (
        <Badge variant={row?.active ? 'default' : 'secondary'}>
          {row?.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ];

  const handleAdd = () => {
    setEditingCentre(null);
    setShowAddDialog(true);
  };

  const handleEdit = (centre: any) => {
    setEditingCentre(centre);
    setShowAddDialog(true);
  };

  const handleDelete = async (centre: any) => {
    await deleteCentre(centre.id);
  };

  const handleSubmit = async (data: any) => {
    if (editingCentre) {
      await updateCentre(editingCentre.id, data);
    } else {
      await createCentre(data);
    }
  };

  const stats = {
    total: centres?.length || 0,
    active: centres?.filter(centre => centre.active)?.length || 0,
    cities: new Set(centres?.map(centre => centre.city))?.size || 0,
    states: new Set(centres?.map(centre => centre.state))?.size || 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Centres" value={stats.total.toString()} icon={Building} />
        <StatCard title="Active Centres" value={stats.active.toString()} icon={Check} />
        <StatCard title="Cities" value={stats.cities.toString()} icon={Map} />
        <StatCard title="States" value={stats.states.toString()} icon={Globe} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Diagnostic Centres</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Centre
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Diagnostic Centres"
        data={centres || []}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      <div style={{ display: 'none' }}>
        <FormDialog
          title="Add Centre"
          fields={centreFields}
          onSubmit={handleSubmit}
          trigger={<button>Hidden</button>}
        />
      </div>
    </div>
  );
};