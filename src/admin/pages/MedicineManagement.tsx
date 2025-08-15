
import React, { useState } from 'react';
import { DataTable, DataTableColumn } from '../components/shared/DataTable';
import { FormDialog, FormField } from '../components/shared/FormDialog';
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

  // Form states
  const [medicineDialog, setMedicineDialog] = useState({ open: false, item: null as Medicine | null });
  const [categoryDialog, setCategoryDialog] = useState({ open: false, item: null as MedicineCategory | null });
  const [brandDialog, setBrandDialog] = useState({ open: false, item: null as MedicineBrand | null });
  
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formLoading, setFormLoading] = useState(false);

  // Medicine columns
  const medicineColumns: DataTableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { 
      key: 'category_id', 
      label: 'Category',
      render: (value) => {
        const category = categories.find(c => c.id === value);
        return category ? <Badge variant="outline">{category.name}</Badge> : 'N/A';
      }
    },
    { key: 'brand', label: 'Brand' },
    { 
      key: 'mrp', 
      label: 'MRP',
      render: (value) => `₹${value}`
    },
    { 
      key: 'sale_price', 
      label: 'Sale Price',
      render: (value) => `₹${value}`
    },
    { 
      key: 'stock_qty', 
      label: 'Stock',
      render: (value) => (
        <Badge variant={value > 10 ? 'default' : value > 0 ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value) => <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    },
    { 
      key: 'prescription_required', 
      label: 'Prescription',
      render: (value) => <Badge variant={value ? 'destructive' : 'default'}>{value ? 'Required' : 'OTC'}</Badge>
    }
  ];

  // Category columns
  const categoryColumns: DataTableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Brand columns
  const brandColumns: DataTableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Medicine form fields
  const medicineFields: FormField[] = [
    { name: 'name', label: 'Medicine Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select', 
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name }))
    },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'mrp', label: 'MRP (₹)', type: 'number', required: true, min: 0, step: 0.01 },
    { name: 'sale_price', label: 'Sale Price (₹)', type: 'number', required: true, min: 0, step: 0.01 },
    { name: 'stock_qty', label: 'Stock Quantity', type: 'number', required: true, min: 0 },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'tags', label: 'Tags', type: 'array', description: 'Keywords for search' },
    { name: 'featured', label: 'Featured', type: 'boolean' },
    { name: 'prescription_required', label: 'Prescription Required', type: 'boolean' },
    { name: 'expiry_date', label: 'Expiry Date', type: 'date' },
    { name: 'generic_alternative', label: 'Generic Alternative', type: 'text' },
    { name: 'branded_alternatives', label: 'Branded Alternatives', type: 'array' }
  ];

  // Category form fields
  const categoryFields: FormField[] = [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Image URL', type: 'text' }
  ];

  // Brand form fields
  const brandFields: FormField[] = [
    { name: 'name', label: 'Brand Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'logo_url', label: 'Logo URL', type: 'text' }
  ];

  // Form handlers
  const handleMedicineSubmit = async () => {
    setFormLoading(true);
    try {
      if (medicineDialog.item) {
        await updateMedicine(medicineDialog.item.id, formValues as any);
      } else {
        await createMedicine(formValues as any);
      }
      setMedicineDialog({ open: false, item: null });
      setFormValues({});
    } catch (error) {
      console.error('Failed to save medicine:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCategorySubmit = async () => {
    setFormLoading(true);
    try {
      if (categoryDialog.item) {
        await updateCategory(categoryDialog.item.id, formValues as any);
      } else {
        await createCategory(formValues as any);
      }
      setCategoryDialog({ open: false, item: null });
      setFormValues({});
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleBrandSubmit = async () => {
    setFormLoading(true);
    try {
      if (brandDialog.item) {
        await updateBrand(brandDialog.item.id, formValues as any);
      } else {
        await createBrand(formValues as any);
      }
      setBrandDialog({ open: false, item: null });
      setFormValues({});
    } catch (error) {
      console.error('Failed to save brand:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const openMedicineDialog = (item?: Medicine) => {
    setFormValues(item || {});
    setMedicineDialog({ open: true, item: item || null });
  };

  const openCategoryDialog = (item?: MedicineCategory) => {
    setFormValues(item || {});
    setCategoryDialog({ open: true, item: item || null });
  };

  const openBrandDialog = (item?: MedicineBrand) => {
    setFormValues(item || {});
    setBrandDialog({ open: true, item: item || null });
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
          onAdd={() => openMedicineDialog()}
          onEdit={(item) => openMedicineDialog(item)}
          onDelete={(item) => deleteMedicine(item.id)}
          onRefresh={refetchMedicines}
          searchPlaceholder="Search medicines..."
          addButtonText="Add Medicine"
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
          onAdd={() => openCategoryDialog()}
          onEdit={(item) => openCategoryDialog(item)}
          onDelete={(item) => deleteCategory(item.id)}
          onRefresh={refetchCategories}
          searchPlaceholder="Search categories..."
          addButtonText="Add Category"
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
          onAdd={() => openBrandDialog()}
          onEdit={(item) => openBrandDialog(item)}
          onDelete={(item) => deleteBrand(item.id)}
          onRefresh={refetchBrands}
          searchPlaceholder="Search brands..."
          addButtonText="Add Brand"
        />
      )}

      {/* Form Dialogs */}
      <FormDialog
        open={medicineDialog.open}
        onOpenChange={(open) => setMedicineDialog({ open, item: null })}
        title={medicineDialog.item ? 'Edit Medicine' : 'Add Medicine'}
        fields={medicineFields}
        values={formValues}
        onChange={(name, value) => setFormValues({ ...formValues, [name]: value })}
        onSubmit={handleMedicineSubmit}
        onCancel={() => {
          setMedicineDialog({ open: false, item: null });
          setFormValues({});
        }}
        loading={formLoading}
      />

      <FormDialog
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog({ open, item: null })}
        title={categoryDialog.item ? 'Edit Category' : 'Add Category'}
        fields={categoryFields}
        values={formValues}
        onChange={(name, value) => setFormValues({ ...formValues, [name]: value })}
        onSubmit={handleCategorySubmit}
        onCancel={() => {
          setCategoryDialog({ open: false, item: null });
          setFormValues({});
        }}
        loading={formLoading}
      />

      <FormDialog
        open={brandDialog.open}
        onOpenChange={(open) => setBrandDialog({ open, item: null })}
        title={brandDialog.item ? 'Edit Brand' : 'Add Brand'}
        fields={brandFields}
        values={formValues}
        onChange={(name, value) => setFormValues({ ...formValues, [name]: value })}
        onSubmit={handleBrandSubmit}
        onCancel={() => {
          setBrandDialog({ open: false, item: null });
          setFormValues({});
        }}
        loading={formLoading}
      />
    </div>
  );
};
