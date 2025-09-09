import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Home } from 'lucide-react';

const pathNameMap: Record<string, string> = {
  'admin': 'Admin Dashboard',
  'orders': 'Order Management',
  'users': 'User Management',
  'vendors': 'Vendor Management',
  'inventory': 'Inventory Management',
  'medicines': 'Medicine Management',
  'lab-tests': 'Lab Test Management',
  'scans': 'Scan Management',
  'doctors': 'Doctor Management',
  'home-care': 'Home Care Management',
  'diabetes-care': 'Diabetes Care Management',
  'physiotherapy': 'Physiotherapy Management',
  'hospitals': 'Hospital Management',
  'blood-banks': 'Blood Bank Management',
  'ambulance': 'Ambulance Management',
  'insurance': 'Insurance Management',
  'prescriptions': 'Prescription Management',
  'marketing': 'Marketing Dashboard',
  'analytics': 'Analytics Dashboard',
  'business-settings': 'Business Settings',
  'invoices': 'Invoice Management',
  'invoice-templates': 'Invoice Templates',
  'categories': 'Category Management',
  'page-design': 'Page Design Control',
  'reports': 'Reports Dashboard',
  'settings': 'System Settings'
};

export const BreadcrumbNav = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumb on the main admin dashboard
  if (pathSegments.length <= 1) return null;

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const displayName = pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return {
      path,
      name: displayName,
      isLast
    };
  });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.slice(1).map((item, index) => (
          <div key={item.path} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className="font-medium">
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};