import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, TrendingUp, Star, Clock, Truck } from 'lucide-react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CategoryGrid } from '@/frontend/components/Medicines/CategoryGrid';
import { EnhancedProductCard } from '@/frontend/components/Medicines/EnhancedProductCard';
import { medicineCategoriesData } from '@/frontend/data/mockMedicineCategoriesData';
import { painReliefProducts } from '@/frontend/data/mockCategoryProductsData';

export const MedicineHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUploadPrescription = () => {
    navigate('/medicines/upload-prescription');
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    console.log('Added to cart:', productId, quantity);
    // TODO: Implement cart functionality
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggled favorite:', productId);
    // TODO: Implement favorites functionality
  };

  // Get trending categories
  const trendingCategories = medicineCategoriesData.filter(cat => cat.trending);
  
  // Get bestselling products
  const bestsellingProducts = painReliefProducts.filter(product => product.bestSeller);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        {/* Breadcrumb */}
        <NavigationBreadcrumb items={[{ label: 'Medicines' }]} />
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Order Medicines Online
              </h1>
              <p className="text-muted-foreground">
                Get medicines delivered to your doorstep with genuine quality assurance
              </p>
            </div>

            {/* Search & Upload Section */}
            <div className="max-w-2xl mx-auto space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search for medicines, brands, symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-base bg-background border-border focus:border-primary"
                  />
                </div>
              </form>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                onClick={handleUploadPrescription}
                variant="outline"
                className="w-full py-3 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="px-4 py-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-50 text-green-700">
                <Star className="h-5 w-5" />
                <span className="text-sm font-medium">100% Genuine</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-blue-50 text-blue-700">
                <Truck className="h-5 w-5" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-purple-50 text-purple-700">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-orange-50 text-orange-700">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Best Prices</span>
              </div>
            </div>
          </div>
        </section>

        {/* Health Categories */}
        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Shop by Health Concern
              </h2>
              <p className="text-muted-foreground">
                Find medicines for your specific health needs
              </p>
            </div>
            
            <CategoryGrid categories={medicineCategoriesData} maxItems={12} />
          </div>
        </section>

        {/* Trending Categories */}
        {trendingCategories.length > 0 && (
          <section className="px-4 py-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Trending Health Categories
                </h2>
                <p className="text-muted-foreground">
                  Most searched health concerns this week
                </p>
              </div>
              
              <CategoryGrid categories={trendingCategories} maxItems={6} />
            </div>
          </section>
        )}

        {/* Bestselling Products */}
        {bestsellingProducts.length > 0 && (
          <section className="px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Bestselling Medicines
                  </h2>
                  <p className="text-muted-foreground">
                    Most trusted medicines by our customers
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/medicines/bestsellers')}
                  className="hidden md:inline-flex hover:bg-primary hover:text-primary-foreground"
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bestsellingProducts.slice(0, 4).map((product) => (
                  <EnhancedProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>

              <div className="mt-6 text-center md:hidden">
                <Button
                  variant="outline"
                  onClick={() => navigate('/medicines/bestsellers')}
                  className="px-8 hover:bg-primary hover:text-primary-foreground"
                >
                  View All Bestsellers
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Health Tips */}
        <section className="px-4 py-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Health Tips & Information
              </h2>
              <p className="text-muted-foreground">
                Stay informed about your health and wellness
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💊</span>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Medicine Safety Tips
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about proper storage, dosage, and safety guidelines for medicines.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read More →
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🩺</span>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    When to Consult a Doctor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Understand when self-medication is safe and when to seek professional help.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read More →
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Managing Chronic Conditions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tips for managing diabetes, hypertension, and other chronic health conditions.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read More →
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default MedicineHome;