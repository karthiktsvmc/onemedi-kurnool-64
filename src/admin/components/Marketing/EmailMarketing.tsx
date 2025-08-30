import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Mail, Send, Users, Calendar, TrendingUp } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  recipients: number;
  sent_at: string;
  open_rate: number;
  click_rate: number;
  status: 'draft' | 'sent' | 'scheduled';
}

export function EmailMarketing() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Welcome Series',
      subject: 'Welcome to ONE MEDI - Your Health Partner',
      recipients: 1250,
      sent_at: '2024-01-15T10:00:00Z',
      open_rate: 23.5,
      click_rate: 4.2,
      status: 'sent',
    },
    {
      id: '2',
      name: 'Health Checkup Reminder',
      subject: 'Time for Your Annual Health Checkup',
      recipients: 2100,
      sent_at: '2024-01-20T09:00:00Z',
      open_rate: 18.7,
      click_rate: 3.1,
      status: 'sent',
    },
    {
      id: '3',
      name: 'Medicine Discount Offer',
      subject: '20% Off on All Medicines This Weekend',
      recipients: 0,
      sent_at: '',
      open_rate: 0,
      click_rate: 0,
      status: 'draft',
    },
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    audience: 'all',
    schedule: 'now',
  });

  const handleCreateCampaign = () => {
    console.log('Creating campaign:', newCampaign);
    // Implementation for creating email campaign
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.recipients, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.open_rate, 0) / 
                campaigns.filter(c => c.status === 'sent').length || 0).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,247</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                View and manage your email marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <Badge
                          variant={
                            campaign.status === 'sent' ? 'default' :
                            campaign.status === 'scheduled' ? 'secondary' : 'outline'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      {campaign.status === 'sent' && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{campaign.recipients.toLocaleString()} recipients</span>
                          <span>{campaign.open_rate}% open rate</span>
                          <span>{campaign.click_rate}% click rate</span>
                          <span>Sent {new Date(campaign.sent_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm">
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Email Campaign</CardTitle>
              <CardDescription>
                Design and send email campaigns to your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Monthly Newsletter"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    placeholder="Your Health Update This Month"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  placeholder="Write your email content here..."
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select
                    value={newCampaign.audience}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, audience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="customers">Existing Customers</SelectItem>
                      <SelectItem value="new">New Subscribers</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select
                    value={newCampaign.schedule}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, schedule: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="later">Schedule for Later</SelectItem>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
                <Button variant="outline">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Pre-designed templates for your email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Welcome Email', 'Newsletter', 'Promotional Offer', 'Health Reminder', 'Appointment Confirmation', 'Lab Report Ready'].map((template) => (
                  <div key={template} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold mb-2">{template}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Preview</Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Management</CardTitle>
              <CardDescription>
                Manage your email subscriber list and segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">All Subscribers</h4>
                    <p className="text-sm text-muted-foreground">5,247 active subscribers</p>
                  </div>
                  <Button variant="outline">Export List</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Active Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3,421</div>
                      <p className="text-sm text-muted-foreground">Made purchase in last 30 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">New Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">892</div>
                      <p className="text-sm text-muted-foreground">Joined in last 30 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Inactive Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">934</div>
                      <p className="text-sm text-muted-foreground">No activity in 90+ days</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}