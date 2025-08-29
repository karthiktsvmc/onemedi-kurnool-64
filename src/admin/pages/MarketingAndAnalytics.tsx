// Simplified fallback components for Marketing & CMS features

import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Gift, TrendingUp, Target, Users, Monitor, Smartphone, Eye, Send } from 'lucide-react';

// Simple Coupon Management
export function CouponManagement() {
  const [coupons] = useState([
    { id: '1', code: 'HEALTH20', title: '20% Health Discount', type: 'percentage', value: 20, active: true },
    { id: '2', code: 'NEWUSER', title: 'New User Offer', type: 'fixed', value: 100, active: true }
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupon Management"
        description="Create and manage discount coupons and promotional codes"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Coupons" value="12" icon={Gift} iconColor="text-blue-600" />
        <StatCard title="Total Usage" value="2,456" icon={TrendingUp} iconColor="text-green-600" />
        <StatCard title="Total Savings" value="₹45,600" icon={Target} iconColor="text-purple-600" />
        <StatCard title="Conversion Rate" value="12.5%" icon={Users} iconColor="text-orange-600" />
      </div>

      <AdminCard title="Active Coupons">
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-muted-foreground">{coupon.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">{coupon.type}</Badge>
                <span className="font-medium">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// Simple Banner Management
export function BannerManagement() {
  const [banners] = useState([
    { id: '1', title: 'Health Checkup Special', type: 'hero', active: true },
    { id: '2', title: 'Free Delivery Offer', type: 'promo', active: true }
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Management"
        description="Manage hero banners, promotional strips, and visual content"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Hero Banners" value="5" icon={Monitor} iconColor="text-blue-600" />
        <StatCard title="Promo Strips" value="8" icon={Smartphone} iconColor="text-green-600" />
        <StatCard title="Total Views" value="1.2M" icon={Eye} iconColor="text-purple-600" />
        <StatCard title="Click Rate" value="3.8%" icon={TrendingUp} iconColor="text-orange-600" />
      </div>

      <AdminCard title="Active Banners">
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{banner.title}</p>
                <Badge variant="outline">{banner.type}</Badge>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// Simple Analytics Dashboard
export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Comprehensive business insights and performance metrics"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="₹4,56,789"
          change="+12.5%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Orders"
          value="2,847"
          change="+8.3%"
          changeType="positive"
          icon={Gift}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Users"
          value="18,420"
          change="+15.2%"
          changeType="positive"
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change="+0.5%"
          changeType="positive"
          icon={Target}
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Revenue Trend" description="Monthly revenue performance">
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Revenue Chart (Implementation Ready)
          </div>
        </AdminCard>

        <AdminCard title="Service Performance" description="Performance by service type">
          <div className="space-y-4">
            {[
              { name: 'Medicines', revenue: '₹2,85,000', percentage: 45 },
              { name: 'Lab Tests', revenue: '₹1,25,000', percentage: 25 },
              { name: 'Consultations', revenue: '₹95,000', percentage: 15 },
              { name: 'Scans', revenue: '₹78,000', percentage: 10 },
              { name: 'Home Care', revenue: '₹45,000', percentage: 5 }
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <span>{service.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{service.revenue}</span>
                  <span className="text-sm text-muted-foreground">({service.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

// Simple Notification Center
export function NotificationCenter() {
  const [notifications] = useState([
    { id: '1', title: 'Welcome Message', type: 'push', status: 'sent', sent_count: 1245 },
    { id: '2', title: 'Order Update', type: 'email', status: 'sent', sent_count: 890 }
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="Manage push notifications, emails, SMS campaigns and user communications"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Sent" value="24,567" icon={Send} iconColor="text-blue-600" />
        <StatCard title="Delivery Rate" value="98.5%" icon={Target} iconColor="text-green-600" />
        <StatCard title="Open Rate" value="34.2%" icon={Eye} iconColor="text-purple-600" />
        <StatCard title="Click Rate" value="8.9%" icon={TrendingUp} iconColor="text-orange-600" />
      </div>

      <AdminCard title="Recent Notifications">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{notification.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{notification.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Sent to {notification.sent_count} users
                  </span>
                </div>
              </div>
              <Badge variant="default">{notification.status}</Badge>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// Export all components
export default {
  CouponManagement,
  BannerManagement,
  AnalyticsDashboard,
  NotificationCenter
};