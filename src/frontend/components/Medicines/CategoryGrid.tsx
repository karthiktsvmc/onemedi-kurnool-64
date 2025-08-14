import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { MedicineCategory } from '@/frontend/data/mockMedicineCategoriesData';

interface CategoryGridProps {
  categories: MedicineCategory[];
  showAll?: boolean;
  maxItems?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  categories, 
  showAll = false, 
  maxItems = 12 
}) => {
  const navigate = useNavigate();
  
  const displayCategories = showAll ? categories : categories.slice(0, maxItems);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/medicines/category/${categoryId}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayCategories.map((category) => (
          <Card
            key={category.id}
            className="group relative bg-card hover:bg-accent/50 border border-border hover:border-primary/20 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-1"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-4 flex flex-col items-center text-center space-y-3">
              {/* Category Image/Icon */}
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-2xl md:text-3xl">${category.icon}</span>`;
                      }
                    }}
                  />
                </div>
                
                {/* Status Badges */}
                {category.trending && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-red-500 text-white"
                  >
                    Hot
                  </Badge>
                )}
                
                {category.prescriptionRequired && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 bg-blue-500 text-white"
                  >
                    Rx
                  </Badge>
                )}
              </div>

              {/* Category Info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.productCount} products
                </p>
              </div>

              {/* Description - Hidden on small screens */}
              <p className="text-xs text-muted-foreground text-center line-clamp-2 hidden md:block">
                {category.description}
              </p>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          </Card>
        ))}
      </div>

      {/* Show All Button */}
      {!showAll && categories.length > maxItems && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/medicines/categories')}
            className="px-8 hover:bg-primary hover:text-primary-foreground"
          >
            View All Categories
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;