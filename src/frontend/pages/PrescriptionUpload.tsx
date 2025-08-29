import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Upload, 
  Camera, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Phone, 
  Mail,
  X,
  Info,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'validated' | 'error';
  progress: number;
  extractedMedicines?: string[];
  errors?: string[];
}

interface PrescriptionData {
  id: string;
  status: 'uploaded' | 'processing' | 'review_required' | 'validated' | 'rejected';
  uploadedAt: Date;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    available: boolean;
    price?: number;
    alternatives?: string[];
  }>;
  doctor: {
    name: string;
    registration: string;
  };
  patient: {
    name: string;
    age: number;
  };
  prescriptionDate: Date;
  expiryDate: Date;
}

export const PrescriptionUpload: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [showSamplePrescription, setShowSamplePrescription] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format. Please upload JPG, PNG, or PDF files.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit. Please compress the file and try again.`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress and processing
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (file.progress < 100) {
            return { ...file, progress: Math.min(file.progress + 10, 100) };
          } else if (file.status === 'uploading') {
            return { ...file, status: 'uploaded' };
          } else if (file.status === 'uploaded') {
            // Start processing after upload
            setTimeout(() => {
              setUploadedFiles(prev => prev.map(f => 
                f.id === fileId ? { 
                  ...f, 
                  status: 'processing',
                  extractedMedicines: ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Vitamin D3']
                } : f
              ));
              
              // Simulate processing completion
              setTimeout(() => {
                setUploadedFiles(prev => prev.map(f => 
                  f.id === fileId ? { ...f, status: 'validated' } : f
                ));
                
                toast({
                  title: "Prescription processed successfully",
                  description: "Your prescription has been validated and medicines extracted.",
                });
              }, 3000);
            }, 1000);
            
            return file;
          }
        }
        return file;
      }));
      
      if (uploadedFiles.find(f => f.id === fileId)?.progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleWhatsAppUpload = () => {
    const message = "Hi, I would like to share my prescription for medicine order. Please guide me through the process.";
    const phoneNumber = "+919876543210"; // Replace with actual WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmailUpload = () => {
    const email = "prescriptions@onemedi.in";
    const subject = "Prescription Upload Request";
    const body = "Please find my prescription attached. Patient Name: [Your Name], Contact: [Your Number]";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };

  const handleCameraCapture = () => {
    // For mobile devices, this would trigger camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      handleFiles(files);
    };
    input.click();
  };

  const proceedToMedicineSelection = () => {
    const validatedFiles = uploadedFiles.filter(f => f.status === 'validated');
    if (validatedFiles.length === 0) {
      toast({
        title: "No validated prescriptions",
        description: "Please wait for prescription validation to complete before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to medicine selection with prescription data
    navigate('/medicines/prescription-medicines', { 
      state: { 
        prescriptionFiles: validatedFiles,
        extractedMedicines: validatedFiles.flatMap(f => f.extractedMedicines || [])
      }
    });
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'bg-blue-500';
      case 'uploaded': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'validated': return 'bg-green-600';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'uploaded': return 'Uploaded';
      case 'processing': return 'Processing...';
      case 'validated': return 'Validated';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        {/* Breadcrumb */}
        <NavigationBreadcrumb 
          items={[
            { label: 'Medicines', href: '/medicines' },
            { label: 'Upload Prescription' }
          ]} 
        />

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Upload Your Prescription
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your doctor's prescription to order medicines online. We support multiple upload methods for your convenience.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center border-green-200 bg-green-50">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">100% Secure</p>
              <p className="text-xs text-green-600">HIPAA Compliant Storage</p>
            </Card>
            <Card className="p-4 text-center border-blue-200 bg-blue-50">
              <Zap className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">Fast Processing</p>
              <p className="text-xs text-blue-600">AI-Powered Analysis</p>
            </Card>
            <Card className="p-4 text-center border-purple-200 bg-purple-50">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">Expert Review</p>
              <p className="text-xs text-purple-600">Licensed Pharmacists</p>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
              <TabsTrigger value="status">Status & History</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* Main Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Upload Area */}
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      dragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Drag & drop your prescription here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports: JPG, PNG, PDF (Max 5MB per file, up to 10 files)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileInput}
                      className="hidden"
                      id="prescription-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="prescription-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                      </label>
                    </Button>
                  </div>

                  {/* Alternative Upload Methods */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      onClick={handleCameraCapture}
                      className="h-16 flex flex-col gap-1"
                    >
                      <Camera className="h-5 w-5" />
                      <span className="text-sm">Take Photo</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleWhatsAppUpload}
                      className="h-16 flex flex-col gap-1 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">WhatsApp</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleEmailUpload}
                      className="h-16 flex flex-col gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-sm">Email</span>
                    </Button>
                  </div>

                  {/* Sample Prescription Link */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            Need help? View sample prescription format
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSamplePrescription(true)}
                          className="text-blue-600 hover:bg-blue-100"
                        >
                          View Sample
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Uploaded Prescriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 border border-border rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium text-foreground">{file.file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Badge className={getStatusColor(file.status)}>
                                {getStatusText(file.status)}
                              </Badge>
                            </div>

                            {/* Progress Bar */}
                            {file.status === 'uploading' && (
                              <Progress value={file.progress} className="mb-2" />
                            )}

                            {/* Extracted Medicines */}
                            {file.extractedMedicines && file.extractedMedicines.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-foreground mb-2">
                                  Extracted Medicines:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {file.extractedMedicines.map((medicine, index) => (
                                    <Badge key={index} variant="secondary">
                                      {medicine}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Proceed Button */}
                    {uploadedFiles.some(f => f.status === 'validated') && (
                      <div className="pt-4 border-t border-border">
                        <Button 
                          onClick={proceedToMedicineSelection}
                          className="w-full"
                          size="lg"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Proceed to Medicine Selection
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Prescription Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Required Information:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Doctor's name and registration number</li>
                        <li>• Patient name and age</li>
                        <li>• Prescription date (within 6 months)</li>
                        <li>• Clear medicine names and dosages</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">File Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• High-quality image or clear PDF</li>
                        <li>• Maximum 5MB per file</li>
                        <li>• Supports JPG, PNG, PDF formats</li>
                        <li>• Readable text without blur</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status" className="space-y-6">
              {/* Status Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Prescription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPrescriptions ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
                      <p className="text-muted-foreground">Loading your prescriptions...</p>
                    </div>
                  ) : prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No prescriptions uploaded yet</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('upload')}
                      >
                        Upload Your First Prescription
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <Card key={prescription.id} className="border border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-medium text-foreground">
                                    {prescription.prescription_number || `Prescription ${prescription.id.slice(0, 8)}`}
                                  </h3>
                                  <Badge className={getStatusColor(prescription.status)}>
                                    {PRESCRIPTION_STATUS_LABELS[prescription.status]}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                  <div>
                                    <span className="font-medium">Doctor:</span> {prescription.doctor_name}
                                  </div>
                                  <div>
                                    <span className="font-medium">Patient:</span> {prescription.patient_name}
                                  </div>
                                  <div>
                                    <span className="font-medium">Date:</span> {formatDate(prescription.prescription_date)}
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <span className="font-medium">Medicines:</span> {prescription.medicine_count} items
                                </div>
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/prescription/${prescription.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {prescriptions.length >= 50 && (
                        <div className="text-center">
                          <Button variant="outline" onClick={loadUserPrescriptions}>
                            Load More
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};