import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface HomeCareService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  sessions: number;
  category_id: string;
  category_name?: string;
  image_url: string;
  city: string;
  state: string;
  pincode: string;
  location_restricted: boolean;
  service_radius_km: number;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export function HomeCareServices() {
  const [services, setServices] = useState<HomeCareService[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<HomeCareService | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch services with category names
      const { data: servicesData, error: servicesError } = await supabase
        .from('homecare_services')
        .select(`
          *,
          homecare_categories(name)
        `)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      // Transform data to include category name
      const transformedServices = servicesData?.map(service => ({
        ...service,
        category_name: service.homecare_categories?.name || 'Unknown'
      })) || [];

      setServices(transformedServices);

      // Fetch categories for form dropdown
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('homecare_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate savings percentage
  const calculateSavings = (mrp: number, price: number) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
    },
    {
      key: 'category_name',
      label: 'Category',
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value: number) => `${value} mins`,
    },
    {
      key: 'sessions',
      label: 'Sessions',
    },
    {
      key: 'location',
      label: 'Location',
      render: (_: any, row: HomeCareService) => (
        <div className="text-sm">
          {row.city && row.state ? `${row.city}, ${row.state}` : 'All Locations'}
        </div>
      ),
    },
    {
      key: 'location_restricted',
      label: 'Location Restricted',
      render: (value: boolean) => (
        <Badge variant={value ? 'destructive' : 'default'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Service Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter service name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter service description'
    },
    {
      name: 'category_id',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: categories.map(cat => ({ value: cat.id, label: cat.name }))
    },
    {
      name: 'price',
      label: 'Price (₹)',
      type: 'number' as const,
      required: true,
      min: 0
    },
    {
      name: 'duration',
      label: 'Duration (minutes)',
      type: 'number' as const,
      required: true,
      min: 1
    },
    {
      name: 'sessions',
      label: 'Number of Sessions',
      type: 'number' as const,
      required: true,
      min: 1,
      placeholder: '1'
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text' as const,
      placeholder: 'https://example.com/image.jpg'
    },
    {
      name: 'city',
      label: 'City',
      type: 'text' as const,
      placeholder: 'Enter city (optional for all locations)'
    },
    {
      name: 'state',
      label: 'State',
      type: 'text' as const,
      placeholder: 'Enter state (optional for all locations)'
    },
    {
      name: 'pincode',
      label: 'Pincode',
      type: 'text' as const,
      placeholder: 'Enter pincode (optional)'
    },
    {
      name: 'location_restricted',
      label: 'Location Restricted',
      type: 'checkbox' as const,
    },
    {
      name: 'service_radius_km',
      label: 'Service Radius (km)',
      type: 'number' as const,
      min: 1,
      placeholder: '5'
    },
    {
      name: 'latitude',
      label: 'Latitude',
      type: 'number' as const,
      placeholder: 'GPS latitude (optional)'
    },
    {
      name: 'longitude',
      label: 'Longitude',
      type: 'number' as const,
      placeholder: 'GPS longitude (optional)'
    }
  ];

  // Handle create service
  const handleCreate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('homecare_services')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service created successfully',
      });

      setShowAddDialog(false);
      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create service',
        variant: 'destructive',
      });
    }
  };

  // Handle update service
  const handleUpdate = async (formData: any) => {
    if (!editingService) return;

    try {
      const { error } = await supabase
        .from('homecare_services')
        .update(formData)
        .eq('id', editingService.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });

      setEditingService(null);
      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service',
        variant: 'destructive',
      });
    }
  };

  // Handle delete service
  const handleDelete = async (service: HomeCareService) => {
    try {
      const { error } = await supabase
        .from('homecare_services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete service',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AdminCard 
        title="Home Care Services" 
        description="Manage home care services, pricing, and availability"
      >
        <DataTable
          title="Home Care Services"
          data={services}
          columns={columns}
          loading={loading}
          onAdd={() => setShowAddDialog(true)}
          onEdit={(service) => setEditingService(service)}
          onDelete={handleDelete}
          onRefresh={fetchData}
          searchPlaceholder="Search services..."
        />
      </AdminCard>

      {/* Add Service Dialog */}
      {showAddDialog && (
        <FormDialog
          title="Add New Service"
          description="Create a new home care service"
          fields={formFields}
          onSubmit={handleCreate}
          trigger={null}
          initialData={{
            sessions: 1,
            location_restricted: true,
            service_radius_km: 5
          }}
        />
      )}

      {/* Edit Service Dialog */}
      {editingService && (
        <FormDialog
          title="Edit Service"
          description="Update service information"
          fields={formFields}
          initialData={editingService}
          onSubmit={handleUpdate}
          trigger={null}
        />
      )}
    </>
  );
}