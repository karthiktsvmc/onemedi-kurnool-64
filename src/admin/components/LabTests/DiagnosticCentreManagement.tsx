import { useState } from 'react';
import { Plus, Building2, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { AdminCard } from '../shared/AdminCard';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { Badge } from '@/shared/components/ui/badge';

export const DiagnosticCentreManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCentre, setEditingCentre] = useState(null);

  const { data: centres, loading, refetch } = useSupabaseQuery({
    table: 'diagnostics_centres',
    select: '*',
  });

  const centreMutation = useSupabaseMutation({
    table: 'diagnostics_centres',
    onSuccess: () => refetch(),
  });

  const centreFields = [
    { name: 'name', label: 'Centre Name', type: 'text' as const, required: true },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'state', label: 'State', type: 'text' as const, required: true },
    { name: 'pincode', label: 'Pincode', type: 'text' as const, required: true },
    { name: 'contact', label: 'Contact Number', type: 'text' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'lat', label: 'Latitude', type: 'number' as const, step: 0.000001 },
    { name: 'lng', label: 'Longitude', type: 'number' as const, step: 0.000001 },
    { name: 'active', label: 'Active', type: 'boolean' as const },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Centre Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={value} className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {row.city}, {row.state}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'address', 
      label: 'Address',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'contact', 
      label: 'Contact'
    },
    { 
      key: 'pincode', 
      label: 'Pincode'
    },
    { 
      key: 'active', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleAdd = () => {
    setEditingCentre(null);
    setShowAddDialog(true);
  };

  const handleEdit = (centre: any) => {
    setEditingCentre(centre);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    await centreMutation.remove(id);
  };

  const handleSubmit = async (data: any) => {
    if (editingCentre) {
      await centreMutation.update(editingCentre.id, data);
    } else {
      await centreMutation.create({ ...data, active: true });
    }
    setShowAddDialog(false);
    setEditingCentre(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard title="Total Centres" className="text-center">
          <div className="text-2xl font-bold text-primary">{centres?.length || 0}</div>
        </AdminCard>
        <AdminCard title="Active Centres" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {centres?.filter(centre => centre.active).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Cities Covered" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {centres ? new Set(centres.map(centre => centre.city)).size : 0}
          </div>
        </AdminCard>
        <AdminCard title="States Covered" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {centres ? new Set(centres.map(centre => centre.state)).size : 0}
          </div>
        </AdminCard>
      </div>

      {/* Data Table */}
      <DataTable
        title="Diagnostic Centres"
        description="Manage diagnostic centres and their locations"
        data={centres || []}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search centres..."
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingCentre ? 'Edit Diagnostic Centre' : 'Add New Diagnostic Centre'}
          description={editingCentre ? 'Update centre information' : 'Create a new diagnostic centre'}
          fields={centreFields}
          initialData={editingCentre}
          onSubmit={handleSubmit}
          trigger={<div />}
        />
      )}
    </div>
  );
};