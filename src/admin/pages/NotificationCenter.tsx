import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { StatCard } from '../components/shared/StatCard';
import { DataTable } from '../components/shared/DataTable';
import { FormDialog } from '../components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { 
  Plus, 
  Send, 
  Bell, 
  Mail, 
  MessageCircle, 
  Users, 
  Eye,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation } from '@/shared/hooks/useSupabaseQuery';

interface NotificationFormData {
  title: string;
  message: string;
  type: 'push' | 'email' | 'sms' | 'in_app';
  target_audience: string;
  scheduled_at?: Date;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  image_url?: string;
}

export default function NotificationCenter() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('notifications');

  // Fetch notifications
  const { data: notifications = [], refetch } = useSupabaseQuery(
    'notifications',
    {
      select: '*',
      orderBy: 'created_at',
      ascending: false
    }
  );

  // Mutations
  const { mutate: create } = useSupabaseMutation('notifications', {
    onSuccess: () => {
      refetch();
      setIsAddDialogOpen(false);
    }
  });

  const { mutate: update } = useSupabaseMutation('notifications', {
    onSuccess: refetch
  });

  const notificationFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    { name: 'type', label: 'Type', type: 'select', required: true, options: [
      { value: 'push', label: 'Push Notification' },
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'SMS' },
      { value: 'in_app', label: 'In-App Notification' }
    ]},
    { name: 'target_audience', label: 'Target Audience', type: 'select', required: true, options: [
      { value: 'all', label: 'All Users' },
      { value: 'new_users', label: 'New Users' },
      { value: 'active_users', label: 'Active Users' },
      { value: 'premium_users', label: 'Premium Users' },
      { value: 'location_kurnool', label: 'Kurnool Users' },
      { value: 'high_value', label: 'High Value Customers' }
    ]},
    { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'medium', options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ]},
    { name: 'action_url', label: 'Action URL', type: 'url' },
    { name: 'image_url', label: 'Image URL', type: 'url' },
    { name: 'scheduled_at', label: 'Schedule For', type: 'datetime' }
  ];

  const columns = [
    {
      header: 'Notification',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{row.original.message}</p>
        </div>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }: any) => {
        const typeColors = {
          push: 'bg-blue-100 text-blue-800',
          email: 'bg-green-100 text-green-800',
          sms: 'bg-purple-100 text-purple-800',
          in_app: 'bg-orange-100 text-orange-800'
        };
        return (
          <Badge className={typeColors[row.original.type as keyof typeof typeColors]}>
            {row.original.type}
          </Badge>
        );
      }
    },
    {
      header: 'Audience',
      accessorKey: 'target_audience',
      cell: ({ row }: any) => (
        <span className="text-sm">{row.original.target_audience.replace('_', ' ')}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => {
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800',
          scheduled: 'bg-yellow-100 text-yellow-800',
          sent: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={statusColors[row.original.status as keyof typeof statusColors]}>
            {row.original.status || 'draft'}
          </Badge>
        );
      }
    },
    {
      header: 'Delivery Stats',
      accessorKey: 'delivered_count',
      cell: ({ row }: any) => (
        <div className="text-sm">
          <p>Sent: {row.original.sent_count || 0}</p>
          <p>Opened: {row.original.opened_count || 0}</p>
        </div>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (data: NotificationFormData) => {
    create({
      ...data,
      status: 'draft',
      created_at: new Date().toISOString()
    });
  };

  // Mock campaign data
  const campaignTemplates = [
    {
      id: 1,
      name: 'Welcome Series',
      description: 'Onboarding flow for new users',
      type: 'email',
      status: 'active',
      opens: '1,234',
      clicks: '456'
    },
    {
      id: 2,
      name: 'Medicine Reminder',
      description: 'Daily medication reminders',
      type: 'push',
      status: 'active',
      opens: '5,678',
      clicks: '890'
    },
    {
      id: 3,
      name: 'Health Checkup',
      description: 'Monthly health checkup reminders',
      type: 'email',
      status: 'paused',
      opens: '2,345',
      clicks: '234'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="Manage push notifications, emails, SMS campaigns and user communications"
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            New Notification
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Sent"
          value="24,567"
          change="+12.5%"
          changeType="positive"
          icon={Send}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Delivery Rate"
          value="98.5%"
          change="+2.1%"
          changeType="positive"
          icon={Target}
          iconColor="text-green-600"
        />
        <StatCard
          title="Open Rate"
          value="34.2%"
          change="+5.3%"
          changeType="positive"
          icon={Eye}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Click Rate"
          value="8.9%"
          change="+1.2%"
          changeType="positive"
          icon={Zap}
          iconColor="text-orange-600"
        />
      </div>

      {/* Notification Management */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <AdminCard>
            <DataTable
              data={notifications}
              columns={columns}
              searchKey="title"
              searchPlaceholder="Search notifications..."
            />
          </AdminCard>
        </TabsContent>

        <TabsContent value="campaigns">
          <AdminCard title="Email Campaigns" description="Automated email campaign management">
            <div className="space-y-4">
              {campaignTemplates.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-center">
                      <p className="font-medium">{campaign.opens}</p>
                      <p className="text-muted-foreground">Opens</p>
                    </div>
                    <div className="text-sm text-center">
                      <p className="font-medium">{campaign.clicks}</p>
                      <p className="text-muted-foreground">Clicks</p>
                    </div>
                    <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="templates">
          <AdminCard title="Message Templates" description="Reusable notification templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Welcome Message', 'Order Confirmation', 'Medicine Reminder', 'Health Tip', 'Appointment Reminder', 'Payment Receipt'].map((template) => (
                <div key={template} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{template}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pre-built template for {template.toLowerCase()}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Use</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="settings">
          <AdminCard title="Notification Settings" description="Configure notification preferences and limits">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Order Updates</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Medicine Reminders</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Health Tips</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Email Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Marketing Emails</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Newsletter</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Reports</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Rate Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Daily Push Limit</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 per day</SelectItem>
                        <SelectItem value="5">5 per day</SelectItem>
                        <SelectItem value="10">10 per day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Weekly Email Limit</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 per week</SelectItem>
                        <SelectItem value="7">7 per week</SelectItem>
                        <SelectItem value="14">14 per week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>SMS Rate Limit</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 per day</SelectItem>
                        <SelectItem value="2">2 per day</SelectItem>
                        <SelectItem value="5">5 per day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>

      {/* Add Notification Dialog */}
      <FormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Create New Notification"
        description="Send targeted notifications to your users"
        fields={notificationFields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}