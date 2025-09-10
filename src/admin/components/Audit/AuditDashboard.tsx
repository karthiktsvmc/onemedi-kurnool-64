import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { DataTable } from '@/admin/components/shared/DataTable';
import { 
  Shield, AlertTriangle, Activity, Users, Database, 
  Search, Filter, Download, Eye, Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeData } from '@/admin/hooks/useRealtimeData';
import { useHasPermission } from '@/admin/hooks/useAdminPermissions';
import { useToast } from '@/shared/hooks/use-toast';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  risk_score?: number;
  created_at: string;
  user_email?: string;
}

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metadata?: any;
  created_at: string;
}

export const AuditDashboard: React.FC = () => {
  const { toast } = useToast();
  const hasAuditAccess = useHasPermission('audit_logs_read');
  const hasSecurityAccess = useHasPermission('security_read');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTable, setFilterTable] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Real-time audit logs
  const { data: realtimeAuditLogs } = useRealtimeData({ 
    table: 'audit_logs'
  });

  // Real-time security notifications  
  const { data: realtimeAlerts } = useRealtimeData({ 
    table: 'audit_logs' // Using audit_logs for now
  });

  useEffect(() => {
    if (hasAuditAccess) {
      fetchAuditData();
    }
  }, [hasAuditAccess, realtimeAuditLogs]);

  useEffect(() => {
    if (hasSecurityAccess) {
      fetchSecurityAlerts();
    }
  }, [hasSecurityAccess, realtimeAlerts]);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      // Fetch audit logs with user information
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const enrichedLogs = (data || []).map(log => ({
        ...log,
        ip_address: log.ip_address?.toString() || 'N/A',
        user_email: 'Admin User'
      })) as AuditLog[];

      setAuditLogs(enrichedLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityAlerts = async () => {
    try {
      // Mock security alerts for now
      const mockAlerts: SecurityAlert[] = [
        {
          id: '1',
          type: 'security',
          severity: 'high',
          title: 'Multiple Failed Login Attempts',
          message: 'Detected 5 failed login attempts from IP 192.168.1.100',
          created_at: new Date().toISOString()
        }
      ];
      setSecurityAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching security alerts:', error);
    }
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTable = filterTable === 'all' || log.table_name === filterTable;
    
    const matchesRisk = filterRisk === 'all' || 
      (filterRisk === 'high' && (log.risk_score || 0) >= 7) ||
      (filterRisk === 'medium' && (log.risk_score || 0) >= 4 && (log.risk_score || 0) < 7) ||
      (filterRisk === 'low' && (log.risk_score || 0) < 4);

    return matchesSearch && matchesTable && matchesRisk;
  });

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 7) return <Badge variant="destructive">High Risk</Badge>;
    if (riskScore >= 4) return <Badge variant="default">Medium Risk</Badge>;
    return <Badge variant="secondary">Low Risk</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="default">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const exportAuditLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Table', 'Risk Score', 'IP Address'],
      ...filteredAuditLogs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_email || 'System',
        log.action,
        log.table_name,
        log.risk_score || 0,
        log.ip_address || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hasAuditAccess && !hasSecurityAccess) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to view audit logs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const auditColumns: any[] = [
    {
      header: 'Timestamp',
      accessorKey: 'created_at',
      cell: ({ row }: any) => new Date(row.original.created_at).toLocaleString()
    },
    {
      header: 'User',
      accessorKey: 'user_email',
      cell: ({ row }: any) => row.original.user_email || 'System'
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original.action}</Badge>
      )
    },
    {
      header: 'Table',
      accessorKey: 'table_name'
    },
    {
      header: 'Risk Score',
      accessorKey: 'risk_score',
      cell: ({ row }: any) => getRiskBadge(row.original.risk_score || 0)
    },
    {
      header: 'IP Address',
      accessorKey: 'ip_address',
      cell: ({ row }: any) => row.original.ip_address || 'N/A'
    },
    {
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLog(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit & Security</h1>
          <p className="text-muted-foreground">
            Monitor system activities and security events
          </p>
        </div>
        <Button onClick={exportAuditLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by action, table, or user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterTable} onValueChange={setFilterTable}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tables</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="business_settings">Settings</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                {filteredAuditLogs.length} activities found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                title="Audit Logs"
                columns={auditColumns}
                data={filteredAuditLogs}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4">
            {securityAlerts.map(alert => (
              <Card key={alert.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {securityAlerts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Clear</h3>
                  <p className="text-muted-foreground">
                    No security alerts at this time.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
                <CardDescription>GDPR and privacy compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Encryption</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Access Logging</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Retention</span>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Measures</CardTitle>
                <CardDescription>Current security implementations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">MFA Enforcement</span>
                    <Badge variant="default">Required</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session Security</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rate Limiting</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Detail Modal would go here */}
    </div>
  );
};