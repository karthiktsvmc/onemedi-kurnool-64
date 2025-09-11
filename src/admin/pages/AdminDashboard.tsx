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
  Clock,
  Shield,
  Database,
  Server
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { PageHeader } from '../components/shared/PageHeader';
import { useAdminStats } from '../hooks/useAdminStats';
import { ConnectionStatus } from '../components/RealTimeSync/ConnectionStatus';
import { RealTimeOrderMonitor } from '../components/RealTimeOrderMonitor';
import { SmartDashboard } from '../components/Dashboard/SmartDashboard';

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
    Scan,
    Shield,
    Database,
    Server
  };

  const recentActivities = [
    { action: 'New order #12453 placed', time: '2 minutes ago', type: 'order', urgent: true },
    { action: 'Medicine stock updated - Paracetamol', time: '15 minutes ago', type: 'inventory' },
    { action: 'New user registered - Dr. Amit Shah', time: '30 minutes ago', type: 'user' },
    { action: 'Lab test report uploaded', time: '1 hour ago', type: 'report' },
    { action: 'Payment of ₹2,560 received', time: '2 hours ago', type: 'payment' },
    { action: 'Security alert: Failed login attempts', time: '3 hours ago', type: 'security', urgent: true }
  ];

  const securityMetrics = [
    { title: 'Active Sessions', value: '47', icon: 'Users', status: 'normal' },
    { title: 'Failed Logins', value: '3', icon: 'Shield', status: 'warning' },
    { title: 'API Calls/min', value: '1.2k', icon: 'Server', status: 'normal' },
    { title: 'DB Connections', value: '18/50', icon: 'Database', status: 'normal' }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Smart Dashboard */}
      <SmartDashboard userRole="admin" />
    </div>
  );
};