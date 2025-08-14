import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { AutoChangePromotionStrips } from '@/frontend/components/Home/AutoChangePromotionStrips';
import { CategoryTiles } from '@/frontend/components/LabTests/CategoryTiles';
import { FilterableTabs } from '@/frontend/components/LabTests/FilterableTabs';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { MapPin, Shield, Clock, Home as HomeIcon } from 'lucide-react';
export const LabTests = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Enhanced categories with circular images
  const categories = [
    {
      id: 'all',
      name: 'All Tests',
      count: 485,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop'
    },
    {
      id: 'popular',
      name: 'Popular',
      count: 120,
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=300&fit=crop'
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      count: 45,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
    },
    {
      id: 'thyroid',
      name: 'Thyroid',
      count: 32,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'
    },
    {
      id: 'heart',
      name: 'Heart Health',
      count: 38,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
    },
    {
      id: 'liver',
      name: 'Liver',
      count: 25,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop'
    },
    {
      id: 'kidney',
      name: 'Kidney',
      count: 22,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&fit=crop'
    },
    {
      id: 'vitamins',
      name: 'Vitamins',
      count: 35,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop'
    },
    {
      id: 'pregnancy',
      name: 'Pregnancy',
      count: 28,
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop'
    },
    {
      id: 'cancer',
      name: 'Cancer Screening',
      count: 18,
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=300&fit=crop'
    }
  ];
  // Health packages data
  const healthPackages = [
    {
      id: 'basic-health',
      name: 'Basic Health Checkup',
      tests: 'CBC, Blood Sugar, Lipid Profile + 15 more',
      price: '₹1,299',
      originalPrice: '₹2,500',
      discount: '48% OFF'
    },
    {
      id: 'diabetes-care',
      name: 'Diabetes Care Package',
      tests: 'HbA1c, Fasting Sugar, Kidney Function + 8 more',
      price: '₹899',
      originalPrice: '₹1,800',
      discount: '50% OFF'
    },
    {
      id: 'women-health',
      name: 'Women Health Package',
      tests: 'Thyroid, Vitamin D, Iron Studies + 20 more',
      price: '₹1,599',
      originalPrice: '₹3,200',
      discount: '50% OFF'
    },
    {
      id: 'master-health',
      name: 'Master Health Checkup',
      tests: 'Full Body Checkup, All Organs + 45 more',
      price: '₹2,499',
      originalPrice: '₹4,999',
      discount: '50% OFF'
    }
  ];

  // Enhanced lab tests data with diagnostic centers
  const labTests = [{
    id: '1',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
    title: 'Complete Blood Count (CBC)',
    description: 'Comprehensive blood analysis to check overall health',
    sampleType: 'Blood',
    fastingRequired: false,
    parameters: 28,
    tags: ['NABL', 'Doctor Recommended', 'Home Collection'],
    centers: [{
      id: '1',
      name: 'Vijaya Diagnostics',
      price: 299,
      originalPrice: 450,
      rating: 4.8,
      deliveryTime: '6-8 hours',
      homeCollection: true,
      nabl: true,
      offers: 'Free home collection + 10% cashback'
    }, {
      id: '2',
      name: 'Thyrocare',
      price: 320,
      originalPrice: 480,
      rating: 4.7,
      deliveryTime: '12-24 hours',
      homeCollection: true,
      nabl: true
    }, {
      id: '3',
      name: 'Dr. Lal PathLabs',
      price: 350,
      originalPrice: 500,
      rating: 4.6,
      deliveryTime: '8-12 hours',
      homeCollection: true,
      nabl: true,
      offers: 'Free consultation with report'
    }]
  }, {
    id: '2',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
    title: 'HbA1c (Diabetes Check)',
    description: '3-month average blood sugar level monitoring',
    sampleType: 'Blood',
    fastingRequired: false,
    parameters: 1,
    tags: ['NABL', 'Doctor Recommended', 'Home Collection'],
    centers: [{
      id: '1',
      name: 'Vijaya Diagnostics',
      price: 450,
      originalPrice: 650,
      rating: 4.9,
      deliveryTime: '6-8 hours',
      homeCollection: true,
      nabl: true
    }, {
      id: '2',
      name: 'Thyrocare',
      price: 420,
      originalPrice: 600,
      rating: 4.8,
      deliveryTime: '12-24 hours',
      homeCollection: true,
      nabl: true,
      offers: '20% cashback on digital payments'
    }]
  }, {
    id: '3',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    title: 'Lipid Profile',
    description: 'Cholesterol and heart health comprehensive check',
    sampleType: 'Blood',
    fastingRequired: true,
    parameters: 8,
    tags: ['NABL', 'Doctor Recommended', 'Home Collection'],
    centers: [{
      id: '1',
      name: 'Redcliffe Labs',
      price: 580,
      originalPrice: 750,
      rating: 4.7,
      deliveryTime: '6-8 hours',
      homeCollection: true,
      nabl: true
    }, {
      id: '3',
      name: 'Dr. Lal PathLabs',
      price: 620,
      originalPrice: 800,
      rating: 4.6,
      deliveryTime: '8-12 hours',
      homeCollection: true,
      nabl: true
    }]
  }, {
    id: '4',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    title: 'Vitamin D Test',
    description: 'Check vitamin D levels for bone health',
    sampleType: 'Blood',
    fastingRequired: false,
    parameters: 1,
    tags: ['NABL', 'Home Collection'],
    centers: [{
      id: '2',
      name: 'Thyrocare',
      price: 800,
      originalPrice: 1200,
      rating: 4.6,
      deliveryTime: '24-48 hours',
      homeCollection: true,
      nabl: true
    }, {
      id: '4',
      name: 'Redcliffe Labs',
      price: 750,
      originalPrice: 1100,
      rating: 4.5,
      deliveryTime: '12-24 hours',
      homeCollection: false,
      nabl: true
    }]
  }, {
    id: '5',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    title: 'Thyroid Profile (T3, T4, TSH)',
    description: 'Complete thyroid function assessment',
    sampleType: 'Blood',
    fastingRequired: false,
    parameters: 3,
    tags: ['NABL', 'Doctor Recommended', 'Home Collection'],
    centers: [{
      id: '1',
      name: 'Vijaya Diagnostics',
      price: 650,
      originalPrice: 900,
      rating: 4.8,
      deliveryTime: '6-8 hours',
      homeCollection: true,
      nabl: true
    }]
  }, {
    id: '6',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
    title: 'Liver Function Test (LFT)',
    description: 'Comprehensive liver health assessment',
    sampleType: 'Blood',
    fastingRequired: true,
    parameters: 12,
    tags: ['NABL', 'Doctor Recommended', 'Home Collection'],
    centers: [{
      id: '2',
      name: 'Thyrocare',
      price: 480,
      originalPrice: 720,
      rating: 4.7,
      deliveryTime: '12-24 hours',
      homeCollection: true,
      nabl: true
    }]
  }];
  const handleAddToCart = (testId: string, centerId: string) => {
    console.log('Add to cart:', testId, centerId);
    // Implement cart functionality
  };
  
  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite:', id);
    // Implement favorite functionality
  };
  
  const handleViewDetails = (id: string) => {
    navigate(`/lab-tests/${id}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Filter tests based on selected category
  const filteredTests = labTests.filter(test => {
    if (selectedCategory !== 'all' && selectedCategory !== 'popular') {
      return test.title.toLowerCase().includes(selectedCategory);
    }
    return true;
  });
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-3 px-4 border-b border-border">
          <div className="container mx-auto">
            <div className="text-sm text-muted-foreground">
              <span>Home</span> / <span className="text-primary font-medium">Lab Tests</span>
            </div>
          </div>
        </div>

        {/* Auto-changing Promotional Strips */}
        <AutoChangePromotionStrips />

        {/* Page Header */}
        <section className="py-6 px-4">
          <div className="container mx-auto px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Lab Tests</h1>
                <p className="text-muted-foreground">Book lab tests online with home sample collection</p>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-health-green-light px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4 text-health-green" />
                  <span className="text-health-green font-medium">NABL Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-light px-3 py-2 rounded-lg">
                  <HomeIcon className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">Home Collection</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-600 font-medium">24Hr Reports</span>
                </div>
              </div>
            </div>

            {/* Category Tiles - 5x2 Grid */}
            <CategoryTiles
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              className="mb-8"
            />

            {/* Filterable Tabs for Tests and Packages */}
            <FilterableTabs
              labTests={filteredTests}
              packages={healthPackages}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
            />

          </div>
        </section>
      </main>

      <BottomNav />
    </div>;
};