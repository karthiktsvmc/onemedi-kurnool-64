import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Plus, Users, Activity, Package, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const PhysiotherapyManagement: React.FC = () => {
  // Mock data for demonstration - in real implementation, use Supabase hooks
  const categories = [
    { id: '1', name: 'Rehabilitation', description: 'Post-injury rehabilitation services', active: true },
    { id: '2', name: 'Sports Therapy', description: 'Sports injury treatment and prevention', active: true },
    { id: '3', name: 'Geriatric Care', description: 'Physiotherapy for elderly patients', active: true }
  ];

  const therapists = [
    { 
      id: '1', 
      name: 'Dr. Priya Sharma', 
      experience_years: 8, 
      specializations: ['Orthopedic', 'Sports'], 
      city: 'Kurnool',
      rating: 4.8,
      available: true,
      verified: true
    },
    { 
      id: '2', 
      name: 'Dr. Raj Kumar', 
      experience_years: 12, 
      specializations: ['Neurological', 'Pediatric'], 
      city: 'Kurnool',
      rating: 4.6,
      available: true,
      verified: true
    }
  ];

  const services = [
    {
      id: '1',
      name: 'Home Physiotherapy Session',
      service_type: 'home_visit',
      price: 800,
      session_duration_minutes: 60,
      city: 'Kurnool',
      active: true
    },
    {
      id: '2', 
      name: 'Clinic Consultation',
      service_type: 'clinic_session',
      price: 500,
      session_duration_minutes: 45,
      city: 'Kurnool',
      active: true
    }
  ];

  const offers = [
    {
      id: '1',
      title: '10% Off First Session',
      offer_type: 'percentage',
      discount_value: 10,
      valid_until: '2024-03-31',
      active: true,
      used_count: 25
    }
  ];

  // Column definitions
  const categoryColumns = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const therapistColumns = [
    { key: 'name', label: 'Therapist Name', sortable: true },
    { key: 'experience_years', label: 'Experience', render: (value: number) => `${value} years`, sortable: true },
    { key: 'specializations', label: 'Specializations', render: (value: string[]) => value.join(', ') },
    { key: 'city', label: 'Location', sortable: true },
    { key: 'rating', label: 'Rating', render: (value: number) => `${value}/5`, sortable: true },
    { key: 'verified', label: 'Verified', render: (value: boolean) => value ? 'Yes' : 'No' },
    { key: 'available', label: 'Available', render: (value: boolean) => value ? 'Yes' : 'No' }
  ];

  const serviceColumns = [
    { key: 'name', label: 'Service Name', sortable: true },
    { key: 'service_type', label: 'Type', sortable: true },
    { key: 'price', label: 'Price', render: (value: number) => `₹${value}`, sortable: true },
    { key: 'session_duration_minutes', label: 'Duration', render: (value: number) => `${value} min`, sortable: true },
    { key: 'city', label: 'Location', sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const offerColumns = [
    { key: 'title', label: 'Offer Title', sortable: true },
    { key: 'offer_type', label: 'Type', sortable: true },
    { key: 'discount_value', label: 'Discount', render: (value: number, row: any) => 
      row.offer_type === 'percentage' ? `${value}%` : `₹${value}` },
    { key: 'valid_until', label: 'Valid Until', sortable: true },
    { key: 'used_count', label: 'Usage', sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  // Form field definitions
  const categoryFormFields = [
    { name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const therapistFormFields = [
    { name: 'name', label: 'Therapist Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'experience_years', label: 'Experience (Years)', type: 'number', required: true },
    { name: 'qualifications', label: 'Qualifications', type: 'textarea', placeholder: 'Enter qualifications separated by commas' },
    { name: 'specializations', label: 'Specializations', type: 'textarea', placeholder: 'Enter specializations separated by commas' },
    { name: 'certifications', label: 'Certifications', type: 'textarea', placeholder: 'Enter certifications separated by commas' },
    { name: 'languages', label: 'Languages', type: 'textarea', placeholder: 'Enter languages separated by commas' },
    { name: 'bio', label: 'Bio', type: 'textarea' },
    { name: 'gender', label: 'Gender', type: 'select', options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]},
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'service_radius_km', label: 'Service Radius (km)', type: 'number', defaultValue: 10 },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'verified', label: 'Verified', type: 'checkbox' },
    { name: 'available', label: 'Available', type: 'checkbox', defaultValue: true }
  ];

  const serviceFormFields = [
    { name: 'category_id', label: 'Category', type: 'select', options: categories.map(cat => ({ value: cat.id, label: cat.name })), required: true },
    { name: 'therapist_id', label: 'Therapist', type: 'select', options: therapists.map(t => ({ value: t.id, label: t.name })) },
    { name: 'name', label: 'Service Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'service_type', label: 'Service Type', type: 'select', options: [
      { value: 'home_visit', label: 'Home Visit' },
      { value: 'clinic_session', label: 'Clinic Session' },
      { value: 'package', label: 'Package' }
    ], required: true },
    { name: 'session_duration_minutes', label: 'Session Duration (minutes)', type: 'number', defaultValue: 60 },
    { name: 'sessions_included', label: 'Sessions Included', type: 'number', defaultValue: 1 },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'original_price', label: 'Original Price', type: 'number' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'service_radius_km', label: 'Service Radius (km)', type: 'number', defaultValue: 10 },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const offerFormFields = [
    { name: 'title', label: 'Offer Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'offer_type', label: 'Offer Type', type: 'select', options: [
      { value: 'percentage', label: 'Percentage' },
      { value: 'fixed_amount', label: 'Fixed Amount' },
      { value: 'session_discount', label: 'Session Discount' }
    ], required: true },
    { name: 'discount_value', label: 'Discount Value', type: 'number', required: true },
    { name: 'minimum_sessions', label: 'Minimum Sessions', type: 'number', defaultValue: 1 },
    { name: 'maximum_discount_amount', label: 'Maximum Discount Amount', type: 'number' },
    { name: 'applicable_to', label: 'Applicable To', type: 'select', options: [
      { value: 'all', label: 'All Services' },
      { value: 'specific_services', label: 'Specific Services' },
      { value: 'specific_therapists', label: 'Specific Therapists' }
    ], defaultValue: 'all' },
    { name: 'valid_from', label: 'Valid From', type: 'date' },
    { name: 'valid_until', label: 'Valid Until', type: 'date', required: true },
    { name: 'usage_limit', label: 'Usage Limit', type: 'number' },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  // Mock handlers - in real implementation, use Supabase mutations
  const handleCategoryCreate = async (data: any) => {
    console.log('Creating category:', data);
  };

  const handleTherapistCreate = async (data: any) => {
    // Convert comma-separated strings to arrays
    if (data.qualifications) data.qualifications = data.qualifications.split(',').map((s: string) => s.trim());
    if (data.specializations) data.specializations = data.specializations.split(',').map((s: string) => s.trim());
    if (data.certifications) data.certifications = data.certifications.split(',').map((s: string) => s.trim());
    if (data.languages) data.languages = data.languages.split(',').map((s: string) => s.trim());
    console.log('Creating therapist:', data);
  };

  const handleServiceCreate = async (data: any) => {
    console.log('Creating service:', data);
  };

  const handleOfferCreate = async (data: any) => {
    console.log('Creating offer:', data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Physiotherapy Management"
        description="Manage physiotherapy services, therapists, categories, and offers"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Therapists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{therapists.filter(t => t.verified).length}</div>
            <p className="text-xs text-muted-foreground">Available for bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.filter(s => s.active).length}</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.filter(o => o.active).length}</div>
            <p className="text-xs text-muted-foreground">Running promotions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="therapists" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Therapists
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Offers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Categories</h3>
            <FormDialog
              title="Add New Category"
              fields={categoryFormFields as any}
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
            title="Physiotherapy Categories"
            data={categories}
            columns={categoryColumns}
            loading={false}
            onRefresh={() => {}}
            searchPlaceholder="Search categories..."
          />
        </TabsContent>

        <TabsContent value="therapists" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Physiotherapists</h3>
            <FormDialog
              title="Add New Therapist"
              fields={therapistFormFields as any}
              onSubmit={handleTherapistCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Therapist
                </Button>
              }
            />
          </div>
          <DataTable
            title="Physiotherapists"
            data={therapists}
            columns={therapistColumns}
            loading={false}
            onRefresh={() => {}}
            searchPlaceholder="Search therapists..."
          />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Services</h3>
            <FormDialog
              title="Add New Service"
              fields={serviceFormFields as any}
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
            title="Physiotherapy Services"
            data={services}
            columns={serviceColumns}
            loading={false}
            onRefresh={() => {}}
            searchPlaceholder="Search services..."
          />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Offers & Discounts</h3>
            <FormDialog
              title="Add New Offer"
              fields={offerFormFields as any}
              onSubmit={handleOfferCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Offer
                </Button>
              }
            />
          </div>
          <DataTable
            title="Physiotherapy Offers"
            data={offers}
            columns={offerColumns}
            loading={false}
            onRefresh={() => {}}
            searchPlaceholder="Search offers..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};