
import React, { useState } from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string; label: string; count?: number }>;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterOption[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterKey: string, values: string[]) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = Object.values(activeFilters).flat().length;

  const toggleFilterValue = (filterKey: string, value: string) => {
    const currentValues = activeFilters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(filterKey, newValues);
  };

  return (
    <div className="bg-background border-b border-border sticky top-16 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with filters below
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                )}

                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <h4 className="font-medium text-foreground">{filter.label}</h4>
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(activeFilters[filter.key] || []).includes(option.value)}
                            onChange={() => toggleFilterValue(filter.key, option.value)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm flex-1">{option.label}</span>
                          {option.count && (
                            <span className="text-xs text-muted-foreground">({option.count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(activeFilters).map(([filterKey, values]) =>
              values.map((value) => (
                <Badge key={`${filterKey}-${value}`} variant="secondary" className="text-xs">
                  {value}
                  <button
                    onClick={() => toggleFilterValue(filterKey, value)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
