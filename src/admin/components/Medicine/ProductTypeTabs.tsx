import { Button } from '@/shared/components/ui/button';
import { Package, Layers, Grid3X3, FileText, RefreshCw, Settings } from 'lucide-react';

export type ProductTab = 'products' | 'variants' | 'inventory' | 'attributes' | 'tags' | 'pricing' | 'shipping' | 'reports';

interface ProductTypeTabsProps {
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
}

export const ProductTypeTabs = ({ activeTab, onTabChange }: ProductTypeTabsProps) => {
  const tabs = [
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'variants' as const, label: 'Variants', icon: Layers },
    { id: 'inventory' as const, label: 'Inventory', icon: Grid3X3 },
    { id: 'attributes' as const, label: 'Attributes', icon: Settings },
    { id: 'tags' as const, label: 'Tags', icon: FileText },
    { id: 'pricing' as const, label: 'Pricing', icon: RefreshCw },
    { id: 'shipping' as const, label: 'Shipping', icon: Package },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
  ];

  return (
    <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            size="sm"
            className="text-xs"
          >
            <Icon className="h-3 w-3 mr-1" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};