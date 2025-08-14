import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Star, ArrowUpDown, MessageCircle } from 'lucide-react';

interface Alternative {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  composition: string;
  savingsAmount: number;
  inStock: boolean;
}

interface AlternativesSectionProps {
  alternatives: Alternative[];
  onSelectAlternative: (alternativeId: string) => void;
  onConsultPharmacist: () => void;
}

export const AlternativesSection: React.FC<AlternativesSectionProps> = ({
  alternatives,
  onSelectAlternative,
  onConsultPharmacist
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Substitutes & Alternatives
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Same composition, different brands - verified by our pharmacists
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {alternatives.map((alternative) => {
          const savingsPercent = Math.round((alternative.savingsAmount / alternative.originalPrice) * 100);
          
          return (
            <div key={alternative.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <img
                  src={alternative.image}
                  alt={alternative.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{alternative.name}</h4>
                    <p className="text-sm text-muted-foreground">by {alternative.manufacturer}</p>
                    <p className="text-xs text-muted-foreground">{alternative.composition}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{alternative.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({alternative.reviewCount} reviews)</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">₹{alternative.price}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{alternative.originalPrice}</span>
                      {alternative.savingsAmount > 0 && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Save ₹{alternative.savingsAmount}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectAlternative(alternative.id)}
                        disabled={!alternative.inStock}
                      >
                        {alternative.inStock ? 'Switch & Save' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>

                  {alternative.savingsAmount > 0 && (
                    <div className="text-xs text-green-600 font-medium">
                      Switch & Save ₹{alternative.savingsAmount} ({savingsPercent}% cheaper)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Consult Pharmacist CTA */}
        <div className="border-t pt-4">
          <div className="bg-primary-light p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Need help choosing?</h4>
                <p className="text-sm text-muted-foreground">
                  Our pharmacists can help you find the best alternative
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onConsultPharmacist}
                className="border-primary text-primary"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Consult Pharmacist
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};