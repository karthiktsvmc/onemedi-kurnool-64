import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { MapPin, Phone, Mail, Clock, Shield, Droplets } from 'lucide-react';
import { BloodBank } from '@/frontend/data/mockBloodBanksData';

interface BloodBankCardProps {
  bloodBank: BloodBank;
}

export const BloodBankCard = ({ bloodBank }: BloodBankCardProps) => {
  return (
    <Card className="overflow-hidden hover-scale bg-card border-border">
      <div className="relative">
        <img
          src={bloodBank.image}
          alt={bloodBank.name}
          className="w-full h-48 object-cover"
        />
        {bloodBank.isVerified && (
          <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{bloodBank.name}</h3>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{bloodBank.address}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Blood Groups Available
            </h4>
            <div className="flex flex-wrap gap-1">
              {bloodBank.bloodGroups.map((group) => (
                <Badge key={group} variant="secondary" className="text-xs">
                  {group}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Services</h4>
            <div className="flex flex-wrap gap-1">
              {bloodBank.services.slice(0, 3).map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {bloodBank.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{bloodBank.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{bloodBank.timings}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <a href={`tel:${bloodBank.phone}`} className="text-primary hover:underline">
              {bloodBank.phone}
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <a href={`mailto:${bloodBank.email}`} className="text-primary hover:underline">
              {bloodBank.email}
            </a>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <Button size="sm" className="flex-1">
            Contact Bank
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};