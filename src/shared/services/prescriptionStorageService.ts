// Prescription Storage Service - Supabase Storage Integration
// Handles secure file uploads, validation, and management for prescription files

import { supabase } from '@/integrations/supabase/client';
import { 
  PrescriptionFileAttachment, 
  MAX_FILE_SIZE, 
  MAX_FILES_PER_PRESCRIPTION, 
  ACCEPTED_FILE_TYPES 
} from '@/shared/types/prescription';

export interface FileUploadResult {
  success: boolean;
  file_url?: string;
  file_path?: string;
  error?: string;
  file_id?: string;
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PrescriptionUploadProgress {
  file_id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export class PrescriptionStorageService {
  private static readonly STORAGE_BUCKET = 'prescription-uploads';
  private static readonly STORAGE_BASE_PATH = 'prescriptions';

  /**
   * Validates file before upload
   */
  static validateFile(file: File): FileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported. Please upload JPG, PNG, HEIC, or PDF files.`);
    }

    // Check file name
    if (file.name.length > 255) {
      errors.push('File name is too long. Please rename the file to under 255 characters.');
    }

    // Additional validations
    if (file.size < 1024) {
      warnings.push('File is very small and may not contain enough information.');
    }

    // Check for special characters in filename
    if (!/^[a-zA-Z0-9._\-\s]+$/.test(file.name)) {
      warnings.push('File name contains special characters that may cause issues.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates multiple files for a prescription upload
   */
  static validateFilesBatch(files: File[]): FileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (files.length === 0) {
      errors.push('No files selected for upload.');
      return { valid: false, errors, warnings };
    }

    if (files.length > MAX_FILES_PER_PRESCRIPTION) {
      errors.push(`Maximum ${MAX_FILES_PER_PRESCRIPTION} files allowed per prescription.`);
    }

    // Validate each file
    files.forEach((file, index) => {
      const validation = this.validateFile(file);
      validation.errors.forEach(error => {
        errors.push(`File ${index + 1} (${file.name}): ${error}`);
      });
      validation.warnings.forEach(warning => {
        warnings.push(`File ${index + 1} (${file.name}): ${warning}`);
      });
    });

    // Check for duplicate file names
    const fileNames = files.map(f => f.name);
    const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate file names found: ${duplicates.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generates a secure file path for storing prescription files
   */
  private static generateFilePath(userId: string, prescriptionId: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileExtension = sanitizedFileName.split('.').pop();
    const baseName = sanitizedFileName.replace(`.${fileExtension}`, '');
    
    return `${this.STORAGE_BASE_PATH}/${userId}/${prescriptionId}/${timestamp}_${baseName}.${fileExtension}`;
  }

  /**
   * Uploads a single prescription file to Supabase Storage
   */
  static async uploadFile(
    file: File, 
    userId: string, 
    prescriptionId: string,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResult> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Generate secure file path
      const filePath = this.generateFilePath(userId, prescriptionId, file.name);

      // Create FormData for upload with progress tracking
      const fileWithProgress = new File([file], file.name, { type: file.type });
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, fileWithProgress, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error('Storage upload error:', error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        };
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Create file attachment record in database
      const fileAttachment: Omit<PrescriptionFileAttachment, 'id' | 'uploaded_at' | 'processed_at'> = {
        prescription_id: prescriptionId,
        file_name: data.path.split('/').pop() || file.name,
        original_file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
        mime_type: file.type,
        processing_status: 'pending',
        ocr_text: null,
        ocr_confidence: null,
        storage_bucket: this.STORAGE_BUCKET,
        storage_path: filePath,
        access_level: 'private',
        encryption_key: null
      };

      const { data: dbData, error: dbError } = await supabase
        .from('prescription_file_attachments')
        .insert(fileAttachment)
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Try to cleanup uploaded file
        await this.deleteFile(filePath);
        return {
          success: false,
          error: `Database error: ${dbError.message}`
        };
      }

      return {
        success: true,
        file_url: urlData.publicUrl,
        file_path: filePath,
        file_id: dbData.id
      };

    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Uploads multiple prescription files with progress tracking
   */
  static async uploadFiles(
    files: File[],
    userId: string,
    prescriptionId: string,
    onProgress?: (fileId: string, progress: PrescriptionUploadProgress) => void
  ): Promise<FileUploadResult[]> {
    // Validate all files first
    const validation = this.validateFilesBatch(files);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const results: FileUploadResult[] = [];
    
    // Upload files sequentially to avoid overwhelming the server
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file_${i}_${Date.now()}`;
      
      try {
        // Notify upload start
        onProgress?.(fileId, {
          file_id: fileId,
          progress: 0,
          status: 'uploading'
        });

        const result = await this.uploadFile(
          file, 
          userId, 
          prescriptionId,
          (progress) => {
            onProgress?.(fileId, {
              file_id: fileId,
              progress,
              status: 'uploading'
            });
          }
        );

        if (result.success) {
          onProgress?.(fileId, {
            file_id: fileId,
            progress: 100,
            status: 'completed'
          });
        } else {
          onProgress?.(fileId, {
            file_id: fileId,
            progress: 0,
            status: 'error',
            error: result.error
          });
        }

        results.push(result);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onProgress?.(fileId, {
          file_id: fileId,
          progress: 0,
          status: 'error',
          error: errorMessage
        });

        results.push({
          success: false,
          error: errorMessage
        });
      }
    }

    return results;
  }

