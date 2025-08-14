import React, { useState } from 'react';
import { Clock, Users, Star, Download } from 'lucide-react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export const DietPlans = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const dietPlans = [
    {
      id: '1',
      title: 'Weight Loss Diet Plan',
      description: 'A comprehensive 30-day plan to help you lose weight safely',
      duration: '30 days',
      price: 499,
      rating: 4.6,
      reviews: 1200,
      category: 'weight-loss',
      features: ['Customized meals', 'Exercise guide', 'Progress tracking']
    },
    {
      id: '2',
      title: 'Diabetes Management Diet',
      description: 'Specially designed meals for diabetes control',
      duration: '90 days',
      price: 899,
      rating: 4.8,
      reviews: 850,
      category: 'diabetes',
      features: ['Low glycemic meals', 'Blood sugar tracking', 'Expert consultations']
    }
  ];

  const breadcrumbItems = [{ label: 'Diet Plans' }];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        <NavigationBreadcrumb items={breadcrumbItems} />
        
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Personalized Diet Plans
            </h1>
            <p className="text-muted-foreground">
              Expert-designed nutrition plans for your health goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{plan.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{plan.rating}</span>
                      <span className="text-muted-foreground">({plan.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {plan.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-primary">
                      ₹{plan.price}
                    </div>
                    <Button size="sm">
                      Get Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};