import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, Building, Shield, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const InsuranceManagement: React.FC = () => {
  // Initialize Supabase tables
  const providersTable = useSupabaseTable('insurance_providers');
  const categoriesTable = useSupabaseTable('insurance_categories');
  const plansTable = useSupabaseTable('insurance_plans');

  // Data fetching
  const { data: providers, loading: providersLoading, refetch: refetchProviders } = providersTable;
  const { data: categories, loading: categoriesLoading, refetch: refetchCategories } = categoriesTable;
  const { data: plans, loading: plansLoading, refetch: refetchPlans } = plansTable;

  // Column definitions
  const providerColumns = [
    { key: 'company_name', label: 'Company Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'contact_phone', label: 'Phone', sortable: true },
    { key: 'license_number', label: 'License', sortable: true },
    { key: 'website', label: 'Website' },
    { 
      key: 'logo_url', 
      label: 'Logo',
      render: (value: string) => value ? <img src={value} alt="Logo" className="w-12 h-12 object-cover rounded" /> : 'No logo'
    },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const categoryColumns = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'image_url', 
      label: 'Image',
      render: (value: string) => value ? <img src={value} alt="Category" className="w-12 h-12 object-cover rounded" /> : 'No image'
    },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const planColumns = [
    { key: 'name', label: 'Plan Name', sortable: true },
    { key: 'plan_type', label: 'Type', sortable: true },
    { key: 'provider', label: 'Provider', sortable: true },
    { key: 'premium', label: 'Premium', render: (value: number) => `₹${value}`, sortable: true },
    { key: 'coverage_amount', label: 'Coverage', render: (value: number) => `₹${value}`, sortable: true },
    { key: 'duration', label: 'Duration', render: (value: number) => `${value} years`, sortable: true },
    { key: 'city', label: 'Location', sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  // Form field definitions
  const providerFormFields = [
    { name: 'company_name', label: 'Company Name', type: 'text', required: true },
    { name: 'contact_email', label: 'Contact Email', type: 'email' },
    { name: 'contact_phone', label: 'Contact Phone', type: 'text' },
    { name: 'website', label: 'Website', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'license_number', label: 'License Number', type: 'text' },
    { name: 'logo_url', label: 'Logo URL', type: 'text' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const categoryFormFields = [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const planFormFields = [
    { name: 'provider_id', label: 'Provider', type: 'select', options: providers?.map(p => ({ value: p.id, label: p.company_name })) || [], required: true },
    { name: 'category_id', label: 'Category', type: 'select', options: categories?.map(c => ({ value: c.id, label: c.name })) || [] },
    { name: 'name', label: 'Plan Name', type: 'text', required: true },
    { name: 'plan_type', label: 'Plan Type', type: 'select', options: [
      { value: 'health', label: 'Health Insurance' },
      { value: 'life', label: 'Life Insurance' },
      { value: 'critical_illness', label: 'Critical Illness' },
      { value: 'maternity', label: 'Maternity' },
      { value: 'senior_citizen', label: 'Senior Citizen' },
      { value: 'opd', label: 'OPD Cover' },
      { value: 'comprehensive', label: 'Comprehensive' }
    ] },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'premium', label: 'Premium Amount', type: 'number', required: true },
    { name: 'coverage_amount', label: 'Coverage Amount', type: 'number', required: true },
    { name: 'duration', label: 'Duration (years)', type: 'number', required: true },
    { name: 'features', label: 'Features', type: 'textarea', placeholder: 'Enter features separated by commas' },
    { name: 'exclusions', label: 'Exclusions', type: 'textarea', placeholder: 'Enter exclusions separated by commas' },
    { name: 'benefits', label: 'Benefits', type: 'textarea', placeholder: 'Enter benefits separated by commas' },
    { name: 'terms_conditions', label: 'Terms & Conditions', type: 'textarea', placeholder: 'Enter terms separated by commas' },
    { name: 'waiting_period', label: 'Waiting Period (days)', type: 'number', defaultValue: 0 },
    { name: 'claim_process', label: 'Claim Process', type: 'textarea' },
    { name: 'network_hospitals', label: 'Network Hospitals', type: 'textarea', placeholder: 'Enter hospital names separated by commas' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'service_radius_km', label: 'Service Radius (km)', type: 'number', defaultValue: 100 },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'location_restricted', label: 'Location Restricted', type: 'checkbox' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  // CRUD handlers
  const handleProviderCreate = async (data: any) => {
    await providersTable.create(data);
    refetchProviders();
  };

  const handleProviderUpdate = async (id: string, data: any) => {
    await providersTable.update(id, data);
    refetchProviders();
  };

  const handleCategoryCreate = async (data: any) => {
    await categoriesTable.create(data);
    refetchCategories();
  };

  const handleCategoryUpdate = async (id: string, data: any) => {
    await categoriesTable.update(id, data);
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
    if (data.benefits && typeof data.benefits === 'string') {
      data.benefits = data.benefits.split(',').map((item: string) => item.trim());
    }
    if (data.terms_conditions && typeof data.terms_conditions === 'string') {
      data.terms_conditions = data.terms_conditions.split(',').map((item: string) => item.trim());
    }
    if (data.network_hospitals && typeof data.network_hospitals === 'string') {
      data.network_hospitals = data.network_hospitals.split(',').map((item: string) => item.trim());
    }
    
    await plansTable.create(data);
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
    if (data.benefits && typeof data.benefits === 'string') {
      data.benefits = data.benefits.split(',').map((item: string) => item.trim());
    }
    if (data.terms_conditions && typeof data.terms_conditions === 'string') {
      data.terms_conditions = data.terms_conditions.split(',').map((item: string) => item.trim());
    }
    if (data.network_hospitals && typeof data.network_hospitals === 'string') {
      data.network_hospitals = data.network_hospitals.split(',').map((item: string) => item.trim());
    }
    
    await plansTable.update(id, data);
    refetchPlans();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Management"
        subtitle="Manage insurance providers, categories, and plans"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Providers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers?.filter(p => p.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.filter(c => c.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Plans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans?.filter(p => p.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active plans</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
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
            data={providers || []}
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
            onDelete={(id) => providersTable.delete(id).then(() => refetchProviders())}
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
            data={categories || []}
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
            onDelete={(id) => categoriesTable.delete(id).then(() => refetchCategories())}
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
            data={plans || []}
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
                  exclusions: plan.exclusions ? plan.exclusions.join(', ') : '',
                  benefits: plan.benefits ? plan.benefits.join(', ') : '',
                  terms_conditions: plan.terms_conditions ? plan.terms_conditions.join(', ') : '',
                  network_hospitals: plan.network_hospitals ? plan.network_hospitals.join(', ') : ''
                }}
                onSubmit={(data) => handlePlanUpdate(plan.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => plansTable.delete(id).then(() => refetchPlans())}
            searchPlaceholder="Search plans..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};