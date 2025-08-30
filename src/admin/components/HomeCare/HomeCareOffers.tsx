import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Percent, IndianRupee, Gift, Calendar } from 'lucide-react';

interface HomeCareOffer {
  id: string;
  title: string;
  description: string;
  offer_type: 'percentage' | 'fixed_amount' | 'buy_one_get_one';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount: number;
  applicable_to: 'all' | 'category' | 'service' | 'location';
  applicable_ids: string[];
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  used_count: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function HomeCareOffers() {
  const [offers, setOffers] = useState<HomeCareOffer[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<HomeCareOffer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch offers
      const { data: offersData, error: offersError } = await supabase
        .from('homecare_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;
      
      // Transform offers to match interface
      const transformedOffers = offersData?.map(offer => ({
        ...offer,
        offer_type: offer.offer_type as 'percentage' | 'fixed_amount' | 'buy_one_get_one',
        applicable_to: offer.applicable_to as 'all' | 'category' | 'service' | 'location',
        applicable_ids: offer.applicable_ids || [],
        description: offer.description || '',
        valid_from: offer.valid_from || new Date().toISOString(),
        valid_until: offer.valid_until || new Date().toISOString(),
        created_at: offer.created_at || new Date().toISOString(),
        updated_at: offer.updated_at || new Date().toISOString()
      })) || [];
      
      setOffers(transformedOffers);

      // Fetch categories for form dropdown
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('homecare_categories')
        .select('id, name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch services for form dropdown
      const { data: servicesData, error: servicesError } = await supabase
        .from('homecare_services')
        .select('id, name')
        .order('name');

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate discount text
  const getDiscountText = (offer: HomeCareOffer) => {
    switch (offer.offer_type) {
      case 'percentage':
        return `${offer.discount_value}% OFF`;
      case 'fixed_amount':
        return `₹${offer.discount_value} OFF`;
      case 'buy_one_get_one':
        return 'Buy 1 Get 1';
      default:
        return 'Discount';
    }
  };

  // Get offer status
  const getOfferStatus = (offer: HomeCareOffer) => {
    const now = new Date();
    const validFrom = new Date(offer.valid_from);
    const validUntil = new Date(offer.valid_until);

    if (!offer.active) return { status: 'inactive', color: 'secondary' };
    if (now < validFrom) return { status: 'upcoming', color: 'outline' };
    if (now > validUntil) return { status: 'expired', color: 'destructive' };
    if (offer.usage_limit && offer.used_count >= offer.usage_limit) {
      return { status: 'exhausted', color: 'destructive' };
    }
    return { status: 'active', color: 'default' };
  };

  // Table columns
  const columns = [
    {
      key: 'title',
      label: 'Offer Title',
      render: (value: string, row: HomeCareOffer) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {getDiscountText(row)}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'applicable_to',
      label: 'Applicable To',
      render: (value: string) => (
        <Badge variant="outline">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'discount_value',
      label: 'Discount',
      render: (value: number, row: HomeCareOffer) => (
        <div className="flex items-center gap-1">
          {row.offer_type === 'percentage' ? (
            <Percent className="h-3 w-3" />
          ) : (
            <IndianRupee className="h-3 w-3" />
          )}
          {getDiscountText(row)}
        </div>
      ),
    },
    {
      key: 'minimum_order_amount',
      label: 'Min. Order',
      render: (value: number) => value > 0 ? `₹${value.toLocaleString()}` : 'No minimum',
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (_: any, row: HomeCareOffer) => (
        <div className="text-sm">
          <div>{row.used_count} used</div>
          {row.usage_limit && (
            <div className="text-muted-foreground">
              of {row.usage_limit} limit
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'validity',
      label: 'Validity',
      render: (_: any, row: HomeCareOffer) => (
        <div className="text-sm">
          <div>{new Date(row.valid_from).toLocaleDateString()}</div>
          <div className="text-muted-foreground">
            to {new Date(row.valid_until).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, row: HomeCareOffer) => {
        const { status, color } = getOfferStatus(row);
        return (
          <Badge variant={color as any}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  // Form fields
  const formFields = [
    {
      name: 'title',
      label: 'Offer Title',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter offer title'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter offer description'
    },
    {
      name: 'offer_type',
      label: 'Offer Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'percentage', label: 'Percentage Discount' },
        { value: 'fixed_amount', label: 'Fixed Amount Discount' },
        { value: 'buy_one_get_one', label: 'Buy One Get One' }
      ]
    },
    {
      name: 'discount_value',
      label: 'Discount Value',
      type: 'number' as const,
      required: true,
      min: 0,
      placeholder: 'Enter discount value'
    },
    {
      name: 'minimum_order_amount',
      label: 'Minimum Order Amount (₹)',
      type: 'number' as const,
      min: 0,
      placeholder: '0 for no minimum'
    },
    {
      name: 'maximum_discount_amount',
      label: 'Maximum Discount Amount (₹)',
      type: 'number' as const,
      min: 0,
      placeholder: 'Leave empty for no maximum'
    },
    {
      name: 'applicable_to',
      label: 'Applicable To',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'all', label: 'All Services' },
        { value: 'category', label: 'Specific Categories' },
        { value: 'service', label: 'Specific Services' },
        { value: 'location', label: 'Specific Locations' }
      ]
    },
    {
      name: 'valid_from',
      label: 'Valid From',
      type: 'date' as const,
      required: true
    },
    {
      name: 'valid_until',
      label: 'Valid Until',
      type: 'date' as const,
      required: true
    },
    {
      name: 'usage_limit',
      label: 'Usage Limit',
      type: 'number' as const,
      min: 1,
      placeholder: 'Leave empty for unlimited'
    },
    {
      name: 'active',
      label: 'Active Offer',
      type: 'checkbox' as const,
    }
  ];

  // Handle create offer
  const handleCreate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('homecare_offers')
        .insert([{
          ...formData,
          used_count: 0
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Offer created successfully',
      });

      setShowAddDialog(false);
      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create offer',
        variant: 'destructive',
      });
    }
  };

  // Handle update offer
  const handleUpdate = async (formData: any) => {
    if (!editingOffer) return;

    try {
      const { error } = await supabase
        .from('homecare_offers')
        .update(formData)
        .eq('id', editingOffer.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Offer updated successfully',
      });

      setEditingOffer(null);
      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update offer',
        variant: 'destructive',
      });
    }
  };

  // Handle delete offer
  const handleDelete = async (offer: HomeCareOffer) => {
    try {
      const { error } = await supabase
        .from('homecare_offers')
        .delete()
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Offer deleted successfully',
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete offer',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AdminCard 
        title="Home Care Offers & Discounts" 
        description="Manage promotional offers and discounts for home care services"
      >
        <DataTable
          title="Home Care Offers"
          description="Manage promotional offers and discounts"
          data={offers}
          columns={columns}
          loading={loading}
          onAdd={() => setShowAddDialog(true)}
          onEdit={(offer) => setEditingOffer(offer)}
          onDelete={handleDelete}
          onRefresh={fetchData}
          searchPlaceholder="Search offers..."
        />
      </AdminCard>

      {/* Add Offer Dialog */}
      {showAddDialog && (
        <FormDialog
          title="Create New Offer"
          description="Create a new promotional offer or discount"
          fields={formFields}
          onSubmit={handleCreate}
          trigger={null}
          initialData={{
            active: true,
            minimum_order_amount: 0,
            applicable_to: 'all'
          }}
        />
      )}

      {/* Edit Offer Dialog */}
      {editingOffer && (
        <FormDialog
          title="Edit Offer"
          description="Update offer information"
          fields={formFields}
          initialData={editingOffer}
          onSubmit={handleUpdate}
          trigger={null}
        />
      )}
    </>
  );
}