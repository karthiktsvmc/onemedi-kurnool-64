import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImportJob {
  id: string;
  type: 'medicines' | 'vendors' | 'services' | 'prices';
  filename: string;
  total_records: number;
  processed_records: number;
  success_count: number;
  error_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errors: string[];
  created_at: string;
  completed_at?: string;
}

interface BulkImportExportProps {
  onDataUpdate?: () => void;
}

export const BulkImportExport: React.FC<BulkImportExportProps> = ({ 
  onDataUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'history'>('import');
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'medicines' | 'vendors' | 'services' | 'prices'>('medicines');
  const [exportProgress, setExportProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock import jobs data
  const mockJobs: ImportJob[] = [
    {
      id: '1',
      type: 'medicines',
      filename: 'medicines_bulk_upload.csv',
      total_records: 150,
      processed_records: 150,
      success_count: 145,
      error_count: 5,
      status: 'completed',
      errors: [
        'Row 23: Invalid expiry date format',
        'Row 45: Missing required field - brand',
        'Row 67: Duplicate medicine name',
        'Row 89: Invalid price value',
        'Row 102: Missing category'
      ],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'vendors',
      filename: 'vendor_details.xlsx',
      total_records: 25,
      processed_records: 20,
      success_count: 18,
      error_count: 2,
      status: 'processing',
      errors: [
        'Row 15: Invalid phone number format',
        'Row 22: Email already exists'
      ],
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    }
  ];

  React.useEffect(() => {
    setImportJobs(mockJobs);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Parse CSV for preview
      parseFileForPreview(file);
    }
  };

  const parseFileForPreview = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1, 6).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj: any, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    });
    setPreviewData(rows);
    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload and processing
      const newJob: ImportJob = {
        id: Math.random().toString(36).substr(2, 9),
        type: importType,
        filename: selectedFile.name,
        total_records: previewData.length * 10, // Simulate more records
        processed_records: 0,
        success_count: 0,
        error_count: 0,
        status: 'pending',
        errors: [],
        created_at: new Date().toISOString(),
      };

      setImportJobs(prev => [newJob, ...prev]);
      
      // Simulate processing
      setTimeout(() => {
        setImportJobs(prev => 
          prev.map(job => 
            job.id === newJob.id 
              ? { ...job, status: 'processing' as const }
              : job
          )
        );
      }, 1000);

      setTimeout(() => {
        setImportJobs(prev => 
          prev.map(job => 
            job.id === newJob.id 
              ? { 
                  ...job, 
                  status: 'completed' as const,
                  processed_records: job.total_records,
                  success_count: Math.floor(job.total_records * 0.95),
                  error_count: Math.floor(job.total_records * 0.05),
                  completed_at: new Date().toISOString(),
                  errors: ['Sample error message']
                }
              : job
          )
        );
        
        toast({
          title: "Import Completed",
          description: `Successfully imported ${newJob.filename}`,
        });
        
        onDataUpdate?.();
      }, 5000);

      setSelectedFile(null);
      setShowPreview(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async (exportType: string, format: 'csv' | 'xlsx') => {
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Export Completed",
            description: `${exportType} data exported successfully`,
          });
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadTemplate = (type: string) => {
    const templates = {
      medicines: 'name,brand,category,mrp,sale_price,stock_qty,expiry_date,description\nParacetamol,Crocin,Pain Relief,10,8,100,2025-12-31,Pain relief medicine',
      vendors: 'name,type,contact_person,phone,email,address,city,state,pincode\nCity Pharmacy,pharmacy,John Doe,9876543210,john@example.com,123 Main St,Kurnool,AP,518001',
      services: 'name,category,price,duration,description\nHealth Checkup,diagnostic,500,60,Complete health checkup',
      prices: 'item_id,item_type,mrp,sale_price,discount_percent\nmed_001,medicine,100,80,20'
    };

    const content = templates[type as keyof typeof templates];
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Import & Export</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="import">Import Data</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
              <TabsTrigger value="history">Import History</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Import Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Import Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="import-type">Data Type</Label>
                      <Select value={importType} onValueChange={(value) => setImportType(value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medicines">Medicines</SelectItem>
                          <SelectItem value="vendors">Vendors</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="prices">Prices</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="file-upload">Upload File</Label>
                      <Input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => downloadTemplate(importType)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                      <Button
                        onClick={handleImport}
                        disabled={!selectedFile || uploading}
                        className="flex-1"
                      >
                        {uploading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Import
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview */}
                {showPreview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-64 overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {previewData.length > 0 && 
                                Object.keys(previewData[0]).map(key => (
                                  <TableHead key={key}>{key}</TableHead>
                                ))
                              }
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewData.map((row, index) => (
                              <TableRow key={index}>
                                {Object.values(row).map((value: any, i) => (
                                  <TableCell key={i} className="text-sm">
                                    {value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing first 5 rows. Total rows: {previewData.length * 10}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: 'medicines', title: 'Medicines', desc: 'Export all medicine inventory data' },
                  { type: 'vendors', title: 'Vendors', desc: 'Export vendor information and contacts' },
                  { type: 'orders', title: 'Orders', desc: 'Export order history and details' },
                  { type: 'customers', title: 'Customers', desc: 'Export customer database' },
                  { type: 'analytics', title: 'Analytics', desc: 'Export sales and performance data' },
                  { type: 'inventory', title: 'Inventory', desc: 'Export stock levels and movements' }
                ].map((item) => (
                  <Card key={item.type}>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(item.type, 'csv')}
                          className="flex-1"
                        >
                          <FileSpreadsheet className="h-3 w-3 mr-1" />
                          CSV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(item.type, 'xlsx')}
                          className="flex-1"
                        >
                          <FileSpreadsheet className="h-3 w-3 mr-1" />
                          Excel
                        </Button>
                      </div>
                      {exportProgress > 0 && exportProgress < 100 && (
                        <div className="mt-2">
                          <Progress value={exportProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Exporting... {exportProgress}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Import History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Filename</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Success</TableHead>
                          <TableHead>Errors</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {job.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {job.filename}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Progress 
                                  value={(job.processed_records / job.total_records) * 100} 
                                  className="h-2 w-20" 
                                />
                                <p className="text-xs text-muted-foreground">
                                  {job.processed_records}/{job.total_records}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {job.success_count}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-red-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {job.error_count}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(job.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {job.errors.length > 0 && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Import Errors</DialogTitle>
                                        <DialogDescription>
                                          Errors from {job.filename}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="max-h-64 overflow-auto">
                                        <ul className="space-y-2">
                                          {job.errors.map((error, index) => (
                                            <li key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                              {error}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};