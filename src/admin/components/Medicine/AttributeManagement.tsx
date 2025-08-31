import { useState } from 'react';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';

const attributesTable = new SupabaseTable('medicine_attributes');

export const AttributeManagement = () => {
  const {
    data: attributes,
    loading: attributesLoading,
    createItem: createAttribute,
    updateItem: updateAttribute,
    deleteItem: deleteAttribute,
    searchItems: searchAttributes,
    refetch: refetchAttributes
  } = useSupabaseTable(attributesTable, { realtime: true });

  const columns = [
    { key: 'name', label: 'Attribute Name', sortable: true },
    { key: 'label', label: 'Display Label', sortable: true },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: any) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    { 
      key: 'required', 
      label: 'Required',
      render: (value: any) => (
        <Badge variant={value ? 'destructive' : 'secondary'}>
          {value ? 'Required' : 'Optional'}
        </Badge>
      )
    },
    {
      key: 'options',
      label: 'Options',
      render: (value: any) => {
        if (!value || !Array.isArray(value) || value.length === 0) return 'N/A';
        return value.slice(0, 3).join(', ') + (value.length > 3 ? '...' : '');
      }
    }
  ];

  const formFields = [
    { name: 'name', label: 'Attribute Name (internal)', type: 'text' as const, required: true },
    { name: 'label', label: 'Display Label', type: 'text' as const, required: true },
    { 
      name: 'type', 
      label: 'Input Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'text', label: 'Text Input' },
        { value: 'number', label: 'Number Input' },
        { value: 'select', label: 'Single Select' },
        { value: 'multiselect', label: 'Multi Select' },
        { value: 'boolean', label: 'Yes/No (Boolean)' }
      ]
    },
    { name: 'options', label: 'Options (for select types)', type: 'array' as const, description: 'Only for select/multiselect types' },
    { name: 'required', label: 'Required Field', type: 'boolean' as const }
  ];

  return (
    <DataTable
      title="Product Attributes"
      description="Define custom attributes for medicines (e.g., dosage form, therapeutic class)"
      data={attributes}
      columns={columns}
      loading={attributesLoading}
      onSearch={(query) => searchAttributes(query, ['name', 'label'])}
      onDelete={(item) => deleteAttribute(item.id)}
      onRefresh={refetchAttributes}
      searchPlaceholder="Search attributes..."
      renderActions={(item) => (
        <FormDialog
          title="Edit Attribute"
          fields={formFields}
          initialData={item}
          onSubmit={async (data) => {
            await updateAttribute(item.id, data);
          }}
          trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
        />
      )}
      actions={
        <FormDialog
          title="Add Product Attribute"
          fields={formFields}
          onSubmit={async (data) => {
            await createAttribute(data);
          }}
          trigger={<Button size="sm">Add Attribute</Button>}
        />
      }
    />
  );
};