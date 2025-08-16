import { useState } from 'react';
import { Plus, Image } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { AdminCard } from '../shared/AdminCard';
import { useLabCategories } from '@/shared/services/lab-tests.service';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';

export const LabTestCategories = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { categories, loading, refetch } = useLabCategories();
  const categoryMutation = useSupabaseMutation({
    table: 'lab_categories',
    onSuccess: () => refetch(),
  });

  const categoryFields = [
    { name: 'name', label: 'Category Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Category Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={value} className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
              <Image className="h-5 w-5 text-muted-foreground" />
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
      key: 'created_at', 
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleAdd = () => {
    setEditingCategory(null);
    setShowAddDialog(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    await categoryMutation.remove(id);
  };

  const handleSubmit = async (data: any) => {
    if (editingCategory) {
      await categoryMutation.update(editingCategory.id, data);
    } else {
      await categoryMutation.create(data);
    }
    setShowAddDialog(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard title="Total Categories" className="text-center">
          <div className="text-2xl font-bold text-primary">{categories?.length || 0}</div>
        </AdminCard>
        <AdminCard title="Categories with Images" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {categories?.filter(cat => cat.image_url).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Recent Categories" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {categories?.filter(cat => 
              new Date(cat.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length || 0}
          </div>
        </AdminCard>
      </div>

      {/* Data Table */}
      <DataTable
        title="Lab Test Categories"
        description="Organize lab tests into categories for better navigation"
        data={categories || []}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search categories..."
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
          description={editingCategory ? 'Update category information' : 'Create a new lab test category'}
          fields={categoryFields}
          initialData={editingCategory}
          onSubmit={handleSubmit}
          trigger={<div />}
        />
      )}
    </div>
  );
};