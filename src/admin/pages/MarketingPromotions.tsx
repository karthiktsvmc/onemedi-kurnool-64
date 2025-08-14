import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Target, TrendingUp, Users, Gift } from 'lucide-react';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  type: 'banner' | 'offer' | 'push' | 'email' | 'coupon';
  title: string;
  description: string;
  imageUrl?: string;
  targetAudience: string[];
  targetModules: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority: number;
  clickCount: number;
  conversionCount: number;
  budget?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

const campaignTypes = [
  { value: 'banner', label: 'Homepage Banner' },
  { value: 'offer', label: 'Offer Strip' },
  { value: 'push', label: 'Push Notification' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'coupon', label: 'Coupon Code' }
];

const targetAudiences = [
  'new-users',
  'returning-users',
  'premium-users',
  'high-value-customers',
  'inactive-users',
  'location-specific',
  'age-group-specific'
];

const targetModules = [
  'medicines',
  'lab-tests',
  'scans',
  'doctors',
  'homecare',
  'diabetes-care',
  'all-modules'
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'New Year Health Checkup',
    type: 'banner',
    title: 'Complete Health Checkup at 50% OFF',
    description: 'Get comprehensive health screening packages at discounted rates',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=300&fit=crop',
    targetAudience: ['new-users', 'returning-users'],
    targetModules: ['lab-tests', 'scans'],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    isActive: true,
    priority: 1,
    clickCount: 1245,
    conversionCount: 156,
    budget: 50000,
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 1000,
    maxUses: 500,
    usedCount: 156,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Free Medicine Delivery',
    type: 'offer',
    title: 'Free Delivery on Medicines',
    description: 'Zero delivery charges on all medicine orders above ₹299',
    targetAudience: ['all-users'],
    targetModules: ['medicines'],
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    isActive: true,
    priority: 2,
    clickCount: 2341,
    conversionCount: 487,
    minOrderValue: 299,
    usedCount: 487,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Diabetes Care Package',
    type: 'coupon',
    title: 'DIABETES20',
    description: '20% off on all diabetes care products and consultations',
    targetAudience: ['premium-users', 'high-value-customers'],
    targetModules: ['diabetes-care', 'doctors'],
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-10'),
    isActive: true,
    priority: 3,
    clickCount: 456,
    conversionCount: 89,
    discountType: 'percentage',
    discountValue: 20,
    maxUses: 200,
    usedCount: 89,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  }
];

