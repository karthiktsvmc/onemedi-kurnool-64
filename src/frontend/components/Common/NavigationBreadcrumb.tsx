import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/shared/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({ 
  items, 
  className = '' 
}) => {
  return (
    <div className={`bg-secondary/30 py-3 px-4 border-b border-border ${className}`}>
      <div className="container mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {item.href && index < items.length - 1 ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-medium text-primary">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};