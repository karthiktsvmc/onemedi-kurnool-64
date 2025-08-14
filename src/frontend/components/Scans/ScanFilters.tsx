import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Slider } from '@/shared/components/ui/slider';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { 
  Filter, 
  MapPin, 
  Shield, 
  Award, 
  Clock,
  X,
  Home
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface ScanFiltersProps {
  onFiltersChange: (filters: any) => void;
  resultCount: number;
}

export const ScanFilters = ({ onFiltersChange, resultCount }: ScanFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [homePickupOnly, setHomePickupOnly] = useState(false);
  const [nablOnly, setNablOnly] = useState(false);
  const [doctorRecommended, setDoctorRecommended] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const categories = [
    { id: 'all', name: 'All Scans', count: 245 },
    { id: 'mri', name: 'MRI', count: 45 },
    { id: 'ct', name: 'CT Scan', count: 38 },
    { id: 'ultrasound', name: 'Ultrasound', count: 52 },
    { id: 'xray', name: 'X-Ray', count: 67 },
    { id: 'pregnancy', name: 'Pregnancy', count: 24 },
    { id: 'nuclear', name: 'Nuclear', count: 15 },
    { id: 'cardiac', name: 'Cardiac', count: 28 }
  ];

  const handleFilterChange = () => {
    const filters = {
      category: selectedCategory,
      priceRange,
      homePickupOnly,
      nablOnly,
      doctorRecommended,
      urgentOnly,
      sortBy
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 50000]);
    setHomePickupOnly(false);
    setNablOnly(false);
    setDoctorRecommended(false);
    setUrgentOnly(false);
    setSortBy('relevance');
    handleFilterChange();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 50000) count++;
    if (homePickupOnly) count++;
    if (nablOnly) count++;
    if (doctorRecommended) count++;
    if (urgentOnly) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-background border rounded-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <Button
              variant={homePickupOnly ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setHomePickupOnly(!homePickupOnly);
                handleFilterChange();
              }}
              className="flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
              Home Pickup
            </Button>
            <Button
              variant={nablOnly ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setNablOnly(!nablOnly);
                handleFilterChange();
              }}
              className="flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              NABL
            </Button>
            <Button
              variant={doctorRecommended ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDoctorRecommended(!doctorRecommended);
                handleFilterChange();
              }}
              className="flex items-center gap-1"
            >
              <Award className="h-3 w-3" />
              Doctor Recommended
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {resultCount} scans found
          </div>
          
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            handleFilterChange();
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="duration">Shortest Duration</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory(category.id);
              handleFilterChange();
            }}
            className="flex items-center gap-2"
          >
            {category.name}
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Advanced Filters</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={0}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Service Features */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Service Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Home Pickup Available</span>
                    </div>
                    <Switch
                      checked={homePickupOnly}
                      onCheckedChange={setHomePickupOnly}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">NABL Accredited</span>
                    </div>
                    <Switch
                      checked={nablOnly}
                      onCheckedChange={setNablOnly}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Doctor Recommended</span>
                    </div>
                    <Switch
                      checked={doctorRecommended}
                      onCheckedChange={setDoctorRecommended}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Urgent/Same Day</span>
                    </div>
                    <Switch
                      checked={urgentOnly}
                      onCheckedChange={setUrgentOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Center Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Center Type</Label>
                <div className="space-y-2">
                  {['Hospital Based', 'Standalone Lab', 'Home Service', 'Mobile Unit'].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleFilterChange} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};