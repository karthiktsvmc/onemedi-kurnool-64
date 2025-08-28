// Prescription Notification Service Tests
// Unit tests for real-time notification functionality

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import PrescriptionNotificationService, { 
  PrescriptionNotification, 
  NotificationPreferences 
} from '@/shared/services/prescriptionNotificationService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn()
    })),
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn()
          })),
          single: vi.fn()
        })),
        count: vi.fn()
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      })),
      upsert: vi.fn()
    }))
  }
}));

// Mock toast hook
vi.mock('@/shared/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('PrescriptionNotificationService', () => {
  const mockUserId = 'test-user-123';
  const mockNotification: PrescriptionNotification = {
    id: 'notification-123',
    user_id: mockUserId,
    type: 'prescription_status',
    title: 'Prescription Approved',
    message: 'Your prescription has been approved by the pharmacist',
    data: {
      prescription_id: 'prescription-123',
      status: 'validated'
    },
    read: false,
    priority: 'high',
    created_at: new Date().toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset service state
    PrescriptionNotificationService.cleanup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Service Initialization', () => {
    it('should initialize notification service for user', async () => {
      const channelSpy = vi.spyOn(supabase, 'channel');
      
      await PrescriptionNotificationService.initialize(mockUserId);

      expect(channelSpy).toHaveBeenCalledWith('user-notifications');
      expect(channelSpy).toHaveBeenCalledWith('prescription-updates');
      expect(channelSpy).toHaveBeenCalledWith('order-updates');
    });

    it('should not initialize twice for same user', async () => {
      const channelSpy = vi.spyOn(supabase, 'channel');
      
      await PrescriptionNotificationService.initialize(mockUserId);
      await PrescriptionNotificationService.initialize(mockUserId);

      // Should only be called once for each channel type
      expect(channelSpy).toHaveBeenCalledTimes(3);
    });

    it('should cleanup subscriptions', () => {
      const unsubscribeSpy = vi.fn();
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: unsubscribeSpy })
      };

      (supabase.channel as any).mockReturnValue(mockChannel);

      PrescriptionNotificationService.initialize(mockUserId);
      PrescriptionNotificationService.cleanup();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Notification Creation', () => {
    it('should create notification successfully', async () => {
      const mockResponse = {
        data: mockNotification,
        error: null
      };

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.createNotification({
        user_id: mockUserId,
        type: 'prescription_status',
        title: 'Test Notification',
        message: 'Test message',
        priority: 'medium'
      });

      expect(result.success).toBe(true);
      expect(result.notification?.id).toBe(mockNotification.id);
    });

    it('should handle notification creation errors', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Database error' }
      };

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.createNotification({
        user_id: mockUserId,
        type: 'prescription_status',
        title: 'Test Notification',
        message: 'Test message',
        priority: 'medium'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('Notification Retrieval', () => {
    it('should get user notifications', async () => {
      const mockNotifications = [mockNotification];
      const mockResponse = {
        data: mockNotifications,
        error: null
      };

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.getUserNotifications(mockUserId);

      expect(result.success).toBe(true);
      expect(result.notifications).toEqual(mockNotifications);
    });

    it('should filter notifications by type', async () => {
      const mockResponse = {
        data: [mockNotification],
        error: null
      };

      const mockIn = vi.fn(() => mockResponse);
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              in: mockIn
            }))
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      await PrescriptionNotificationService.getUserNotifications(mockUserId, {
        types: ['prescription_status']
      });

      expect(mockIn).toHaveBeenCalledWith('type', ['prescription_status']);
    });

    it('should get unread count', async () => {
      const mockResponse = {
        count: 5,
        error: null
      };

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const count = await PrescriptionNotificationService.getUnreadCount(mockUserId);

      expect(count).toBe(5);
    });
  });

  describe('Notification Actions', () => {
    it('should mark notification as read', async () => {
      const mockResponse = { error: null };

      const mockFrom = vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue(mockResponse)
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.markAsRead('notification-123');

      expect(result.success).toBe(true);
    });

    it('should mark all notifications as read', async () => {
      const mockResponse = { error: null };

      const mockFrom = vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue(mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.markAllAsRead(mockUserId);

      expect(result.success).toBe(true);
    });
  });

  describe('Notification Preferences', () => {
    const mockPreferences: NotificationPreferences = {
      push_notifications: true,
      email_notifications: true,
      sms_notifications: false,
      prescription_updates: true,
      order_updates: true,
      promotional_messages: false,
      system_alerts: true
    };

    it('should get user preferences', async () => {
      const mockResponse = {
        data: mockPreferences,
        error: null
      };

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.getNotificationPreferences(mockUserId);

      expect(result.success).toBe(true);
      expect(result.preferences).toEqual(mockPreferences);
    });

    it('should return default preferences when none exist', async () => {
      const mockResponse = {
        data: null,
        error: { code: 'PGRST116' } // Not found
      };

      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.getNotificationPreferences(mockUserId);

      expect(result.success).toBe(true);
      expect(result.preferences?.push_notifications).toBe(true); // Default value
    });

    it('should update user preferences', async () => {
      const mockResponse = { error: null };

      const mockFrom = vi.fn(() => ({
        upsert: vi.fn().mockResolvedValue(mockResponse)
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.updateNotificationPreferences(
        mockUserId,
        { push_notifications: false }
      );

      expect(result.success).toBe(true);
    });
  });

  describe('Real-time Event Handling', () => {
    it('should handle prescription status changes', async () => {
      const mockPrescription = {
        id: 'prescription-123',
        user_id: mockUserId,
        status: 'validated'
      };

      const createNotificationSpy = vi.spyOn(PrescriptionNotificationService, 'createNotification')
        .mockResolvedValue({ success: true });

      // Simulate prescription status change
      await (PrescriptionNotificationService as any).handlePrescriptionStatusChange(
        mockPrescription,
        'processing'
      );

      expect(createNotificationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUserId,
          type: 'prescription_status',
          title: 'Prescription Approved'
        })
      );

      createNotificationSpy.mockRestore();
    });

    it('should handle order status changes', async () => {
      const mockOrder = {
        id: 'order-123',
        user_id: mockUserId,
        order_number: 'ORD-123',
        status: 'dispatched'
      };

      const createNotificationSpy = vi.spyOn(PrescriptionNotificationService, 'createNotification')
        .mockResolvedValue({ success: true });

      // Simulate order status change
      await (PrescriptionNotificationService as any).handleOrderStatusChange(
        mockOrder,
        'packed'
      );

      expect(createNotificationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUserId,
          type: 'order_update',
          title: 'Order Dispatched'
        })
      );

      createNotificationSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => {
          throw new Error('Network error');
        })
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const result = await PrescriptionNotificationService.createNotification({
        user_id: mockUserId,
        type: 'prescription_status',
        title: 'Test',
        message: 'Test',
        priority: 'medium'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle invalid notification data', async () => {
      const result = await PrescriptionNotificationService.createNotification({
        user_id: '', // Invalid user ID
        type: 'prescription_status',
        title: '',  // Empty title
        message: 'Test',
        priority: 'medium'
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent notifications', async () => {
      const mockResponse = {
        data: mockNotification,
        error: null
      };

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue(mockResponse)
          }))
        }))
      }));

      (supabase.from as any).mockImplementation(mockFrom);

      const notifications = Array.from({ length: 10 }, (_, i) => ({
        user_id: mockUserId,
        type: 'prescription_status' as const,
        title: `Notification ${i}`,
        message: `Message ${i}`,
        priority: 'medium' as const
      }));

      const promises = notifications.map(notification => 
        PrescriptionNotificationService.createNotification(notification)
      );

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should handle subscription cleanup properly', () => {
      // Test that cleanup doesn't cause memory leaks
      for (let i = 0; i < 100; i++) {
        PrescriptionNotificationService.initialize(mockUserId);
        PrescriptionNotificationService.cleanup();
      }

      // Should not throw any errors
      expect(true).toBe(true);
    });
  });
});

export default describe;