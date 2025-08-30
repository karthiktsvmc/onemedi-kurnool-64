import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { DataTable } from '@/admin/components/shared/DataTable';
import { Percent, Gift, Calendar, Users } from 'lucide-react';

export function CouponManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const { data: coupons, loading, refetch } = useSupabaseQuery({
    table: 'coupons',
    select: '*',
    orderBy: 'created_at',
    ascending: false,
  });

  const { create, update, remove, loading: mutationLoading } = useSupabaseMutation({
    table: 'coupons',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingCoupon(null);
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const data = {
      code: formData.get('code'),
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      value: parseFloat(formData.get('value') as string),
      minimum_order_amount: parseFloat(formData.get('minimum_order_amount') as string) || 0,
      maximum_discount_amount: parseFloat(formData.get('maximum_discount_amount') as string) || null,
      usage_limit: parseInt(formData.get('usage_limit') as string) || null,
      user_usage_limit: parseInt(formData.get('user_usage_limit') as string) || 1,
      valid_from: formData.get('valid_from'),
      valid_until: formData.get('valid_until'),
      applicable_to: formData.get('applicable_to'),
      active: formData.get('active') === 'true',
    };

    if (editingCoupon) {
      await update(editingCoupon.id, data);
    } else {
      await create(data);
    }
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (value: any) => (
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      ),
    },
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: any) => (
        <Badge variant={value === 'percentage' ? 'default' : 'secondary'}>
          {value === 'percentage' ? 'Percentage' : 'Fixed Amount'}
        </Badge>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (value: any, row: any) => 
        row.type === 'percentage' ? `${value}%` : `₹${value}`,
    },
    {
      key: 'used_count',
      label: 'Used',
      render: (value: any, row: any) => 
        row.usage_limit ? `${value || 0}/${row.usage_limit}` : (value || 0),
    },
    {
      key: 'active',
      label: 'Status',
      render: (value: any) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'valid_until',
      label: 'Expires',
      render: (value: any) => 
        new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons?.filter(c => c.active).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons?.reduce((sum, c) => sum + (c.used_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coupons?.filter(c => 
                new Date(c.valid_until) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>
                Manage discount coupons and promotional codes
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              Create Coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            title="Coupons"
            columns={columns}
            data={coupons || []}
            loading={loading}
            onEdit={(coupon) => {
              setEditingCoupon(coupon);
              setIsDialogOpen(true);
            }}
            onDelete={(coupon) => remove(coupon.id)}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              name="code"
              defaultValue={editingCoupon?.code}
              placeholder="WELCOME20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={editingCoupon?.title}
              placeholder="Welcome Discount"
              required
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={editingCoupon?.description}
              placeholder="Get 20% off on your first order"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Discount Type</Label>
            <Select name="type" defaultValue={editingCoupon?.type || 'percentage'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              type="number"
              step="0.01"
              defaultValue={editingCoupon?.value}
              placeholder="20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minimum_order_amount">Minimum Order Amount</Label>
            <Input
              id="minimum_order_amount"
              name="minimum_order_amount"
              type="number"
              step="0.01"
              defaultValue={editingCoupon?.minimum_order_amount}
              placeholder="500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maximum_discount_amount">Maximum Discount</Label>
            <Input
              id="maximum_discount_amount"
              name="maximum_discount_amount"
              type="number"
              step="0.01"
              defaultValue={editingCoupon?.maximum_discount_amount}
              placeholder="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Total Usage Limit</Label>
            <Input
              id="usage_limit"
              name="usage_limit"
              type="number"
              defaultValue={editingCoupon?.usage_limit}
              placeholder="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user_usage_limit">Per User Limit</Label>
            <Input
              id="user_usage_limit"
              name="user_usage_limit"
              type="number"
              defaultValue={editingCoupon?.user_usage_limit || 1}
              placeholder="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valid_from">Valid From</Label>
            <Input
              id="valid_from"
              name="valid_from"
              type="datetime-local"
              defaultValue={editingCoupon?.valid_from ? new Date(editingCoupon.valid_from).toISOString().slice(0, 16) : ''}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valid_until">Valid Until</Label>
            <Input
              id="valid_until"
              name="valid_until"
              type="datetime-local"
              defaultValue={editingCoupon?.valid_until ? new Date(editingCoupon.valid_until).toISOString().slice(0, 16) : ''}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="applicable_to">Applicable To</Label>
            <Select name="applicable_to" defaultValue={editingCoupon?.applicable_to || 'all'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="medicines">Medicines Only</SelectItem>
                <SelectItem value="lab_tests">Lab Tests Only</SelectItem>
                <SelectItem value="scans">Scans Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="active">Status</Label>
            <Select name="active" defaultValue={editingCoupon?.active ? 'true' : 'false'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}