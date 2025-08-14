import { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Slider } from '@/shared/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { 
  Filter, 
  X, 
  MapPin, 
  Shield, 
  Award,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface LabTestFiltersProps {
  onFiltersChange: (filters: any) => void;
  resultCount: number;
}

export const LabTestFilters = ({ onFiltersChange, resultCount }: LabTestFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    conditions: [] as string[],
    risks: [] as string[],
    organs: [] as string[],
    homeCollection: false,
    nabl: false,
    doctorRecommended: false,
    priceRange: [0, 5000] as number[],
    ageGroup: '',
    gender: ''
  });

  const conditionFilters: FilterOption[] = [
    { id: 'diabetes', label: 'Diabetes', count: 45 },
    { id: 'thyroid', label: 'Thyroid', count: 32 },
    { id: 'fever', label: 'Fever', count: 28 },
    { id: 'allergy', label: 'Allergy', count: 22 },
    { id: 'cancer', label: 'Cancer', count: 18 },
    { id: 'pregnancy', label: 'Pregnancy', count: 25 },
    { id: 'pcos', label: 'PCOS', count: 15 },
    { id: 'obesity', label: 'Obesity', count: 12 }
  ];

  const riskFilters: FilterOption[] = [
    { id: 'full-body', label: 'Full Body', count: 8 },
    { id: 'heart-risk', label: 'Heart Risk', count: 15 },
    { id: 'alcohol', label: 'Alcohol', count: 6 },
    { id: 'smoking', label: 'Smoking', count: 8 },
    { id: 'family-history', label: 'Family History', count: 12 },
    { id: 'pregnancy-risk', label: 'Pregnancy Risk', count: 10 }
  ];

  const organFilters: FilterOption[] = [
    { id: 'heart', label: 'Heart', count: 35 },
    { id: 'kidney', label: 'Kidney', count: 28 },
    { id: 'liver', label: 'Liver', count: 22 },
    { id: 'brain', label: 'Brain', count: 18 },
    { id: 'gastric', label: 'Gastric', count: 15 },
    { id: 'pancreas', label: 'Pancreas', count: 12 }
  ];

  const ageGroups = [
    { id: 'child', label: 'Children (0-12)' },
    { id: 'teen', label: 'Teenagers (13-19)' },
    { id: 'adult', label: 'Adults (20-59)' },
    { id: 'senior', label: 'Seniors (60+)' }
  ];

  const handleFilterChange = (type: string, value: any) => {
    const newFilters = { ...selectedFilters };
    
    if (type === 'conditions' || type === 'risks' || type === 'organs') {
      const currentArray = newFilters[type];
      if (currentArray.includes(value)) {
        newFilters[type] = currentArray.filter(item => item !== value);
      } else {
        newFilters[type] = [...currentArray, value];
      }
    } else {
      newFilters[type] = value;
    }
    
    setSelectedFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      conditions: [],
      risks: [],
      organs: [],
      homeCollection: false,
      nabl: false,
      doctorRecommended: false,
      priceRange: [0, 5000],
      ageGroup: '',
      gender: ''
    };
    setSelectedFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = 
    selectedFilters.conditions.length + 
    selectedFilters.risks.length + 
    selectedFilters.organs.length +
    (selectedFilters.homeCollection ? 1 : 0) +
    (selectedFilters.nabl ? 1 : 0) +
    (selectedFilters.doctorRecommended ? 1 : 0) +
    (selectedFilters.ageGroup ? 1 : 0) +
    (selectedFilters.gender ? 1 : 0);

  const FilterSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <>
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          
          {selectedFilters.conditions.map(condition => (
            <Badge key={condition} variant="secondary" className="flex items-center gap-1">
              {conditionFilters.find(f => f.id === condition)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('conditions', condition)}
              />
            </Badge>
          ))}
          
          {selectedFilters.risks.map(risk => (
            <Badge key={risk} variant="secondary" className="flex items-center gap-1">
              {riskFilters.find(f => f.id === risk)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('risks', risk)}
              />
            </Badge>
          ))}
          
          {selectedFilters.organs.map(organ => (
            <Badge key={organ} variant="secondary" className="flex items-center gap-1">
              {organFilters.find(f => f.id === organ)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('organs', organ)}
              />
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Filters
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* By Condition */}
            <FilterSection title="By Health Condition" icon={Award}>
              <div className="space-y-2">
                {conditionFilters.map(filter => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${filter.id}`}
                      checked={selectedFilters.conditions.includes(filter.id)}
                      onCheckedChange={() => handleFilterChange('conditions', filter.id)}
                    />
                    <label htmlFor={`condition-${filter.id}`} className="text-sm flex-1 cursor-pointer">
                      {filter.label}
                    </label>
                    <span className="text-xs text-muted-foreground">({filter.count})</span>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* By Risk */}
            <FilterSection title="By Health Risk" icon={Shield}>
              <div className="space-y-2">
                {riskFilters.map(filter => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`risk-${filter.id}`}
                      checked={selectedFilters.risks.includes(filter.id)}
                      onCheckedChange={() => handleFilterChange('risks', filter.id)}
                    />
                    <label htmlFor={`risk-${filter.id}`} className="text-sm flex-1 cursor-pointer">
                      {filter.label}
                    </label>
                    <span className="text-xs text-muted-foreground">({filter.count})</span>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* By Organ */}
            <FilterSection title="By Body Organ" icon={Users}>
              <div className="space-y-2">
                {organFilters.map(filter => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`organ-${filter.id}`}
                      checked={selectedFilters.organs.includes(filter.id)}
                      onCheckedChange={() => handleFilterChange('organs', filter.id)}
                    />
                    <label htmlFor={`organ-${filter.id}`} className="text-sm flex-1 cursor-pointer">
                      {filter.label}
                    </label>
                    <span className="text-xs text-muted-foreground">({filter.count})</span>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Smart Filters */}
            <FilterSection title="Smart Filters" icon={Award}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="home-collection"
                    checked={selectedFilters.homeCollection}
                    onCheckedChange={(checked) => handleFilterChange('homeCollection', checked)}
                  />
                  <label htmlFor="home-collection" className="text-sm cursor-pointer flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Home Collection Available
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nabl"
                    checked={selectedFilters.nabl}
                    onCheckedChange={(checked) => handleFilterChange('nabl', checked)}
                  />
                  <label htmlFor="nabl" className="text-sm cursor-pointer flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    NABL Accredited
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="doctor-recommended"
                    checked={selectedFilters.doctorRecommended}
                    onCheckedChange={(checked) => handleFilterChange('doctorRecommended', checked)}
                  />
                  <label htmlFor="doctor-recommended" className="text-sm cursor-pointer flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Doctor Recommended
                  </label>
                </div>
              </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" icon={DollarSign}>
              <div className="space-y-4">
                <Slider
                  value={selectedFilters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={5000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{selectedFilters.priceRange[0]}</span>
                  <span>₹{selectedFilters.priceRange[1]}</span>
                </div>
              </div>
            </FilterSection>

            {/* Age Group */}
            <FilterSection title="Age Group" icon={Users}>
              <div className="space-y-2">
                {ageGroups.map(group => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`age-${group.id}`}
                      checked={selectedFilters.ageGroup === group.id}
                      onCheckedChange={(checked) => 
                        handleFilterChange('ageGroup', checked ? group.id : '')
                      }
                    />
                    <label htmlFor={`age-${group.id}`} className="text-sm cursor-pointer">
                      {group.label}
                    </label>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Gender */}
            <FilterSection title="Gender Specific" icon={Users}>
              <div className="space-y-2">
                {['male', 'female', 'unisex'].map(gender => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={selectedFilters.gender === gender}
                      onCheckedChange={(checked) => 
                        handleFilterChange('gender', checked ? gender : '')
                      }
                    />
                    <label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer capitalize">
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Results Count */}
          <div className="sticky bottom-0 bg-background pt-4 mt-6 border-t">
            <Button 
              className="w-full" 
              onClick={() => setIsOpen(false)}
            >
              Show {resultCount} Results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};