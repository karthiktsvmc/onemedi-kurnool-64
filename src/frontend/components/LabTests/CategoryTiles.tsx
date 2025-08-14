import React from 'react';
import { Badge } from '@/shared/components/ui/badge';

interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

interface CategoryTilesProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <h2 className="text-xl font-bold text-foreground mb-4">Browse by Category</h2>
      <div className="grid grid-cols-5 gap-4 md:gap-6">
        {categories.slice(0, 10).map((category, index) => (
          <div
            key={category.id}
            className={`flex flex-col items-center cursor-pointer group transition-all duration-200 ${
              selectedCategory === category.id ? 'scale-105' : 'hover:scale-105'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border-2 transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'border-primary shadow-lg shadow-primary/25'
                  : 'border-border group-hover:border-primary/50'
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              {selectedCategory === category.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="text-center">
              <p
                className={`text-xs md:text-sm font-medium mb-1 transition-colors duration-200 ${
                  selectedCategory === category.id ? 'text-primary' : 'text-foreground'
                }`}
              >
                {category.name}
              </p>
              <Badge
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className="text-xs px-2 py-0.5"
              >
                {category.count}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};