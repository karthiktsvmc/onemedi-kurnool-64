
import React from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';

const bloodBanksTable = new SupabaseTable('blood_banks');

export default function BloodBankManagement() {
  const bloodBanks = useSupabaseTable(bloodBanksTable);

  const columns = [
    { key: 'name', label: 'Blood Bank Name' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'contact', label: 'Contact' },
    { key: 'emergency_contact', label: 'Emergency Contact' },
  ];

  const formFields = [
    { name: 'name', label: 'Blood Bank Name', type: 'text' as const, required: true },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'state', label: 'State', type: 'text' as const, required: true },
    { name: 'pincode', label: 'Pincode', type: 'text' as const, required: true },
    { name: 'contact', label: 'Contact', type: 'text' as const },
    { name: 'emergency_contact', label: 'Emergency Contact', type: 'text' as const },
    { name: 'lat', label: 'Latitude', type: 'number' as const },
    { name: 'lng', label: 'Longitude', type: 'number' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  return (
    <div className="p-6">
      <PageHeader 
        title="Blood Bank Management" 
        description="Manage blood bank listings and contact information"
      />

      <DataTable
        title="Blood Banks"
        data={bloodBanks.data}
        columns={columns}
        loading={bloodBanks.loading}
        onDelete={bloodBanks.deleteItem}
        renderActions={(item) => (
          <FormDialog
            title="Edit Blood Bank"
            fields={formFields}
            initialData={item}
            onSubmit={(data) => bloodBanks.updateItem(item.id, data)}
            trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
          />
        )}
      />

      <FormDialog
        title="Add Blood Bank"
        fields={formFields}
        onSubmit={bloodBanks.createItem}
        trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Blood Bank</button>}
      />
    </div>
  );
}
