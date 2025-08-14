import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { CategoryTiles } from '@/frontend/components/HomeCare/CategoryTiles';
import { ServiceCard } from '@/frontend/components/HomeCare/ServiceCard';
import { ServiceFilters } from '@/frontend/components/HomeCare/ServiceFilters';
import { homeCareCategories, homeCareServices } from '@/frontend/data/mockHomeCareData';

export const HomeCare: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredServices = useMemo(() => {
    let filtered = homeCareServices;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(service => service.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        service.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(service =>
        selectedTags.every(tag => service.tags.includes(tag))
      );
    }

    // Sort services
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const aPrice = a.durations[0]?.price || 0;
          const bPrice = b.durations[0]?.price || 0;
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aPrice = a.durations[0]?.price || 0;
          const bPrice = b.durations[0]?.price || 0;
          return bPrice - aPrice;
        });
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, selectedTags, sortBy]);

  const selectedCategoryName = selectedCategory 
    ? homeCareCategories.find(cat => cat.id === selectedCategory)?.name 
    : '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="shrink-0">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
                  {selectedCategoryName || 'Home Care Services'}
                </h1>
                <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">Delivering to your location</span>
                </div>
              </div>
            </div>
            
            {/* Mobile-friendly location indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground md:hidden">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Available in your area</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Category Tiles */}
        <CategoryTiles
          categories={homeCareCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Service Filters */}
        <ServiceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
            {selectedCategoryName && ` in ${selectedCategoryName}`}
          </p>
        </div>

        {/* Service Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms to find the care services you need.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};