
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
    { name: 'name', label: 'Hospital Name', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'textarea', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode', type: 'text', required: true },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'lat', label: 'Latitude', type: 'number' },
    { name: 'lng', label: 'Longitude', type: 'number' },
    { name: 'emergency_services', label: 'Emergency Services', type: 'checkbox' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
  ];

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
        onDelete={hospitals.deleteItem}
        renderActions={(item) => (
          <FormDialog
            title="Edit Hospital"
            fields={formFields}
            initialData={item}
            onSubmit={(data) => hospitals.updateItem(item.id, data)}
            trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
          />
        )}
      />

      <FormDialog
        title="Add Hospital"
        fields={formFields}
        onSubmit={hospitals.createItem}
        trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Hospital</button>}
      />
    </div>
  );
}
