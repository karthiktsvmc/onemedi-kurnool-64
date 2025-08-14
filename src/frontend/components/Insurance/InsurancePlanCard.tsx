
import React from 'react';
import { Shield, Star, Check, Phone, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { InsurancePlan } from '@/frontend/data/mockInsuranceData';

interface InsurancePlanCardProps {
  plan: InsurancePlan;
  onCompare: (planId: string) => void;
  onBuyNow: (planId: string) => void;
  onContactAdvisor: () => void;
  isSelected?: boolean;
}

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({
  plan,
  onCompare,
  onBuyNow,
  onContactAdvisor,
  isSelected = false
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Health':
        return <Heart className="h-4 w-4" />;
      case 'Life':
        return <Shield className="h-4 w-4" />;
      case 'Critical Illness':
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Health':
        return 'bg-green-500';
      case 'Life':
        return 'bg-blue-500';
      case 'Critical Illness':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={plan.insurerLogo}
              alt={plan.insurerName}
              className="w-10 h-10 rounded object-cover"
            />
            <div>
              <h3 className="font-semibold text-foreground">{plan.planName}</h3>
              <p className="text-sm text-muted-foreground">{plan.insurerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${getTypeColor(plan.type)} flex items-center justify-center`}>
              {getTypeIcon(plan.type)}
            </div>
            <Badge variant="outline" className="text-xs">
              {plan.type}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{plan.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({plan.reviewCount} reviews)</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Coverage Amount */}
        <div className="text-center py-3 bg-accent/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Coverage Amount</p>
          <p className="text-2xl font-bold text-primary">₹{(plan.coverageAmount / 100000).toFixed(1)}L</p>
        </div>

        {/* Premium */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Premium</p>
            <p className="text-lg font-bold">₹{plan.monthlyPremium.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Annual Premium</p>
            <p className="text-lg font-bold">₹{plan.annualPremium.toLocaleString()}</p>
          </div>
        </div>

        {/* Key Benefits */}
        <div>
          <p className="font-medium text-sm mb-2">Key Benefits</p>
          <div className="space-y-1">
            {plan.keyBenefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-xs text-foreground">{benefit}</span>
              </div>
            ))}
            {plan.keyBenefits.length > 3 && (
              <p className="text-xs text-primary cursor-pointer">
                +{plan.keyBenefits.length - 3} more benefits
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {plan.taxBenefit && (
            <Badge variant="secondary" className="text-xs">Tax Benefit</Badge>
          )}
          {plan.cashlessClaims && (
            <Badge variant="secondary" className="text-xs">Cashless</Badge>
          )}
          {plan.preExistingCoverage && (
            <Badge variant="secondary" className="text-xs">Pre-existing</Badge>
          )}
        </div>

        {/* Hospital Network */}
        {plan.hospitalNetwork > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network Hospitals</span>
            <span className="font-medium">{plan.hospitalNetwork.toLocaleString()}+</span>
          </div>
        )}

        {/* Age Limit */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Age Limit</span>
          <span className="font-medium">{plan.ageLimit.min}-{plan.ageLimit.max} years</span>
        </div>

        {/* Waiting Period */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Waiting Period</span>
          <span className="font-medium">{plan.waitingPeriod}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            className="w-full"
            onClick={() => onBuyNow(plan.id)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onCompare(plan.id)}
            >
              Compare
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onContactAdvisor}
            >
              <Phone className="h-4 w-4 mr-1" />
              Advisor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
