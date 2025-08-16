import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Plus, Tag, Image, Clock } from 'lucide-react';

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
            <div className="text-sm text-muted-foreground line-clamp-2">
              {row?.description}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'scan_count',
      label: 'Scans Count',
      render: (_: any, row: any) => {
        const count = Array.isArray(row?.scans)
          ? row.scans.length
          : (row?.scans?.[0]?.count ?? row?.scans?.count ?? 0);
        return count;
      }
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: any) => new Date(value).toLocaleDateString()
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
        <StatCard title="Total Categories" value={stats.total.toString()} icon={Tag} />
        <StatCard title="Categories with Images" value={stats.withImages.toString()} icon={Image} />
        <StatCard title="Recent Categories" value={stats.recent.toString()} icon={Clock} />
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
      <div style={{ display: 'none' }}>
        <FormDialog
          title="Add Category"
          fields={categoryFields}
          onSubmit={handleSubmit}
          trigger={<button>Hidden</button>}
        />
      </div>
    </div>
  );
};