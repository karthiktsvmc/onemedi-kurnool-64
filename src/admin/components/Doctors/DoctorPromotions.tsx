import React, { useState } from 'react';
import { Plus, Search, Megaphone, Star, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { StatCard } from '@/admin/components/shared/StatCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useToast } from '@/shared/hooks/use-toast';

export function DoctorPromotions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: promotions, loading, refetch } = useSupabaseQuery({
    table: 'doctor_promotional_strips',
    select: `
      id, title, description, image_url, link, active, sort_order, created_at,
      doctor_specialties(name)
    `,
    orderBy: 'sort_order',
  });

  const { data: specialties } = useSupabaseQuery({
    table: 'doctor_specialties',
    select: 'id, name',
    filters: { active: true },
  });

  const { create, update, remove } = useSupabaseMutation({
    table: 'doctor_promotional_strips',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: editingItem ? "Promotion updated successfully" : "Promotion created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredPromotions = promotions?.filter(promotion =>
    promotion.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.doctor_specialties?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPromotions = promotions?.length || 0;
  const activePromotions = promotions?.filter(p => p.active)?.length || 0;
  const specialtyPromotions = promotions?.filter(p => p.specialty_id)?.length || 0;

  const formFields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'specialty_id', 
      label: 'Specialty (Optional)', 
      type: 'select' as const, 
      options: [
        { value: '', label: 'All Specialties' },
        ...(specialties?.map(s => ({ value: s.id, label: s.name })) || [])
      ]
    },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'link', label: 'Link URL', type: 'text' as const },
    { name: 'sort_order', label: 'Sort Order', type: 'number' as const },
    { name: 'active', label: 'Active', type: 'boolean' as const },
  ];

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{value}</span>
          {row.description && (
            <span className="text-sm text-muted-foreground line-clamp-2">{row.description}</span>
          )}
        </div>
      )
    },
    { 
      key: 'specialty',
      label: 'Specialty', 
      render: (_: any, row: any) => (
        <Badge variant="outline">
          {row.doctor_specialties?.name || 'All Specialties'}
        </Badge>
      )
    },
    { 
      key: 'sort_order', 
      label: 'Order',
      render: (value: number) => value || 0
    },
    { 
      key: 'active', 
      label: 'Status', 
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
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

  const handleSubmit = async (data: any) => {
    // Handle empty specialty_id
    if (data.specialty_id === '') {
      data.specialty_id = null;
    }
    
    if (editingItem) {
      await update(editingItem.id, data);
    } else {
      await create(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem({
      ...item,
      specialty_id: item.specialty_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Promotions"
          value={totalPromotions}
          icon="megaphone"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Promotions"
          value={activePromotions}
          icon="eye"
          iconColor="text-green-600"
        />
        <StatCard
          title="Specialty Promotions"
          value={specialtyPromotions}
          icon="star"
          iconColor="text-purple-600"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search promotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Promotion
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Doctor Promotions"
        description="Manage promotional strips and banners for doctors"
        data={filteredPromotions}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {/* Form Dialog */}
      {isDialogOpen && (
        <FormDialog
          title={editingItem ? "Edit Promotion" : "Add New Promotion"}
          fields={formFields}
          initialData={editingItem}
          onSubmit={handleSubmit}
          trigger={<Button style={{ display: 'none' }}>Hidden</Button>}
        />
      )}
    </div>
  );
}