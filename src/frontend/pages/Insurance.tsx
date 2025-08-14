
import React, { useState } from 'react';
import { Shield, Calculator, FileText, HelpCircle } from 'lucide-react';
import { ServiceHeader } from '@/frontend/components/Common/ServiceHeader';
import { FilterBar } from '@/frontend/components/Common/FilterBar';
import { FloatingHelp } from '@/frontend/components/Common/FloatingHelp';
import { InsurancePlanCard } from '@/frontend/components/Insurance/InsurancePlanCard';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { mockInsurancePlans, mockInsuranceFAQs } from '@/frontend/data/mockInsuranceData';

export const Insurance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [compareList, setCompareList] = useState<string[]>([]);

  const filters = [
    {
      key: 'type',
      label: 'Insurance Type',
      options: [
        { value: 'Health', label: 'Health Insurance', count: 15 },
        { value: 'Life', label: 'Life Insurance', count: 8 },
        { value: 'Critical Illness', label: 'Critical Illness', count: 5 }
      ]
    },
    {
      key: 'premium',
      label: 'Monthly Premium',
      options: [
        { value: '0-1000', label: 'Under ₹1,000', count: 12 },
        { value: '1000-2000', label: '₹1,000 - ₹2,000', count: 8 },
        { value: '2000+', label: 'Above ₹2,000', count: 3 }
      ]
    },
    {
      key: 'coverage',
      label: 'Coverage Amount',
      options: [
        { value: '0-5L', label: 'Up to ₹5L', count: 8 },
        { value: '5L-10L', label: '₹5L - ₹10L', count: 10 },
        { value: '10L+', label: 'Above ₹10L', count: 5 }
      ]
    },
    {
      key: 'features',
      label: 'Features',
      options: [
        { value: 'cashless', label: 'Cashless Claims', count: 18 },
        { value: 'tax', label: 'Tax Benefits', count: 20 },
        { value: 'preexisting', label: 'Pre-existing Coverage', count: 12 }
      ]
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Insurance Plans' }
  ];

  const handleCompare = (planId: string) => {
    if (compareList.includes(planId)) {
      setCompareList(compareList.filter(id => id !== planId));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, planId]);
    }
  };

  const handleBuyNow = (planId: string) => {
    console.log('Buying insurance plan:', planId);
    // TODO: Implement purchase flow with Supabase
  };

  const handleContactAdvisor = () => {
    console.log('Contacting insurance advisor');
    // TODO: Implement advisor contact form
  };

  const filteredPlans = mockInsurancePlans.filter(plan => {
    const matchesSearch = plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plan.insurerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = Object.entries(activeFilters).every(([filterKey, values]) => {
      if (values.length === 0) return true;
      
      switch (filterKey) {
        case 'type':
          return values.includes(plan.type);
        case 'premium':
          const premium = plan.monthlyPremium;
          return values.some(range => {
            if (range === '0-1000') return premium <= 1000;
            if (range === '1000-2000') return premium > 1000 && premium <= 2000;
            if (range === '2000+') return premium > 2000;
            return false;
          });
        case 'coverage':
          const coverage = plan.coverageAmount;
          return values.some(range => {
            if (range === '0-5L') return coverage <= 500000;
            if (range === '5L-10L') return coverage > 500000 && coverage <= 1000000;
            if (range === '10L+') return coverage > 1000000;
            return false;
          });
        case 'features':
          return values.some(feature => {
            if (feature === 'cashless') return plan.cashlessClaims;
            if (feature === 'tax') return plan.taxBenefit;
            if (feature === 'preexisting') return plan.preExistingCoverage;
            return false;
          });
        default:
          return true;
      }
    });
    
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="min-h-screen bg-background">
      <ServiceHeader
        title="Insurance Plans"
        subtitle="Protect your health and family with trusted insurance partners"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Premium Calculator</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Claims Guide</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Policy Checker</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Get Expert Help</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchPlaceholder="Search insurance plans..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={(key, values) => 
            setActiveFilters(prev => ({ ...prev, [key]: values }))
          }
          onClearFilters={() => setActiveFilters({})}
        />

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {compareList.length} plan{compareList.length > 1 ? 's' : ''} selected for comparison
                </span>
                <div className="flex gap-2">
                  <Button size="sm" disabled={compareList.length < 2}>
                    Compare Plans
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareList([])}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insurance Plans Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Plans ({filteredPlans.length})</h2>
            <Button variant="outline" size="sm">
              Sort by Premium
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <InsurancePlanCard
                key={plan.id}
                plan={plan}
                onCompare={handleCompare}
                onBuyNow={handleBuyNow}
                onContactAdvisor={handleContactAdvisor}
                isSelected={compareList.includes(plan.id)}
              />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {mockInsuranceFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <FloatingHelp />
    </div>
  );
};
