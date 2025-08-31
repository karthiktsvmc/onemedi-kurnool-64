import { useState } from 'react';
import { FormDialog } from '../shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';

interface EnhancedProductFormProps {
  title: string;
  trigger: React.ReactNode;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  categories: any[];
  tags: any[];
  attributes: any[];
  taxConfigurations: any[];
  locations: any[];
}

export const EnhancedProductForm = ({
  title,
  trigger,
  initialData,
  onSubmit,
  categories,
  tags,
  attributes,
  taxConfigurations,
  locations
}: EnhancedProductFormProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tag_ids || []);

  const productFields = [
    // Basic Information
    { name: 'name', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'product_type', 
      label: 'Product Type', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 'simple', label: 'Simple Product' },
        { value: 'variable', label: 'Variable Product' },
        { value: 'grouped', label: 'Grouped Product' },
        { value: 'digital', label: 'Digital Product' },
        { value: 'subscription', label: 'Subscription Product' }
      ]
    },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select' as const, 
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name }))
    },
    { name: 'brand', label: 'Brand', type: 'text' as const },
    { name: 'manufacturer', label: 'Manufacturer', type: 'text' as const },
    { name: 'composition', label: 'Composition', type: 'textarea' as const },
    
    // SKU & Identification
    { name: 'sku', label: 'SKU', type: 'text' as const, required: true },
    { name: 'hsn_code', label: 'HSN Code', type: 'text' as const },
    
    // Pricing
    { name: 'mrp', label: 'MRP (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    { name: 'sale_price', label: 'Sale Price (₹)', type: 'number' as const, required: true, min: 0, step: 0.01 },
    
    // Inventory
    { name: 'stock_qty', label: 'Stock Quantity', type: 'number' as const, required: true, min: 0 },
    { name: 'min_order_quantity', label: 'Min Order Qty', type: 'number' as const, min: 1 },
    { name: 'max_order_quantity', label: 'Max Order Qty', type: 'number' as const, min: 1 },
    { name: 'backorder_allowed', label: 'Allow Backorders', type: 'boolean' as const },
    
    // Physical Properties
    { name: 'weight', label: 'Weight (grams)', type: 'number' as const, min: 0, step: 0.01 },
    
    // Shipping & Tax
    { 
      name: 'tax_configuration_id', 
      label: 'Tax Configuration', 
      type: 'select' as const,
      options: [
        { value: '', label: 'No Tax' },
        ...taxConfigurations.map(t => ({ value: t.id, label: `${t.name} (${t.rate}%)` }))
      ]
    },
    { name: 'shipping_class', label: 'Shipping Class', type: 'text' as const },
    
    // Subscription (for subscription products)
    { name: 'subscription_interval_days', label: 'Subscription Interval (days)', type: 'number' as const, min: 1 },
    
    // Media & Display
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'featured', label: 'Featured Product', type: 'boolean' as const },
    { name: 'prescription_required', label: 'Prescription Required', type: 'boolean' as const },
    
    // Expiry
    { name: 'expiry_date', label: 'Expiry Date', type: 'date' as const },
    
    // Alternatives
    { name: 'generic_alternative', label: 'Generic Alternative', type: 'text' as const },
    { name: 'branded_alternatives', label: 'Branded Alternatives', type: 'array' as const }
  ];

  const handleSubmit = async (data: any) => {
    // Add selected tags to the data
    const finalData = {
      ...data,
      tag_ids: selectedTags
    };
    await onSubmit(finalData);
  };

  return (
    <div className="space-y-4">
      <FormDialog
        title={title}
        fields={productFields}
        initialData={initialData}
        onSubmit={handleSubmit}
        trigger={trigger}
      />
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag.id) 
                      ? prev.filter(id => id !== tag.id)
                      : [...prev, tag.id]
                  );
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};