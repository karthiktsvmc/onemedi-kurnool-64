
import React from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const diabetesCategoriesTable = new SupabaseTable('diabetes_categories');
const diabetesTestsTable = new SupabaseTable('diabetes_tests');
const diabetesProductsTable = new SupabaseTable('diabetes_products');
const diabetesServicesTable = new SupabaseTable('diabetes_services');
const diabetesPlansTable = new SupabaseTable('diabetes_plans');
const diabetesExpertsTable = new SupabaseTable('diabetes_experts');
const diabetesDietsTable = new SupabaseTable('diabetes_diets');

export default function DiabetesCareManagement() {
  const categories = useSupabaseTable(diabetesCategoriesTable);
  const tests = useSupabaseTable(diabetesTestsTable);
  const products = useSupabaseTable(diabetesProductsTable);
  const services = useSupabaseTable(diabetesServicesTable);
  const plans = useSupabaseTable(diabetesPlansTable);
  const experts = useSupabaseTable(diabetesExpertsTable);
  const diets = useSupabaseTable(diabetesDietsTable);

  const categoryColumns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
  ];

  const testColumns = [
    { key: 'name', label: 'Test Name' },
    { key: 'mrp', label: 'Price' },
    { key: 'home_collection_available', label: 'Home Collection' },
    { key: 'fasting_required', label: 'Fasting Required' },
  ];

  const productColumns = [
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price' },
    { key: 'description', label: 'Description' },
  ];

  const serviceColumns = [
    { key: 'name', label: 'Service Name' },
    { key: 'price', label: 'Price' },
    { key: 'description', label: 'Description' },
  ];

  const planColumns = [
    { key: 'name', label: 'Plan Name' },
    { key: 'price', label: 'Price' },
    { key: 'duration', label: 'Duration (Days)' },
    { key: 'sessions', label: 'Sessions' },
  ];

  const expertColumns = [
    { key: 'name', label: 'Expert Name' },
    { key: 'speciality', label: 'Speciality' },
    { key: 'experience', label: 'Experience (Years)' },
    { key: 'qualification', label: 'Qualification' },
  ];

  const dietColumns = [
    { key: 'name', label: 'Diet Name' },
    { key: 'calories', label: 'Calories' },
    { key: 'instructions', label: 'Instructions' },
  ];

  const categoryFormFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'type', label: 'Type', type: 'select' as const, options: [
      { value: 'test', label: 'Test' },
      { value: 'product', label: 'Product' },
      { value: 'service', label: 'Service' }
    ], required: true },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const testFormFields = [
    { name: 'name', label: 'Test Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, options: categories.data.map(cat => ({ value: cat.id, label: cat.name })), required: true },
    { name: 'mrp', label: 'MRP', type: 'number' as const, required: true },
    { name: 'home_collection_available', label: 'Home Collection Available', type: 'checkbox' as const },
    { name: 'fasting_required', label: 'Fasting Required', type: 'checkbox' as const },
    { name: 'featured', label: 'Featured', type: 'checkbox' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const productFormFields = [
    { name: 'name', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, options: categories.data.map(cat => ({ value: cat.id, label: cat.name })), required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const serviceFormFields = [
    { name: 'name', label: 'Service Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category_id', label: 'Category', type: 'select' as const, options: categories.data.map(cat => ({ value: cat.id, label: cat.name })), required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'expert_id', label: 'Expert', type: 'select' as const, options: experts.data.map(expert => ({ value: expert.id, label: expert.name })) },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const planFormFields = [
    { name: 'name', label: 'Plan Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'duration', label: 'Duration (Days)', type: 'number' as const },
    { name: 'sessions', label: 'Sessions', type: 'number' as const },
    { name: 'expert_id', label: 'Expert', type: 'select' as const, options: experts.data.map(expert => ({ value: expert.id, label: expert.name })) },
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

  const dietFormFields = [
    { name: 'name', label: 'Diet Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'plan_id', label: 'Plan', type: 'select' as const, options: plans.data.map(plan => ({ value: plan.id, label: plan.name })), required: true },
    { name: 'calories', label: 'Calories', type: 'number' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  return (
    <div className="p-6">
      <PageHeader 
        title="Diabetes Care Management" 
        description="Manage diabetes categories, tests, products, services, plans, experts, and diet plans"
      />

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="diets">Diets</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <DataTable
            title="Diabetes Categories"
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

        <TabsContent value="tests">
          <DataTable
            title="Diabetes Tests"
            data={tests.data}
            columns={testColumns}
            loading={tests.loading}
            onDelete={tests.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Test"
                fields={testFormFields}
                initialData={item}
                onSubmit={(data) => tests.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Test"
            fields={testFormFields}
            onSubmit={tests.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Test</button>}
          />
        </TabsContent>

        <TabsContent value="products">
          <DataTable
            title="Diabetes Products"
            data={products.data}
            columns={productColumns}
            loading={products.loading}
            onDelete={products.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Product"
                fields={productFormFields}
                initialData={item}
                onSubmit={(data) => products.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Product"
            fields={productFormFields}
            onSubmit={products.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Product</button>}
          />
        </TabsContent>

        <TabsContent value="services">
          <DataTable
            title="Diabetes Services"
            data={services.data}
            columns={serviceColumns}
            loading={services.loading}
            onDelete={services.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Service"
                fields={serviceFormFields}
                initialData={item}
                onSubmit={(data) => services.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Service"
            fields={serviceFormFields}
            onSubmit={services.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Service</button>}
          />
        </TabsContent>

        <TabsContent value="plans">
          <DataTable
            title="Diabetes Plans"
            data={plans.data}
            columns={planColumns}
            loading={plans.loading}
            onDelete={plans.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Plan"
                fields={planFormFields}
                initialData={item}
                onSubmit={(data) => plans.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Plan"
            fields={planFormFields}
            onSubmit={plans.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Plan</button>}
          />
        </TabsContent>

        <TabsContent value="experts">
          <DataTable
            title="Diabetes Experts"
            data={experts.data}
            columns={expertColumns}
            loading={experts.loading}
            onDelete={experts.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Expert"
                fields={expertFormFields}
                initialData={item}
                onSubmit={(data) => experts.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Expert"
            fields={expertFormFields}
            onSubmit={experts.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Expert</button>}
          />
        </TabsContent>

        <TabsContent value="diets">
          <DataTable
            title="Diet Plans"
            data={diets.data}
            columns={dietColumns}
            loading={diets.loading}
            onDelete={diets.deleteItem}
            renderActions={(item) => (
              <FormDialog
                title="Edit Diet"
                fields={dietFormFields}
                initialData={item}
                onSubmit={(data) => diets.updateItem(item.id, data)}
                trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
              />
            )}
          />
          <FormDialog
            title="Add Diet"
            fields={dietFormFields}
            onSubmit={diets.createItem}
            trigger={<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Diet</button>}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
