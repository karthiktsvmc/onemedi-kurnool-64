
import React, { useState } from 'react';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Ambulance, Clock, Phone, MapPin } from 'lucide-react';

const ambulanceServicesTable = new SupabaseTable('ambulance_services');

export default function AmbulanceManagement() {
  const ambulanceServices = useSupabaseTable(ambulanceServicesTable, { realtime: true });

  const columns = [
    { key: 'name', label: 'Service Name', sortable: true },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'contact', label: 'Contact' },
    { 
      key: 'vehicle_type', 
      label: 'Vehicle Type',
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">{value}</Badge>
      )
    },
    { 
      key: 'price', 
      label: 'Price',
      render: (value: number) => `₹${value}`
    },
    { 
      key: 'available_24x7', 
      label: '24x7 Service',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Available' : 'Limited Hours'}
        </Badge>
      )
    },
    { 
      key: 'service_radius_km', 
      label: 'Service Radius',
      render: (value: number) => `${value} km`
    }
  ];

  const formFields = [
    { name: 'name', label: 'Service Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'city', label: 'City', type: 'text' as const, required: true },
    { name: 'state', label: 'State', type: 'text' as const },
    { name: 'pincode', label: 'Pincode', type: 'text' as const },
    { name: 'contact', label: 'Contact', type: 'text' as const, required: true },
    { 
      name: 'vehicle_type', 
      label: 'Vehicle Type', 
      type: 'select' as const,
      options: [
        { value: 'basic', label: 'Basic Ambulance' },
        { value: 'advanced', label: 'Advanced Life Support' },
        { value: 'icu', label: 'ICU Ambulance' },
        { value: 'air', label: 'Air Ambulance' },
        { value: 'patient_transport', label: 'Patient Transport' }
      ]
    },
    { name: 'price', label: 'Base Price (₹)', type: 'number' as const, required: true, min: 0 },
    { name: 'equipment', label: 'Equipment (comma-separated)', type: 'textarea' as const, description: 'List available medical equipment' },
    { name: 'available_24x7', label: '24x7 Available', type: 'checkbox' as const },
    { name: 'service_radius_km', label: 'Service Radius (km)', type: 'number' as const, min: 1, max: 100 },
    { name: 'location_restricted', label: 'Location Restricted', type: 'checkbox' as const },
    { name: 'latitude', label: 'Latitude', type: 'number' as const, step: 0.0001 },
    { name: 'longitude', label: 'Longitude', type: 'number' as const, step: 0.0001 },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
  ];

  const handleCreate = async (data: any): Promise<void> => {
    // Process equipment array
    if (data.equipment) {
      data.equipment = data.equipment.split(',').map((item: string) => item.trim());
    }
    await ambulanceServices.createItem(data);
  };

  const handleUpdate = async (item: any, data: any): Promise<void> => {
    // Process equipment array
    if (data.equipment) {
      data.equipment = data.equipment.split(',').map((item: string) => item.trim());
    }
    await ambulanceServices.updateItem(item.id, data);
  };

  // Calculate metrics
  const metrics = {
    total: ambulanceServices.data.length,
    available24x7: ambulanceServices.data.filter(service => service.available_24x7).length,
    avgPrice: ambulanceServices.data.length > 0 
      ? Math.round(ambulanceServices.data.reduce((sum, service) => sum + service.price, 0) / ambulanceServices.data.length)
      : 0,
    byType: ambulanceServices.data.reduce((acc: any, service) => {
      acc[service.vehicle_type] = (acc[service.vehicle_type] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ambulance Management" 
        description="Manage ambulance services and emergency transportation providers"
      />

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Ambulance className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24x7 Available</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.available24x7}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <Phone className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics.avgPrice}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Areas</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(ambulanceServices.data.map(s => s.city)).size}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Ambulance Services Directory"
        description="Manage emergency transportation and ambulance service providers"
        data={ambulanceServices.data}
        columns={columns}
        loading={ambulanceServices.loading}
        onSearch={(query) => ambulanceServices.searchItems(query, ['name', 'city', 'state', 'vehicle_type'])}
        onDelete={(item) => ambulanceServices.deleteItem(item.id)}
        onRefresh={() => ambulanceServices.fetchData()}
        searchPlaceholder="Search ambulance services..."
        renderActions={(item) => (
          <FormDialog
            title="Edit Ambulance Service"
            fields={formFields}
            initialData={{
              ...item,
              equipment: Array.isArray(item.equipment) ? item.equipment.join(', ') : ''
            }}
            onSubmit={(data) => handleUpdate(item, data)}
            trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
          />
        )}
        actions={
          <FormDialog
            title="Add Ambulance Service"
            fields={formFields}
            onSubmit={handleCreate}
            trigger={<Button size="sm">Add Service</Button>}
          />
        }
      />
    </div>
  );
}
