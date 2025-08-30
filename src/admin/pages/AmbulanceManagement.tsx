import React from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { Button } from '@/shared/components/ui/button';
import { Building2, Truck, ClipboardList } from 'lucide-react';

const AmbulanceManagement: React.FC = () => {
  const providers = [];
  const services = [];
  const enquiries = [];

  const providerColumns = [
    { key: 'name', label: 'Provider Name', sortable: true },
    { key: 'provider_type', label: 'Type', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Ambulance Management" />

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <DataTable
            title="Providers"
            data={providers}
            columns={providerColumns}
            loading={false}
            onRefresh={() => {}}
            searchPlaceholder="Search providers..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AmbulanceManagement;