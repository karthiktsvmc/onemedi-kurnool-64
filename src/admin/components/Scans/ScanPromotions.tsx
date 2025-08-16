import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, Megaphone, Check, Link } from 'lucide-react';

export const ScanPromotions = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);

  const { data: promotions, loading, refetch } = useSupabaseQuery({
    table: 'promotional_strips',
    filters: { module_name: 'scans' },
    orderBy: 'sort_order',
    ascending: true
  });

  const { create: createPromotion, update: updatePromotion, remove: deletePromotion } = useSupabaseMutation({
    table: 'promotional_strips',
    onSuccess: () => {
      refetch();
      setShowAddDialog(false);
      setEditingPromotion(null);
    }
  });

  const promotionFields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'link', label: 'Action Link', type: 'text' as const },
    { name: 'active', label: 'Active', type: 'checkbox' as const },
    { name: 'sort_order', label: 'Sort Order', type: 'number' as const }
  ];

  const columns = [
    {
      key: 'title',
      label: 'Promotion',
      render: (promotion: any) => (
        <div className="flex items-center gap-3">
          {promotion.image_url && (
            <img 
              src={promotion.image_url} 
              alt={promotion.title}
              className="w-12 h-8 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{promotion.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {promotion.description}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'link',
      label: 'Action Link',
      render: (promotion: any) => (
        promotion.link ? (
          <a 
            href={promotion.link} 
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
      render: (promotion: any) => (
        <Badge variant={promotion.active ? 'default' : 'secondary'}>
          {promotion.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (promotion: any) => promotion.sort_order || 0
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (promotion: any) => new Date(promotion.created_at).toLocaleDateString()
    }
  ];

  const handleAdd = () => {
    setEditingPromotion(null);
    setShowAddDialog(true);
  };

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion);
    setShowAddDialog(true);
  };

  const handleDelete = async (promotion: any) => {
    await deletePromotion(promotion.id);
  };

  const handleSubmit = async (data: any) => {
    const promotionData = {
      ...data,
      module_name: 'scans'
    };

    if (editingPromotion) {
      await updatePromotion(editingPromotion.id, promotionData);
    } else {
      await createPromotion(promotionData);
    }
  };

  const stats = {
    total: promotions?.length || 0,
    active: promotions?.filter(promo => promo.active)?.length || 0,
    withLinks: promotions?.filter(promo => promo.link)?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Promotions" value={stats.total.toString()} icon={Megaphone} />
        <StatCard title="Active Promotions" value={stats.active.toString()} icon={Check} />
        <StatCard title="With Links" value={stats.withLinks.toString()} icon={Link} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Promotional Banners</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Promotion
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Scan Promotions"
        data={promotions || []}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      <div style={{ display: 'none' }}>
        <FormDialog
          title="Add Promotion"
          fields={promotionFields}
          onSubmit={handleSubmit}
          trigger={<button>Hidden</button>}
        />
      </div>
    </div>
  );
};