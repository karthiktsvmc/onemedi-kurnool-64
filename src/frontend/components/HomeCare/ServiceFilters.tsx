import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface ServiceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const availableTags = [
  'Doctor Recommended',
  'Female Staff Available', 
  'Urgent',
  'Equipment Included',
  'Featured'
];

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
];

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search home care services..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40 flex-shrink-0">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Tags */}
        <div className="flex gap-2 flex-shrink-0">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap hover:scale-105 transition-transform"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onTagToggle(tag)}
            >
              {tag} ×
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};