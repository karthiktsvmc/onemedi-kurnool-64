
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { ScanCatalogue } from '@/admin/components/Scans/ScanCatalogue';
import { ScanCategories } from '@/admin/components/Scans/ScanCategories';
import { ScanPackages } from '@/admin/components/Scans/ScanPackages';
import { ScanDiagnosticCentres } from '@/admin/components/Scans/ScanDiagnosticCentres';
import { ScanPromotions } from '@/admin/components/Scans/ScanPromotions';
import { ScanVariants } from '@/admin/components/Scans/ScanVariants';
import { 
  Scan as ScanIcon, 
  Tag,
  Package, 
  Building2, 
  Megaphone, 
  Layers
} from 'lucide-react';

export default function ScanManagement() {
  const [activeTab, setActiveTab] = useState('catalogue');

  const tabs = [
    { id: 'catalogue', label: 'Scans Catalogue', icon: ScanIcon },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'centres', label: 'Diagnostic Centres', icon: Building2 },
    { id: 'variants', label: 'Pricing Variants', icon: Layers },
    { id: 'promotions', label: 'Promotions', icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scans Management"
        description="Manage scans, packages, diagnostic centres, and promotions with real-time sync"
        showBack
        backTo="/admin"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
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
          <ScanCatalogue />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <ScanCategories />
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <ScanPackages />
        </TabsContent>

        <TabsContent value="centres" className="space-y-6">
          <ScanDiagnosticCentres />
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <ScanVariants />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <ScanPromotions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
