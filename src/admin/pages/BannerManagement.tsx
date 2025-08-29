import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { DataTable } from '../components/shared/DataTable';
import { FormDialog } from '../components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye, ArrowUp, ArrowDown, Image, Monitor, Smartphone } from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation } from '@/shared/hooks/useSupabaseQuery';

interface BannerFormData {
  title: string;
  subtitle?: string;
  image_url: string;
  link?: string;
  sort_order: number;
  active: boolean;
}

export default function BannerManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('hero');

  // Fetch banners based on type
  const { data: heroBanners = [], refetch: refetchHero } = useSupabaseQuery(
    'hero_banners',
    {
      select: '*',
      orderBy: 'sort_order',
      ascending: true
    }
  );

  const { data: promotionalStrips = [], refetch: refetchPromo } = useSupabaseQuery(
    'promotional_strips',
    {
      select: '*',
      orderBy: 'sort_order',
      ascending: true
    }
  );

  // Mutations
  const { mutate: createHero } = useSupabaseMutation('hero_banners', {
    onSuccess: () => {
      refetchHero();
      setIsAddDialogOpen(false);
    }
  });

  const { mutate: updateHero } = useSupabaseMutation('hero_banners', {
    onSuccess: () => {
      refetchHero();
      setEditingBanner(null);
    }
  });

  const { mutate: removeHero } = useSupabaseMutation('hero_banners', {
    onSuccess: refetchHero
  });

  const { mutate: createPromo } = useSupabaseMutation('promotional_strips', {
    onSuccess: () => {
      refetchPromo();
      setIsAddDialogOpen(false);
    }
  });

  const { mutate: updatePromo } = useSupabaseMutation('promotional_strips', {
    onSuccess: () => {
      refetchPromo();
      setEditingBanner(null);
    }
  });

  const { mutate: removePromo } = useSupabaseMutation('promotional_strips', {
    onSuccess: refetchPromo
  });

  const heroBannerFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text' },
    { name: 'image_url', label: 'Image URL', type: 'url', required: true },
    { name: 'link', label: 'Link URL', type: 'url' },
    { name: 'sort_order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
  ];

  const promoStripFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Image URL', type: 'url' },
    { name: 'link', label: 'Link URL', type: 'url' },
    { name: 'module_name', label: 'Module', type: 'select', options: [
      { value: 'global', label: 'Global' },
      { value: 'medicines', label: 'Medicines' },
      { value: 'lab-tests', label: 'Lab Tests' },
      { value: 'scans', label: 'Scans' },
      { value: 'doctors', label: 'Doctors' },
      { value: 'homecare', label: 'Home Care' }
    ]},
    { name: 'sort_order', label: 'Display Order', type: 'number', defaultValue: 0 },
    { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
  ];

  const createBannerColumns = (type: 'hero' | 'promo') => [
    {
      header: 'Preview',
      accessorKey: 'image_url',
      cell: ({ row }: any) => (
        <div className="w-16 h-10 bg-muted rounded overflow-hidden">
          {row.original.image_url ? (
            <img 
              src={row.original.image_url} 
              alt={row.original.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Content',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          {row.original.subtitle && (
            <p className="text-sm text-muted-foreground">{row.original.subtitle}</p>
          )}
          {row.original.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{row.original.description}</p>
          )}
        </div>
      )
    },
    {
      header: 'Order',
      accessorKey: 'sort_order',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <span className="font-mono text-sm">{row.original.sort_order}</span>
          <div className="flex flex-col gap-1">
            <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'active',
      cell: ({ row }: any) => (
        <Badge variant={row.original.active ? 'default' : 'secondary'}>
          {row.original.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleEdit(row.original, type)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.original.id, type)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleAdd = (type: 'hero' | 'promo') => {
    setEditingBanner({ type });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (banner: any, type: 'hero' | 'promo') => {
    setEditingBanner({ ...banner, type });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string, type: 'hero' | 'promo') => {
    if (confirm('Are you sure you want to delete this banner?')) {
      if (type === 'hero') {
        removeHero({ id });
      } else {
        removePromo({ id });
      }
    }
  };

  const handleSubmit = (data: any) => {
    const { type, ...formData } = data;
    
    if (editingBanner?.id) {
      if (type === 'hero') {
        updateHero({ id: editingBanner.id, ...formData });
      } else {
        updatePromo({ id: editingBanner.id, ...formData });
      }
    } else {
      if (type === 'hero') {
        createHero(formData);
      } else {
        createPromo(formData);
      }
    }
  };

  const currentFields = editingBanner?.type === 'hero' ? heroBannerFields : promoStripFields;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Management"
        description="Manage hero banners, promotional strips, and visual content"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Hero Banners"
          value={heroBanners.filter(b => b.active).length.toString()}
          icon={Monitor}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Promo Strips"
          value={promotionalStrips.filter(p => p.active).length.toString()}
          icon={Smartphone}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Views"
          value="1.2M"
          icon={Eye}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Click Rate"
          value="3.8%"
          icon={ArrowUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Banner Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="hero">Hero Banners</TabsTrigger>
            <TabsTrigger value="promo">Promotional Strips</TabsTrigger>
          </TabsList>
          <Button onClick={() => handleAdd(selectedTab as 'hero' | 'promo')}>
            <Plus className="h-4 w-4 mr-2" />
            Add {selectedTab === 'hero' ? 'Hero Banner' : 'Promo Strip'}
          </Button>
        </div>

        <TabsContent value="hero" className="space-y-4">
          <AdminCard>
            <DataTable
              data={heroBanners}
              columns={createBannerColumns('hero')}
              searchKey="title"
              searchPlaceholder="Search hero banners..."
            />
          </AdminCard>
        </TabsContent>

        <TabsContent value="promo" className="space-y-4">
          <AdminCard>
            <DataTable
              data={promotionalStrips}
              columns={createBannerColumns('promo')}
              searchKey="title"
              searchPlaceholder="Search promotional strips..."
            />
          </AdminCard>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Banner Dialog */}
      <FormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title={editingBanner?.id ? 'Edit Banner' : 'Add New Banner'}
        description="Create or modify banner content and settings"
        fields={currentFields}
        defaultValues={editingBanner}
        onSubmit={handleSubmit}
      />
    </div>
  );
}