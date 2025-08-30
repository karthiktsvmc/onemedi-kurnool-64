import React, { useState } from 'react';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import {
  Home,
  Users,
  MapPin,
  Tags,
  Heart,
  Stethoscope,
  Activity,
  User,
  Target,
  Settings,
  FileSpreadsheet
} from 'lucide-react';

// Import the component modules
import { HomeCareServices } from '@/admin/components/HomeCare/HomeCareServices';
import { HomeCareCategories } from '@/admin/components/HomeCare/HomeCareCategories';
import { CareTakerManagement } from '@/admin/components/HomeCare/CareTakerManagement';
import { LocationManagement } from '@/admin/components/HomeCare/LocationManagement';
import { HomeCareOffers } from '@/admin/components/HomeCare/HomeCareOffers';
import { HomeCareBookings } from '@/admin/components/HomeCare/HomeCareBookings';
import { HomeCareAnalytics } from '@/admin/components/HomeCare/HomeCareAnalytics';
import { BulkImportExport } from '@/admin/components/shared/BulkImportExport';

export function HomeCareManagement() {
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    { id: 'services', label: 'Services', icon: Home },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'caretakers', label: 'Care Takers', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'offers', label: 'Offers & Discounts', icon: Target },
    { id: 'bookings', label: 'Bookings', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'import-export', label: 'Import/Export', icon: FileSpreadsheet }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Care Management"
        description="Manage home care services, categories, care takers, locations, and offers"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 text-xs lg:text-sm"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="services">
          <HomeCareServices />
        </TabsContent>

        <TabsContent value="categories">
          <HomeCareCategories />
        </TabsContent>

        <TabsContent value="caretakers">
          <CareTakerManagement />
        </TabsContent>

        <TabsContent value="locations">
          <LocationManagement />
        </TabsContent>

        <TabsContent value="offers">
          <HomeCareOffers />
        </TabsContent>

        <TabsContent value="bookings">
          <HomeCareBookings />
        </TabsContent>

        <TabsContent value="analytics">
          <HomeCareAnalytics />
        </TabsContent>

        <TabsContent value="import-export">
          <BulkImportExport 
            entityType="homecare"
            availableEntities={[
              { id: 'services', name: 'Home Care Services' },
              { id: 'categories', name: 'Service Categories' },
              { id: 'caretakers', name: 'Care Takers' },
              { id: 'offers', name: 'Offers & Discounts' }
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}