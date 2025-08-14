import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Heart,
  Activity,
  Stethoscope,
  TestTube,
  Scan,
  Download,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { PageHeader } from '../components/shared/PageHeader';
import { useAdminStats } from '../hooks/useAdminStats';

export const AdminDashboard = () => {
  const { stats, serviceStats, loading } = useAdminStats();

  const iconMap = {
    ShoppingCart,
    Users,
    TrendingUp,
    Package,
    Heart,
    TestTube,
    Stethoscope,
    Activity,
    Scan
  };

  const recentActivities = [
    { action: 'New order #12453 placed', time: '2 minutes ago', type: 'order', urgent: true },
    { action: 'Medicine stock updated - Paracetamol', time: '15 minutes ago', type: 'inventory' },
    { action: 'New user registered - Dr. Amit Shah', time: '30 minutes ago', type: 'user' },
    { action: 'Lab test report uploaded', time: '1 hour ago', type: 'report' },
    { action: 'Payment of ₹2,560 received', time: '2 hours ago', type: 'payment' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with ONE MEDI today."
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={IconComponent}
              iconColor={stat.color}
              loading={loading}
            />
          );
        })}
      </div>

      {/* Service Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Performance */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Service Performance"
            description="Revenue and order metrics across all services"
            headerAction={
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            }
          >
            <div className="space-y-4">
              {serviceStats.map((service) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap];
                return (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-lg">
                        {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{service.name}</p>
                          {service.growth && service.growth > 15 && (
                            <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                              +{service.growth}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{service.orders} orders this month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{service.revenue}</p>
                      {service.growth && (
                        <p className="text-sm text-emerald-600">+{service.growth}%</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>

        {/* Recent Activity */}
        <AdminCard
          title="Recent Activity"
          description="Latest platform updates"
        >
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.urgent ? 'bg-destructive' : 'bg-primary'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
                {activity.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Quick Actions */}
      <AdminCard
        title="Quick Actions"
        description="Frequently used admin functions"
        gradient
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', action: 'add-product', variant: 'default' },
            { label: 'Process Orders', action: 'orders', variant: 'outline' },
            { label: 'Inventory Alert', action: 'inventory', variant: 'outline' },
            { label: 'Generate Report', action: 'reports', variant: 'outline' }
          ].map((action) => (
            <Button 
              key={action.action} 
              variant={action.variant as any}
              className="h-auto py-4 flex-col gap-2"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </AdminCard>
    </div>
  );
};