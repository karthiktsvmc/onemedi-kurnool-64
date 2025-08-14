import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Search, Filter as FilterIcon, SortAsc } from 'lucide-react';
import { LabTestCard } from './LabTestCard';
import { LabTestFilters } from './LabTestFilters';

interface LabTest {
  id: string;
  image: string;
  title: string;
  description: string;
  sampleType: string;
  fastingRequired: boolean;
  parameters: number;
  tags: string[];
  centers: any[];
}

interface Package {
  id: string;
  name: string;
  tests: string;
  price: string;
  originalPrice: string;
  discount: string;
  description?: string;
  image?: string;
}

interface FilterableTabsProps {
  labTests: LabTest[];
  packages: Package[];
  onAddToCart: (testId: string, centerId: string) => void;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
  className?: string;
}

export const FilterableTabs: React.FC<FilterableTabsProps> = ({
  labTests,
  packages,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({});

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Alphabetical' }
  ];

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Filter tests based on search and filters
  const filteredTests = labTests.filter(test => {
    if (searchQuery) {
      return test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             test.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Filter packages based on search
  const filteredPackages = packages.filter(pkg => {
    if (searchQuery) {
      return pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             pkg.tests.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className={`${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="tests" className="text-sm">
              Individual Tests
              <Badge variant="secondary" className="ml-2 text-xs">
                {filteredTests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="packages" className="text-sm">
              Health Packages
              <Badge variant="secondary" className="ml-2 text-xs">
                {filteredPackages.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 flex-1 md:max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${activeTab === 'tests' ? 'tests' : 'packages'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10"
              />
            </div>
            
            <div className="flex gap-2">
              {activeTab === 'tests' && (
                <LabTestFilters 
                  onFiltersChange={handleFiltersChange} 
                  resultCount={filteredTests.length}
                />
              )}
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TabsContent value="tests" className="mt-6">
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredTests.length} tests</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTests.map(test => (
              <LabTestCard
                key={test.id}
                {...test}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No tests found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredPackages.length} packages</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-emergency text-white">{pkg.discount}</Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.tests}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">{pkg.originalPrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No packages found</h3>
                <p>Try adjusting your search</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};