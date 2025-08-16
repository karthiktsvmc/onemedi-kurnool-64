import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Plus, Layers, Scan, Building, DollarSign } from 'lucide-react';

export const ScanVariants = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);

  const { data: variants, loading, refetch } = useSupabaseQuery({
    table: 'scan_variants',
    select: `
      *,
      scans(name),
      diagnostics_centres(name, city)
    `,
    orderBy: 'created_at',
    ascending: false
  });

  const { data: scans } = useSupabaseQuery({
    table: 'scans',
    select: 'id, name'
  });

  const { data: centres } = useSupabaseQuery({
    table: 'diagnostics_centres',
    select: 'id, name, city',
    filters: { active: true }
  });

  const { create: createVariant, update: updateVariant, remove: deleteVariant } = useSupabaseMutation({
    table: 'scan_variants',
    onSuccess: () => {
      refetch();
      setShowAddDialog(false);
      setEditingVariant(null);
    }
  });

  const variantFields = [
    { 
      name: 'scan_id', 
      label: 'Scan', 
      type: 'select' as const, 
      options: scans?.filter(Boolean).map(scan => ({ 
        value: scan?.id || '', 
        label: scan?.name || 'Unknown' 
      })) || [],
      required: true 
    },
    { 
      name: 'diagnostic_centre_id', 
      label: 'Diagnostic Centre', 
      type: 'select' as const, 
      options: centres?.filter(Boolean).map(centre => ({ 
        value: centre?.id || '', 
        label: `${centre?.name || 'Unknown'} - ${centre?.city || ''}` 
      })) || [],
      required: true 
    },
    { name: 'price', label: 'Price', type: 'number' as const, required: true }
  ];

  const columns = [
    {
      key: 'scan',
      label: 'Scan',
      render: (variant: any) => variant.scans?.name || 'N/A'
    },
    {
      key: 'centre',
      label: 'Diagnostic Centre',
      render: (variant: any) => (
        <div>
          <div className="font-medium">{variant.diagnostics_centres?.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">
            {variant.diagnostics_centres?.city || ''}
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (variant: any) => `₹${variant.price}`
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (variant: any) => new Date(variant.created_at).toLocaleDateString()
    }
  ];

  const handleAdd = () => {
    setEditingVariant(null);
    setShowAddDialog(true);
  };

  const handleEdit = (variant: any) => {
    setEditingVariant(variant);
    setShowAddDialog(true);
  };

  const handleDelete = async (variant: any) => {
    await deleteVariant(variant.id);
  };

  const handleSubmit = async (data: any) => {
    if (editingVariant) {
      await updateVariant(editingVariant.id, data);
    } else {
      await createVariant(data);
    }
  };

  const stats = {
    total: variants?.length || 0,
    uniqueScans: new Set(variants?.map(v => v.scan_id))?.size || 0,
    uniqueCentres: new Set(variants?.map(v => v.diagnostic_centre_id))?.size || 0,
    avgPrice: variants?.length ? Math.round(variants.reduce((sum, v) => sum + (v.price || 0), 0) / variants.length) : 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Variants" value={stats.total.toString()} icon={Layers} />
        <StatCard title="Unique Scans" value={stats.uniqueScans.toString()} icon={Scan} />
        <StatCard title="Unique Centres" value={stats.uniqueCentres.toString()} icon={Building} />
        <StatCard title="Avg Price" value={`₹${stats.avgPrice}`} icon={DollarSign} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Scan Pricing Variants</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Scan Variants"
        data={variants || []}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      <div style={{ display: 'none' }}>
        <FormDialog
          title="Add Variant"
          fields={variantFields}
          onSubmit={handleSubmit}
          trigger={<button>Hidden</button>}
        />
      </div>
    </div>
  );
};