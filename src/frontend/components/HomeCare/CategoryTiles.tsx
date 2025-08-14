import React from 'react';
import { Link } from 'react-router-dom';
import { HomeCareCategory } from '@/frontend/data/mockHomeCareData';

interface CategoryTilesProps {
  categories: HomeCareCategory[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Care Categories</h2>
      <div className="grid grid-cols-5 gap-3 md:gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          if (category.redirectTo) {
            return (
              <Link
                key={category.id}
                to={category.redirectTo}
                className="flex flex-col items-center group min-w-0"
              >
                <div className="relative mb-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-center leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {category.name}
                </span>
              </Link>
            );
          }

          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className="flex flex-col items-center group min-w-0 transition-all duration-200"
            >
              <div className="relative mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full object-cover transition-all duration-300 group-hover:scale-110 ${
                    isSelected 
                      ? 'ring-3 ring-primary ring-offset-2 shadow-lg scale-105' 
                      : 'group-hover:shadow-lg'
                  }`}
                />
              </div>
              <span className={`text-xs md:text-sm font-medium text-center leading-tight transition-colors duration-200 line-clamp-2 ${
                isSelected ? 'text-primary font-semibold' : 'text-foreground group-hover:text-primary'
              }`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};