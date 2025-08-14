import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X, Filter } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
interface SearchResult {
  id: string;
  title: string;
  category: string;
  type: 'medicine' | 'lab' | 'doctor' | 'service';
  description?: string;
  price?: string;
}
interface SmartSearchBarProps {
  onSearch: (query: string, category?: string) => void;
}
export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholders
  const placeholders = ['Search for medicines...', 'Search for scans...', 'Search for doctors...', 'Search for lab tests...', 'Search for home care...', 'Search for diabetes care...'];

  // Mock search results
  const mockSearchData: SearchResult[] = [{
    id: '1',
    title: 'Paracetamol 500mg',
    category: 'Pain Relief',
    type: 'medicine',
    price: '₹25'
  }, {
    id: '2',
    title: 'CBC Blood Test',
    category: 'Blood Tests',
    type: 'lab',
    price: '₹300'
  }, {
    id: '3',
    title: 'Dr. Rajesh Kumar',
    category: 'Cardiologist',
    type: 'doctor',
    description: 'MD Cardiology, 15 years exp'
  }, {
    id: '4',
    title: 'Chest X-Ray',
    category: 'Radiology',
    type: 'service',
    price: '₹500'
  }, {
    id: '5',
    title: 'Insulin Pen',
    category: 'Diabetes Care',
    type: 'medicine',
    price: '₹1,200'
  }, {
    id: '6',
    title: 'Thyroid Function Test',
    category: 'Hormone Tests',
    type: 'lab',
    price: '₹450'
  }, {
    id: '7',
    title: 'Dr. Priya Sharma',
    category: 'Dermatologist',
    type: 'doctor',
    description: 'MBBS, MD Dermatology'
  }, {
    id: '8',
    title: 'MRI Scan',
    category: 'Radiology',
    type: 'service',
    price: '₹5,000'
  }, {
    id: '9',
    title: 'Vitamin D3 Tablets',
    category: 'Vitamins',
    type: 'medicine',
    price: '₹180'
  }, {
    id: '10',
    title: 'Liver Function Test',
    category: 'Organ Tests',
    type: 'lab',
    price: '₹600'
  }];

  // Trending searches
  const trendingSearches = ['Paracetamol', 'CBC Test', 'Cardiologist', 'Chest X-Ray', 'Diabetes'];

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Placeholder rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockSearchData.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || selectedCategory === 'medicines' && item.type === 'medicine' || selectedCategory === 'labs' && item.type === 'lab' || selectedCategory === 'doctors' && item.type === 'doctor' || selectedCategory === 'services' && item.type === 'service';
        return matchesQuery && matchesCategory;
      }).slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, selectedCategory]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search
  const handleSearch = (searchQuery: string) => {
    saveRecentSearch(searchQuery);
    onSearch(searchQuery, selectedCategory);
    setQuery(searchQuery);
    setIsExpanded(false);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };
  const getTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'medicine':
        return '💊';
      case 'lab':
        return '🧪';
      case 'doctor':
        return '👨‍⚕️';
      case 'service':
        return '🏥';
      default:
        return '🔍';
    }
  };
  return <div ref={searchRef} className="relative w-full">
      {/* Search Input with 3D Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-sm transform scale-105" />
        <div className="relative bg-background border border-primary/30 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="flex items-center px-4 py-0 rounded-3xl mx-0">
            <Search className="w-5 h-5 text-primary mr-3" />
            <Input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setIsExpanded(true)} onKeyDown={e => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch(query);
            }
          }} placeholder={placeholders[placeholderIndex]} className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0" />
            {query && <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2" onClick={() => setQuery('')}>
                <X className="w-4 h-4" />
              </Button>}
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      {isExpanded && <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-primary/20 shadow-xl">
          <CardContent className="p-0">
            {/* Category Tabs */}
            <div className="p-4 border-b">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="medicines" className="text-xs">Medicines</TabsTrigger>
                  <TabsTrigger value="labs" className="text-xs">Labs</TabsTrigger>
                  <TabsTrigger value="doctors" className="text-xs">Doctors</TabsTrigger>
                  <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search Results */}
            {suggestions.length > 0 && <div className="max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">Search Results</p>
                  {suggestions.map(item => <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer" onClick={() => handleSearch(item.title)}>
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                      </div>
                      {item.price && <Badge variant="secondary" className="text-xs">{item.price}</Badge>}
                    </div>)}
                </div>
              </div>}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length === 0 && <div className="p-2 border-t">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </p>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearRecentSearches}>
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, index) => <div key={index} className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg cursor-pointer" onClick={() => handleSearch(search)}>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </div>)}
              </div>}

            {/* Trending Searches */}
            {query.length === 0 && <div className="p-2 border-t">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </p>
                <div className="flex flex-wrap gap-2 px-2 py-1">
                  {trendingSearches.map((trend, index) => <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs" onClick={() => handleSearch(trend)}>
                      {trend}
                    </Badge>)}
                </div>
              </div>}
          </CardContent>
        </Card>}
    </div>;
};