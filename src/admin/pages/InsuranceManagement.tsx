import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog, type FormField } from '@/admin/components/shared/FormDialog';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { insurancePlansTable } from '@/shared/lib/supabase-utils';
import { Button } from '@/shared/components/ui/button';
import { Plus, Shield, Building2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

// Create table instances
import { SupabaseTable } from '@/shared/lib/supabase-utils';
const insuranceProvidersTable = new SupabaseTable('insurance_providers');
const insuranceCategoriesTable = new SupabaseTable('insurance_categories');

export const InsuranceManagement: React.FC = () => {
  // Initialize Supabase tables
  const plans = useSupabaseTable(insurancePlansTable);
  const providers = useSupabaseTable(insuranceProvidersTable);
  const categories = useSupabaseTable(insuranceCategoriesTable);

  // Data fetching
  const { data: plansData, loading: plansLoading, refetch: refetchPlans } = plans;
  const { data: providersData, loading: providersLoading, refetch: refetchProviders } = providers;
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = categories;

  // Column definitions
  const planColumns = [
    { key: 'name', label: 'Plan Name', sortable: true },
    { key: 'provider', label: 'Provider', sortable: true },
    { key: 'premium', label: 'Premium', render: (value: number) => `₹${value}`, sortable: true },
    { key: 'coverage_amount', label: 'Coverage', render: (value: number) => `₹${value}`, sortable: true },
    { key: 'duration', label: 'Duration (years)', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  const providerColumns = [
    { key: 'name', label: 'Provider Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'license_number', label: 'License', sortable: true },
    { key: 'rating', label: 'Rating', render: (value: number) => `${value}/5`, sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  const categoryColumns = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'min_age', label: 'Min Age', sortable: true },
    { key: 'max_age', label: 'Max Age', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  // Form field definitions
  const planFormFields: FormField[] = [
    { name: 'provider_id', label: 'Provider', type: 'select', options: providersData?.map(p => ({ value: p.id, label: p.name })) || [], required: true },
    { name: 'category_id', label: 'Category', type: 'select', options: categoriesData?.map(c => ({ value: c.id, label: c.name })) || [] },
    { name: 'name', label: 'Plan Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'premium', label: 'Premium Amount', type: 'number', required: true },
    { name: 'coverage_amount', label: 'Coverage Amount', type: 'number', required: true },
    { name: 'duration', label: 'Duration (years)', type: 'number', required: true },
    { name: 'features', label: 'Features', type: 'textarea', placeholder: 'Enter features separated by commas' },
    { name: 'exclusions', label: 'Exclusions', type: 'textarea', placeholder: 'Enter exclusions separated by commas' },
    { name: 'image_url', label: 'Image URL', type: 'text' }
  ];

  const providerFormFields: FormField[] = [
    { name: 'name', label: 'Provider Name', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', options: [
      { value: 'life', label: 'Life Insurance' },
      { value: 'health', label: 'Health Insurance' },
      { value: 'motor', label: 'Motor Insurance' },
      { value: 'travel', label: 'Travel Insurance' },
      { value: 'home', label: 'Home Insurance' }
    ]},
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'website', label: 'Website', type: 'text' },
    { name: 'license_number', label: 'License Number', type: 'text' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'rating', label: 'Rating', type: 'number', min: 0, max: 5, step: 0.1 },
    { name: 'review_count', label: 'Review Count', type: 'number' },
    { name: 'established_year', label: 'Established Year', type: 'number' },
    { name: 'image_url', label: 'Image URL', type: 'text' }
  ];

  const categoryFormFields: FormField[] = [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'min_age', label: 'Minimum Age', type: 'number' },
    { name: 'max_age', label: 'Maximum Age', type: 'number' },
    { name: 'image_url', label: 'Image URL', type: 'text' }
  ];

  // CRUD handlers
  const handleProviderCreate = async (data: any) => {
    await providers.createItem(data);
    refetchProviders();
  };

  const handleProviderUpdate = async (id: string, data: any) => {
    await providers.updateItem(id, data);
    refetchProviders();
  };

  const handleCategoryCreate = async (data: any) => {
    await categories.createItem(data);
    refetchCategories();
  };

  const handleCategoryUpdate = async (id: string, data: any) => {
    await categories.updateItem(id, data);
    refetchCategories();
  };

  const handlePlanCreate = async (data: any) => {
    // Convert comma-separated strings to arrays
    if (data.features && typeof data.features === 'string') {
      data.features = data.features.split(',').map((item: string) => item.trim());
    }
    if (data.exclusions && typeof data.exclusions === 'string') {
      data.exclusions = data.exclusions.split(',').map((item: string) => item.trim());
    }
    
    await plans.createItem(data);
    refetchPlans();
  };

  const handlePlanUpdate = async (id: string, data: any) => {
    // Convert comma-separated strings to arrays
    if (data.features && typeof data.features === 'string') {
      data.features = data.features.split(',').map((item: string) => item.trim());
    }
    if (data.exclusions && typeof data.exclusions === 'string') {
      data.exclusions = data.exclusions.split(',').map((item: string) => item.trim());
    }
    
    await plans.updateItem(id, data);
    refetchPlans();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Management"
        description="Manage insurance providers, categories, and plans"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Providers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providersData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Plans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plansData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total plans</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Insurance Providers</h3>
            <FormDialog
              title="Add New Provider"
              fields={providerFormFields}
              onSubmit={handleProviderCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              }
            />
          </div>
          <DataTable
            title="Insurance Providers"
            data={providersData || []}
            columns={providerColumns}
            loading={providersLoading}
            onRefresh={refetchProviders}
            onEdit={(provider) => (
              <FormDialog
                title="Edit Provider"
                fields={providerFormFields}
                initialData={provider}
                onSubmit={(data) => handleProviderUpdate(provider.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => providers.deleteItem(id).then(() => refetchProviders())}
            searchPlaceholder="Search providers..."
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Insurance Categories</h3>
            <FormDialog
              title="Add New Category"
              fields={categoryFormFields}
              onSubmit={handleCategoryCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              }
            />
          </div>
          <DataTable
            title="Insurance Categories"
            data={categoriesData || []}
            columns={categoryColumns}
            loading={categoriesLoading}
            onRefresh={refetchCategories}
            onEdit={(category) => (
              <FormDialog
                title="Edit Category"
                fields={categoryFormFields}
                initialData={category}
                onSubmit={(data) => handleCategoryUpdate(category.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => categories.deleteItem(id).then(() => refetchCategories())}
            searchPlaceholder="Search categories..."
          />
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Insurance Plans</h3>
            <FormDialog
              title="Add New Plan"
              fields={planFormFields}
              onSubmit={handlePlanCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              }
            />
          </div>
          <DataTable
            title="Insurance Plans"
            data={plansData || []}
            columns={planColumns}
            loading={plansLoading}
            onRefresh={refetchPlans}
            onEdit={(plan) => (
              <FormDialog
                title="Edit Plan"
                fields={planFormFields}
                initialData={{
                  ...plan,
                  features: plan.features ? plan.features.join(', ') : '',
                  exclusions: plan.exclusions ? plan.exclusions.join(', ') : ''
                }}
                onSubmit={(data) => handlePlanUpdate(plan.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => plans.deleteItem(id).then(() => refetchPlans())}
            searchPlaceholder="Search plans..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};