export default function MarketingPromotions() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      campaign.type === selectedTab ||
                      (selectedTab === 'active' && campaign.isActive) ||
                      (selectedTab === 'inactive' && !campaign.isActive);
    return matchesSearch && matchesTab;
  });

  const handleToggleActive = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { ...campaign, isActive: !campaign.isActive } : campaign
    ));
  };

  const CampaignForm = ({ campaign, onClose }: { campaign?: Campaign; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: campaign?.name || '',
      type: campaign?.type || 'banner' as const,
      title: campaign?.title || '',
      description: campaign?.description || '',
      imageUrl: campaign?.imageUrl || '',
      targetAudience: campaign?.targetAudience || [],
      targetModules: campaign?.targetModules || [],
      startDate: campaign?.startDate || new Date(),
      endDate: campaign?.endDate || new Date(),
      isActive: campaign?.isActive ?? true,
      priority: campaign?.priority?.toString() || '1',
      budget: campaign?.budget?.toString() || '',
      discountType: campaign?.discountType || 'percentage',
      discountValue: campaign?.discountValue?.toString() || '',
      minOrderValue: campaign?.minOrderValue?.toString() || '',
      maxUses: campaign?.maxUses?.toString() || ''
    });

    const handleAudienceToggle = (audience: string) => {
      setFormData(prev => ({
        ...prev,
        targetAudience: prev.targetAudience.includes(audience)
          ? prev.targetAudience.filter(a => a !== audience)
          : [...prev.targetAudience, audience]
      }));
    };

    const handleModuleToggle = (module: string) => {
      setFormData(prev => ({
        ...prev,
        targetModules: prev.targetModules.includes(module)
          ? prev.targetModules.filter(m => m !== module)
          : [...prev.targetModules, module]
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const campaignData = {
        ...formData,
        priority: parseInt(formData.priority),
        budget: formData.budget ? parseInt(formData.budget) : undefined,
        discountValue: formData.discountValue ? parseInt(formData.discountValue) : undefined,
        minOrderValue: formData.minOrderValue ? parseInt(formData.minOrderValue) : undefined,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined
      };

      if (campaign) {
        setCampaigns(prev => prev.map(c => 
          c.id === campaign.id 
            ? { 
                ...c, 
                ...campaignData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : c
        ));
      } else {
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          ...campaignData,
          clickCount: 0,
          conversionCount: 0,
          usedCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setCampaigns(prev => [...prev, newCampaign]);
      }
      
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Campaign Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL (for banners)</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.startDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.endDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label>Target Audience</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {targetAudiences.map(audience => (
              <div key={audience} className="flex items-center space-x-2">
                <Switch
                  checked={formData.targetAudience.includes(audience)}
                  onCheckedChange={() => handleAudienceToggle(audience)}
                />
                <span className="text-sm">{audience.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Target Modules</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {targetModules.map(module => (
              <div key={module} className="flex items-center space-x-2">
                <Switch
                  checked={formData.targetModules.includes(module)}
                  onCheckedChange={() => handleModuleToggle(module)}
                />
                <span className="text-sm">{module.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {(formData.type === 'coupon' || formData.type === 'offer') && (
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Discount Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select value={formData.discountType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, discountType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                  placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minOrderValue">Minimum Order Value (₹)</Label>
                <Input
                  id="minOrderValue"
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxUses">Maximum Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priority">Priority (1-5)</Label>
            <Input
              id="priority"
              type="number"
              min="1"
              max="5"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label>Active Campaign</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{campaign ? 'Update' : 'Create'} Campaign</Button>
        </div>
      </form>
    );
  };

  const totalClicks = campaigns.reduce((sum, c) => sum + c.clickCount, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversionCount, 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing & Promotions"
        description="Manage campaigns, offers, banners and promotional content"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard title="Active Campaigns">{campaigns.filter(c => c.isActive).length.toString()}</AdminCard>
        <AdminCard title="Total Clicks">{totalClicks.toLocaleString()}</AdminCard>
        <AdminCard title="Conversions">{totalConversions.toLocaleString()}</AdminCard>
        <AdminCard title="Conversion Rate">{`${conversionRate}%`}</AdminCard>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="banner">Banners</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
            <TabsTrigger value="coupon">Coupons</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <CampaignForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value={selectedTab} className="mt-0">
          <AdminCard title="Campaigns">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {campaign.imageUrl && (
                          <img src={campaign.imageUrl} alt={campaign.title} className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-muted-foreground">{campaign.name}</div>
                          {campaign.type === 'coupon' && campaign.discountValue && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {campaign.discountType === 'percentage' ? `${campaign.discountValue}% OFF` : `₹${campaign.discountValue} OFF`}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {campaign.targetModules.slice(0, 2).map(module => (
                            <Badge key={module} variant="secondary" className="text-xs">
                              {module.replace('-', ' ')}
                            </Badge>
                          ))}
                          {campaign.targetModules.length > 2 && (
                            <Badge variant="secondary" className="text-xs">+{campaign.targetModules.length - 2}</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.targetAudience.length} audience segments
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(campaign.startDate, 'MMM dd')}</div>
                        <div className="text-muted-foreground">to {format(campaign.endDate, 'MMM dd')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-3 h-3" />
                          <span>{campaign.clickCount.toLocaleString()} clicks</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-3 h-3" />
                          <span>{campaign.conversionCount} conversions</span>
                        </div>
                        {campaign.type === 'coupon' && campaign.maxUses && (
                          <div className="text-xs text-muted-foreground">
                            {campaign.usedCount}/{campaign.maxUses} uses
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={campaign.isActive}
                          onCheckedChange={() => handleToggleActive(campaign.id)}
                        />
                        <span className="text-sm">{campaign.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingCampaign(campaign)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Campaign</DialogTitle>
                            </DialogHeader>
                            {editingCampaign && (
                              <CampaignForm 
                                campaign={editingCampaign} 
                                onClose={() => setEditingCampaign(null)} 
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}