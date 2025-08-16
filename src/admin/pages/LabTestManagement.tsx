import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PageHeader } from '../components/shared/PageHeader';
import { LabTestCatalogue } from '../components/LabTests/LabTestCatalogue';
import { LabPackageManagement } from '../components/LabTests/LabPackageManagement';
import { DiagnosticCentreManagement } from '../components/LabTests/DiagnosticCentreManagement';
import { LabPromotionManagement } from '../components/LabTests/LabPromotionManagement';
import { LabTestCategories } from '../components/LabTests/LabTestCategories';
import { 
  TestTube, 
  Package, 
  Building2, 
  Megaphone, 
  Tag,
  BarChart3
} from 'lucide-react';

export const LabTestManagement = () => {
  const [activeTab, setActiveTab] = useState('catalogue');

  const tabs = [
    { id: 'catalogue', label: 'Master Catalogue', icon: TestTube },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'packages', label: 'Packages & Panels', icon: Package },
    { id: 'centres', label: 'Diagnostic Centres', icon: Building2 },
    { id: 'promotions', label: 'Promotions', icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lab Tests Management"
        description="Manage lab tests, packages, diagnostic centres, and promotions"
        showBack
        backTo="/admin"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="catalogue" className="space-y-6">
          <LabTestCatalogue />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <LabTestCategories />
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <LabPackageManagement />
        </TabsContent>

        <TabsContent value="centres" className="space-y-6">
          <DiagnosticCentreManagement />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <LabPromotionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};