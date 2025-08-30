import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, Building2, Package, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const HospitalsManagement: React.FC = () => {
  // Initialize Supabase tables
  const categoriesTable = useSupabaseTable('hospital_categories');
  const hospitalsTable = useSupabaseTable('hospitals');
  const servicesTable = useSupabaseTable('hospital_services');
  const hospitalDoctorsTable = useSupabaseTable('hospital_doctors');
  const doctorsTable = useSupabaseTable('doctors');

  // Data fetching
  const { data: categories, loading: categoriesLoading, refetch: refetchCategories } = categoriesTable;
  const { data: hospitals, loading: hospitalsLoading, refetch: refetchHospitals } = hospitalsTable;
  const { data: services, loading: servicesLoading, refetch: refetchServices } = servicesTable;
  const { data: hospitalDoctors, loading: hospitalDoctorsLoading, refetch: refetchHospitalDoctors } = hospitalDoctorsTable;
  const { data: doctors, loading: doctorsLoading } = doctorsTable;

  // Column definitions
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

  const hospitalColumns = [
    { key: 'name', label: 'Hospital Name', sortable: true },
    { key: 'hospital_type', label: 'Type', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'bed_count', label: 'Beds', sortable: true },
    { key: 'icu_beds', label: 'ICU Beds', sortable: true },
    { key: 'emergency_services', label: 'Emergency', render: (value: boolean) => value ? 'Yes' : 'No' },
    { key: 'rating', label: 'Rating', render: (value: number) => `${value}/5`, sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const serviceColumns = [
    { key: 'name', label: 'Service Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', render: (value: number) => value ? `₹${value}` : 'N/A', sortable: true },
    { key: 'duration_hours', label: 'Duration (hrs)', sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const hospitalDoctorColumns = [
    { key: 'hospital_name', label: 'Hospital', sortable: true },
    { key: 'doctor_name', label: 'Doctor', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'consultation_fee', label: 'Fee', render: (value: number) => value ? `₹${value}` : 'N/A', sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  // Form field definitions
  const categoryFormFields = [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const hospitalFormFields = [
    { name: 'category_id', label: 'Category', type: 'select', options: categories?.map(c => ({ value: c.id, label: c.name })) || [] },
    { name: 'name', label: 'Hospital Name', type: 'text', required: true },
    { name: 'hospital_type', label: 'Hospital Type', type: 'select', options: [
      { value: 'government', label: 'Government' },
      { value: 'private', label: 'Private' },
      { value: 'trust', label: 'Trust' },
      { value: 'corporate', label: 'Corporate' }
    ]},
    { name: 'address', label: 'Address', type: 'textarea', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode', type: 'text', required: true },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'license_number', label: 'License Number', type: 'text' },
    { name: 'website', label: 'Website', type: 'text' },
    { name: 'established_year', label: 'Established Year', type: 'number' },
    { name: 'bed_count', label: 'Total Beds', type: 'number', defaultValue: 0 },
    { name: 'icu_beds', label: 'ICU Beds', type: 'number', defaultValue: 0 },
    { name: 'operation_theaters', label: 'Operation Theaters', type: 'number', defaultValue: 0 },
    { name: 'specialities', label: 'Specialities', type: 'textarea', placeholder: 'Enter specialities separated by commas' },
    { name: 'accreditation', label: 'Accreditation', type: 'textarea', placeholder: 'Enter accreditations separated by commas' },
    { name: 'facilities', label: 'Facilities', type: 'textarea', placeholder: 'Enter facilities separated by commas' },
    { name: 'procedures', label: 'Procedures', type: 'textarea', placeholder: 'Enter procedures separated by commas' },
    { name: 'emergency_services', label: 'Emergency Services', type: 'checkbox' },
    { name: 'ambulance_services', label: 'Ambulance Services', type: 'checkbox' },
    { name: 'pharmacy', label: 'Pharmacy', type: 'checkbox' },
    { name: 'lab_services', label: 'Lab Services', type: 'checkbox' },
    { name: 'blood_bank', label: 'Blood Bank', type: 'checkbox' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const serviceFormFields = [
    { name: 'hospital_id', label: 'Hospital', type: 'select', options: hospitals?.map(h => ({ value: h.id, label: h.name })) || [], required: true },
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
    { name: 'duration_hours', label: 'Duration (hours)', type: 'number' },
    { name: 'includes', label: 'Includes', type: 'textarea', placeholder: 'Enter items included separated by commas' },
    { name: 'excludes', label: 'Excludes', type: 'textarea', placeholder: 'Enter items excluded separated by commas' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const hospitalDoctorFormFields = [
    { name: 'hospital_id', label: 'Hospital', type: 'select', options: hospitals?.map(h => ({ value: h.id, label: h.name })) || [], required: true },
    { name: 'doctor_id', label: 'Doctor', type: 'select', options: doctors?.map(d => ({ value: d.id, label: d.name })) || [], required: true },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'position', label: 'Position', type: 'select', options: [
      { value: 'consultant', label: 'Consultant' },
      { value: 'senior_consultant', label: 'Senior Consultant' },
      { value: 'head_of_department', label: 'Head of Department' },
      { value: 'director', label: 'Director' },
      { value: 'chief_medical_officer', label: 'Chief Medical Officer' }
    ]},
    { name: 'available_days', label: 'Available Days', type: 'textarea', placeholder: 'Enter days separated by commas (mon, tue, wed, etc.)' },
    { name: 'consultation_fee', label: 'Consultation Fee', type: 'number' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  // CRUD handlers
  const handleCategoryCreate = async (data: any) => {
    await categoriesTable.create(data);
    refetchCategories();
  };

  const handleCategoryUpdate = async (id: string, data: any) => {
    await categoriesTable.update(id, data);
    refetchCategories();
  };

  const handleHospitalCreate = async (data: any) => {
    // Convert comma-separated strings to arrays
    if (data.specialities && typeof data.specialities === 'string') {
      data.specialities = data.specialities.split(',').map((item: string) => item.trim());
    }
    if (data.accreditation && typeof data.accreditation === 'string') {
      data.accreditation = data.accreditation.split(',').map((item: string) => item.trim());
    }
    if (data.facilities && typeof data.facilities === 'string') {
      data.facilities = data.facilities.split(',').map((item: string) => item.trim());
    }
    if (data.procedures && typeof data.procedures === 'string') {
      data.procedures = data.procedures.split(',').map((item: string) => item.trim());
    }
    
    await hospitalsTable.create(data);
    refetchHospitals();
  };

  const handleHospitalUpdate = async (id: string, data: any) => {
    // Convert comma-separated strings to arrays
    if (data.specialities && typeof data.specialities === 'string') {
      data.specialities = data.specialities.split(',').map((item: string) => item.trim());
    }
    if (data.accreditation && typeof data.accreditation === 'string') {
      data.accreditation = data.accreditation.split(',').map((item: string) => item.trim());
    }
    if (data.facilities && typeof data.facilities === 'string') {
      data.facilities = data.facilities.split(',').map((item: string) => item.trim());
    }
    if (data.procedures && typeof data.procedures === 'string') {
      data.procedures = data.procedures.split(',').map((item: string) => item.trim());
    }
    
    await hospitalsTable.update(id, data);
    refetchHospitals();
  };

  const handleServiceCreate = async (data: any) => {
    // Convert comma-separated strings to arrays
    if (data.includes && typeof data.includes === 'string') {
      data.includes = data.includes.split(',').map((item: string) => item.trim());
    }
    if (data.excludes && typeof data.excludes === 'string') {
      data.excludes = data.excludes.split(',').map((item: string) => item.trim());
    }
    
    await servicesTable.create(data);
    refetchServices();
  };

  const handleServiceUpdate = async (id: string, data: any) => {
    // Convert comma-separated strings to arrays
    if (data.includes && typeof data.includes === 'string') {
      data.includes = data.includes.split(',').map((item: string) => item.trim());
    }
    if (data.excludes && typeof data.excludes === 'string') {
      data.excludes = data.excludes.split(',').map((item: string) => item.trim());
    }
    
    await servicesTable.update(id, data);
    refetchServices();
  };

  const handleHospitalDoctorCreate = async (data: any) => {
    // Convert comma-separated string to array
    if (data.available_days && typeof data.available_days === 'string') {
      data.available_days = data.available_days.split(',').map((day: string) => day.trim());
    }
    
    await hospitalDoctorsTable.create(data);
    refetchHospitalDoctors();
  };

  const handleHospitalDoctorUpdate = async (id: string, data: any) => {
    // Convert comma-separated string to array
    if (data.available_days && typeof data.available_days === 'string') {
      data.available_days = data.available_days.split(',').map((day: string) => day.trim());
    }
    
    await hospitalDoctorsTable.update(id, data);
    refetchHospitalDoctors();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospitals Management"
        subtitle="Manage hospital categories, hospitals, services, and doctor assignments"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospital Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.filter(c => c.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitals?.filter(h => h.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active hospitals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospital Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services?.filter(s => s.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctor Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalDoctors?.filter(hd => hd.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
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
            data={hospitals || []}
            columns={hospitalColumns}
            loading={hospitalsLoading}
            onRefresh={refetchHospitals}
            onEdit={(hospital) => (
              <FormDialog
                title="Edit Hospital"
                fields={hospitalFormFields}
                initialData={{
                  ...hospital,
                  specialities: hospital.specialities ? hospital.specialities.join(', ') : '',
                  accreditation: hospital.accreditation ? hospital.accreditation.join(', ') : '',
                  facilities: hospital.facilities ? hospital.facilities.join(', ') : '',
                  procedures: hospital.procedures ? hospital.procedures.join(', ') : ''
                }}
                onSubmit={(data) => handleHospitalUpdate(hospital.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => hospitalsTable.delete(id).then(() => refetchHospitals())}
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
            data={services || []}
            columns={serviceColumns}
            loading={servicesLoading}
            onRefresh={refetchServices}
            onEdit={(service) => (
              <FormDialog
                title="Edit Service"
                fields={serviceFormFields}
                initialData={{
                  ...service,
                  includes: service.includes ? service.includes.join(', ') : '',
                  excludes: service.excludes ? service.excludes.join(', ') : ''
                }}
                onSubmit={(data) => handleServiceUpdate(service.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => servicesTable.delete(id).then(() => refetchServices())}
            searchPlaceholder="Search services..."
          />
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Doctor Assignments</h3>
            <FormDialog
              title="Assign Doctor to Hospital"
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
            title="Hospital Doctor Assignments"
            data={hospitalDoctors || []}
            columns={hospitalDoctorColumns}
            loading={hospitalDoctorsLoading}
            onRefresh={refetchHospitalDoctors}
            onEdit={(assignment) => (
              <FormDialog
                title="Edit Assignment"
                fields={hospitalDoctorFormFields}
                initialData={{
                  ...assignment,
                  available_days: assignment.available_days ? assignment.available_days.join(', ') : ''
                }}
                onSubmit={(data) => handleHospitalDoctorUpdate(assignment.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => hospitalDoctorsTable.delete(id).then(() => refetchHospitalDoctors())}
            searchPlaceholder="Search assignments..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};