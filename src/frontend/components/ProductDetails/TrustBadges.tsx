import React from 'react';
import { Shield, Award, Truck, RotateCcw, CheckCircle, Lock } from 'lucide-react';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const TrustBadges: React.FC = () => {
  const badges: TrustBadge[] = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "100% Genuine Medicines",
      description: "Sourced directly from manufacturers"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Licensed Pharmacy",
      description: "Government certified & regulated"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-600" />,
      title: "NABL Certified Labs",
      description: "Quality assured diagnostics"
    },
    {
      icon: <Lock className="h-6 w-6 text-orange-600" />,
      title: "Secure Payments",
      description: "SSL encrypted transactions"
    },
    {
      icon: <Truck className="h-6 w-6 text-indigo-600" />,
      title: "Free Delivery",
      description: "On orders above ₹299"
    },
    {
      icon: <RotateCcw className="h-6 w-6 text-teal-600" />,
      title: "Easy Returns",
      description: "15-day return policy"
    }
  ];

  return (
    <div className="bg-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold text-center text-foreground mb-6">
          Why Choose ONE MEDI?
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="bg-card p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-3">
                {badge.icon}
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                {badge.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            FDA Reg. No: 20B-64321 | CDSCO License: DL-14562 | 
            Pharmacy Registration: DL-UP-14562-2024
          </p>
        </div>
      </div>
    </div>
  );
};