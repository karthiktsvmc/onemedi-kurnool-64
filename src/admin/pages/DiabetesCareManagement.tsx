
import React, { useState } from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

// Initialize Supabase tables
const diabetesCategoriesTable = new SupabaseTable('diabetes_categories');
const diabetesProductsTable = new SupabaseTable('diabetes_products');
const diabetesServicesTable = new SupabaseTable('diabetes_services');
const diabetesTestsTable = new SupabaseTable('diabetes_tests');
const diabetesExpertsTable = new SupabaseTable('diabetes_experts');
const diabetesPlansTable = new SupabaseTable('diabetes_plans');
const diabetesDietsTable = new SupabaseTable('diabetes_diets');

export default function DiabetesCareManagement() {
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'services' | 'tests' | 'experts' | 'plans' | 'diets'>('categories');

  // Hook for each table
  const categories = useSupabaseTable(diabetesCategoriesTable);
  const products = useSupabaseTable(diabetesProductsTable);
  const services = useSupabaseTable(diabetesServicesTable);
  const tests = useSupabaseTable(diabetesTestsTable);
  const experts = useSupabaseTable(diabetesExpertsTable);
  const plans = useSupabaseTable(diabetesPlansTable);
  const diets = useSupabaseTable(diabetesDietsTable);

  // Column definitions
  const categoryColumns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
  ];

  const productColumns = [
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price' },
    { key: 'category_id', label: 'Category' },
  ];

  const serviceColumns = [
    { key: 'name', label: 'Service Name' },
    { key: 'price', label: 'Price' },
    { key: 'category_id', label: 'Category' },
  ];

  const testColumns = [
    { key: 'name', label: 'Test Name' },
    { key: 'mrp', label: 'MRP' },
    { key: 'featured', label: 'Featured' },
    { key: 'fasting_required', label: 'Fasting Required' },
  ];

  const expertColumns = [
    { key: 'name', label: 'Expert Name' },
    { key: 'speciality', label: 'Speciality' },
    { key: 'experience', label: 'Experience (Years)' },
    { key: 'qualification', label: 'Qualification' },
  ];

  const planColumns = [
    { key: 'name', label: 'Plan Name' },
    { key: 'price', label: 'Price' },
    { key: 'duration', label: 'Duration (Days)' },
    { key: 'sessions', label: 'Sessions' },
  ];

  const dietColumns = [
    { key: 'name', label: 'Diet Name' },
    { key: 'calories', label: 'Calories' },
    { key: 'plan_id', label: 'Plan ID' },
  ];

  // Form field definitions
  const categoryFormFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'type', label: 'Type', type: 'select' as const, options: [
      { value: 'product', label: 'Product' },
      { value: 'service', label: 'Service' },
      { value: 'test', label: 'Test' }
    ], required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const productFormFields = [
    { name: 'name', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, 
      options: categories.data.filter(cat => cat.type === 'product').map(cat => ({ value: cat.id, label: cat.name })), 
      required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const serviceFormFields = [
    { name: 'name', label: 'Service Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, 
      options: categories.data.filter(cat => cat.type === 'service').map(cat => ({ value: cat.id, label: cat.name })), 
      required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'expert_id', label: 'Expert', type: 'select' as const, 
      options: experts.data.map(expert => ({ value: expert.id, label: expert.name })) },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const testFormFields = [
    { name: 'name', label: 'Test Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, 
      options: categories.data.filter(cat => cat.type === 'test').map(cat => ({ value: cat.id, label: cat.name })), 
      required: true },
    { name: 'mrp', label: 'MRP', type: 'number' as const, required: true },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const },
    { name: 'fasting_required', label: 'Fasting Required', type: 'checkbox' as const },
    { name: 'home_collection_available', label: 'Home Collection Available', type: 'checkbox' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const expertFormFields = [
    { name: 'name', label: 'Expert Name', type: 'text' as const, required: true },
    { name: 'speciality', label: 'Speciality', type: 'text' as const },
    { name: 'qualification', label: 'Qualification', type: 'text' as const },
    { name: 'experience', label: 'Experience (Years)', type: 'number' as const },
    { name: 'bio', label: 'Bio', type: 'textarea' as const },
    { name: 'contact', label: 'Contact', type: 'text' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const planFormFields = [
    { name: 'name', label: 'Plan Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'duration', label: 'Duration (Days)', type: 'number' as const },
    { name: 'sessions', label: 'Sessions', type: 'number' as const },
    { name: 'expert_id', label: 'Expert', type: 'select' as const, 
      options: experts.data.map(expert => ({ value: expert.id, label: expert.name })) },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const dietFormFields = [
    { name: 'name', label: 'Diet Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'plan_id', label: 'Plan', type: 'select' as const, 
      options: plans.data.map(plan => ({ value: plan.id, label: plan.name })), 
      required: true },
    { name: 'calories', label: 'Calories', type: 'number' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  // Handlers for categories
  const handleCategoryCreate = async (data: any): Promise<void> => {
    await categories.createItem(data);
  };

  const handleCategoryUpdate = async (item: any, data: any): Promise<void> => {
    await categories.updateItem(item.id, data);
  };

  // Handlers for products
  const handleProductCreate = async (data: any): Promise<void> => {
    await products.createItem(data);
  };

  const handleProductUpdate = async (item: any, data: any): Promise<void> => {
    await products.updateItem(item.id, data);
  };

  // Handlers for services
  const handleServiceCreate = async (data: any): Promise<void> => {
    await services.createItem(data);
  };

  const handleServiceUpdate = async (item: any, data: any): Promise<void> => {
    await services.updateItem(item.id, data);
  };

  // Handlers for tests
  const handleTestCreate = async (data: any): Promise<void> => {
    await tests.createItem(data);
  };

  const handleTestUpdate = async (item: any, data: any): Promise<void> => {
    await tests.updateItem(item.id, data);
  };

  // Handlers for experts
  const handleExpertCreate = async (data: any): Promise<void> => {
    await experts.createItem(data);
  };

  const handleExpertUpdate = async (item: any, data: any): Promise<void> => {
    await experts.updateItem(item.id, data);
  };

  // Handlers for plans
  const handlePlanCreate = async (data: any): Promise<void> => {
    await plans.createItem(data);
  };

  const handlePlanUpdate = async (item: any, data: any): Promise<void> => {
    await plans.updateItem(item.id, data);
  };

  // Handlers for diets
  const handleDietCreate = async (data: any): Promise<void> => {
    await diets.createItem(data);
  };

  const handleDietUpdate = async (item: any, data: any): Promise<void> => {
    await diets.updateItem(item.id, data);
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Diabetes Care Management" 
        description="Manage diabetes care categories, products, services, tests, experts, and plans"
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="diets">Diets</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <DataTable
            title="Diabetes Categories"
            data={categories.data}
            columns={categoryColumns}
            loading={categories.loading}
            onDelete={(item) => categories.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Category"
                fields={categoryFormFields}
                initialData={item}
                onSubmit={(data) => handleCategoryUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Category"
            fields={categoryFormFields}
            onSubmit={handleCategoryCreate}
            trigger={<Button className="mt-4">Add Category</Button>}
          />
        </TabsContent>

        <TabsContent value="products">
          <DataTable
            title="Diabetes Products"
            data={products.data}
            columns={productColumns}
            loading={products.loading}
            onDelete={(item) => products.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Product"
                fields={productFormFields}
                initialData={item}
                onSubmit={(data) => handleProductUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Product"
            fields={productFormFields}
            onSubmit={handleProductCreate}
            trigger={<Button className="mt-4">Add Product</Button>}
          />
        </TabsContent>

        <TabsContent value="services">
          <DataTable
            title="Diabetes Services"
            data={services.data}
            columns={serviceColumns}
            loading={services.loading}
            onDelete={(item) => services.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Service"
                fields={serviceFormFields}
                initialData={item}
                onSubmit={(data) => handleServiceUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Service"
            fields={serviceFormFields}
            onSubmit={handleServiceCreate}
            trigger={<Button className="mt-4">Add Service</Button>}
          />
        </TabsContent>

        <TabsContent value="tests">
          <DataTable
            title="Diabetes Tests"
            data={tests.data}
            columns={testColumns}
            loading={tests.loading}
            onDelete={(item) => tests.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Test"
                fields={testFormFields}
                initialData={item}
                onSubmit={(data) => handleTestUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Test"
            fields={testFormFields}
            onSubmit={handleTestCreate}
            trigger={<Button className="mt-4">Add Test</Button>}
          />
        </TabsContent>

        <TabsContent value="experts">
          <DataTable
            title="Diabetes Experts"
            data={experts.data}
            columns={expertColumns}
            loading={experts.loading}
            onDelete={(item) => experts.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Expert"
                fields={expertFormFields}
                initialData={item}
                onSubmit={(data) => handleExpertUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Expert"
            fields={expertFormFields}
            onSubmit={handleExpertCreate}
            trigger={<Button className="mt-4">Add Expert</Button>}
          />
        </TabsContent>

        <TabsContent value="plans">
          <DataTable
            title="Diabetes Plans"
            data={plans.data}
            columns={planColumns}
            loading={plans.loading}
            onDelete={(item) => plans.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Plan"
                fields={planFormFields}
                initialData={item}
                onSubmit={(data) => handlePlanUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Plan"
            fields={planFormFields}
            onSubmit={handlePlanCreate}
            trigger={<Button className="mt-4">Add Plan</Button>}
          />
        </TabsContent>

        <TabsContent value="diets">
          <DataTable
            title="Diabetes Diets"
            data={diets.data}
            columns={dietColumns}
            loading={diets.loading}
            onDelete={(item) => diets.deleteItem(item.id)}
            renderActions={(item) => (
              <FormDialog
                title="Edit Diet"
                fields={dietFormFields}
                initialData={item}
                onSubmit={(data) => handleDietUpdate(item, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Diet"
            fields={dietFormFields}
            onSubmit={handleDietCreate}
            trigger={<Button className="mt-4">Add Diet</Button>}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
