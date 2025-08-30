import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog, type FormField } from '@/admin/components/shared/FormDialog';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { hospitalsTable } from '@/shared/lib/supabase-utils';
import { Button } from '@/shared/components/ui/button';
import { Plus, Building2, Package, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

// Create table instances
import { SupabaseTable } from '@/shared/lib/supabase-utils';
const hospitalCategoriesTable = new SupabaseTable('hospital_categories');
const hospitalServicesTable = new SupabaseTable('hospital_services');
const hospitalDoctorsTable = new SupabaseTable('hospital_doctors');
const doctorsTable = new SupabaseTable('doctors');

export const HospitalsManagement: React.FC = () => {
  // Initialize Supabase tables
  const hospitals = useSupabaseTable(hospitalsTable);
  const categories = useSupabaseTable(hospitalCategoriesTable);
  const services = useSupabaseTable(hospitalServicesTable);
  const hospitalDoctors = useSupabaseTable(hospitalDoctorsTable);
  const doctors = useSupabaseTable(doctorsTable);

  // Data fetching
  const { data: hospitalsData, loading: hospitalsLoading, refetch: refetchHospitals } = hospitals;
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = categories;
  const { data: servicesData, loading: servicesLoading, refetch: refetchServices } = services;
  const { data: hospitalDoctorsData, loading: hospitalDoctorsLoading, refetch: refetchHospitalDoctors } = hospitalDoctors;
  const { data: doctorsData, loading: doctorsLoading } = doctors;

  // Column definitions
  const categoryColumns = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'image_url', 
      label: 'Image',
      render: (value: string) => value ? <img src={value} alt="Category" className="w-12 h-12 object-cover rounded" /> : 'No image'
    },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  const hospitalColumns = [
    { key: 'name', label: 'Hospital Name', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'emergency_services', label: 'Emergency', render: (value: boolean) => value ? 'Yes' : 'No' },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  const serviceColumns = [
    { key: 'name', label: 'Service Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', render: (value: number) => value ? `₹${value}` : 'N/A', sortable: true },
    { key: 'duration_hours', label: 'Duration (hrs)', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  const hospitalDoctorColumns = [
    { key: 'hospital_name', label: 'Hospital', sortable: true },
    { key: 'doctor_name', label: 'Doctor', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'consultation_fee', label: 'Fee', render: (value: number) => value ? `₹${value}` : 'N/A', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true }
  ];

  // Form field definitions
  const categoryFormFields: FormField[] = [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Image URL', type: 'text' }
  ];

  const hospitalFormFields: FormField[] = [
    { name: 'category_id', label: 'Category', type: 'select', options: categoriesData?.map(c => ({ value: c.id, label: c.name })) || [] },
    { name: 'name', label: 'Hospital Name', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'textarea', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode', type: 'text', required: true },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'specialities', label: 'Specialities', type: 'textarea', placeholder: 'Enter specialities separated by commas' },
    { name: 'emergency_services', label: 'Emergency Services', type: 'boolean' },
    { name: 'image_url', label: 'Image URL', type: 'text' }
  ];

  const serviceFormFields: FormField[] = [
    { name: 'hospital_id', label: 'Hospital', type: 'select', options: hospitalsData?.map(h => ({ value: h.id, label: h.name })) || [], required: true },
    { name: 'name', label: 'Service Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'surgery', label: 'Surgery' },
      { value: 'consultation', label: 'Consultation' },
      { value: 'diagnostic', label: 'Diagnostic' },
      { value: 'emergency', label: 'Emergency' },
      { value: 'therapy', label: 'Therapy' },
      { value: 'specialized', label: 'Specialized Care' }
    ]},
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'duration_hours', label: 'Duration (hours)', type: 'number' }
  ];

  const hospitalDoctorFormFields: FormField[] = [
    { name: 'hospital_id', label: 'Hospital', type: 'select', options: hospitalsData?.map(h => ({ value: h.id, label: h.name })) || [], required: true },
    { name: 'doctor_id', label: 'Doctor', type: 'select', options: doctorsData?.map(d => ({ value: d.id, label: d.name })) || [], required: true },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'position', label: 'Position', type: 'select', options: [
      { value: 'consultant', label: 'Consultant' },
      { value: 'senior_consultant', label: 'Senior Consultant' },
      { value: 'head_of_department', label: 'Head of Department' },
      { value: 'director', label: 'Director' },
      { value: 'chief_medical_officer', label: 'Chief Medical Officer' }
    ]},
    { name: 'available_days', label: 'Available Days', type: 'textarea', placeholder: 'Enter days separated by commas (mon, tue, wed, etc.)' },
    { name: 'consultation_fee', label: 'Consultation Fee', type: 'number' }
  ];

  // CRUD handlers
  const handleCategoryCreate = async (data: any) => {
    await categories.createItem(data);
    refetchCategories();
  };

  const handleCategoryUpdate = async (id: string, data: any) => {
    await categories.updateItem(id, data);
    refetchCategories();
  };

  const handleHospitalCreate = async (data: any) => {
    // Convert comma-separated strings to arrays
    if (data.specialities && typeof data.specialities === 'string') {
      data.specialities = data.specialities.split(',').map((item: string) => item.trim());
    }
    
    await hospitals.createItem(data);
    refetchHospitals();
  };

  const handleHospitalUpdate = async (id: string, data: any) => {
    // Convert comma-separated strings to arrays
    if (data.specialities && typeof data.specialities === 'string') {
      data.specialities = data.specialities.split(',').map((item: string) => item.trim());
    }
    
    await hospitals.updateItem(id, data);
    refetchHospitals();
  };

  const handleServiceCreate = async (data: any) => {
    await services.createItem(data);
    refetchServices();
  };

  const handleServiceUpdate = async (id: string, data: any) => {
    await services.updateItem(id, data);
    refetchServices();
  };

  const handleHospitalDoctorCreate = async (data: any) => {
    // Convert comma-separated string to array
    if (data.available_days && typeof data.available_days === 'string') {
      data.available_days = data.available_days.split(',').map((day: string) => day.trim());
    }
    
    await hospitalDoctors.createItem(data);
    refetchHospitalDoctors();
  };

  const handleHospitalDoctorUpdate = async (id: string, data: any) => {
    // Convert comma-separated string to array
    if (data.available_days && typeof data.available_days === 'string') {
      data.available_days = data.available_days.split(',').map((day: string) => day.trim());
    }
    
    await hospitalDoctors.updateItem(id, data);
    refetchHospitalDoctors();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospitals Management"
        description="Manage hospital categories, hospitals, services, and doctor assignments"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospital Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalsData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total hospitals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospital Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctor Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalDoctorsData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total assignments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hospitals
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Doctor Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hospital Categories</h3>
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
            title="Hospital Categories"
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

        <TabsContent value="hospitals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hospitals</h3>
            <FormDialog
              title="Add New Hospital"
              fields={hospitalFormFields}
              onSubmit={handleHospitalCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital
                </Button>
              }
            />
          </div>
          <DataTable
            title="Hospitals"
            data={hospitalsData || []}
            columns={hospitalColumns}
            loading={hospitalsLoading}
            onRefresh={refetchHospitals}
            onEdit={(hospital) => (
              <FormDialog
                title="Edit Hospital"
                fields={hospitalFormFields}
                initialData={{
                  ...hospital,
                  specialities: hospital.specialities ? hospital.specialities.join(', ') : ''
                }}
                onSubmit={(data) => handleHospitalUpdate(hospital.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => hospitals.deleteItem(id).then(() => refetchHospitals())}
            searchPlaceholder="Search hospitals..."
          />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hospital Services</h3>
            <FormDialog
              title="Add New Service"
              fields={serviceFormFields}
              onSubmit={handleServiceCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              }
            />
          </div>
          <DataTable
            title="Hospital Services"
            data={servicesData || []}
            columns={serviceColumns}
            loading={servicesLoading}
            onRefresh={refetchServices}
            onEdit={(service) => (
              <FormDialog
                title="Edit Service"
                fields={serviceFormFields}
                initialData={service}
                onSubmit={(data) => handleServiceUpdate(service.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => services.deleteItem(id).then(() => refetchServices())}
            searchPlaceholder="Search services..."
          />
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Doctor Assignments</h3>
            <FormDialog
              title="Add New Doctor Assignment"
              fields={hospitalDoctorFormFields}
              onSubmit={handleHospitalDoctorCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Doctor
                </Button>
              }
            />
          </div>
          <DataTable
            title="Doctor Assignments"
            data={hospitalDoctorsData || []}
            columns={hospitalDoctorColumns}
            loading={hospitalDoctorsLoading}
            onRefresh={refetchHospitalDoctors}
            onEdit={(assignment) => (
              <FormDialog
                title="Edit Doctor Assignment"
                fields={hospitalDoctorFormFields}
                initialData={{
                  ...assignment,
                  available_days: assignment.available_days ? assignment.available_days.join(', ') : ''
                }}
                onSubmit={(data) => handleHospitalDoctorUpdate(assignment.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => hospitalDoctors.deleteItem(id).then(() => refetchHospitalDoctors())}
            searchPlaceholder="Search assignments..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};