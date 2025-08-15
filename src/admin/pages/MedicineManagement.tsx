
import React, { useState } from 'react';
import { DataTable } from '../components/shared/DataTable';
import { FormDialog } from '../components/shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { 
  medicinesTable, 
  medicineCategoriesTable, 
  medicineBrandsTable,
  type Medicine,
  type MedicineCategory,
  type MedicineBrand
} from '@/shared/lib/supabase-utils';
import { PageHeader } from '../components/shared/PageHeader';
import { Pill, Package, Building2 } from 'lucide-react';

export const MedicineManagement = () => {
  const [activeTab, setActiveTab] = useState<'medicines' | 'categories' | 'brands'>('medicines');
  
  // Medicines
  const {
    data: medicines,
    loading: medicinesLoading,
    createItem: createMedicine,
    updateItem: updateMedicine,
    deleteItem: deleteMedicine,
    searchItems: searchMedicines,
    refetch: refetchMedicines
  } = useSupabaseTable(medicinesTable, { realtime: true });

  // Categories
  const {
    data: categories,
    loading: categoriesLoading,
    createItem: createCategory,
    updateItem: updateCategory,
    deleteItem: deleteCategory,
    searchItems: searchCategories,
    refetch: refetchCategories
  } = useSupabaseTable(medicineCategoriesTable, { realtime: true });

  // Brands
  const {
    data: brands,
    loading: brandsLoading,
    createItem: createBrand,
    updateItem: updateBrand,
    deleteItem: deleteBrand,
    searchItems: searchBrands,
    refetch: refetchBrands
  } = useSupabaseTable(medicineBrandsTable, { realtime: true });

  // Medicine columns
  const medicineColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { 
      key: 'category_id', 
      label: 'Category',
      render: (value: any) => {
        const category = categories.find(c => c.id === value);
        return category ? <Badge variant="outline">{category.name}</Badge> : 'N/A';
      }
    },
    { key: 'brand', label: 'Brand' },
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
      key: 'stock_qty', 
      label: 'Stock',
      render: (value: any) => (
        <Badge variant={value > 10 ? 'default' : value > 0 ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value: any) => <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    },
    { 
      key: 'prescription_required', 
      label: 'Prescription',
      render: (value: any) => <Badge variant={value ? 'destructive' : 'default'}>{value ? 'Required' : 'OTC'}</Badge>
    }
  ];

  // Category columns
  const categoryColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ];

  // Brand columns
  const brandColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ];

  // Medicine form fields
  const medicineFields = [
    { name: 'name', label: 'Medicine Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select' as const, 
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name }))
    },
    { name: 'brand', label: 'Brand', type: 'text' as const },
    { name: 'mrp', label: 'MRP (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { name: 'sale_price', label: 'Sale Price (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { name: 'stock_qty', label: 'Stock Quantity', type: 'number' as const, required: true, min: 0 },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'tags', label: 'Tags', type: 'array' as const, description: 'Keywords for search' },
    { name: 'featured', label: 'Featured', type: 'boolean' as const },
    { name: 'prescription_required', label: 'Prescription Required', type: 'boolean' as const },
    { name: 'expiry_date', label: 'Expiry Date', type: 'date' as const },
    { name: 'generic_alternative', label: 'Generic Alternative', type: 'text' as const },
    { name: 'branded_alternatives', label: 'Branded Alternatives', type: 'array' as const }
  ];

  // Category form fields
  const categoryFields = [
    { name: 'name', label: 'Category Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const }
  ];

  // Brand form fields
  const brandFields = [
    { name: 'name', label: 'Brand Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'logo_url', label: 'Logo URL', type: 'text' as const }
  ];

  // Form handlers
  const handleMedicineCreate = async (data: any): Promise<void> => {
    await createMedicine(data);
  };

  const handleMedicineUpdate = async (item: any, data: any): Promise<void> => {
    await updateMedicine(item.id, data);
  };

  const handleCategoryCreate = async (data: any): Promise<void> => {
    await createCategory(data);
  };

  const handleCategoryUpdate = async (item: any, data: any): Promise<void> => {
    await updateCategory(item.id, data);
  };

  const handleBrandCreate = async (data: any): Promise<void> => {
    await createBrand(data);
  };

  const handleBrandUpdate = async (item: any, data: any): Promise<void> => {
    await updateBrand(item.id, data);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Medicine Management"
        description="Manage medicines, categories, and brands"
      />

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'medicines' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('medicines')}
          size="sm"
        >
          <Pill className="h-4 w-4 mr-2" />
          Medicines
        </Button>
        <Button
          variant={activeTab === 'categories' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('categories')}
          size="sm"
        >
          <Package className="h-4 w-4 mr-2" />
          Categories
        </Button>
        <Button
          variant={activeTab === 'brands' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('brands')}
          size="sm"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Brands
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'medicines' && (
        <DataTable
          title="Medicines"
          description="Manage your medicine inventory"
          data={medicines}
          columns={medicineColumns}
          loading={medicinesLoading}
          onSearch={(query) => searchMedicines(query, ['name', 'brand', 'description'])}
          onDelete={(item) => deleteMedicine(item.id)}
          onRefresh={refetchMedicines}
          searchPlaceholder="Search medicines..."
          renderActions={(item) => (
            <div className="flex gap-2">
              <FormDialog
                title="Edit Medicine"
                fields={medicineFields}
                initialData={item}
                onSubmit={(data) => handleMedicineUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            </div>
          )}
          actions={
            <FormDialog
              title="Add Medicine"
              fields={medicineFields}
              onSubmit={handleMedicineCreate}
              trigger={<Button size="sm">Add Medicine</Button>}
            />
          }
        />
      )}

      {activeTab === 'categories' && (
        <DataTable
          title="Medicine Categories"
          description="Organize medicines into categories"
          data={categories}
          columns={categoryColumns}
          loading={categoriesLoading}
          onSearch={(query) => searchCategories(query, ['name', 'description'])}
          onDelete={(item) => deleteCategory(item.id)}
          onRefresh={refetchCategories}
          searchPlaceholder="Search categories..."
          renderActions={(item) => (
            <div className="flex gap-2">
              <FormDialog
                title="Edit Category"
                fields={categoryFields}
                initialData={item}
                onSubmit={(data) => handleCategoryUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            </div>
          )}
          actions={
            <FormDialog
              title="Add Category"
              fields={categoryFields}
              onSubmit={handleCategoryCreate}
              trigger={<Button size="sm">Add Category</Button>}
            />
          }
        />
      )}

      {activeTab === 'brands' && (
        <DataTable
          title="Medicine Brands"
          description="Manage pharmaceutical brands"
          data={brands}
          columns={brandColumns}
          loading={brandsLoading}
          onSearch={(query) => searchBrands(query, ['name', 'description'])}
          onDelete={(item) => deleteBrand(item.id)}
          onRefresh={refetchBrands}
          searchPlaceholder="Search brands..."
          renderActions={(item) => (
            <div className="flex gap-2">
              <FormDialog
                title="Edit Brand"
                fields={brandFields}
                initialData={item}
                onSubmit={(data) => handleBrandUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            </div>
          )}
          actions={
            <FormDialog
              title="Add Brand"
              fields={brandFields}
              onSubmit={handleBrandCreate}
              trigger={<Button size="sm">Add Brand</Button>}
            />
          }
        />
      )}
    </div>
  );
};
