import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Activity, Users, Database, FileText, TrendingUp } from 'lucide-react';

export const ComplianceDashboard = () => {
  const complianceMetrics = [
    {
      title: 'Data Protection',
      score: 95,
      status: 'excellent',
      icon: Shield,
      description: 'GDPR/NDHM compliant data handling'
    },
    {
      title: 'Access Control',
      score: 88,
      status: 'good',
      icon: Users,
      description: 'Role-based access controls implemented'
    },
    {
      title: 'Audit Logging',
      score: 100,
      status: 'excellent',
      icon: FileText,
      description: 'Complete audit trail for sensitive operations'
    },
    {
      title: 'Security Monitoring',
      score: 82,
      status: 'good',
      icon: Activity,
      description: 'Real-time security event monitoring'
    }
  ];

  const healthcareCompliance = [
    {
      standard: 'NDHM (National Digital Health Mission)',
      status: 'compliant',
      items: [
        'Patient data privacy protection',
        'Secure health record storage',
        'Digital consent management',
        'Healthcare provider verification'
      ]
    },
    {
      standard: 'IT Rules 2021 (India)',
      status: 'compliant',
      items: [
        'Data localization compliance',
        'User consent mechanisms',
        'Grievance redressal system',
        'Content moderation policies'
      ]
    },
    {
      standard: 'Medical Device Rules',
      status: 'partial',
      items: [
        'Software as Medical Device (SaMD) classification',
        'Clinical evaluation documentation',
        'Post-market surveillance',
        'Adverse event reporting'
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case 'non-compliant':
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor healthcare compliance, security standards, and regulatory requirements
        </p>
      </div>

      {/* Compliance Score Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {complianceMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className={`border-2 ${getScoreColor(metric.score)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8" />
                  <span className="text-2xl font-bold">{metric.score}%</span>
                </div>
                <CardTitle className="text-base">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-80">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="healthcare" className="space-y-6">
        <TabsList>
          <TabsTrigger value="healthcare">Healthcare Compliance</TabsTrigger>
          <TabsTrigger value="data">Data Protection</TabsTrigger>
          <TabsTrigger value="security">Security Standards</TabsTrigger>
          <TabsTrigger value="audit">Audit & Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="healthcare">
          <div className="grid gap-6">
            {healthcareCompliance.map((standard) => (
              <Card key={standard.standard}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{standard.standard}</CardTitle>
                    {getStatusBadge(standard.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {standard.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Protection Measures</CardTitle>
              <CardDescription>
                Comprehensive data protection and privacy compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Implemented Measures
                  </h4>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• End-to-end encryption for sensitive data</li>
                    <li>• Row Level Security (RLS) policies</li>
                    <li>• Role-based access control</li>
                    <li>• Data minimization practices</li>
                    <li>• Audit logging for all data access</li>
                    <li>• Regular security assessments</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Recommended Improvements
                  </h4>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Implement data retention policies</li>
                    <li>• Add automated PII detection</li>
                    <li>• Enhanced consent management</li>
                    <li>• Data portability features</li>
                    <li>• Privacy impact assessments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Standards Compliance</CardTitle>
              <CardDescription>
                Security frameworks and standards implementation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-semibold">ISO 27001</h4>
                    <p className="text-sm text-muted-foreground">Information Security</p>
                    <Badge className="mt-2">85% Complete</Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-semibold">SOC 2</h4>
                    <p className="text-sm text-muted-foreground">Service Organization Control</p>
                    <Badge variant="secondary" className="mt-2">Planning</Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h4 className="font-semibold">OWASP</h4>
                    <p className="text-sm text-muted-foreground">Web Security</p>
                    <Badge className="mt-2">92% Complete</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit & Reporting</CardTitle>
              <CardDescription>
                Comprehensive audit trails and compliance reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Audit Log Coverage</h4>
                    <p className="text-sm text-muted-foreground">Sensitive operations tracked</p>
                  </div>
                  <Badge>100%</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Real-time Monitoring</h4>
                    <p className="text-sm text-muted-foreground">Security events detection</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Compliance Reports</h4>
                    <p className="text-sm text-muted-foreground">Automated compliance reporting</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};