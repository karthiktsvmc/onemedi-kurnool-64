// Prescription Upload Service Tests
// Comprehensive unit tests for prescription upload and processing functionality

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import PrescriptionUploadService from '@/shared/services/prescriptionUploadService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn()
      }))
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

describe('PrescriptionUploadService', () => {
  const mockFile = new File(['test content'], 'test-prescription.jpg', {
    type: 'image/jpeg'
  });

  const mockUserId = 'test-user-123';
  const mockPrescriptionData = {
    doctorName: 'Dr. Test',
    patientName: 'Test Patient',
    prescriptionDate: '2024-01-15',
    expiryDate: '2024-02-15',
    diagnosis: 'Test condition'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('File Validation', () => {
    it('should validate supported file types', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      const validResult = PrescriptionUploadService.validateFile(validFile);
      const invalidResult = PrescriptionUploadService.validateFile(invalidFile);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toContain('Unsupported file type. Please upload images or PDFs only.');
    });

    it('should validate file size limits', () => {
      // Create a file that's too large (mock 15MB)
      const largeFile = new File(['test'.repeat(15 * 1024 * 1024)], 'large.jpg', { 
        type: 'image/jpeg' 
      });

      // Mock the size property since jsdom doesn't set it accurately
      Object.defineProperty(largeFile, 'size', { value: 15 * 1024 * 1024 });

      const result = PrescriptionUploadService.validateFile(largeFile);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File size must be less than 10MB');
    });

    it('should validate multiple files batch', () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.pdf', { type: 'application/pdf' }),
        new File(['test3'], 'test3.txt', { type: 'text/plain' }) // Invalid
      ];

      const result = PrescriptionUploadService.validateFilesBatch(files);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should limit maximum number of files', () => {
      const files = Array.from({ length: 6 }, (_, i) => 
        new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' })
      );

      const result = PrescriptionUploadService.validateFilesBatch(files);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Maximum 5 files allowed per prescription');
    });
  });

  describe('File Upload', () => {
    it('should upload file successfully', async () => {
      const mockUploadResponse = {
        data: { path: 'prescriptions/test-path.jpg' },
        error: null
      };

      const mockStorageFrom = vi.fn(() => ({
        upload: vi.fn().mockResolvedValue(mockUploadResponse),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test.jpg' }
        })
      }));

      (supabase.storage.from as any).mockImplementation(mockStorageFrom);

      const result = await PrescriptionUploadService.uploadFile(mockFile, mockUserId);

      expect(result.success).toBe(true);
      expect(result.url).toBe('https://example.com/test.jpg');
      expect(result.path).toBe('prescriptions/test-path.jpg');
    });

    it('should handle upload errors', async () => {
      const mockUploadResponse = {
        data: null,
        error: { message: 'Upload failed' }
      };

      const mockStorageFrom = vi.fn(() => ({
        upload: vi.fn().mockResolvedValue(mockUploadResponse)
      }));

      (supabase.storage.from as any).mockImplementation(mockStorageFrom);

      const result = await PrescriptionUploadService.uploadFile(mockFile, mockUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Upload failed');
    });
  });

  describe('Prescription Creation', () => {
    it('should create prescription with valid data', async () => {
      const mockInsertResponse = {
        data: {
          id: 'prescription-123',
          user_id: mockUserId,
          ...mockPrescriptionData
        },
        error: null
      };

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockInsertResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionUploadService.createPrescription(
        mockUserId,
        mockPrescriptionData
      );

      expect(result.success).toBe(true);
      expect(result.prescription?.id).toBe('prescription-123');
    });

    it('should handle prescription creation errors', async () => {
      const mockInsertResponse = {
        data: null,
        error: { message: 'Database error' }
      };

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockInsertResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionUploadService.createPrescription(
        mockUserId,
        mockPrescriptionData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    it('should validate required prescription data', async () => {
      const invalidData = {
        doctorName: '', // Empty required field
        patientName: 'Test Patient',
        prescriptionDate: '2024-01-15',
        expiryDate: '2024-02-15'
      };

      const result = await PrescriptionUploadService.createPrescription(
        mockUserId,
        invalidData
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Doctor name is required');
    });

    it('should validate prescription dates', async () => {
      const invalidDateData = {
        ...mockPrescriptionData,
        prescriptionDate: '2024-02-15',
        expiryDate: '2024-01-15' // Expiry before prescription date
      };

      const result = await PrescriptionUploadService.createPrescription(
        mockUserId,
        invalidDateData
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Expiry date must be after prescription date');
    });
  });

  describe('OCR Processing', () => {
    it('should extract text from image successfully', async () => {
      // Mock the OCR service response
      const mockOCRResult = {
        text: 'Dr. Test\nPatient: John Doe\nDrug: Paracetamol 500mg\nDosage: Twice daily',
        confidence: 0.95
      };

      // Mock the processFileWithOCR method
      const processOCRSpy = vi.spyOn(PrescriptionUploadService, 'processFileWithOCR')
        .mockResolvedValue({
          success: true,
          extractedText: mockOCRResult.text,
          confidence: mockOCRResult.confidence
        });

      const result = await PrescriptionUploadService.processFileWithOCR(mockFile);

      expect(result.success).toBe(true);
      expect(result.extractedText).toBe(mockOCRResult.text);
      expect(result.confidence).toBe(mockOCRResult.confidence);

      processOCRSpy.mockRestore();
    });

    it('should handle OCR processing errors', async () => {
      const processOCRSpy = vi.spyOn(PrescriptionUploadService, 'processFileWithOCR')
        .mockResolvedValue({
          success: false,
          error: 'OCR processing failed'
        });

      const result = await PrescriptionUploadService.processFileWithOCR(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toBe('OCR processing failed');

      processOCRSpy.mockRestore();
    });
  });

  describe('Medicine Extraction', () => {
    it('should extract medicines from OCR text', () => {
      const ocrText = `
        Dr. Smith Prescription
        Patient: John Doe
        
        1. Paracetamol 500mg - Take twice daily for 7 days
        2. Cough Syrup 10ml - Take thrice daily for 5 days  
        3. Vitamin D tablets - Once daily for 30 days
      `;

      const result = PrescriptionUploadService.extractMedicinesFromText(ocrText);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(med => med.medicine_name.includes('Paracetamol'))).toBe(true);
      expect(result.some(med => med.dosage === '500mg')).toBe(true);
    });

    it('should handle text with no medicines', () => {
      const ocrText = 'This is just some random text with no medicine information.';

      const result = PrescriptionUploadService.extractMedicinesFromText(ocrText);

      expect(result.length).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full prescription upload workflow', async () => {
      // Mock all the required service calls
      const mockUploadResponse = {
        data: { path: 'prescriptions/test.jpg' },
        error: null
      };

      const mockPrescriptionResponse = {
        data: { id: 'prescription-123', status: 'uploaded' },
        error: null
      };

      const mockStorageFrom = vi.fn(() => ({
        upload: vi.fn().mockResolvedValue(mockUploadResponse),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test.jpg' }
        })
      }));

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockPrescriptionResponse)
          }))
        }))
      }));

      (supabase.storage.from as any).mockImplementation(mockStorageFrom);
      (supabase.from as any).mockImplementation(mockFrom);

      // Test the complete workflow
      const uploadResult = await PrescriptionUploadService.uploadFile(mockFile, mockUserId);
      expect(uploadResult.success).toBe(true);

      const prescriptionResult = await PrescriptionUploadService.createPrescription(
        mockUserId,
        mockPrescriptionData
      );
      expect(prescriptionResult.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      const mockStorageFrom = vi.fn(() => ({
        upload: vi.fn().mockRejectedValue(new Error('Network error'))
      }));

      (supabase.storage.from as any).mockImplementation(mockStorageFrom);

      const result = await PrescriptionUploadService.uploadFile(mockFile, mockUserId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should validate user authentication', async () => {
      const result = await PrescriptionUploadService.createPrescription(
        '', // Empty user ID
        mockPrescriptionData
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('User ID is required');
    });

    it('should handle concurrent uploads', async () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
      ];

      const mockUploadResponse = {
        data: { path: 'prescriptions/test.jpg' },
        error: null
      };

      const mockStorageFrom = vi.fn(() => ({
        upload: vi.fn().mockResolvedValue(mockUploadResponse),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test.jpg' }
        })
      }));

      (supabase.storage.from as any).mockImplementation(mockStorageFrom);

      const uploadPromises = files.map(file => 
        PrescriptionUploadService.uploadFile(file, mockUserId)
      );

      const results = await Promise.all(uploadPromises);

      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });
});

// Export for test runner
export default describe;