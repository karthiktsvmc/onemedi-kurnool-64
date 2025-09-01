import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Upload, X, File, Eye, Trash2, Camera, MessageSquare, Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { usePrescriptions } from '@/shared/hooks/usePrescriptions';

interface PrescriptionFile {
  file: File;
  preview?: string;
  id: string;
}

interface PrescriptionUploadWidgetProps {
  orderId?: string;
  onUploadComplete?: (prescriptionIds: string[]) => void;
  className?: string;
  multiple?: boolean;
  required?: boolean;
}

export const PrescriptionUploadWidget: React.FC<PrescriptionUploadWidgetProps> = ({
  orderId,
  onUploadComplete,
  className,
  multiple = true,
  required = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<PrescriptionFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPrescription } = usePrescriptions();
  const { toast } = useToast();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFiles = async (files: FileList) => {
    const validFiles: PrescriptionFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      
      if (error) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        });
        continue;
      }

      const preview = await createFilePreview(file);
      validFiles.push({
        file,
        preview,
        id: `${Date.now()}-${i}`
      });
    }

    if (!multiple && validFiles.length > 0) {
      setSelectedFiles([validFiles[0]]);
    } else {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

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
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, []);

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedIds: string[] = [];

    try {
      for (const fileData of selectedFiles) {
        const uploadData = {
          file: fileData.file,
          patient_name: 'Self', // Default, can be customized
          order_id: orderId,
        };

        const prescriptionId = await uploadPrescription(uploadData);
        if (prescriptionId) {
          uploadedIds.push(prescriptionId);
        }
      }

      if (uploadedIds.length > 0) {
        setSelectedFiles([]);
        onUploadComplete?.(uploadedIds);
        toast({
          title: "Upload Successful",
          description: `${uploadedIds.length} prescription(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const openWhatsApp = () => {
    const message = "Hi, I would like to share my prescription for my medical order.";
    const phoneNumber = "+919876543210";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className={cn("border-dashed border-primary/30", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Prescription
          {required && <span className="text-destructive">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            Drag & drop your prescription here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports: JPG, PNG, PDF (Max 5MB each)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="outline" type="button">
              <File className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <Button variant="outline" type="button" onClick={openCamera}>
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            <Button variant="outline" type="button" onClick={openWhatsApp}>
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Files ({selectedFiles.length}):</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((fileData) => (
                <div key={fileData.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  {fileData.preview ? (
                    <img 
                      src={fileData.preview} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <File className="h-12 w-12 text-muted-foreground" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fileData.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    {fileData.preview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(fileData.preview, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileData.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <Button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="w-full"
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
          </Button>
        )}

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Upload Guidelines:</p>
          <ul className="space-y-1 ml-4">
            <li>• Clear, readable prescription images</li>
            <li>• Prescription date within 6 months</li>
            <li>• Doctor's name and signature visible</li>
            <li>• File size under 5MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};