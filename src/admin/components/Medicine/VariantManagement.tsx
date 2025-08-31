import { useState } from 'react';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';

const variantsTable = new SupabaseTable('medicine_variants');

interface VariantManagementProps {
  medicines: any[];
}

export const VariantManagement = ({ medicines }: VariantManagementProps) => {
  const {
    data: variants,
    loading: variantsLoading,
    createItem: createVariant,
    updateItem: updateVariant,
    deleteItem: deleteVariant,
    searchItems: searchVariants,
    refetch: refetchVariants
  } = useSupabaseTable(variantsTable, { realtime: true });

  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Variant Name', sortable: true },
    {
      key: 'medicine_id',
      label: 'Parent Product',
      render: (value: any) => {
        const medicine = medicines.find(m => m.id === value);
        return medicine ? medicine.name : 'Unknown';
      }
    },
    { key: 'strength', label: 'Strength' },
    { key: 'pack_size', label: 'Pack Size' },
    { key: 'dosage_form', label: 'Dosage Form' },
    { 
      key: 'mrp', 
      label: 'MRP',
      render: (value: any) => `₹${value}`
    },
    { 
      key: 'sale_price', 
      label: 'Sale Price',
      render: (value: any) => `₹${value}`
    },
    { 
      key: 'active', 
      label: 'Status',
      render: (value: any) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const formFields = [
    { 
      name: 'medicine_id', 
      label: 'Parent Product', 
      type: 'select' as const, 
      required: true,
      options: medicines.map(m => ({ value: m.id, label: m.name }))
    },
    { name: 'sku', label: 'SKU', type: 'text' as const, required: true },
    { name: 'name', label: 'Variant Name', type: 'text' as const, required: true },
    { name: 'strength', label: 'Strength (e.g., 500mg)', type: 'text' as const },
    { name: 'pack_size', label: 'Pack Size (e.g., 10 tablets)', type: 'text' as const },
    { 
      name: 'dosage_form', 
      label: 'Dosage Form', 
      type: 'select' as const,
      options: [
        { value: 'tablet', label: 'Tablet' },
        { value: 'capsule', label: 'Capsule' },
        { value: 'syrup', label: 'Syrup' },
        { value: 'injection', label: 'Injection' },
        { value: 'cream', label: 'Cream' },
        { value: 'ointment', label: 'Ointment' },
        { value: 'drops', label: 'Drops' },
        { value: 'inhaler', label: 'Inhaler' },
        { value: 'powder', label: 'Powder' },
        { value: 'other', label: 'Other' }
      ]
    },
    { name: 'mrp', label: 'MRP (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { name: 'sale_price', label: 'Sale Price (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { name: 'cost_price', label: 'Cost Price (₹)', type: 'number' as const, min: 0, step: 0.01 },
    { name: 'weight', label: 'Weight (grams)', type: 'number' as const, min: 0, step: 0.01 },
    { name: 'active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <DataTable
      title="Product Variants"
      description="Manage different variants of your products (strengths, pack sizes, etc.)"
      data={variants}
      columns={columns}
      loading={variantsLoading}
      onSearch={(query) => searchVariants(query, ['sku', 'name', 'strength', 'pack_size'])}
      onDelete={(item) => deleteVariant(item.id)}
      onRefresh={refetchVariants}
      searchPlaceholder="Search variants..."
      renderActions={(item) => (
        <FormDialog
          title="Edit Variant"
          fields={formFields}
          initialData={item}
          onSubmit={async (data) => {
            await updateVariant(item.id, data);
          }}
          trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
        />
      )}
      actions={
        <FormDialog
          title="Add Product Variant"
          fields={formFields}
          onSubmit={async (data) => {
            await createVariant(data);
          }}
          trigger={<Button size="sm">Add Variant</Button>}
        />
      }
    />
  );
};