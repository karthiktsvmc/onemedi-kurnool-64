
import React, { useState } from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Ambulance, Clock, Phone, MapPin } from 'lucide-react';

const ambulanceServicesTable = new SupabaseTable('ambulance_services');

export default function AmbulanceManagement() {
  const ambulanceServices = useSupabaseTable(ambulanceServicesTable);

  const columns = [
    { key: 'name', label: 'Service Name' },
    { key: 'city', label: 'City' },
    { key: 'vehicle_type', label: 'Vehicle Type' },
    { key: 'price', label: 'Price' },
    { key: 'available_24x7', label: '24x7 Available' },
  ];

  const formFields = [
    { name: 'name', label: 'Service Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'contact', label: 'Contact', type: 'text' as const },
    { name: 'vehicle_type', label: 'Vehicle Type', type: 'text' as const },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'available_24x7', label: '24x7 Available', type: 'checkbox' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const handleCreate = async (data: any): Promise<void> => {
    await ambulanceServices.createItem(data);
  };

  const handleUpdate = async (item: any, data: any): Promise<void> => {
    await ambulanceServices.updateItem(item.id, data);
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Ambulance Management" 
        description="Manage ambulance services and their details"
      />

      <DataTable
        title="Ambulance Services"
        data={ambulanceServices.data}
        columns={columns}
        loading={ambulanceServices.loading}
        onDelete={(item) => ambulanceServices.deleteItem(item.id)}
        renderActions={(item) => (
          <FormDialog
            title="Edit Ambulance Service"
            fields={formFields}
            initialData={item}
            onSubmit={(data) => handleUpdate(item, data)}
            trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
          />
        )}
      />

      <FormDialog
        title="Add Ambulance Service"
        fields={formFields}
        onSubmit={handleCreate}
        trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Service</button>}
      />
    </div>
  );
}
