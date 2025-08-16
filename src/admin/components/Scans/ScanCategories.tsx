import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export const ScanCategories = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categories, loading, refetch } = useSupabaseQuery({
    table: 'scan_categories',
    select: `
      *,
      scans(count)
    `,
    orderBy: 'created_at',
    ascending: false
  });

  const { create: createCategory, update: updateCategory, remove: deleteCategory } = useSupabaseMutation({
    table: 'scan_categories',
    onSuccess: () => {
      refetch();
      setShowAddDialog(false);
      setEditingCategory(null);
    }
  });

  const categoryFields = [
    { name: 'name', label: 'Category Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (category: any) => (
        <div className="flex items-center gap-3">
          {category.image_url && (
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'scan_count',
      label: 'Scans Count',
      render: (category: any) => category.scans?.length || 0
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (category: any) => new Date(category.created_at).toLocaleDateString()
    }
  ];

  const handleAdd = () => {
    setEditingCategory(null);
    setShowAddDialog(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowAddDialog(true);
  };

  const handleDelete = async (category: any) => {
    await deleteCategory(category.id);
  };

  const handleSubmit = async (data: any) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
  };

  const stats = {
    total: categories?.length || 0,
    withImages: categories?.filter(cat => cat.image_url)?.length || 0,
    recent: categories?.filter(cat => {
      const created = new Date(cat.created_at);
      const week = new Date();
      week.setDate(week.getDate() - 7);
      return created > week;
    })?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard title="Total Categories" value={stats.total} icon="tag" />
        <AdminCard title="Categories with Images" value={stats.withImages} icon="image" />
        <AdminCard title="Recent Categories" value={stats.recent} icon="clock" />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Scan Categories</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Scan Categories"
        data={categories || []}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
          fields={categoryFields}
          initialData={editingCategory}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddDialog(false);
            setEditingCategory(null);
          }}
          open={showAddDialog}
        />
      )}
    </div>
  );
};