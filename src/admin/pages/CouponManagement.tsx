import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { DataTable } from '../components/shared/DataTable';
import { FormDialog } from '../components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Gift, TrendingUp, Target, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';

interface CouponFormData {
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  user_usage_limit: number;
  valid_from: Date;
  valid_until: Date;
  applicable_to: string;
  active: boolean;
}

export default function CouponManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // Fetch coupons data
  const { data: coupons = [], refetch } = useSupabaseQuery({
    table: 'coupons',
    select: '*',
    orderBy: 'created_at',
    ascending: false
  });

  // Mutations for CRUD operations
  const { mutate: create } = useSupabaseMutation('coupons', {
    onSuccess: () => {
      refetch();
      setIsAddDialogOpen(false);
    }
  });

  const { mutate: update } = useSupabaseMutation('coupons', {
    onSuccess: () => {
      refetch();
      setEditingCoupon(null);
    }
  });

  const { remove } = useSupabaseMutation('coupons', {
    onSuccess: refetch
  });

  const couponFields = [
    { name: 'code', label: 'Coupon Code', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'type', label: 'Type', type: 'select', options: [
      { value: 'percentage', label: 'Percentage' },
      { value: 'fixed', label: 'Fixed Amount' }
    ]},
    { name: 'value', label: 'Value', type: 'number', required: true },
    { name: 'minimum_order_amount', label: 'Minimum Order (₹)', type: 'number' },
    { name: 'maximum_discount_amount', label: 'Maximum Discount (₹)', type: 'number' },
    { name: 'usage_limit', label: 'Total Usage Limit', type: 'number' },
    { name: 'user_usage_limit', label: 'Per User Limit', type: 'number', defaultValue: 1 },
    { name: 'valid_from', label: 'Valid From', type: 'date' },
    { name: 'valid_until', label: 'Valid Until', type: 'date' },
    { name: 'applicable_to', label: 'Applicable To', type: 'select', options: [
      { value: 'all', label: 'All Products' },
      { value: 'medicines', label: 'Medicines Only' },
      { value: 'lab-tests', label: 'Lab Tests Only' },
      { value: 'scans', label: 'Scans Only' }
    ]},
    { name: 'active', label: 'Active', type: 'boolean', defaultValue: true }
  ];

  const columns = [
    {
      key: 'code',
      label: 'Coupon',
      render: (value: any, row: any) => (
        <div>
          <p className="font-medium">{row.code}</p>
          <p className="text-sm text-muted-foreground">{row.title}</p>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Discount',
      render: (value: any, row: any) => (
        <div>
          <p className="font-medium">
            {row.type === 'percentage' ? `${row.value}%` : `₹${row.value}`}
          </p>
          <p className="text-xs text-muted-foreground">
            Min: ₹{row.minimum_order_amount || 0}
          </p>
        </div>
      )
    },
    {
      key: 'used_count',
      label: 'Usage',
      render: (value: any, row: any) => (
        <div>
          <p className="font-medium">{row.used_count || 0}</p>
          <p className="text-xs text-muted-foreground">
            {row.usage_limit ? `/ ${row.usage_limit}` : 'Unlimited'}
          </p>
        </div>
      )
    },
    {
      key: 'valid_until',
      label: 'Validity',
      render: (value: any, row: any) => (
        <div>
          <p className="text-sm">{format(new Date(row.valid_until), 'PPP')}</p>
          <Badge variant={new Date(row.valid_until) > new Date() ? 'default' : 'destructive'}>
            {new Date(row.valid_until) > new Date() ? 'Active' : 'Expired'}
          </Badge>
        </div>
      )
    },
    {
      key: 'active',
      label: 'Status',
      render: (value: any, row: any) => (
        <Badge variant={row.active ? 'default' : 'secondary'}>
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleAdd = () => {
    setEditingCoupon(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      remove({ id });
    }
  };

  const handleSubmit = (data: CouponFormData) => {
    if (editingCoupon) {
      update({ 
        id: editingCoupon.id, 
        ...data 
      });
    } else {
      create(data);
    }
  };

  // Calculate stats
  const activeCoupons = coupons.filter(c => c.active && new Date(c.valid_until) > new Date()).length;
  const totalUsage = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);
  const totalSavings = coupons.reduce((sum, c) => sum + ((c.used_count || 0) * (c.value || 0)), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupon Management"
        description="Create and manage discount coupons and promotional codes"
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Coupons"
          value={activeCoupons.toString()}
          icon={Gift}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Usage"
          value={totalUsage.toString()}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Savings"
          value={`₹${totalSavings.toLocaleString()}`}
          icon={Target}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Conversion Rate"
          value="12.5%"
          icon={Users}
          iconColor="text-orange-600"
        />
      </div>

      {/* Coupons Table */}
      <DataTable
        title="Coupons"
        data={coupons}
        columns={columns}
        onSearch={(query) => console.log('Search:', query)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search coupons..."
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add/Edit Coupon Dialog */}
      <FormDialog
        title={editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
        description="Create or modify coupon codes with specific discount rules"
        fields={couponFields}
        initialData={editingCoupon}
        onSubmit={async (data) => handleSubmit(data)}
        trigger={<div />}
      />
    </div>
  );
}