import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { CouponManagement } from '@/admin/components/Marketing/CouponManagement';
import { BannerManagement } from '@/admin/components/Marketing/BannerManagement';
import { EmailMarketing } from '@/admin/components/Marketing/EmailMarketing';

export default function MarketingDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing & CMS"
        description="Manage promotional campaigns, coupons, banners, and email marketing"
      />

      <Tabs defaultValue="coupons" className="space-y-6">
        <TabsList>
          <TabsTrigger value="coupons">Coupons & Discounts</TabsTrigger>
          <TabsTrigger value="banners">Banners & Content</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <CouponManagement />
        </TabsContent>

        <TabsContent value="banners">
          <BannerManagement />
        </TabsContent>

        <TabsContent value="email">
          <EmailMarketing />
        </TabsContent>
      </Tabs>
    </div>
  );
}