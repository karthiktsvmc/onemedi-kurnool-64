import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus } from 'lucide-react';

export const ScanPackages = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);

  // For now using promotional_strips filtered by scan packages
  // Later can create dedicated scan_packages table
  const { data: packages, loading, refetch } = useSupabaseQuery({
    table: 'promotional_strips',
    filters: { module_name: 'scans-packages' },
    orderBy: 'created_at',
    ascending: false
  });

  const { create: createPackage, update: updatePackage, remove: deletePackage } = useSupabaseMutation({
    table: 'promotional_strips',
    onSuccess: () => {
      refetch();
      setShowAddDialog(false);
      setEditingPackage(null);
    }
  });

  const packageFields = [
    { name: 'title', label: 'Package Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'link', label: 'Booking Link', type: 'text' as const },
    { name: 'active', label: 'Active', type: 'checkbox' as const },
    { name: 'sort_order', label: 'Sort Order', type: 'number' as const }
  ];

  const columns = [
    {
      key: 'title',
      label: 'Package Name',
      render: (pkg: any) => (
        <div className="flex items-center gap-3">
          {pkg.image_url && (
            <img 
              src={pkg.image_url} 
              alt={pkg.title}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{pkg.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {pkg.description}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'link',
      label: 'Booking Link',
      render: (pkg: any) => (
        pkg.link ? (
          <a 
            href={pkg.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Link
          </a>
        ) : (
          <span className="text-muted-foreground">No link</span>
        )
      )
    },
    {
      key: 'active',
      label: 'Status',
      render: (pkg: any) => (
        <Badge variant={pkg.active ? 'default' : 'secondary'}>
          {pkg.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (pkg: any) => pkg.sort_order || 0
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (pkg: any) => new Date(pkg.created_at).toLocaleDateString()
    }
  ];

  const handleAdd = () => {
    setEditingPackage(null);
    setShowAddDialog(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setShowAddDialog(true);
  };

  const handleDelete = async (pkg: any) => {
    await deletePackage(pkg.id);
  };

  const handleSubmit = async (data: any) => {
    const packageData = {
      ...data,
      module_name: 'scans-packages'
    };

    if (editingPackage) {
      await updatePackage(editingPackage.id, packageData);
    } else {
      await createPackage(packageData);
    }
  };

  const stats = {
    total: packages?.length || 0,
    active: packages?.filter(pkg => pkg.active)?.length || 0,
    withLinks: packages?.filter(pkg => pkg.link)?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard title="Total Packages" value={stats.total} icon="package" />
        <AdminCard title="Active Packages" value={stats.active} icon="check" />
        <AdminCard title="With Booking Links" value={stats.withLinks} icon="link" />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Scan Packages</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Scan Packages"
        data={packages || []}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingPackage ? 'Edit Package' : 'Add New Package'}
          fields={packageFields}
          initialData={editingPackage}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddDialog(false);
            setEditingPackage(null);
          }}
          open={showAddDialog}
        />
      )}
    </div>
  );
};