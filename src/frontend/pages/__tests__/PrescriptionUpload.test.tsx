// Prescription Upload Component Integration Tests
// Tests for user interactions and component behavior

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PrescriptionUpload } from '@/frontend/pages/PrescriptionUpload';

// Mock dependencies
vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123', email: 'test@example.com' },
    isAuthenticated: true
  })
}));

vi.mock('@/shared/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/shared/services/prescriptionUploadService', () => ({
  default: {
    validateFile: vi.fn(() => ({ valid: true, errors: [] })),
    validateFilesBatch: vi.fn(() => ({ valid: true, errors: [] })),
    uploadFile: vi.fn(() => Promise.resolve({ 
      success: true, 
      url: 'https://example.com/test.jpg',
      path: 'test.jpg'
    })),
    createPrescription: vi.fn(() => Promise.resolve({
      success: true,
      prescription: { id: 'prescription-123' }
    })),
    processFileWithOCR: vi.fn(() => Promise.resolve({
      success: true,
      extractedText: 'Test prescription text',
      confidence: 0.95
    }))
  }
}));

// Wrapper component for React Router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('PrescriptionUpload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the prescription upload form', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      expect(screen.getByText('Upload Prescription')).toBeInTheDocument();
      expect(screen.getByText('Doctor Information')).toBeInTheDocument();
      expect(screen.getByText('Patient Information')).toBeInTheDocument();
      expect(screen.getByText('Prescription Details')).toBeInTheDocument();
    });

    it('should render file upload area', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      expect(screen.getByText(/Drag and drop prescription files/)).toBeInTheDocument();
      expect(screen.getByText(/Choose Files/)).toBeInTheDocument();
    });

    it('should show form validation errors', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      // Try to submit form without required fields
      const submitButton = screen.getByText('Upload Prescription');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Doctor name is required/)).toBeInTheDocument();
        expect(screen.getByText(/Patient name is required/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Interactions', () => {
    it('should fill out doctor information', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const doctorNameInput = screen.getByLabelText(/Doctor Name/);
      const clinicNameInput = screen.getByLabelText(/Clinic\\/Hospital Name/);

      fireEvent.change(doctorNameInput, { target: { value: 'Dr. John Smith' } });
      fireEvent.change(clinicNameInput, { target: { value: 'City Hospital' } });

      expect(doctorNameInput).toHaveValue('Dr. John Smith');
      expect(clinicNameInput).toHaveValue('City Hospital');
    });

    it('should fill out patient information', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const patientNameInput = screen.getByLabelText(/Patient Name/);
      const ageInput = screen.getByLabelText(/Age/);

      fireEvent.change(patientNameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(ageInput, { target: { value: '30' } });

      expect(patientNameInput).toHaveValue('Jane Doe');
      expect(ageInput).toHaveValue('30');
    });

    it('should handle date inputs', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const prescriptionDateInput = screen.getByLabelText(/Prescription Date/);
      const expiryDateInput = screen.getByLabelText(/Expiry Date/);

      fireEvent.change(prescriptionDateInput, { target: { value: '2024-01-15' } });
      fireEvent.change(expiryDateInput, { target: { value: '2024-02-15' } });

      expect(prescriptionDateInput).toHaveValue('2024-01-15');
      expect(expiryDateInput).toHaveValue('2024-02-15');
    });
  });

  describe('File Upload', () => {
    const createMockFile = (name: string, type: string, size: number = 1024) => {
      const file = new File(['test content'], name, { type });
      Object.defineProperty(file, 'size', { value: size });
      return file;
    };

    it('should handle file selection', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const fileInput = screen.getByLabelText(/Choose Files/);
      const testFile = createMockFile('prescription.jpg', 'image/jpeg');

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      await waitFor(() => {
        expect(screen.getByText('prescription.jpg')).toBeInTheDocument();
      });
    });

    it('should handle drag and drop', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const dropZone = screen.getByText(/Drag and drop prescription files/).closest('div');
      const testFile = createMockFile('prescription.pdf', 'application/pdf');

      if (dropZone) {
        fireEvent.dragEnter(dropZone);
        fireEvent.dragOver(dropZone);
        fireEvent.drop(dropZone, {
          dataTransfer: {
            files: [testFile]
          }
        });
      }

      await waitFor(() => {
        expect(screen.getByText('prescription.pdf')).toBeInTheDocument();
      });
    });

    it('should show file validation errors', async () => {
      const { default: PrescriptionUploadService } = await import('@/shared/services/prescriptionUploadService');
      
      // Mock validation to return error
      (PrescriptionUploadService.validateFile as any).mockReturnValue({
        valid: false,
        errors: ['File size too large']
      });

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const fileInput = screen.getByLabelText(/Choose Files/);
      const largeFile = createMockFile('large.jpg', 'image/jpeg', 15 * 1024 * 1024);

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/File size too large/)).toBeInTheDocument();
      });
    });

    it('should remove uploaded files', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const fileInput = screen.getByLabelText(/Choose Files/);
      const testFile = createMockFile('prescription.jpg', 'image/jpeg');

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      await waitFor(() => {
        expect(screen.getByText('prescription.jpg')).toBeInTheDocument();
      });

      // Find and click remove button
      const removeButton = screen.getByLabelText(/Remove file/);
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('prescription.jpg')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    const fillRequiredFields = () => {
      fireEvent.change(screen.getByLabelText(/Doctor Name/), { 
        target: { value: 'Dr. John Smith' } 
      });
      fireEvent.change(screen.getByLabelText(/Patient Name/), { 
        target: { value: 'Jane Doe' } 
      });
      fireEvent.change(screen.getByLabelText(/Prescription Date/), { 
        target: { value: '2024-01-15' } 
      });
      fireEvent.change(screen.getByLabelText(/Expiry Date/), { 
        target: { value: '2024-02-15' } 
      });
    };

    it('should submit form with valid data', async () => {
      const { default: PrescriptionUploadService } = await import('@/shared/services/prescriptionUploadService');

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      fillRequiredFields();

      // Add a file
      const fileInput = screen.getByLabelText(/Choose Files/);
      const testFile = createMockFile('prescription.jpg', 'image/jpeg');
      fireEvent.change(fileInput, { target: { files: [testFile] } });

      await waitFor(() => {
        expect(screen.getByText('prescription.jpg')).toBeInTheDocument();
      });

      // Submit form
      const submitButton = screen.getByText('Upload Prescription');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(PrescriptionUploadService.createPrescription).toHaveBeenCalledWith(
          'test-user-123',
          expect.objectContaining({
            doctorName: 'Dr. John Smith',
            patientName: 'Jane Doe'
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const { default: PrescriptionUploadService } = await import('@/shared/services/prescriptionUploadService');

      // Mock slow response
      (PrescriptionUploadService.createPrescription as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
      );

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      fillRequiredFields();

      const submitButton = screen.getByText('Upload Prescription');
      fireEvent.click(submitButton);

      expect(screen.getByText(/Uploading.../)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should handle submission errors', async () => {
      const { default: PrescriptionUploadService } = await import('@/shared/services/prescriptionUploadService');

      // Mock error response
      (PrescriptionUploadService.createPrescription as any).mockResolvedValue({
        success: false,
        error: 'Server error'
      });

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      fillRequiredFields();

      const submitButton = screen.getByText('Upload Prescription');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Server error/)).toBeInTheDocument();
      });
    });
  });

  describe('Camera Capture', () => {
    it('should show camera capture option', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      expect(screen.getByText(/Take Photo/)).toBeInTheDocument();
    });

    it('should handle camera capture errors', async () => {
      // Mock getUserMedia to fail
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: vi.fn().mockRejectedValue(new Error('Camera not available'))
        },
        writable: true
      });

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const cameraButton = screen.getByText(/Take Photo/);
      fireEvent.click(cameraButton);

      await waitFor(() => {
        expect(screen.getByText(/Camera not available/)).toBeInTheDocument();
      });
    });
  });

  describe('Alternative Upload Methods', () => {
    it('should show WhatsApp upload option', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      expect(screen.getByText(/WhatsApp/)).toBeInTheDocument();
    });

    it('should show email upload option', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      expect(screen.getByText(/Email/)).toBeInTheDocument();
    });

    it('should handle WhatsApp sharing', () => {
      // Mock window.open
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const whatsappButton = screen.getByText(/WhatsApp/);
      fireEvent.click(whatsappButton);

      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('whatsapp.com'),
        '_blank'
      );

      openSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Doctor Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Patient Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Choose Files/)).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const doctorNameInput = screen.getByLabelText(/Doctor Name/);
      doctorNameInput.focus();

      expect(document.activeElement).toBe(doctorNameInput);

      // Tab to next field
      fireEvent.keyDown(doctorNameInput, { key: 'Tab' });
      
      // Should move to next focusable element
      expect(document.activeElement).not.toBe(doctorNameInput);
    });

    it('should announce form errors to screen readers', async () => {
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const submitButton = screen.getByText('Upload Prescription');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Doctor name is required/);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      // Component should render without errors on mobile
      expect(screen.getByText('Upload Prescription')).toBeInTheDocument();
    });

    it('should stack form fields on small screens', () => {
      // Test responsive layout behavior
      render(
        <TestWrapper>
          <PrescriptionUpload />
        </TestWrapper>
      );

      const formContainer = screen.getByText('Doctor Information').closest('div');
      expect(formContainer).toHaveClass('space-y-4'); // Vertical spacing for mobile
    });
  });
});

export default describe;