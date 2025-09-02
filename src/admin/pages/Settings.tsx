import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';

export const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'ONE MEDI',
    siteDescription: 'Healthcare Simplified',
    contactEmail: 'support@onemedi.com',
    contactPhone: '+91-9429690055',
    address: 'Kurnool, Andhra Pradesh, India',
    
    // Business Settings
    businessHours: '8:00 AM - 10:00 PM',
    minimumOrderAmount: '500',
    freeDeliveryThreshold: '500',
    deliveryCharge: '50',
    taxRate: '18',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordPolicy: 'medium',
    
    // Feature Toggles
    enablePrescriptionUpload: true,
    enableTeleConsultation: true,
    enableHomeCare: true,
    enableLabTests: true,
    enableMedicineDelivery: true,
    
    // Payment Settings
    codEnabled: true,
    onlinePaymentsEnabled: true,
    razorpayEnabled: true,
    paytmEnabled: false,
  });

  const handleSave = (section: string) => {
    // In real implementation, this would save to backend
    toast.success(`${section} settings saved successfully!`);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings, business configuration, and system preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information about your healthcare platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input
                    id="businessHours"
                    value={settings.businessHours}
                    onChange={(e) => handleSettingChange('businessHours', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                />
              </div>

              <Button onClick={() => handleSave('General')}>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Configure your business rules and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minimumOrderAmount">Minimum Order Amount (₹)</Label>
                  <Input
                    id="minimumOrderAmount"
                    type="number"
                    value={settings.minimumOrderAmount}
                    onChange={(e) => handleSettingChange('minimumOrderAmount', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (₹)</Label>
                  <Input
                    id="freeDeliveryThreshold"
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => handleSettingChange('freeDeliveryThreshold', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
                  <Input
                    id="deliveryCharge"
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={(e) => handleSettingChange('deliveryCharge', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Business')}>Save Business Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when to send notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications to mobile apps</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify customers about order status changes</p>
                  </div>
                  <Switch
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked) => handleSettingChange('orderUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promotional Emails</Label>
                    <p className="text-sm text-muted-foreground">Send promotional and marketing emails</p>
                  </div>
                  <Switch
                    checked={settings.promotionalEmails}
                    onCheckedChange={(checked) => handleSettingChange('promotionalEmails', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Notification')}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select value={settings.passwordPolicy} onValueChange={(value) => handleSettingChange('passwordPolicy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - 6 characters minimum</SelectItem>
                      <SelectItem value="medium">Medium - 8 characters, mixed case</SelectItem>
                      <SelectItem value="high">High - 12 characters, symbols required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('Security')}>Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Prescription Upload</Label>
                    <p className="text-sm text-muted-foreground">Allow users to upload prescriptions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.enablePrescriptionUpload}
                      onCheckedChange={(checked) => handleSettingChange('enablePrescriptionUpload', checked)}
                    />
                    <Badge variant={settings.enablePrescriptionUpload ? "default" : "secondary"}>
                      {settings.enablePrescriptionUpload ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Teleconsultation</Label>
                    <p className="text-sm text-muted-foreground">Enable online doctor consultations</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.enableTeleConsultation}
                      onCheckedChange={(checked) => handleSettingChange('enableTeleConsultation', checked)}
                    />
                    <Badge variant={settings.enableTeleConsultation ? "default" : "secondary"}>
                      {settings.enableTeleConsultation ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Home Care Services</Label>
                    <p className="text-sm text-muted-foreground">Enable home care bookings</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.enableHomeCare}
                      onCheckedChange={(checked) => handleSettingChange('enableHomeCare', checked)}
                    />
                    <Badge variant={settings.enableHomeCare ? "default" : "secondary"}>
                      {settings.enableHomeCare ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lab Tests</Label>
                    <p className="text-sm text-muted-foreground">Enable lab test bookings</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.enableLabTests}
                      onCheckedChange={(checked) => handleSettingChange('enableLabTests', checked)}
                    />
                    <Badge variant={settings.enableLabTests ? "default" : "secondary"}>
                      {settings.enableLabTests ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Medicine Delivery</Label>
                    <p className="text-sm text-muted-foreground">Enable medicine ordering and delivery</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.enableMedicineDelivery}
                      onCheckedChange={(checked) => handleSettingChange('enableMedicineDelivery', checked)}
                    />
                    <Badge variant={settings.enableMedicineDelivery ? "default" : "secondary"}>
                      {settings.enableMedicineDelivery ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave('Feature')}>Save Feature Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and gateways</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cash on Delivery</Label>
                    <p className="text-sm text-muted-foreground">Accept cash payments on delivery</p>
                  </div>
                  <Switch
                    checked={settings.codEnabled}
                    onCheckedChange={(checked) => handleSettingChange('codEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Online Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept online payments</p>
                  </div>
                  <Switch
                    checked={settings.onlinePaymentsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('onlinePaymentsEnabled', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Razorpay Gateway</Label>
                    <p className="text-sm text-muted-foreground">Enable Razorpay payment processing</p>
                  </div>
                  <Switch
                    checked={settings.razorpayEnabled}
                    onCheckedChange={(checked) => handleSettingChange('razorpayEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Paytm Gateway</Label>
                    <p className="text-sm text-muted-foreground">Enable Paytm payment processing</p>
                  </div>
                  <Switch
                    checked={settings.paytmEnabled}
                    onCheckedChange={(checked) => handleSettingChange('paytmEnabled', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Payment')}>Save Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};