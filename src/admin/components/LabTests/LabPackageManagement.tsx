import { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { AdminCard } from '../shared/AdminCard';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLabCategories } from '@/shared/services/lab-tests.service';
import { Badge } from '@/shared/components/ui/badge';

export const LabPackageManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const { data: packages, loading, refetch } = useSupabaseQuery({
    table: 'lab_packages',
    select: `
      *,
      category:lab_categories(id, name)
    `,
  });

  const { categories } = useLabCategories();

  const packageMutation = useSupabaseMutation({
    table: 'lab_packages',
    onSuccess: () => refetch(),
  });

  const packageFields = [
    { name: 'name', label: 'Package Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select' as const, 
      required: true,
      options: categories?.map(cat => ({ value: cat.id, label: cat.name })) || []
    },
    { name: 'mrp', label: 'MRP (₹)', type: 'number' as const, required: true, min: 0 },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'home_collection_available', label: 'Home Collection Available', type: 'boolean' as const },
    { name: 'fasting_required', label: 'Fasting Required', type: 'boolean' as const },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Package Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={value} className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.description}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: any) => value?.name || 'Uncategorized'
    },
    { 
      key: 'mrp', 
      label: 'MRP',
      render: (value: number) => `₹${value}`
    },
    { 
      key: 'home_collection_available', 
      label: 'Home Collection',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Available' : 'Not Available'}
        </Badge>
      )
    },
    { 
      key: 'fasting_required', 
      label: 'Fasting',
      render: (value: boolean) => (
        <Badge variant={value ? 'destructive' : 'secondary'}>
          {value ? 'Required' : 'Not Required'}
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
    setEditingPackage(null);
    setShowAddDialog(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    await packageMutation.remove(id);
  };

  const handleSubmit = async (data: any) => {
    if (editingPackage) {
      await packageMutation.update(editingPackage.id, data);
    } else {
      await packageMutation.create(data);
    }
    setShowAddDialog(false);
    setEditingPackage(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard title="Total Packages" className="text-center">
          <div className="text-2xl font-bold text-primary">{packages?.length || 0}</div>
        </AdminCard>
        <AdminCard title="Home Collection" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {packages?.filter(pkg => pkg.home_collection_available).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Fasting Required" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {packages?.filter(pkg => pkg.fasting_required).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Average Price" className="text-center">
          <div className="text-2xl font-bold text-primary">
            ₹{packages?.length ? Math.round(packages.reduce((acc, pkg) => acc + pkg.mrp, 0) / packages.length) : 0}
          </div>
        </AdminCard>
      </div>

      {/* Data Table */}
      <DataTable
        title="Lab Packages & Panels"
        description="Manage bundled health packages with multiple tests"
        data={packages || []}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search packages..."
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingPackage ? 'Edit Package' : 'Add New Package'}
          description={editingPackage ? 'Update package information' : 'Create a new health package'}
          fields={packageFields}
          initialData={editingPackage}
          onSubmit={handleSubmit}
          trigger={<div />}
        />
      )}
    </div>
  );
};