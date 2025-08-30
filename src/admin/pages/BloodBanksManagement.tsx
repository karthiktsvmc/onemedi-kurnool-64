import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { Button } from '@/shared/components/ui/button';
import { Plus, Building2, Users, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const BloodBanksManagement: React.FC = () => {
  // Initialize Supabase tables
  const bloodBanksTable = useSupabaseTable('blood_banks');
  const donorsTable = useSupabaseTable('blood_donors');
  const inventoryTable = useSupabaseTable('blood_inventory');

  // Data fetching
  const { data: bloodBanks, loading: bloodBanksLoading, refetch: refetchBloodBanks } = bloodBanksTable;
  const { data: donors, loading: donorsLoading, refetch: refetchDonors } = donorsTable;
  const { data: inventory, loading: inventoryLoading, refetch: refetchInventory } = inventoryTable;

  // Column definitions
  const bloodBankColumns = [
    { key: 'name', label: 'Blood Bank Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'license_number', label: 'License', sortable: true },
    { key: 'storage_capacity', label: 'Storage Capacity', sortable: true },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const donorColumns = [
    { key: 'name', label: 'Donor Name', sortable: true },
    { key: 'blood_group', label: 'Blood Group', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'weight', label: 'Weight (kg)', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'last_donation_date', label: 'Last Donation', sortable: true },
    { key: 'eligible_for_donation', label: 'Eligible', render: (value: boolean) => value ? 'Yes' : 'No' },
    { key: 'active', label: 'Status', render: (value: boolean) => value ? 'Active' : 'Inactive' }
  ];

  const inventoryColumns = [
    { key: 'blood_bank_name', label: 'Blood Bank', sortable: true },
    { key: 'blood_group', label: 'Blood Group', sortable: true },
    { key: 'component_type', label: 'Component', sortable: true },
    { key: 'units_available', label: 'Units Available', sortable: true },
    { key: 'expiry_date', label: 'Expiry Date', sortable: true },
    { key: 'last_updated', label: 'Last Updated', sortable: true }
  ];

  // Form field definitions
  const bloodBankFormFields = [
    { name: 'name', label: 'Blood Bank Name', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'government', label: 'Government' },
      { value: 'private', label: 'Private' },
      { value: 'ngo', label: 'NGO' },
      { value: 'hospital_based', label: 'Hospital Based' }
    ]},
    { name: 'address', label: 'Address', type: 'textarea', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode', type: 'text', required: true },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'emergency_contact', label: 'Emergency Contact', type: 'text' },
    { name: 'license_number', label: 'License Number', type: 'text' },
    { name: 'storage_capacity', label: 'Storage Capacity (units)', type: 'number', defaultValue: 0 },
    { name: 'available_blood_groups', label: 'Available Blood Groups', type: 'textarea', placeholder: 'Enter blood groups separated by commas (A+, B+, O+, etc.)' },
    { name: 'facilities', label: 'Facilities', type: 'textarea', placeholder: 'Enter facilities separated by commas' },
    { name: 'image_url', label: 'Image URL', type: 'text' },
    { name: 'location_restricted', label: 'Location Restricted', type: 'checkbox', defaultValue: true },
    { name: 'service_radius_km', label: 'Service Radius (km)', type: 'number', defaultValue: 15 },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const donorFormFields = [
    { name: 'name', label: 'Donor Name', type: 'text', required: true },
    { name: 'blood_group', label: 'Blood Group', type: 'select', options: [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' }
    ], required: true },
    { name: 'phone', label: 'Phone', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'weight', label: 'Weight (kg)', type: 'number', step: 0.1 },
    { name: 'gender', label: 'Gender', type: 'select', options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]},
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'last_donation_date', label: 'Last Donation Date', type: 'date' },
    { name: 'eligible_for_donation', label: 'Eligible for Donation', type: 'checkbox', defaultValue: true },
    { name: 'active', label: 'Active', type: 'checkbox', defaultValue: true }
  ];

  const inventoryFormFields = [
    { name: 'blood_bank_id', label: 'Blood Bank', type: 'select', options: bloodBanks?.map(bb => ({ value: bb.id, label: bb.name })) || [], required: true },
    { name: 'blood_group', label: 'Blood Group', type: 'select', options: [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' }
    ], required: true },
    { name: 'component_type', label: 'Component Type', type: 'select', options: [
      { value: 'whole_blood', label: 'Whole Blood' },
      { value: 'plasma', label: 'Plasma' },
      { value: 'platelets', label: 'Platelets' },
      { value: 'rbc', label: 'Red Blood Cells' }
    ], defaultValue: 'whole_blood' },
    { name: 'units_available', label: 'Units Available', type: 'number', required: true, defaultValue: 0 },
    { name: 'expiry_date', label: 'Expiry Date', type: 'date' }
  ];

  // CRUD handlers
  const handleBloodBankCreate = async (data: any) => {
    // Convert comma-separated strings to arrays
    if (data.available_blood_groups && typeof data.available_blood_groups === 'string') {
      data.available_blood_groups = data.available_blood_groups.split(',').map((item: string) => item.trim());
    }
    if (data.facilities && typeof data.facilities === 'string') {
      data.facilities = data.facilities.split(',').map((item: string) => item.trim());
    }
    
    await bloodBanksTable.create(data);
    refetchBloodBanks();
  };

  const handleBloodBankUpdate = async (id: string, data: any) => {
    // Convert comma-separated strings to arrays
    if (data.available_blood_groups && typeof data.available_blood_groups === 'string') {
      data.available_blood_groups = data.available_blood_groups.split(',').map((item: string) => item.trim());
    }
    if (data.facilities && typeof data.facilities === 'string') {
      data.facilities = data.facilities.split(',').map((item: string) => item.trim());
    }
    
    await bloodBanksTable.update(id, data);
    refetchBloodBanks();
  };

  const handleDonorCreate = async (data: any) => {
    await donorsTable.create(data);
    refetchDonors();
  };

  const handleDonorUpdate = async (id: string, data: any) => {
    await donorsTable.update(id, data);
    refetchDonors();
  };

  const handleInventoryCreate = async (data: any) => {
    await inventoryTable.create(data);
    refetchInventory();
  };

  const handleInventoryUpdate = async (id: string, data: any) => {
    await inventoryTable.update(id, data);
    refetchInventory();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blood Banks Management"
        subtitle="Manage blood banks, donors, and blood inventory"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Banks</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bloodBanks?.filter(bb => bb.active).length || 0}</div>
            <p className="text-xs text-muted-foreground">Active blood banks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donors?.filter(d => d.active && d.eligible_for_donation).length || 0}</div>
            <p className="text-xs text-muted-foreground">Eligible donors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory?.reduce((total, item) => total + (item.units_available || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total units available</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bloodbanks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bloodbanks" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Blood Banks
          </TabsTrigger>
          <TabsTrigger value="donors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Donors
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bloodbanks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Blood Banks</h3>
            <FormDialog
              title="Add New Blood Bank"
              fields={bloodBankFormFields}
              onSubmit={handleBloodBankCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blood Bank
                </Button>
              }
            />
          </div>
          <DataTable
            title="Blood Banks"
            data={bloodBanks || []}
            columns={bloodBankColumns}
            loading={bloodBanksLoading}
            onRefresh={refetchBloodBanks}
            onEdit={(bloodBank) => (
              <FormDialog
                title="Edit Blood Bank"
                fields={bloodBankFormFields}
                initialData={{
                  ...bloodBank,
                  available_blood_groups: bloodBank.available_blood_groups ? bloodBank.available_blood_groups.join(', ') : '',
                  facilities: bloodBank.facilities ? bloodBank.facilities.join(', ') : ''
                }}
                onSubmit={(data) => handleBloodBankUpdate(bloodBank.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => bloodBanksTable.delete(id).then(() => refetchBloodBanks())}
            searchPlaceholder="Search blood banks..."
          />
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Blood Donors</h3>
            <FormDialog
              title="Add New Donor"
              fields={donorFormFields}
              onSubmit={handleDonorCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Donor
                </Button>
              }
            />
          </div>
          <DataTable
            title="Blood Donors"
            data={donors || []}
            columns={donorColumns}
            loading={donorsLoading}
            onRefresh={refetchDonors}
            onEdit={(donor) => (
              <FormDialog
                title="Edit Donor"
                fields={donorFormFields}
                initialData={donor}
                onSubmit={(data) => handleDonorUpdate(donor.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => donorsTable.delete(id).then(() => refetchDonors())}
            searchPlaceholder="Search donors..."
          />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Blood Inventory</h3>
            <FormDialog
              title="Add Inventory Record"
              fields={inventoryFormFields}
              onSubmit={handleInventoryCreate}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Inventory
                </Button>
              }
            />
          </div>
          <DataTable
            title="Blood Inventory"
            data={inventory || []}
            columns={inventoryColumns}
            loading={inventoryLoading}
            onRefresh={refetchInventory}
            onEdit={(item) => (
              <FormDialog
                title="Edit Inventory"
                fields={inventoryFormFields}
                initialData={item}
                onSubmit={(data) => handleInventoryUpdate(item.id, data)}
                trigger={<Button variant="outline" size="sm">Edit</Button>}
              />
            )}
            onDelete={(id) => inventoryTable.delete(id).then(() => refetchInventory())}
            searchPlaceholder="Search inventory..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};