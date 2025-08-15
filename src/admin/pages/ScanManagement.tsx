
import React from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const scanCategoriesTable = new SupabaseTable('scan_categories');
const scansTable = new SupabaseTable('scans');
const scanVariantsTable = new SupabaseTable('scan_variants');

export default function ScanManagement() {
  const categories = useSupabaseTable(scanCategoriesTable);
  const scans = useSupabaseTable(scansTable);
  const variants = useSupabaseTable(scanVariantsTable);

  const categoryColumns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
  ];

  const scanColumns = [
    { key: 'name', label: 'Scan Name' },
    { key: 'mrp', label: 'MRP' },
    { key: 'featured', label: 'Featured' },
    { key: 'instructions', label: 'Instructions' },
  ];

  const variantColumns = [
    { key: 'price', label: 'Price' },
    { key: 'scan_id', label: 'Scan ID' },
    { key: 'diagnostic_centre_id', label: 'Centre ID' },
  ];

  const categoryFormFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const scanFormFields = [
    { name: 'name', label: 'Scan Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, options: categories.data.map(cat => ({ value: cat.id, label: cat.name })), required: true },
    { name: 'mrp', label: 'MRP', type: 'number' as const, required: true },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const variantFormFields = [
    { name: 'scan_id', label: 'Scan', type: 'select' as const, options: scans.data.map(scan => ({ value: scan.id, label: scan.name })), required: true },
    { name: 'diagnostic_centre_id', label: 'Diagnostic Centre', type: 'text' as const, required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
  ];

  return (
    <div className="p-6">
      <PageHeader 
        title="Scan Management" 
        description="Manage scan categories, scans, and pricing variants"
      />

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="scans">Scans</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <DataTable
            title="Scan Categories"
            data={categories.data}
            columns={categoryColumns}
            loading={categories.loading}
            onDelete={categories.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Category"
                fields={categoryFormFields}
                initialData={item}
                onSubmit={(data) => categories.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Category"
            fields={categoryFormFields}
            onSubmit={categories.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Category</button>}
          />
        </TabsContent>

        <TabsContent value="scans">
          <DataTable
            title="Scans"
            data={scans.data}
            columns={scanColumns}
            loading={scans.loading}
            onDelete={scans.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Scan"
                fields={scanFormFields}
                initialData={item}
                onSubmit={(data) => scans.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Scan"
            fields={scanFormFields}
            onSubmit={scans.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Scan</button>}
          />
        </TabsContent>

        <TabsContent value="variants">
          <DataTable
            title="Scan Variants"
            data={variants.data}
            columns={variantColumns}
            loading={variants.loading}
            onDelete={variants.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Variant"
                fields={variantFormFields}
                initialData={item}
                onSubmit={(data) => variants.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Variant"
            fields={variantFormFields}
            onSubmit={variants.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Variant</button>}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
