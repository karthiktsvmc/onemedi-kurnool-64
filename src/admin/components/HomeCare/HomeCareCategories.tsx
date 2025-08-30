import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface HomeCareCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  service_count?: number;
  created_at: string;
  updated_at: string;
}

export function HomeCareCategories() {
  const [categories, setCategories] = useState<HomeCareCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<HomeCareCategory | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  // Fetch categories with service count
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('homecare_categories')
        .select(`
          *,
          homecare_services(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include service count
      const transformedCategories = data?.map(category => ({
        ...category,
        service_count: category.homecare_services?.length || 0
      })) || [];

      setCategories(transformedCategories);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Table columns
  const columns = [
    {
      key: 'image_url',
      label: 'Image',
      render: (value: string) => (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {value ? (
            <img 
              src={value} 
              alt="Category" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                img.parentElement!.classList.add('bg-muted');
                img.parentElement!.innerHTML = '📋';
              }}
            />
          ) : (
            <span className="text-2xl">📋</span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || 'No description'}
        </div>
      ),
    },
    {
      key: 'service_count',
      label: 'Services',
      render: (value: number) => (
        <Badge variant="secondary">{value} services</Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Category Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter category name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter category description'
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text' as const,
      placeholder: 'https://example.com/image.jpg'
    }
  ];

  // Handle create category
  const handleCreate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('homecare_categories')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category created successfully',
      });

      setShowAddDialog(false);
      await fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  // Handle update category
  const handleUpdate = async (formData: any) => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('homecare_categories')
        .update(formData)
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });

      setEditingCategory(null);
      await fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  // Handle delete category
  const handleDelete = async (category: HomeCareCategory) => {
    try {
      // Check if category has services
      const { data: services, error: checkError } = await supabase
        .from('homecare_services')
        .select('id')
        .eq('category_id', category.id)
        .limit(1);

      if (checkError) throw checkError;

      if (services && services.length > 0) {
        toast({
          title: 'Cannot Delete',
          description: 'This category has associated services. Please remove or reassign services first.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('homecare_categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });

      await fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AdminCard 
        title="Home Care Categories" 
        description="Manage service categories for organizing home care services"
      >
        <DataTable
          title="Home Care Categories"
          description="Manage service categories for organizing home care services"
          data={categories}
          columns={columns}
          loading={loading}
          onAdd={() => setShowAddDialog(true)}
          onEdit={(category) => setEditingCategory(category)}
          onDelete={handleDelete}
          onRefresh={fetchCategories}
          searchPlaceholder="Search categories..."
        />
      </AdminCard>

      {/* Add Category Dialog */}
      {showAddDialog && (
        <FormDialog
          title="Add New Category"
          description="Create a new service category"
          fields={formFields}
          onSubmit={handleCreate}
          trigger={null}
        />
      )}

      {/* Edit Category Dialog */}
      {editingCategory && (
        <FormDialog
          title="Edit Category"
          description="Update category information"
          fields={formFields}
          initialData={editingCategory}
          onSubmit={handleUpdate}
          trigger={null}
        />
      )}
    </>
  );
}