import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { 
  Camera, 
  Upload, 
  FileText, 
  X, 
  Eye, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Pill,
  Clock
} from 'lucide-react';
import { ocrService, OCRResult } from '@/utils/ocrService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';

interface UploadedFile {
  file: File;
  preview: string;
  ocrResult?: OCRResult;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

interface EnhancedPrescriptionUploadProps {
  onUploadComplete?: () => void;
  className?: string;
}

export const EnhancedPrescriptionUpload: React.FC<EnhancedPrescriptionUploadProps> = ({ 
  onUploadComplete, 
  className = "" 
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form fields for prescription details
  const [prescriptionDetails, setPrescriptionDetails] = useState({
    patientName: '',
    doctorName: '',
    hospitalName: '',
    prescriptionDate: '',
    diagnosis: '',
    notes: ''
  });

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Please upload images or PDF files only",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each image file with OCR
    for (const uploadedFile of newFiles) {
      if (uploadedFile.file.type.startsWith('image/')) {
        await processFileWithOCR(uploadedFile);
      }
    }
  };

  const processFileWithOCR = async (uploadedFile: UploadedFile) => {
    try {
      setProcessing(true);
      setProcessingStep('Initializing OCR...');
      setProgress(10);
      
      await ocrService.initialize();
      
      setProcessingStep('Reading prescription...');
      setProgress(50);
      
      const ocrResult = await ocrService.processImage(uploadedFile.file);
      
      setProcessingStep('Extracting medicine information...');
      setProgress(80);
      
      // Update the file with OCR results
      setFiles(prev => prev.map(f => 
        f.file === uploadedFile.file 
          ? { ...f, ocrResult }
          : f
      ));

      // Auto-populate form fields if empty
      if (ocrResult.medicines.length > 0 && !prescriptionDetails.patientName) {
        const firstMedicine = ocrResult.medicines[0];
        setPrescriptionDetails(prev => ({
          ...prev,
          // We could enhance this to extract patient name from OCR text
        }));
      }

      setProgress(100);
      
      toast({
        title: "OCR Processing Complete",
        description: `Found ${ocrResult.medicines.length} medicines and ${ocrResult.dosages.length} dosage instructions`,
      });

    } catch (error) {
      console.error('OCR processing failed:', error);
      setFiles(prev => prev.map(f => 
        f.file === uploadedFile.file 
          ? { ...f, error: 'OCR processing failed' }
          : f
      ));
      
      toast({
        title: "OCR Processing Failed",
        description: "Unable to read prescription text, but you can still upload manually",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setProcessingStep('');
      setProgress(0);
    }
  };

  const uploadToSupabase = async (): Promise<void> => {
    if (!user || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const uploadedFile = files[i];
        
        // Update uploading state
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, uploading: true } : f
        ));

        // Upload file to Supabase Storage
        const fileName = `${user.id}/${Date.now()}_${uploadedFile.file.name}`;
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(fileName, uploadedFile.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(fileName);

        // Save prescription record to database
        const prescriptionData = {
          user_id: user.id,
          patient_name: prescriptionDetails.patientName || 'Patient',
          file_url: urlData.publicUrl,
          file_type: uploadedFile.file.type,
          prescription_date: prescriptionDetails.prescriptionDate || null,
          doctor_name: prescriptionDetails.doctorName || null,
          hospital_name: prescriptionDetails.hospitalName || null,
          diagnosis: prescriptionDetails.diagnosis || null,
          notes: prescriptionDetails.notes || null,
          ocr_text: uploadedFile.ocrResult?.text || null,
          ocr_confidence: uploadedFile.ocrResult?.confidence || null,
          medicines_extracted: JSON.stringify(uploadedFile.ocrResult?.medicines || []),
          dosage_extracted: JSON.stringify(uploadedFile.ocrResult?.dosages || []),
          processing_status: uploadedFile.ocrResult ? 'completed' : 'manual',
          processed_at: uploadedFile.ocrResult ? new Date().toISOString() : null,
          verification_status: 'pending'
        };

        const { error: dbError } = await supabase
          .from('prescriptions')
          .insert(prescriptionData);

        if (dbError) throw dbError;

        // Update uploaded state
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, uploading: false, uploaded: true } : f
        ));
      }

      toast({
        title: "Upload Successful",
        description: "Prescriptions uploaded and ready for verification",
      });

      // Reset form
      setFiles([]);
      setPrescriptionDetails({
        patientName: '',
        doctorName: '',
        hospitalName: '',
        prescriptionDate: '',
        diagnosis: '',
        notes: ''
      });

      onUploadComplete?.();

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Prescription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Drop your prescription here</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Or choose how you'd like to upload
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={openCamera} variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button onClick={openFileSelector} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Supports: Images (JPG, PNG) and PDF files up to 10MB
              </p>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            className="hidden"
          />

          {/* Processing Progress */}
          {processing && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">{processingStep}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((uploadedFile, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {/* File Preview */}
                  <div className="flex-shrink-0">
                    {uploadedFile.file.type.startsWith('image/') ? (
                      <img
                        src={uploadedFile.preview}
                        alt="Prescription preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{uploadedFile.file.name}</h4>
                      <div className="flex items-center gap-2">
                        {uploadedFile.uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {uploadedFile.uploaded && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {uploadedFile.error && <AlertCircle className="h-4 w-4 text-red-600" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* OCR Results */}
                    {uploadedFile.ocrResult && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            OCR Confidence: {Math.round(uploadedFile.ocrResult.confidence)}%
                          </Badge>
                        </div>
                        
                        {uploadedFile.ocrResult.medicines.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Pill className="h-3 w-3" />
                              <span className="text-xs font-medium">Medicines Found:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {uploadedFile.ocrResult.medicines.slice(0, 3).map((med, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {med.name}
                                </Badge>
                              ))}
                              {uploadedFile.ocrResult.medicines.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{uploadedFile.ocrResult.medicines.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {uploadedFile.ocrResult.dosages.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-medium">Dosages Found:</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {uploadedFile.ocrResult.dosages.length} dosage instruction(s) extracted
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {uploadedFile.error && (
                      <Alert className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {uploadedFile.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Prescription Details Form */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={prescriptionDetails.patientName}
                  onChange={(e) => setPrescriptionDetails(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <Label htmlFor="prescriptionDate">Prescription Date</Label>
                <Input
                  id="prescriptionDate"
                  type="date"
                  value={prescriptionDetails.prescriptionDate}
                  onChange={(e) => setPrescriptionDetails(prev => ({ ...prev, prescriptionDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={prescriptionDetails.doctorName}
                  onChange={(e) => setPrescriptionDetails(prev => ({ ...prev, doctorName: e.target.value }))}
                  placeholder="Dr. Name"
                />
              </div>
              
              <div>
                <Label htmlFor="hospitalName">Hospital/Clinic</Label>
                <Input
                  id="hospitalName"
                  value={prescriptionDetails.hospitalName}
                  onChange={(e) => setPrescriptionDetails(prev => ({ ...prev, hospitalName: e.target.value }))}
                  placeholder="Hospital or clinic name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={prescriptionDetails.diagnosis}
                onChange={(e) => setPrescriptionDetails(prev => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="Medical condition or diagnosis"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={prescriptionDetails.notes}
                onChange={(e) => setPrescriptionDetails(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information"
                rows={3}
              />
            </div>

            <Button 
              onClick={uploadToSupabase}
              disabled={!prescriptionDetails.patientName || files.some(f => f.uploading)}
              className="w-full"
            >
              {files.some(f => f.uploading) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Prescription{files.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};