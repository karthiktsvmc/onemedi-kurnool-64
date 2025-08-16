import { useState } from 'react';
import { Plus, Megaphone, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { AdminCard } from '../shared/AdminCard';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { Badge } from '@/shared/components/ui/badge';

export const LabPromotionManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const { data: promotions, loading, refetch } = useSupabaseQuery({
    table: 'promotional_strips',
    select: '*',
    filters: { module_name: 'lab-tests' },
  });

  const promotionMutation = useSupabaseMutation({
    table: 'promotional_strips',
    onSuccess: () => refetch(),
  });

  const promotionFields = [
    { name: 'title', label: 'Promotion Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'link', label: 'Link URL', type: 'text' as const },
    { name: 'sort_order', label: 'Sort Order', type: 'number' as const, defaultValue: 0 },
    { name: 'active', label: 'Active', type: 'boolean' as const },
  ];

  const columns = [
    { 
      key: 'title', 
      label: 'Promotion Title',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={value} className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-muted-foreground" />
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
      key: 'link', 
      label: 'Link',
      render: (value: string) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          View Link
        </a>
      ) : '-'
    },
    { 
      key: 'sort_order', 
      label: 'Order'
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
    setEditingPromotion(null);
    setShowAddDialog(true);
  };

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    await promotionMutation.remove(id);
  };

  const handleSubmit = async (data: any) => {
    const promotionData = { ...data, module_name: 'lab-tests' };
    
    if (editingPromotion) {
      await promotionMutation.update(editingPromotion.id, promotionData);
    } else {
      await promotionMutation.create(promotionData);
    }
    setShowAddDialog(false);
    setEditingPromotion(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminCard title="Total Promotions" className="text-center">
          <div className="text-2xl font-bold text-primary">{promotions?.length || 0}</div>
        </AdminCard>
        <AdminCard title="Active Promotions" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {promotions?.filter(promo => promo.active).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="With Links" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {promotions?.filter(promo => promo.link).length || 0}
          </div>
        </AdminCard>
      </div>

      {/* Data Table */}
      <DataTable
        title="Lab Test Promotions"
        description="Manage promotional banners and campaigns for lab tests"
        data={promotions || []}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search promotions..."
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
          description={editingPromotion ? 'Update promotion information' : 'Create a new lab test promotion'}
          fields={promotionFields}
          initialData={editingPromotion}
          onSubmit={handleSubmit}
          trigger={<div />}
        />
      )}
    </div>
  );
};