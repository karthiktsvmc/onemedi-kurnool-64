import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProductHeaderProps {
  name: string;
  genericName?: string;
  manufacturer: string;
  composition: string;
  packSize: string;
  prescriptionRequired: boolean;
  inStock: boolean;
  verifiedByPharmacist: boolean;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  genericName,
  manufacturer,
  composition,
  packSize,
  prescriptionRequired,
  inStock,
  verifiedByPharmacist
}) => {
  return (
    <div className="space-y-4">
      {/* Medicine Name */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{name}</h1>
        {genericName && (
          <p className="text-lg text-muted-foreground mt-1">Generic: {genericName}</p>
        )}
      </div>

      {/* Manufacturer */}
      <div>
        <p className="text-sm text-muted-foreground">Manufactured by</p>
        <p className="font-semibold text-primary">{manufacturer}</p>
      </div>

      {/* Pack Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Pack Size</p>
          <p className="font-medium">{packSize}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Composition</p>
          <p className="font-medium text-sm">{composition}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {prescriptionRequired && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Prescription Required
          </Badge>
        )}
        
        <Badge variant={inStock ? "default" : "secondary"} className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {inStock ? "In Stock" : "Out of Stock"}
        </Badge>

        {verifiedByPharmacist && (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-700">
            <Shield className="h-3 w-3" />
            Verified by Pharmacist
          </Badge>
        )}
      </div>
    </div>
  );
};