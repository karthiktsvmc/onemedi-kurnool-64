import { useState } from 'react';
import { Upload, FileText, Eye, Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockHealthRecords } from '@/frontend/data/mockProfileData';

export const HealthRecords = () => {
  const [records] = useState(mockHealthRecords);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Prescription': return 'bg-green-100 text-green-800';
      case 'Lab Report': return 'bg-blue-100 text-blue-800';
      case 'Scan Report': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Health Records</h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload
            </Button>
          </div>
          
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{record.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={getTypeColor(record.type)}>
                          {record.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {record.doctorName && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Dr. {record.doctorName}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};