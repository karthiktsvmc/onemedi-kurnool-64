import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Download, FileText, Table, BarChart3, Calendar, Filter, CheckCircle, Clock } from 'lucide-react';

interface ExportJob {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  downloadUrl?: string;
  fileSize?: string;
}

export function DataExport() {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Orders Report - January 2024',
      type: 'orders',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      downloadUrl: '/exports/orders-jan-2024.xlsx',
      fileSize: '2.3 MB',
    },
    {
      id: '2',
      name: 'User Analytics - Last 30 Days',
      type: 'users',
      status: 'completed',
      createdAt: new Date('2024-01-14'),
      downloadUrl: '/exports/users-analytics.csv',
      fileSize: '856 KB',
    },
    {
      id: '3',
      name: 'Medicine Inventory Report',
      type: 'inventory',
      status: 'processing',
      createdAt: new Date('2024-01-15'),
    },
  ]);

  const [exportConfig, setExportConfig] = useState({
    reportType: '',
    dateRange: 'last_30_days',
    format: 'xlsx',
    includeColumns: [],
    filters: {},
  });

  const reportTypes = [
    { value: 'orders', label: 'Orders Report', icon: <FileText className="h-4 w-4" /> },
    { value: 'users', label: 'Users Report', icon: <Table className="h-4 w-4" /> },
    { value: 'sales', label: 'Sales Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'inventory', label: 'Inventory Report', icon: <Table className="h-4 w-4" /> },
    { value: 'finance', label: 'Financial Report', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const columnOptions = {
    orders: [
      'Order ID', 'Customer Name', 'Email', 'Phone', 'Items', 'Total Amount', 
      'Status', 'Payment Method', 'Created At', 'Updated At'
    ],
    users: [
      'User ID', 'Name', 'Email', 'Phone', 'Registration Date', 'Last Login',
      'Total Orders', 'Total Spent', 'Status'
    ],
    sales: [
      'Date', 'Revenue', 'Orders Count', 'Average Order Value', 'Service Type',
      'Location', 'Payment Method', 'Profit Margin'
    ],
    inventory: [
      'Product ID', 'Name', 'Category', 'Stock Quantity', 'Price', 'Supplier',
      'Expiry Date', 'Last Updated'
    ],
    finance: [
      'Transaction ID', 'Type', 'Amount', 'Date', 'Status', 'Payment Gateway',
      'Commission', 'Net Amount'
    ],
  };

  const handleCreateExport = () => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: `${reportTypes.find(r => r.value === exportConfig.reportType)?.label} - ${new Date().toLocaleDateString()}`,
      type: exportConfig.reportType,
      status: 'pending',
      createdAt: new Date(),
    };

    setExportJobs(prev => [newJob, ...prev]);

    // Simulate processing
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: 'processing' } : job
      ));
    }, 1000);

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id ? { 
          ...job, 
          status: 'completed',
          downloadUrl: `/exports/${job.type}-${Date.now()}.${exportConfig.format}`,
          fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`
        } : job
      ));
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Export</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Data Export</CardTitle>
                  <CardDescription>
                    Generate and download reports from your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select 
                      value={exportConfig.reportType} 
                      onValueChange={(value) => setExportConfig({...exportConfig, reportType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Select 
                        value={exportConfig.dateRange}
                        onValueChange={(value) => setExportConfig({...exportConfig, dateRange: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last_7_days">Last 7 days</SelectItem>
                          <SelectItem value="last_30_days">Last 30 days</SelectItem>
                          <SelectItem value="last_90_days">Last 90 days</SelectItem>
                          <SelectItem value="last_year">Last year</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select 
                        value={exportConfig.format}
                        onValueChange={(value) => setExportConfig({...exportConfig, format: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                          <SelectItem value="csv">CSV (.csv)</SelectItem>
                          <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                          <SelectItem value="json">JSON (.json)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {exportConfig.dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                  )}

                  {exportConfig.reportType && columnOptions[exportConfig.reportType as keyof typeof columnOptions] && (
                    <div className="space-y-2">
                      <Label>Include Columns</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {columnOptions[exportConfig.reportType as keyof typeof columnOptions].map((column) => (
                          <div key={column} className="flex items-center space-x-2">
                            <Checkbox id={column} defaultChecked />
                            <Label htmlFor={column} className="text-sm">{column}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleCreateExport} 
                    className="w-full"
                    disabled={!exportConfig.reportType}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Export
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Reports</CardTitle>
                  <CardDescription>
                    Common reports ready to download
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Today\'s Orders',
                    'Weekly Sales Summary',
                    'Low Stock Alert',
                    'Payment Failures',
                    'User Activity Log',
                  ].map((report) => (
                    <Button key={report} variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      {report}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold">23 exports</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Size</span>
                    <span className="font-semibold">47.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Most Used</span>
                    <span className="font-semibold">Orders Report</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>
                Your recent data exports and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{job.name}</h4>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created {job.createdAt.toLocaleDateString()}</span>
                        {job.fileSize && <span>{job.fileSize}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'completed' && job.downloadUrl && (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {job.status === 'processing' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                          Processing...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>
                    Automatically generated reports sent to your email
                  </CardDescription>
                </div>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Weekly Sales Report',
                    schedule: 'Every Monday at 9:00 AM',
                    lastSent: '2024-01-15',
                    recipients: 'admin@onemedi.com',
                    active: true,
                  },
                  {
                    name: 'Monthly Financial Summary',
                    schedule: '1st of every month at 8:00 AM',
                    lastSent: '2024-01-01',
                    recipients: 'finance@onemedi.com',
                    active: true,
                  },
                  {
                    name: 'Daily Orders Report',
                    schedule: 'Every day at 11:00 PM',
                    lastSent: '2024-01-15',
                    recipients: 'operations@onemedi.com',
                    active: false,
                  },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{report.name}</h4>
                        <Badge variant={report.active ? 'default' : 'secondary'}>
                          {report.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{report.schedule}</p>
                        <p>Last sent: {report.lastSent} • To: {report.recipients}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        {report.active ? 'Pause' : 'Resume'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}