import React, { useState } from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Building2, Users, Package, TrendingUp } from 'lucide-react';

// Initialize vendor tables
const vendorsTable = new SupabaseTable('vendors');
const vendorLocationsTable = new SupabaseTable('vendor_locations');

export default function VendorManagement() {
  const [activeTab, setActiveTab] = useState<'vendors' | 'locations' | 'analytics'>('vendors');

  // Hooks for data management
  const vendors = useSupabaseTable(vendorsTable, { realtime: true });
  const locations = useSupabaseTable(vendorLocationsTable, { realtime: true });

  // Vendor columns
  const vendorColumns = [
    { key: 'name', label: 'Vendor Name', sortable: true },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">{value}</Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : value === 'pending' ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      )
    },
    { key: 'contact_person', label: 'Contact Person' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { 
      key: 'commission_rate', 
      label: 'Commission',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'created_at', 
      label: 'Registered',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  // Location columns
  const locationColumns = [
    { key: 'vendor_name', label: 'Vendor' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
    { 
      key: 'is_primary', 
      label: 'Primary',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Primary' : 'Secondary'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'destructive'}>
          {value}
        </Badge>
      )
    }
  ];

  // Vendor form fields
  const vendorFormFields = [
    { name: 'name', label: 'Vendor Name', type: 'text' as const, required: true },
    { 
      name: 'type', 
      label: 'Vendor Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'pharmacy', label: 'Pharmacy' },
        { value: 'diagnostic_center', label: 'Diagnostic Center' },
        { value: 'hospital', label: 'Hospital' },
        { value: 'homecare', label: 'Home Care' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'ambulance', label: 'Ambulance' },
        { value: 'blood_bank', label: 'Blood Bank' }
      ]
    },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'contact_person', label: 'Contact Person', type: 'text' as const, required: true },
    { name: 'phone', label: 'Phone', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    { name: 'website', label: 'Website', type: 'text' as const },
    { name: 'gst_number', label: 'GST Number', type: 'text' as const },
    { name: 'pan_number', label: 'PAN Number', type: 'text' as const },
    { name: 'license_number', label: 'License Number', type: 'text' as const },
    { name: 'commission_rate', label: 'Commission Rate (%)', type: 'number' as const, min: 0, max: 100, step: 0.01 },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select' as const, 
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    { name: 'logo_url', label: 'Logo URL', type: 'text' as const },
    { name: 'documents', label: 'Documents (JSON)', type: 'textarea' as const, description: 'Upload documents as JSON array' },
    { name: 'operating_hours', label: 'Operating Hours (JSON)', type: 'textarea' as const, description: 'Define operating hours as JSON' },
    { name: 'services_offered', label: 'Services Offered', type: 'textarea' as const, description: 'Comma-separated list of services' },
    { name: 'coverage_areas', label: 'Coverage Areas', type: 'textarea' as const, description: 'Comma-separated list of areas covered' }
  ];

  // Location form fields
  const locationFormFields = [
    { 
      name: 'vendor_id', 
      label: 'Vendor', 
      type: 'select' as const, 
      required: true,
      options: vendors.data.map(vendor => ({ value: vendor.id, label: vendor.name }))
    },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'state', label: 'State', type: 'text' as const, required: true },
    { name: 'pincode', label: 'Pincode', type: 'text' as const, required: true },
    { name: 'latitude', label: 'Latitude', type: 'number' as const, step: 'any' },
    { name: 'longitude', label: 'Longitude', type: 'number' as const, step: 'any' },
    { name: 'contact_phone', label: 'Contact Phone', type: 'text' as const },
    { name: 'manager_name', label: 'Manager Name', type: 'text' as const },
    { name: 'is_primary', label: 'Primary Location', type: 'checkbox' as const },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select' as const, 
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  // Form handlers
  const handleVendorCreate = async (data: any): Promise<void> => {
    // Process arrays and JSON fields
    if (data.services_offered) {
      data.services_offered = data.services_offered.split(',').map((s: string) => s.trim());
    }
    if (data.coverage_areas) {
      data.coverage_areas = data.coverage_areas.split(',').map((s: string) => s.trim());
    }
    if (data.documents) {
      try {
        data.documents = JSON.parse(data.documents);
      } catch (e) {
        data.documents = [];
      }
    }
    if (data.operating_hours) {
      try {
        data.operating_hours = JSON.parse(data.operating_hours);
      } catch (e) {
        data.operating_hours = {};
      }
    }
    await vendors.createItem(data);
  };

  const handleVendorUpdate = async (item: any, data: any): Promise<void> => {
    // Process arrays and JSON fields
    if (data.services_offered) {
      data.services_offered = data.services_offered.split(',').map((s: string) => s.trim());
    }
    if (data.coverage_areas) {
      data.coverage_areas = data.coverage_areas.split(',').map((s: string) => s.trim());
    }
    if (data.documents) {
      try {
        data.documents = JSON.parse(data.documents);
      } catch (e) {
        data.documents = [];
      }
    }
    if (data.operating_hours) {
      try {
        data.operating_hours = JSON.parse(data.operating_hours);
      } catch (e) {
        data.operating_hours = {};
      }
    }
    await vendors.updateItem(item.id, data);
  };

  const handleLocationCreate = async (data: any): Promise<void> => {
    await locations.createItem(data);
  };

  const handleLocationUpdate = async (item: any, data: any): Promise<void> => {
    await locations.updateItem(item.id, data);
  };

  // Analytics data
  const vendorStats = {
    total: vendors.data.length,
    active: vendors.data.filter(v => v.status === 'active').length,
    pending: vendors.data.filter(v => v.status === 'pending').length,
    byType: vendors.data.reduce((acc: any, vendor) => {
      acc[vendor.type] = (acc[vendor.type] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Management"
        description="Manage vendor partnerships, locations, and performance"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vendorStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{vendorStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.data.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <DataTable
            title="Vendor Directory"
            description="Manage vendor partnerships and onboarding"
            data={vendors.data}
            columns={vendorColumns}
            loading={vendors.loading}
            onSearch={(query) => vendors.searchItems(query, ['name', 'contact_person', 'email', 'type'])}
            onDelete={(item) => vendors.deleteItem(item.id)}
            onRefresh={() => vendors.fetchData()}
            searchPlaceholder="Search vendors..."
            renderActions={(item) => (
              <div className="flex gap-2">
                <FormDialog
                  title="Edit Vendor"
                  fields={vendorFormFields}
                  initialData={{
                    ...item,
                    services_offered: Array.isArray(item.services_offered) ? item.services_offered.join(', ') : '',
                    coverage_areas: Array.isArray(item.coverage_areas) ? item.coverage_areas.join(', ') : '',
                    documents: JSON.stringify(item.documents || []),
                    operating_hours: JSON.stringify(item.operating_hours || {})
                  }}
                  onSubmit={(data) => handleVendorUpdate(item, data)}
                  trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
                />
              </div>
            )}
            actions={
              <FormDialog
                title="Add Vendor"
                fields={vendorFormFields}
                onSubmit={handleVendorCreate}
                trigger={<Button size="sm">Add Vendor</Button>}
              />
            }
          />
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <DataTable
            title="Vendor Locations"
            description="Manage vendor location directories"
            data={locations.data}
            columns={locationColumns}
            loading={locations.loading}
            onSearch={(query) => locations.searchItems(query, ['address', 'city', 'state', 'pincode'])}
            onDelete={(item) => locations.deleteItem(item.id)}
            onRefresh={() => locations.fetchData()}
            searchPlaceholder="Search locations..."
            renderActions={(item) => (
              <div className="flex gap-2">
                <FormDialog
                  title="Edit Location"
                  fields={locationFormFields}
                  initialData={item}
                  onSubmit={(data) => handleLocationUpdate(item, data)}
                  trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
                />
              </div>
            )}
            actions={
              <FormDialog
                title="Add Location"
                fields={locationFormFields}
                onSubmit={handleLocationCreate}
                trigger={<Button size="sm">Add Location</Button>}
              />
            }
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(vendorStats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Active</span>
                    <Badge variant="default">{vendorStats.active}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending</span>
                    <Badge variant="secondary">{vendorStats.pending}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Suspended</span>
                    <Badge variant="destructive">
                      {vendors.data.filter(v => v.status === 'suspended').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}