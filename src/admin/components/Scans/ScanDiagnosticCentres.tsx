import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, MapPin } from 'lucide-react';

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
      render: (centre: any) => (
        <div className="flex items-center gap-3">
          {centre.image_url && (
            <img 
              src={centre.image_url} 
              alt={centre.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{centre.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {centre.city}, {centre.state}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Address',
      render: (centre: any) => (
        <div className="max-w-xs">
          <div className="text-sm line-clamp-2">{centre.address}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {centre.pincode}
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (centre: any) => centre.contact || 'N/A'
    },
    {
      key: 'scan_count',
      label: 'Available Scans',
      render: (centre: any) => centre.scan_variants?.length || 0
    },
    {
      key: 'active',
      label: 'Status',
      render: (centre: any) => (
        <Badge variant={centre.active ? 'default' : 'secondary'}>
          {centre.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (centre: any) => new Date(centre.created_at).toLocaleDateString()
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
        <AdminCard title="Total Centres" value={stats.total} icon="building" />
        <AdminCard title="Active Centres" value={stats.active} icon="check" />
        <AdminCard title="Cities" value={stats.cities} icon="map" />
        <AdminCard title="States" value={stats.states} icon="globe" />
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
      {showAddDialog && (
        <FormDialog
          title={editingCentre ? 'Edit Centre' : 'Add New Centre'}
          fields={centreFields}
          initialData={editingCentre}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddDialog(false);
            setEditingCentre(null);
          }}
          open={showAddDialog}
        />
      )}
    </div>
  );
};