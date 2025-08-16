import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Upload, Download, Scan, Star, Building, Clock } from 'lucide-react';

export const ScanCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingScan, setEditingScan] = useState<any>(null);

  const { data: scans, loading, refetch } = useSupabaseQuery({
    table: 'scans',
    select: `
      id, name, description, image_url, created_at, mrp, featured, category_id,
      scan_categories!left(name),
      scan_variants!left(
        id,
        price,
        diagnostics_centres!left(name)
      )
    `,
    orderBy: 'created_at',
    ascending: false
  });

  const { data: categories } = useSupabaseQuery({
    table: 'scan_categories',
    select: 'id, name'
  });

  const { create: createScan, update: updateScan, remove: deleteScan } = useSupabaseMutation({
    table: 'scans',
    onSuccess: () => {
      refetch();
      setShowAddDialog(false);
      setEditingScan(null);
    }
  });

  const scanFields = [
    { name: 'name', label: 'Scan Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select' as const, 
      options: categories?.filter(Boolean).map(cat => ({ 
        value: cat?.id || '', 
        label: cat?.name || 'Unknown' 
      })) || [],
      required: true 
    },
    { name: 'mrp', label: 'MRP Price', type: 'number' as const, required: true },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Scan Name',
      render: (_value: any, row: any) => (
        <div className="flex items-center gap-3">
          {row?.image_url && (
            <img src={row.image_url} alt={row.name} className="w-10 h-10 rounded object-cover" />
          )}
          <div>
            <div className="font-medium">{row?.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {row?.description}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (_: any, row: any) => row?.scan_categories?.name || 'N/A'
    },
    {
      key: 'mrp',
      label: 'MRP Price',
      render: (value: number) => `₹${value ?? 0}`
    },
    {
      key: 'variants',
      label: 'Available At',
      render: (_: any, row: any) => (
        <div className="space-y-1">
          {row?.scan_variants?.slice(0, 2).map((variant: any) => (
            <div key={variant.id} className="text-sm">
              {variant?.diagnostics_centres?.name} - ₹{variant?.price}
            </div>
          ))}
          {(row?.scan_variants?.length || 0) > 2 && (
            <div className="text-xs text-muted-foreground">
              +{(row.scan_variants.length - 2)} more centers
            </div>
          )}
        </div>
      )
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAdd = () => {
    setEditingScan(null);
    setShowAddDialog(true);
  };

  const handleEdit = (scan: any) => {
    setEditingScan(scan);
    setShowAddDialog(true);
  };

  const handleDelete = async (scan: any) => {
    await deleteScan(scan.id);
  };

  const handleSubmit = async (data: any) => {
    if (editingScan) {
      await updateScan(editingScan.id, data);
    } else {
      await createScan(data);
    }
  };

  const filteredScans = scans?.filter(scan =>
    scan?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const stats = {
    total: scans?.length || 0,
    featured: scans?.filter(scan => scan.featured)?.length || 0,
    withVariants: scans?.filter(scan => scan.scan_variants?.length > 0)?.length || 0,
    recent: scans?.filter(scan => {
      const created = new Date(scan.created_at);
      const week = new Date();
      week.setDate(week.getDate() - 7);
      return created > week;
    })?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Scans" value={stats.total.toString()} icon={Scan} />
        <StatCard title="Featured Scans" value={stats.featured.toString()} icon={Star} />
        <StatCard title="With Centers" value={stats.withVariants.toString()} icon={Building} />
        <StatCard title="Recent Scans" value={stats.recent.toString()} icon={Clock} />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search scans..."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Scan
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="Scans Catalogue"
        data={filteredScans}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Hidden trigger for FormDialog */}
      <div style={{ display: 'none' }}>
        <FormDialog
          title="Add New Scan"
          fields={scanFields}
          onSubmit={handleSubmit}
          trigger={<button>Hidden</button>}
        />
      </div>
    </div>
  );
};