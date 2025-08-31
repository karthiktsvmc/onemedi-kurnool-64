import { useState } from 'react';
import { ProductTypeTabs, ProductTab } from '../components/Medicine/ProductTypeTabs';
import { EnhancedProductForm } from '../components/Medicine/EnhancedProductForm';
import { InventoryManagement } from '../components/Medicine/InventoryManagement';
import { VariantManagement } from '../components/Medicine/VariantManagement';
import { AttributeManagement } from '../components/Medicine/AttributeManagement';
import { TagManagement } from '../components/Medicine/TagManagement';
import { PricingManagement } from '../components/Medicine/PricingManagement';
import { ShippingManagement } from '../components/Medicine/ShippingManagement';
import { DataTable } from '../components/shared/DataTable';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { 
  medicinesTable, 
  medicineCategoriesTable, 
  type Medicine,
  type MedicineCategory
} from '@/shared/lib/supabase-utils';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { PageHeader } from '../components/shared/PageHeader';
import { Package, TrendingUp, AlertCircle, Users } from 'lucide-react';

const tagsTable = new SupabaseTable('medicine_tags');
const attributesTable = new SupabaseTable('medicine_attributes');
const taxConfigurationsTable = new SupabaseTable('tax_configurations');
const locationsTable = new SupabaseTable('medicine_locations');
const variantsTable = new SupabaseTable('medicine_variants');

export const EnhancedMedicineManagement = () => {
  const [activeTab, setActiveTab] = useState<ProductTab>('products');

  // Core data
  const {
    data: medicines,
    loading: medicinesLoading,
    createItem: createMedicine,
    updateItem: updateMedicine,
    deleteItem: deleteMedicine,
    searchItems: searchMedicines,
    refetch: refetchMedicines
  } = useSupabaseTable(medicinesTable, { realtime: true });

  const {
    data: categories,
    loading: categoriesLoading,
    createItem: createCategory,
    updateItem: updateCategory,
    deleteItem: deleteCategory
  } = useSupabaseTable(medicineCategoriesTable, { realtime: true });

  // Supporting data
  const { data: tags } = useSupabaseTable(tagsTable, { realtime: true });
  const { data: attributes } = useSupabaseTable(attributesTable, { realtime: true });
  const { data: taxConfigurations } = useSupabaseTable(taxConfigurationsTable, { realtime: true });
  const { data: locations } = useSupabaseTable(locationsTable, { realtime: true });
  const { data: variants } = useSupabaseTable(variantsTable, { realtime: true });

  // Enhanced medicine columns
  const medicineColumns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { 
      key: 'product_type', 
      label: 'Type',
      render: (value: any) => (
        <Badge variant="outline">{value || 'simple'}</Badge>
      )
    },
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

  // Enhanced product creation
  const handleProductCreate = async (data: any): Promise<void> => {
    // Process tag relations separately
    const { tag_ids, ...productData } = data;
    
    // Add default values for new fields
    const enhancedData = {
      ...productData,
      product_type: productData.product_type || 'simple',
      min_order_quantity: productData.min_order_quantity || 1,
      backorder_allowed: productData.backorder_allowed || false
    };

    await createMedicine(enhancedData);
    // TODO: Handle tag relations after product creation
  };

  const handleProductUpdate = async (item: any, data: any): Promise<void> => {
    const { tag_ids, ...productData } = data;
    await updateMedicine(item.id, productData);
    // TODO: Handle tag relations after product update
  };

  // Stats calculations
  const totalProducts = medicines.length;
  const lowStockProducts = medicines.filter(m => m.stock_qty <= 10).length;
  const featuredProducts = medicines.filter(m => m.featured).length;
  const prescriptionProducts = medicines.filter(m => m.prescription_required).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <DataTable
            title="Products"
            description="Manage your medicine catalog with enhanced features"
            data={medicines}
            columns={medicineColumns}
            loading={medicinesLoading}
            onSearch={(query) => searchMedicines(query, ['name', 'brand', 'sku', 'manufacturer'])}
            onDelete={(item) => deleteMedicine(item.id)}
            onRefresh={refetchMedicines}
            searchPlaceholder="Search products..."
            renderActions={(item) => (
              <div className="flex gap-2">
                <EnhancedProductForm
                  title="Edit Product"
                  initialData={item}
                  onSubmit={(data) => handleProductUpdate(item, data)}
                  categories={categories}
                  tags={tags}
                  attributes={attributes}
                  taxConfigurations={taxConfigurations}
                  locations={locations}
                  trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
                />
              </div>
            )}
            actions={
              <EnhancedProductForm
                title="Add Product"
                onSubmit={handleProductCreate}
                categories={categories}
                tags={tags}
                attributes={attributes}
                taxConfigurations={taxConfigurations}
                locations={locations}
                trigger={<Button size="sm">Add Product</Button>}
              />
            }
          />
        );

      case 'variants':
        return <VariantManagement medicines={medicines} />;

      case 'inventory':
        return <InventoryManagement medicines={medicines} variants={variants} />;

      case 'attributes':
        return <AttributeManagement />;

      case 'tags':
        return <TagManagement />;

      case 'pricing':
        return <PricingManagement medicines={medicines} locations={locations} />;

      case 'shipping':
        return <ShippingManagement />;

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
              <p className="text-muted-foreground">
                Advanced reporting features coming soon. Export inventory reports, sales analytics, and more.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Enhanced Medicine Management"
        description="Comprehensive product, inventory, and business management"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredProducts}</div>
            <p className="text-xs text-muted-foreground">
              Featured products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescription</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptionProducts}</div>
            <p className="text-xs text-muted-foreground">
              Require prescription
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <ProductTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      {renderTabContent()}
    </div>
  );
};

export default EnhancedMedicineManagement;