  /**
   * Deletes a file from Supabase Storage
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('File deletion error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  /**
   * Deletes prescription file and database record
   */
  static async deletePrescriptionFile(fileId: string): Promise<boolean> {
    try {
      // Get file info from database
      const { data: fileInfo, error: fetchError } = await supabase
        .from('prescription_file_attachments')
        .select('storage_path')
        .eq('id', fileId)
        .single();

      if (fetchError || !fileInfo) {
        console.error('Error fetching file info:', fetchError);
        return false;
      }

      // Delete from storage
      const storageDeleted = await this.deleteFile(fileInfo.storage_path);
      
      if (!storageDeleted) {
        console.warn('Storage file deletion failed, but continuing with database cleanup');
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('prescription_file_attachments')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  /**
   * Gets file download URL with temporary access
   */
  static async getFileDownloadUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
  }

  /**
   * Updates file processing status
   */
  static async updateFileProcessingStatus(
    fileId: string,
    status: string,
    ocrText?: string,
    ocrConfidence?: number
  ): Promise<boolean> {
    try {
      const updateData: any = {
        processing_status: status,
        processed_at: new Date().toISOString()
      };

      if (ocrText !== undefined) {
        updateData.ocr_text = ocrText;
      }

      if (ocrConfidence !== undefined) {
        updateData.ocr_confidence = ocrConfidence;
      }

      const { error } = await supabase
        .from('prescription_file_attachments')
        .update(updateData)
        .eq('id', fileId);

      if (error) {
        console.error('Error updating file status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating file status:', error);
      return false;
    }
  }

  /**
   * Gets all files for a prescription
   */
  static async getPrescriptionFiles(prescriptionId: string): Promise<PrescriptionFileAttachment[]> {
    try {
      const { data, error } = await supabase
        .from('prescription_file_attachments')
        .select('*')
        .eq('prescription_id', prescriptionId)
        .order('uploaded_at', { ascending: true });

      if (error) {
        console.error('Error fetching prescription files:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching prescription files:', error);
      return [];
    }
  }

  /**
   * Cleanup orphaned files (files without prescription records)
   */
  static async cleanupOrphanedFiles(): Promise<number> {
    try {
      // This would typically be run as a scheduled job
      const { data, error } = await supabase
        .from('prescription_file_attachments')
        .select('id, storage_path')
        .is('prescription_id', null);

      if (error) {
        console.error('Error finding orphaned files:', error);
        return 0;
      }

      let deletedCount = 0;
      for (const file of data || []) {
        const deleted = await this.deletePrescriptionFile(file.id);
        if (deleted) deletedCount++;
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
      return 0;
    }
  }

  /**
   * Get storage usage statistics for a user
   */
  static async getUserStorageStats(userId: string): Promise<{
    total_files: number;
    total_size: number;
    storage_used_mb: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('prescription_file_attachments')
        .select('file_size')
        .in('prescription_id', 
          supabase
            .from('prescriptions')
            .select('id')
            .eq('user_id', userId)
        );

      if (error) {
        console.error('Error fetching storage stats:', error);
        return { total_files: 0, total_size: 0, storage_used_mb: 0 };
      }

      const totalSize = (data || []).reduce((sum, file) => sum + file.file_size, 0);
      
      return {
        total_files: data?.length || 0,
        total_size: totalSize,
        storage_used_mb: totalSize / (1024 * 1024)
      };
    } catch (error) {
      console.error('Error fetching storage stats:', error);
      return { total_files: 0, total_size: 0, storage_used_mb: 0 };
    }
  }
}

export default PrescriptionStorageService;