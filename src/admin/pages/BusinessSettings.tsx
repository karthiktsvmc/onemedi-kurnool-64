import { useState, useEffect } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CreditCard, 
  Percent, 
  Truck, 
  Settings, 
  FileText,
  DollarSign,
  Hash
} from 'lucide-react';

interface BusinessSettings {
  id: string;
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  gst_number?: string;
  pan_number?: string;
  default_currency: string;
  gst_rate: number;
  delivery_charge: number;
  service_charge_rate: number;
  invoice_number_format: string;
  invoice_counter: number;
  created_at: string;
  updated_at: string;
}

export const BusinessSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company_name: 'ONE MEDI',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    gst_number: '',
    pan_number: '',
    default_currency: 'INR',
    gst_rate: 18.00,
    delivery_charge: 0,
    service_charge_rate: 0,
    invoice_number_format: 'INV-{YYYY}{MM}{DD}-{####}',
    invoice_counter: 1000
  });

  const { data: settings, loading, refetch } = useSupabaseQuery<BusinessSettings>({
    table: 'business_settings',
    limit: 1
  });

  const { create, update, loading: saving } = useSupabaseMutation({
    table: 'business_settings',
    onSuccess: () => {
      toast({ title: 'Settings saved successfully' });
      refetch();
    }
  });

  useEffect(() => {
    if (settings && settings.length > 0) {
      const setting = settings[0];
      setFormData({
        company_name: setting.company_name || 'ONE MEDI',
        company_address: setting.company_address || '',
        company_phone: setting.company_phone || '',
        company_email: setting.company_email || '',
        company_website: setting.company_website || '',
        gst_number: setting.gst_number || '',
        pan_number: setting.pan_number || '',
        default_currency: setting.default_currency || 'INR',
        gst_rate: setting.gst_rate || 18.00,
        delivery_charge: setting.delivery_charge || 0,
        service_charge_rate: setting.service_charge_rate || 0,
        invoice_number_format: setting.invoice_number_format || 'INV-{YYYY}{MM}{DD}-{####}',
        invoice_counter: setting.invoice_counter || 1000
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (settings && settings.length > 0) {
      await update(settings[0].id, formData);
    } else {
      await create(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const previewInvoiceNumber = () => {
    const now = new Date();
    let preview = formData.invoice_number_format;
    preview = preview.replace('{YYYY}', now.getFullYear().toString());
    preview = preview.replace('{MM}', (now.getMonth() + 1).toString().padStart(2, '0'));
    preview = preview.replace('{DD}', now.getDate().toString().padStart(2, '0'));
    preview = preview.replace('{####}', formData.invoice_counter.toString().padStart(4, '0'));
    return preview;
  };

  const currencyOptions = [
    { value: 'INR', label: '₹ Indian Rupee (INR)' },
    { value: 'USD', label: '$ US Dollar (USD)' },
    { value: 'EUR', label: '€ Euro (EUR)' },
    { value: 'GBP', label: '£ British Pound (GBP)' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Settings"
        description="Configure global business and billing settings"
      />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="company">Company Info</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="charges">Charges & Taxes</TabsTrigger>
              <TabsTrigger value="invoice">Invoice Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_phone">Phone Number</Label>
                      <div className="flex">
                        <Phone className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                        <Input
                          id="company_phone"
                          value={formData.company_phone}
                          onChange={(e) => handleInputChange('company_phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company_address">Address</Label>
                    <div className="flex">
                      <MapPin className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                      <Input
                        id="company_address"
                        value={formData.company_address}
                        onChange={(e) => handleInputChange('company_address', e.target.value)}
                        placeholder="Complete business address"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="company_email">Email</Label>
                      <div className="flex">
                        <Mail className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                        <Input
                          id="company_email"
                          type="email"
                          value={formData.company_email}
                          onChange={(e) => handleInputChange('company_email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company_website">Website</Label>
                      <div className="flex">
                        <Globe className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                        <Input
                          id="company_website"
                          value={formData.company_website}
                          onChange={(e) => handleInputChange('company_website', e.target.value)}
                          placeholder="https://www.onemedi.com"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="gst_number">GST Number</Label>
                      <Input
                        id="gst_number"
                        value={formData.gst_number}
                        onChange={(e) => handleInputChange('gst_number', e.target.value)}
                        placeholder="GSTIN Number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pan_number">PAN Number</Label>
                      <Input
                        id="pan_number"
                        value={formData.pan_number}
                        onChange={(e) => handleInputChange('pan_number', e.target.value)}
                        placeholder="PAN Number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="default_currency">Default Currency</Label>
                    <select
                      id="default_currency"
                      value={formData.default_currency}
                      onChange={(e) => handleInputChange('default_currency', e.target.value)}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charges">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Charges & Tax Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="gst_rate">GST Rate (%)</Label>
                      <div className="flex">
                        <Percent className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                        <Input
                          id="gst_rate"
                          type="number"
                          step="0.01"
                          value={formData.gst_rate}
                          onChange={(e) => handleInputChange('gst_rate', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="delivery_charge">Fixed Delivery Charge</Label>
                      <div className="flex">
                        <Truck className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                        <Input
                          id="delivery_charge"
                          type="number"
                          step="0.01"
                          value={formData.delivery_charge}
                          onChange={(e) => handleInputChange('delivery_charge', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service_charge_rate">Service Charge Rate (%)</Label>
                    <div className="flex">
                      <DollarSign className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                      <Input
                        id="service_charge_rate"
                        type="number"
                        step="0.01"
                        value={formData.service_charge_rate}
                        onChange={(e) => handleInputChange('service_charge_rate', parseFloat(e.target.value))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applied as a percentage of order total
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoice">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoice Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="invoice_number_format">Invoice Number Format</Label>
                    <div className="flex">
                      <Hash className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                      <Input
                        id="invoice_number_format"
                        value={formData.invoice_number_format}
                        onChange={(e) => handleInputChange('invoice_number_format', e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use placeholders: {'{YYYY}'} {'{MM}'} {'{DD}'} {'{####}'}
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline">
                        Preview: {previewInvoiceNumber()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="invoice_counter">Current Counter</Label>
                    <Input
                      id="invoice_counter"
                      type="number"
                      value={formData.invoice_counter}
                      onChange={(e) => handleInputChange('invoice_counter', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Next invoice will start from this number
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Format Guidelines:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {'{YYYY}'} - Full year (2025)</li>
                      <li>• {'{MM}'} - Month with zero padding (01-12)</li>
                      <li>• {'{DD}'} - Day with zero padding (01-31)</li>
                      <li>• {'{####}'} - Sequential counter with padding</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    );
};