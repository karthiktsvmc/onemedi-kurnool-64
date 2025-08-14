
import React from 'react';
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/shared/components/ui/breadcrumb";

interface ServiceHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  showEmergencyCall?: boolean;
  emergencyNumber?: string;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showEmergencyCall = false,
  emergencyNumber = "108"
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {showEmergencyCall && (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => window.open(`tel:${emergencyNumber}`)}
                className="animate-pulse"
              >
                <Phone className="h-4 w-4 mr-1" />
                Emergency
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
