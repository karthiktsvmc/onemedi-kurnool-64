import React, { useState } from 'react';
import { Search, Filter, Phone, MessageCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ServiceHeader } from '@/frontend/components/Common/ServiceHeader';
import { FloatingHelp } from '@/frontend/components/Common/FloatingHelp';
import { ServiceCard } from '@/frontend/components/DiabetesCare/ServiceCard';
import { ProductCard } from '@/frontend/components/DiabetesCare/ProductCard';
import { ExpertCard } from '@/frontend/components/DiabetesCare/ExpertCard';
import { TestCard } from '@/frontend/components/DiabetesCare/TestCard';
import { ArticleCard } from '@/frontend/components/DiabetesCare/ArticleCard';
import { PackageCard } from '@/frontend/components/DiabetesCare/PackageCard';
import {
  diabetesServices,
  diabetesProducts,
  diabetesExperts,
  diabetesTests,
  diabetesArticles,
  diabetesCarePackages,
  diabetesCategories
} from '@/frontend/data/mockDiabetesCareData';

export const DiabetesCare: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/' },
    { label: 'Diabetes Care' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ServiceHeader
        title="Diabetes Care Hub"
        subtitle="Comprehensive diabetes management services and products"
        breadcrumbs={breadcrumbs}
        showEmergencyCall={true}
        emergencyNumber="108"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Complete Diabetes Care Partner
            </h2>
            <p className="text-muted-foreground">
              Expert care, quality products, and education for better diabetes management
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for services, products, or experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12"
              />
              <Button size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {diabetesCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="services" className="w-full">
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max w-full lg:w-auto lg:justify-center">
              <TabsTrigger value="services" className="flex-shrink-0 px-4 py-2 text-sm">Services</TabsTrigger>
              <TabsTrigger value="products" className="flex-shrink-0 px-4 py-2 text-sm">Products</TabsTrigger>
              <TabsTrigger value="experts" className="flex-shrink-0 px-4 py-2 text-sm">Experts</TabsTrigger>
              <TabsTrigger value="tests" className="flex-shrink-0 px-4 py-2 text-sm">Tests</TabsTrigger>
              <TabsTrigger value="education" className="flex-shrink-0 px-4 py-2 text-sm">Education</TabsTrigger>
              <TabsTrigger value="packages" className="flex-shrink-0 px-4 py-2 text-sm">Packages</TabsTrigger>
            </TabsList>
          </div>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Diabetes Management Services
              </h3>
              <Badge variant="outline">{diabetesServices.length} services</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diabetesServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Diabetes Essentials Store
              </h3>
              <Badge variant="outline">{diabetesProducts.length} products</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {diabetesProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          {/* Experts Tab */}
          <TabsContent value="experts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Talk to Diabetes Experts
              </h3>
              <Badge variant="outline">{diabetesExperts.length} experts</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diabetesExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
            
            {/* Floating Expert Help */}
            <div className="fixed bottom-24 right-6 z-40">
              <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm font-medium">Call Expert Now</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Diabetes Tests & Monitoring
              </h3>
              <Badge variant="outline">{diabetesTests.length} tests</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diabetesTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Diabetes Knowledge Hub
              </h3>
              <Badge variant="outline">{diabetesArticles.length} articles</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diabetesArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Care Packages & Subscriptions
              </h3>
              <Badge variant="outline">{diabetesCarePackages.length} packages</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diabetesCarePackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Success Stories Section */}
        <div className="mt-12 py-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Success Stories
            </h3>
            <p className="text-muted-foreground">
              Real stories from people who transformed their diabetes journey
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="outline">
              View All Success Stories
            </Button>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 z-40 shadow-lg lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Manage My Diabetes Now</p>
              <p className="text-xs opacity-90">Get personalized care today</p>
            </div>
            <Button variant="secondary" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <FloatingHelp />
    </div>
  );
};