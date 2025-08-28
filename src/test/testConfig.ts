// Test Configuration and Utilities
// Setup file for prescription upload feature tests

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

// Global test utilities
export const mockFile = (name: string, type: string, size: number = 1024) => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

export const mockPrescriptionData = {
  doctorName: 'Dr. Test Smith',
  doctorRegistration: 'REG123456',
  doctorPhone: '+91-9876543210',
  clinicName: 'Test Clinic',
  clinicAddress: '123 Test Street, Test City',
  patientName: 'Test Patient',
  patientAge: 30,
  patientGender: 'male',
  patientPhone: '+91-9876543210',
  prescriptionDate: '2024-01-15',
  expiryDate: '2024-02-15',
  diagnosis: 'Test diagnosis',
  symptoms: 'Test symptoms'
};

export const mockNotification = {
  id: 'notification-123',
  user_id: 'test-user-123',
  type: 'prescription_status' as const,
  title: 'Test Notification',
  message: 'Test notification message',
  data: {
    prescription_id: 'prescription-123',
    status: 'validated'
  },
  read: false,
  priority: 'medium' as const,
  created_at: new Date().toISOString()
};

export const mockOrder = {
  id: 'order-123',
  order_number: 'ORD-123',
  user_id: 'test-user-123',
  prescription_id: 'prescription-123',
  status: 'placed' as const,
  total_amount: 250.00,
  prescription_discount: 12.50,
  delivery_charges: 0,
  payment_status: 'pending' as const,
  payment_method: 'online',
  delivery_type: 'home' as const,
  estimated_delivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Mock implementations
export const mockSupabaseClient = {
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({
        data: { path: 'prescriptions/test.jpg' },
        error: null
      }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' }
      })
    }))
  },
  from: vi.fn(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: mockPrescriptionData,
          error: null
        })
      }))
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({
            data: [mockNotification],
            error: null
          })
        })),
        single: vi.fn().mockResolvedValue({
          data: mockPrescriptionData,
          error: null
        })
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({
        error: null
      })
    })),
    upsert: vi.fn().mockResolvedValue({
      error: null
    })
  })),
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn()
  }))
};

export const mockAuthUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User'
  }
};

// Global mocks
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}));

vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockAuthUser,
    isAuthenticated: true,
    loading: false
  })
}));

vi.mock('@/shared/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ orderId: 'order-123' }),
    useLocation: () => ({ pathname: '/test' })
  };
});

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '2 hours ago'),
  format: vi.fn(() => '15 Jan 2024'),
  isValid: vi.fn(() => true),
  parseISO: vi.fn((date) => new Date(date))
}));

// Mock window methods
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn()
  }
});

Object.defineProperty(window, 'File', {
  value: class MockFile {
    constructor(chunks: any[], filename: string, options: any = {}) {
      this.name = filename;
      this.type = options.type || '';
      this.size = options.size || 1024;
      this.lastModified = Date.now();
    }
    name: string;
    type: string;
    size: number;
    lastModified: number;
  }
});

Object.defineProperty(window, 'FileReader', {
  value: class MockFileReader {
    constructor() {
      this.onload = null;
      this.onerror = null;
      this.result = null;
    }
    onload: any;
    onerror: any;
    result: any;
    
    readAsDataURL() {
      setTimeout(() => {
        this.result = 'data:image/jpeg;base64,mock-base64-data';
        if (this.onload) this.onload({ target: this });
      }, 0);
    }
    
    readAsText() {
      setTimeout(() => {
        this.result = 'mock file content';
        if (this.onload) this.onload({ target: this });
      }, 0);
    }
  }
});

// Mock navigator.mediaDevices for camera tests
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }]
    })
  },
  writable: true
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Helper function to create test wrapper
export const createTestWrapper = (children: React.ReactNode) => {
  const { BrowserRouter } = require('react-router-dom');
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Test data generators
export const generateMockPrescription = (overrides = {}) => ({
  id: 'prescription-123',
  user_id: 'test-user-123',
  prescription_number: 'RX-123456',
  ...mockPrescriptionData,
  status: 'uploaded' as const,
  priority_level: 1,
  file_urls: ['https://example.com/prescription.jpg'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const generateMockMedicine = (overrides = {}) => ({
  id: 'medicine-123',
  name: 'Paracetamol',
  brand: 'Crocin',
  generic_name: 'Acetaminophen',
  strength: '500mg',
  form: 'Tablet',
  dosage: '500mg',
  frequency: 'Twice daily',
  duration: '7 days',
  quantity_prescribed: 14,
  price: 25.00,
  mrp: 30.00,
  available: true,
  in_stock: true,
  stock_quantity: 100,
  ...overrides
});

export const generateMockCartItem = (overrides = {}) => ({
  id: 'cart-item-123',
  type: 'product' as const,
  category: 'Prescription Medicines',
  image: 'https://example.com/medicine.jpg',
  name: 'Paracetamol 500mg',
  brand: 'Crocin',
  description: 'Pain relief medication',
  price: 25.00,
  originalPrice: 30.00,
  quantity: 2,
  deliveryType: 'home' as const,
  prescriptionRequired: true,
  requires_prescription: true,
  inStock: true,
  stockLevel: 'high' as const,
  prescription_id: 'prescription-123',
  badges: ['Prescription Item', 'Rx Required'],
  ...overrides
});

// Test assertion helpers
export const expectFormValidation = async (
  screen: any,
  errorMessage: string,
  timeout = 3000
) => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  }, { timeout });
};

export const expectLoadingState = (screen: any, loadingText = 'Loading...') => {
  expect(screen.getByText(loadingText)).toBeInTheDocument();
};

export const expectSuccessState = async (
  screen: any,
  successMessage: string,
  timeout = 3000
) => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  }, { timeout });
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const simulateNetworkDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Cleanup utilities
export const cleanup = () => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  vi.useRealTimers();
};

// Test setup function
export const setupTest = () => {
  vi.clearAllMocks();
  
  // Reset all mock implementations to defaults
  mockSupabaseClient.from.mockImplementation(() => ({
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: mockPrescriptionData,
          error: null
        })
      }))
    })),
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({
            data: [mockNotification],
            error: null
          })
        })),
        single: vi.fn().mockResolvedValue({
          data: mockPrescriptionData,
          error: null
        })
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({
        error: null
      })
    })),
    upsert: vi.fn().mockResolvedValue({
      error: null
    })
  }));
};

// Test teardown function
export const teardownTest = () => {
  cleanup();
  vi.restoreAllMocks();
};

export default {
  mockFile,
  mockPrescriptionData,
  mockNotification,
  mockOrder,
  mockSupabaseClient,
  mockAuthUser,
  createTestWrapper,
  generateMockPrescription,
  generateMockMedicine,
  generateMockCartItem,
  expectFormValidation,
  expectLoadingState,
  expectSuccessState,
  measureRenderTime,
  simulateNetworkDelay,
  cleanup,
  setupTest,
  teardownTest
};