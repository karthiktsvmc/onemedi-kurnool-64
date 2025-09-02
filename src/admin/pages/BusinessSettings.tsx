import { useState, useEffect } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
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
  Hash,
  Users,
  Shield,
  Bell,
  Package,
  Lock,
  Code,
  Scale,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

export const BusinessSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    company_name: 'ONE MEDI',
    logo_url: '',
    favicon_url: '',
    tagline: 'One Stop for all Medical Needs',
    company_phone: '',
    company_email: '',
    whatsapp_business_number: '',
    company_website: '',
    company_address: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    timezone: 'Asia/Kolkata',
    language: 'en',
    storefront_status: 'live',
    maintenance_message: '',
    multi_location_enabled: false
  });

  // Payment Settings State
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [newGateway, setNewGateway] = useState({ gateway_name: '', enabled: false });

  // Regional Settings State
  const [regionalSettings, setRegionalSettings] = useState({
    country: 'India',
    default_state: 'Andhra Pradesh',
    default_city: 'Kurnool',
    serviceable_locations: [],
    shipping_zones: [],
    delivery_coverage: []
  });

  // Notification Templates State
  const [notificationTemplates, setNotificationTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // System Policies State
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout: 3600,
    max_login_attempts: 5,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false
    },
    data_encryption_enabled: true,
    activity_monitoring: true
  });

  // Fetch data queries
  const { data: businessSettings, loading: businessLoading } = useSupabaseQuery({
    table: 'business_settings',
    limit: 1
  });

  const { data: paymentSettings } = useSupabaseQuery({
    table: 'payment_settings'
  });

  const { data: templates } = useSupabaseQuery({
    table: 'notification_templates'
  });

  const { data: systemPolicies } = useSupabaseQuery({
    table: 'system_policies'
  });

  // Mutations
  const { create: createBusinessSettings, update: updateBusinessSettings, loading: saving } = useSupabaseMutation({
    table: 'business_settings',
    onSuccess: () => { toast({ title: 'Settings saved successfully' }); }
  });

  const { create: createPaymentSetting, update: updatePaymentSetting } = useSupabaseMutation({
    table: 'payment_settings',
    onSuccess: () => { toast({ title: 'Payment settings updated' }); }
  });

  const { create: createTemplate, update: updateTemplate } = useSupabaseMutation({
    table: 'notification_templates',
    onSuccess: () => { toast({ title: 'Template saved successfully' }); }
  });

  // Load initial data
  useEffect(() => {
    if (businessSettings && businessSettings.length > 0) {
      const settings = businessSettings[0];
      setGeneralSettings({
        company_name: settings.company_name || 'ONE MEDI',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '',
        tagline: settings.tagline || 'One Stop for all Medical Needs',
        company_phone: settings.company_phone || '',
        company_email: settings.company_email || '',
        whatsapp_business_number: settings.whatsapp_business_number || '',
        company_website: settings.company_website || '',
        company_address: settings.company_address || '',
        social_links: settings.social_links || {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: ''
        },
        timezone: settings.timezone || 'Asia/Kolkata',
        language: settings.language || 'en',
        storefront_status: settings.storefront_status || 'live',
        maintenance_message: settings.maintenance_message || '',
        multi_location_enabled: settings.multi_location_enabled || false
      });
    }

    if (paymentSettings) {
      setPaymentGateways(paymentSettings);
    }

    if (templates) {
      setNotificationTemplates(templates);
    }

    if (systemPolicies) {
      setPolicies(systemPolicies);
    }
  }, [businessSettings, paymentSettings, templates, systemPolicies]);

  const handleSaveGeneral = async () => {
    if (businessSettings && businessSettings.length > 0) {
      await updateBusinessSettings(businessSettings[0].id, generalSettings);
    } else {
      await createBusinessSettings(generalSettings);
    }
  };

  const handleAddPaymentGateway = async () => {
    if (newGateway.gateway_name) {
      await createPaymentSetting(newGateway);
      setNewGateway({ gateway_name: '', enabled: false });
    }
  };

  const StorefrontStatusOptions = [
    { value: 'live', label: '🟢 Live & Active' },
    { value: 'maintenance', label: '🔧 Under Maintenance' },
    { value: 'coming_soon', label: '🚀 Coming Soon' }
  ];

  const tabConfig = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'regional', label: 'Regional', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'tax', label: 'Tax & Compliance', icon: Percent },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'catalog', label: 'Catalog', icon: Package },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Code },
    { id: 'policies', label: 'Policies', icon: Scale }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Settings"
        description="Configure all aspects of your e-commerce platform"
        actions={
          <Button onClick={() => window.location.href = '/admin/invoice-management'}>
            <FileText className="h-4 w-4 mr-2" />
            Invoice Management
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabConfig.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Business Name *</Label>
                      <Input
                        value={generalSettings.company_name}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="ONE MEDI"
                      />
                    </div>
                    <div>
                      <Label>Tagline</Label>
                      <Input
                        value={generalSettings.tagline}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="One Stop for all Medical Needs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Logo URL</Label>
                      <Input
                        value={generalSettings.logo_url}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div>
                      <Label>Favicon URL</Label>
                      <Input
                        value={generalSettings.favicon_url}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={generalSettings.company_phone}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, company_phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label>WhatsApp Business Number</Label>
                      <Input
                        value={generalSettings.whatsapp_business_number}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, whatsapp_business_number: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={generalSettings.company_email}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, company_email: e.target.value }))}
                        placeholder="contact@onemedi.com"
                      />
                    </div>
                    <div>
                      <Label>Website URL</Label>
                      <Input
                        value={generalSettings.company_website}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, company_website: e.target.value }))}
                        placeholder="https://www.onemedi.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Business Address</Label>
                    <Textarea
                      value={generalSettings.company_address}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, company_address: e.target.value }))}
                      placeholder="Complete business address with city, state, pincode"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </Label>
                      <Input
                        value={generalSettings.social_links.facebook}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          social_links: { ...prev.social_links, facebook: e.target.value }
                        }))}
                        placeholder="https://facebook.com/onemedi"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        Twitter
                      </Label>
                      <Input
                        value={generalSettings.social_links.twitter}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          social_links: { ...prev.social_links, twitter: e.target.value }
                        }))}
                        placeholder="https://twitter.com/onemedi"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram
                      </Label>
                      <Input
                        value={generalSettings.social_links.instagram}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          social_links: { ...prev.social_links, instagram: e.target.value }
                        }))}
                        placeholder="https://instagram.com/onemedi"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        LinkedIn
                      </Label>
                      <Input
                        value={generalSettings.social_links.linkedin}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          social_links: { ...prev.social_links, linkedin: e.target.value }
                        }))}
                        placeholder="https://linkedin.com/company/onemedi"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      YouTube
                    </Label>
                    <Input
                      value={generalSettings.social_links.youtube}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        social_links: { ...prev.social_links, youtube: e.target.value }
                      }))}
                      placeholder="https://youtube.com/@onemedi"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Timezone</Label>
                      <Select value={generalSettings.timezone} onValueChange={(value) => 
                        setGeneralSettings(prev => ({ ...prev, timezone: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Default Language</Label>
                      <Select value={generalSettings.language} onValueChange={(value) => 
                        setGeneralSettings(prev => ({ ...prev, language: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Storefront Status</Label>
                    <Select value={generalSettings.storefront_status} onValueChange={(value) => 
                      setGeneralSettings(prev => ({ ...prev, storefront_status: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {StorefrontStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {generalSettings.storefront_status === 'maintenance' && (
                    <div>
                      <Label>Maintenance Message</Label>
                      <Textarea
                        value={generalSettings.maintenance_message}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, maintenance_message: e.target.value }))}
                        placeholder="We're currently updating our systems. Please check back soon!"
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Multi-Location Support</Label>
                      <p className="text-sm text-muted-foreground">Enable multiple business locations</p>
                    </div>
                    <Switch
                      checked={generalSettings.multi_location_enabled}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, multi_location_enabled: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral} disabled={saving}>
                  {saving ? 'Saving...' : 'Save General Settings'}
                </Button>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Gateway Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {paymentGateways.map((gateway) => (
                    <div key={gateway.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{gateway.gateway_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {gateway.enabled ? 'Enabled' : 'Disabled'} • {gateway.test_mode ? 'Test Mode' : 'Live Mode'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={gateway.enabled}
                          onCheckedChange={(checked) => 
                            updatePaymentSetting(gateway.id, { ...gateway, enabled: checked })
                          }
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Add New Payment Gateway</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Gateway name (e.g., Stripe, PayPal)"
                      value={newGateway.gateway_name}
                      onChange={(e) => setNewGateway(prev => ({ ...prev, gateway_name: e.target.value }))}
                    />
                    <Button onClick={handleAddPaymentGateway}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Gateway
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'general' && activeTab !== 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {tabConfig.find(tab => tab.id === activeTab)?.label} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    🚧 This section is under development
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Advanced {tabConfig.find(tab => tab.id === activeTab)?.label.toLowerCase()} configuration options will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};