import React, { useState, useRef } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Save,
  Trash2,
  Copy,
  Settings,
  Clock,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'update' | 'delete';
  entity: 'medicines' | 'lab_tests' | 'scans' | 'doctors' | 'users';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  errorCount: number;
  fileName?: string;
  startedAt?: Date;
  completedAt?: Date;
  user: string;
}

interface ValidationError {
  row: number;
  field: string;
  value: string;
  error: string;
  severity: 'error' | 'warning';
}

interface ImportTemplate {
  entity: string;
  name: string;
  description: string;
  fields: Array<{
    name: string;
    required: boolean;
    type: string;
    validation?: string;
    example?: string;
  }>;
}

export const EnhancedBulkOperations: React.FC = () => {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string>('medicines');
  const [operationType, setOperationType] = useState<string>('import');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const importTemplates: ImportTemplate[] = [
    {
      entity: 'medicines',
      name: 'Medicines Import Template',
      description: 'Import medicines with pricing, stock, and metadata',
      fields: [
        { name: 'name', required: true, type: 'text', example: 'Paracetamol 500mg' },
        { name: 'sku', required: true, type: 'text', example: 'MED001' },
        { name: 'manufacturer', required: true, type: 'text', example: 'PharmaCorp' },
        { name: 'price', required: true, type: 'number', validation: 'min:0', example: '25.50' },
        { name: 'mrp', required: true, type: 'number', validation: 'min:0', example: '30.00' },
        { name: 'stock_quantity', required: true, type: 'number', validation: 'min:0', example: '100' },
        { name: 'category_id', required: true, type: 'uuid', example: 'cat-123-456' },
        { name: 'prescription_required', required: false, type: 'boolean', example: 'true' },
        { name: 'description', required: false, type: 'text', example: 'Pain relief medication' },
        { name: 'side_effects', required: false, type: 'text', example: 'Nausea, dizziness' },
        { name: 'expiry_date', required: false, type: 'date', validation: 'future', example: '2025-12-31' }
      ]
    },
    {
      entity: 'lab_tests',
      name: 'Lab Tests Import Template',
      description: 'Import lab tests with pricing and requirements',
      fields: [
        { name: 'name', required: true, type: 'text', example: 'Complete Blood Count' },
        { name: 'code', required: true, type: 'text', example: 'CBC001' },
        { name: 'description', required: false, type: 'text', example: 'Basic blood analysis' },
        { name: 'mrp', required: true, type: 'number', validation: 'min:0', example: '450.00' },
        { name: 'fasting_required', required: false, type: 'boolean', example: 'false' },
        { name: 'home_collection_available', required: false, type: 'boolean', example: 'true' },
        { name: 'report_time', required: false, type: 'text', example: '24 hours' },
        { name: 'category_id', required: true, type: 'uuid', example: 'labcat-123' }
      ]
    }
  ];

  const mockOperations: BulkOperation[] = [
    {
      id: '1',
      type: 'import',
      entity: 'medicines',
      status: 'completed',
      progress: 100,
      totalRecords: 150,
      processedRecords: 150,
      errorCount: 5,
      fileName: 'medicines_batch_001.csv',
      startedAt: new Date('2024-01-15T10:00:00'),
      completedAt: new Date('2024-01-15T10:15:00'),
      user: 'admin@onemedi.com'
    },
    {
      id: '2',
      type: 'update',
      entity: 'lab_tests',
      status: 'processing',
      progress: 65,
      totalRecords: 80,
      processedRecords: 52,
      errorCount: 2,
      fileName: 'lab_tests_update.xlsx',
      startedAt: new Date('2024-01-15T11:00:00'),
      user: 'manager@onemedi.com'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      validateFile(file);
    }
  };

  const validateFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // Simulate file validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation errors
      const mockErrors: ValidationError[] = [
        {
          row: 3,
          field: 'price',
          value: '-5.00',
          error: 'Price cannot be negative',
          severity: 'error'
        },
        {
          row: 7,
          field: 'expiry_date',
          value: '2023-01-01',
          error: 'Expiry date is in the past',
          severity: 'warning'
        }
      ];

      // Mock preview data
      const mockPreview = [
        { name: 'Paracetamol 500mg', sku: 'MED001', price: 25.50, stock: 100 },
        { name: 'Ibuprofen 400mg', sku: 'MED002', price: 18.75, stock: 75 },
        { name: 'Amoxicillin 250mg', sku: 'MED003', price: -5.00, stock: 50 }
      ];

      setValidationErrors(mockErrors);
      setPreviewData(mockPreview);
      
      toast({
        title: "File Validated",
        description: `Found ${mockErrors.length} issues that need attention.`,
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Unable to validate the file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTemplate = (entity: string) => {
    const template = importTemplates.find(t => t.entity === entity);
    if (!template) return;

    const csvHeaders = template.fields.map(field => field.name).join(',');
    const csvExample = template.fields.map(field => field.example || '').join(',');
    const csvContent = `${csvHeaders}\n${csvExample}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entity}_import_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const startBulkOperation = async () => {
    if (!selectedFile) return;

    const newOperation: BulkOperation = {
      id: Date.now().toString(),
      type: operationType as any,
      entity: selectedEntity as any,
      status: 'processing',
      progress: 0,
      totalRecords: previewData.length,
      processedRecords: 0,
      errorCount: validationErrors.filter(e => e.severity === 'error').length,
      fileName: selectedFile.name,
      startedAt: new Date(),
      user: 'current@user.com'
    };

    setOperations([newOperation, ...operations]);
    
    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOperations(prev => prev.map(op => 
        op.id === newOperation.id 
          ? { ...op, progress: i, processedRecords: Math.floor((i / 100) * newOperation.totalRecords) }
          : op
      ));
    }

    setOperations(prev => prev.map(op => 
      op.id === newOperation.id 
        ? { ...op, status: 'completed', completedAt: new Date() }
        : op
    ));

    toast({
      title: "Operation Completed",
      description: `Successfully processed ${newOperation.totalRecords} records.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'paused': return <PauseCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Operations</h2>
          <p className="text-muted-foreground">Import, export, and manage large datasets efficiently</p>
        </div>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="operations">Operation History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Import Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Import Configuration</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="entity">Data Type</Label>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicines">Medicines</SelectItem>
                      <SelectItem value="lab_tests">Lab Tests</SelectItem>
                      <SelectItem value="scans">Scans</SelectItem>
                      <SelectItem value="doctors">Doctors</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="operation">Operation Type</Label>
                  <Select value={operationType} onValueChange={setOperationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="import">Create New Records</SelectItem>
                      <SelectItem value="update">Update Existing</SelectItem>
                      <SelectItem value="upsert">Create or Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>File Upload</Label>
                  <div className="mt-2 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    
                    {selectedFile && (
                      <div className="p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                          <Badge variant="outline">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => generateTemplate(selectedEntity)}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>

                {selectedFile && validationErrors.length === 0 && (
                  <Button onClick={startBulkOperation} className="w-full">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Import
                  </Button>
                )}
              </div>
            </Card>

            {/* Validation Results */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Validating file...</span>
                  </div>
                  <Progress value={75} />
                </div>
              ) : selectedFile ? (
                <div className="space-y-4">
                  {validationErrors.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {validationErrors.length} issues found
                        </span>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {validationErrors.map((error, index) => (
                          <Alert key={index} className="py-2">
                            <AlertDescription className="text-sm">
                              <strong>Row {error.row}:</strong> {error.error}
                              <br />
                              <span className="text-xs text-muted-foreground">
                                Field: {error.field}, Value: {error.value}
                              </span>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">File validation passed</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Upload a file to see validation results</p>
                </div>
              )}
            </Card>

            {/* Data Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
              {previewData.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Showing first {Math.min(previewData.length, 5)} records
                  </div>
                  <div className="max-h-60 overflow-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(previewData[0]).map(key => (
                            <th key={key} className="text-left p-2 font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 5).map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value: any, colIndex) => (
                              <td key={colIndex} className="p-2 truncate max-w-20">
                                {value?.toString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Data preview will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Operations</h3>
            {mockOperations.map((operation) => (
              <Card key={operation.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(operation.status)}
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">
                        {operation.type} {operation.entity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {operation.fileName} • {operation.user}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm">
                      {operation.processedRecords}/{operation.totalRecords} records
                    </p>
                    {operation.errorCount > 0 && (
                      <p className="text-sm text-red-600">
                        {operation.errorCount} errors
                      </p>
                    )}
                  </div>
                </div>

                {operation.status === 'processing' && (
                  <div className="mt-4">
                    <Progress value={operation.progress} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {operation.progress}% complete
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {importTemplates.map((template) => (
              <Card key={template.entity} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{template.name}</h3>
                  <Button
                    onClick={() => generateTemplate(template.entity)}
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Required Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.filter(f => f.required).map((field) => (
                      <Badge key={field.name} variant="outline" className="text-xs">
                        {field.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Scheduled operations feature coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};