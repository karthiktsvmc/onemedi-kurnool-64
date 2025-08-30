import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { DataTable } from '@/admin/components/shared/DataTable';
import { Image, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

export function BannerManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const { data: banners, loading, refetch } = useSupabaseQuery({
    table: 'hero_banners',
    select: '*',
    orderBy: 'sort_order',
    ascending: true,
  });

  const { create, update, remove, loading: mutationLoading } = useSupabaseMutation({
    table: 'hero_banners',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingBanner(null);
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const data = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      image_url: formData.get('image_url'),
      link: formData.get('link'),
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      active: formData.get('active') === 'true',
    };

    if (editingBanner) {
      await update(editingBanner.id, data);
    } else {
      await create(data);
    }
  };

  const updateSortOrder = async (id: string, direction: 'up' | 'down') => {
    const banner = banners?.find(b => b.id === id);
    if (!banner) return;

    const newSortOrder = direction === 'up' 
      ? Math.max(0, banner.sort_order - 1)
      : banner.sort_order + 1;

    await update(id, { sort_order: newSortOrder });
  };

  const toggleActive = async (id: string, active: boolean) => {
    await update(id, { active: !active });
  };

  const columns = [
    {
      key: 'image_url',
      label: 'Preview',
      render: (value: any) => (
        <div className="w-16 h-10 bg-muted rounded overflow-hidden">
          {value ? (
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'subtitle',
      label: 'Subtitle',
      render: (value: any) => (
        <div className="max-w-xs truncate text-muted-foreground">
          {value || 'No subtitle'}
        </div>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-1">
          <span className="text-sm">{value}</span>
          <div className="flex flex-col">
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => updateSortOrder(row.id, 'up')}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => updateSortOrder(row.id, 'down')}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'active',
      label: 'Status',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => toggleActive(row.id, value)}
          >
            {value ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
    {
      key: 'link',
      label: 'Link',
      render: (value: any) => {
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            View Link
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">No link</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {banners?.filter(b => b.active).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Banners</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {banners?.filter(b => !b.active).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hero Banners</CardTitle>
              <CardDescription>
                Manage promotional banners and hero images
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              Create Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            title="Banners"
            columns={columns}
            data={banners || []}
            loading={loading}
            onEdit={(banner) => {
              setEditingBanner(banner);
              setIsDialogOpen(true);
            }}
            onDelete={(banner) => remove(banner.id)}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <h3 className="text-lg font-semibold">{editingBanner ? 'Edit Banner' : 'Create Banner'}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingBanner?.title}
                  placeholder="Your Health, Our Priority"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editingBanner?.subtitle}
                  placeholder="Get medicines, lab tests, and scans delivered to your doorstep"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  defaultValue={editingBanner?.image_url}
                  placeholder="https://example.com/banner.jpg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  name="link"
                  defaultValue={editingBanner?.link}
                  placeholder="/medicines or https://example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    defaultValue={editingBanner?.sort_order || 0}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="active">Status</Label>
                  <Select name="active" defaultValue={editingBanner?.active ? 'true' : 'false'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSubmit(new FormData())} disabled={mutationLoading}>
                  {mutationLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}