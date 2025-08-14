import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal, Grid, List, Search } from 'lucide-react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EnhancedProductCard } from '@/frontend/components/Medicines/EnhancedProductCard';
import { medicineCategoriesData } from '@/frontend/data/mockMedicineCategoriesData';
import { getProductsByCategory } from '@/frontend/data/mockCategoryProductsData';

export const CategoryListing: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Get category data
  const category = medicineCategoriesData.find(cat => cat.id === categoryId);
  const products = getProductsByCategory(categoryId || '');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.composition.toLowerCase().includes(query) ||
        product.genericName?.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.packSizes[0].price - b.packSizes[0].price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.packSizes[0].price - a.packSizes[0].price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  }, [products, searchQuery, sortBy]);

  const handleAddToCart = (productId: string, quantity: number) => {
    console.log('Added to cart:', productId, quantity);
    // TODO: Implement cart functionality
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggled favorite:', productId);
    // TODO: Implement favorites functionality
  };

  const handleBack = () => {
    navigate('/medicines');
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
              <Button onClick={handleBack} variant="outline">
                Back to Medicines
              </Button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        {/* Category Header */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Medicines</span>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium text-foreground">{category.name}</span>
            </div>

            {/* Category Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-2 border-primary/10">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-2xl">${category.icon}</span>`;
                    }
                  }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {category.name}
                  </h1>
                  {category.prescriptionRequired && (
                    <Badge variant="outline" className="border-blue-500 text-blue-600">
                      Prescription Required
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">
                  {category.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {category.productCount} products available
                </p>
              </div>
            </div>

            {/* Subcategories */}
            {category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <Badge
                    key={subcategory}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {subcategory}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Search and Filters */}
        <section className="px-4 py-4 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search in ${category.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} products found
                {searchQuery && ` for "${searchQuery}"`}
              </p>

              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 md:grid-cols-2'
              }`}>
                {filteredProducts.map((product) => (
                  <EnhancedProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `We couldn't find any products matching "${searchQuery}" in ${category.name}.`
                    : `No products available in ${category.name} at the moment.`
                  }
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">
                      {currentPage}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage * itemsPerPage >= filteredProducts.length}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryListing;