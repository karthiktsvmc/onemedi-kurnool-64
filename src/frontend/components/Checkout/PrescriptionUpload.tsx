import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { PrescriptionRequirement } from '@/frontend/data/mockCheckoutData';
import { 
  Upload, 
  FileText, 
  Camera, 
  MessageSquare, 
  CheckCircle, 
  X,
  AlertCircle,
  Eye
} from 'lucide-react';

interface PrescriptionUploadProps {
  prescriptionReq: PrescriptionRequirement;
  onUpload: (files: File[]) => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  prescriptionReq,
  onUpload
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSample, setShowSample] = useState(false);

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
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
    onUpload([...uploadedFiles, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onUpload(newFiles);
  };

  if (!prescriptionReq.required) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Prescription Upload
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload prescription for: {prescriptionReq.items.join(', ')}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-3">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
            <div>
              <p className="text-sm font-medium">
                Drop prescription here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, PDF (Max 5MB each)
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Upload Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Take Photo
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp Upload
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Uploaded Files</p>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-border rounded-lg"
              >
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Sample Prescription Link */}
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Need help? View sample prescription
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSample(true)}
            className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          >
            View Sample
          </Button>
        </div>

        {/* Prescription Guidelines */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Prescription Guidelines:</p>
          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
            <li>• Must be from a registered doctor</li>
            <li>• Should include patient name and age</li>
            <li>• Prescription date should be within 6 months</li>
            <li>• Clear image with readable text</li>
          </ul>
        </div>

        {/* Upload Status */}
        {prescriptionReq.required && uploadedFiles.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700 dark:text-orange-300">
              Prescription upload is required to proceed with checkout
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};