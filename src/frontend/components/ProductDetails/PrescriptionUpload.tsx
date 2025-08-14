import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Upload, MessageSquare, FileText, Info, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PrescriptionUploadProps {
  onUpload: (files: File[]) => void;
  required?: boolean;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  onUpload,
  required = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

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
      setUploadedFiles(prev => [...prev, ...files]);
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      onUpload(files);
    }
  }, [onUpload]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openWhatsApp = () => {
    const message = "Hi, I would like to share my prescription for medicine order.";
    const phoneNumber = "+919876543210"; // Replace with actual WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Prescription
          {required && <span className="text-red-500">*</span>}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showTooltip && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-black text-white text-xs rounded shadow-lg z-10 w-64">
                We need your prescription to verify the medicine and dosage as per legal requirements for safe dispensing.
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            Drag & drop your prescription here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports: JPG, PNG, PDF (Max 5MB)
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

        {/* WhatsApp Upload */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Or</p>
          <Button
            variant="outline"
            onClick={openWhatsApp}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send via WhatsApp
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Uploaded Files:</p>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                <span className="text-sm text-foreground">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};