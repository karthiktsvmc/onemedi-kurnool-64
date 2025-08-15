
import React from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';

const hospitalsTable = new SupabaseTable('hospitals');

export default function HospitalManagement() {
  const hospitals = useSupabaseTable(hospitalsTable);

  const columns = [
    { key: 'name', label: 'Hospital Name' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'contact', label: 'Contact' },
    { key: 'emergency_services', label: 'Emergency Services' },
  ];

  const formFields = [
    { name: 'name', label: 'Hospital Name', type: 'text' as const, required: true },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'state', label: 'State', type: 'text' as const, required: true },
    { name: 'pincode', label: 'Pincode', type: 'text' as const, required: true },
    { name: 'contact', label: 'Contact', type: 'text' as const },
    { name: 'lat', label: 'Latitude', type: 'number' as const },
    { name: 'lng', label: 'Longitude', type: 'number' as const },
    { name: 'emergency_services', label: 'Emergency Services', type: 'checkbox' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const handleCreate = async (data: any): Promise<void> => {
    await hospitals.createItem(data);
  };

  const handleUpdate = async (item: any, data: any): Promise<void> => {
    await hospitals.updateItem(item.id, data);
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Hospital Management" 
        description="Manage hospital listings and information"
      />

      <DataTable
        title="Hospitals"
        data={hospitals.data}
        columns={columns}
        loading={hospitals.loading}
        onDelete={(item) => hospitals.deleteItem(item.id)}
        renderActions={(item) => (
          <FormDialog
            title="Edit Hospital"
            fields={formFields}
            initialData={item}
            onSubmit={(data) => handleUpdate(item, data)}
            trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
          />
        )}
      />

      <FormDialog
        title="Add Hospital"
        fields={formFields}
        onSubmit={handleCreate}
        trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Hospital</button>}
      />
    </div>
  );
}
