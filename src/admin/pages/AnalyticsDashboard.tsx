import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { BusinessDashboard } from '@/admin/components/Analytics/BusinessDashboard';
import { RealtimeMonitoring } from '@/admin/components/Analytics/RealtimeMonitoring';
import { DataExport } from '@/admin/components/Analytics/DataExport';

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reporting"
        description="Comprehensive business insights, performance metrics, and data exports"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Business Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="exports">Data Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BusinessDashboard />
        </TabsContent>

        <TabsContent value="monitoring">
          <RealtimeMonitoring />
        </TabsContent>

        <TabsContent value="exports">
          <DataExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}