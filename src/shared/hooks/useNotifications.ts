// Real-time Notification Hook
// React hook for managing prescription and order notifications with real-time updates

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import PrescriptionNotificationService, { 
  PrescriptionNotification, 
  NotificationPreferences 
} from '@/shared/services/prescriptionNotificationService';

export interface UseNotificationsReturn {
  notifications: PrescriptionNotification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  clearError: () => void;
}

export const useNotifications = (options?: {
  limit?: number;
  unreadOnly?: boolean;
  types?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}): UseNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PrescriptionNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    limit = 50,
    unreadOnly = false,
    types = [],
    autoRefresh = true,
    refreshInterval = 30000 // 30 seconds
  } = options || {};

  // Load notifications from server
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await PrescriptionNotificationService.getUserNotifications(user.id, {
        limit,
        unreadOnly,
        types: types.length > 0 ? types : undefined
      });

      if (result.success && result.notifications) {
        setNotifications(result.notifications);
        setError(null);
      } else {
        setError(result.error || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications');
    }
  }, [user?.id, limit, unreadOnly, types]);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const count = await PrescriptionNotificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [user?.id]);

  // Load notification preferences
  const loadPreferences = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await PrescriptionNotificationService.getNotificationPreferences(user.id);
      if (result.success && result.preferences) {
        setPreferences(result.preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, [user?.id]);

  // Refresh all notification data
  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadNotifications(),
        loadUnreadCount(),
        loadPreferences()
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [loadNotifications, loadUnreadCount, loadPreferences]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const result = await PrescriptionNotificationService.markAsRead(notificationId);
      if (result.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setError(result.error || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await PrescriptionNotificationService.markAllAsRead(user.id);
      if (result.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      } else {
        setError(result.error || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError('Failed to mark all notifications as read');
    }
  }, [user?.id]);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user?.id) return;

    try {
      const result = await PrescriptionNotificationService.updateNotificationPreferences(
        user.id, 
        newPreferences
      );
      
      if (result.success) {
        // Update local state
        setPreferences(prev => prev ? { ...prev, ...newPreferences } : null);
      } else {
        setError(result.error || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
    }
  }, [user?.id]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle real-time notification events
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<PrescriptionNotification>) => {
      const notification = event.detail;
      
      // Add to notifications if it matches our filters
      const matchesType = types.length === 0 || types.includes(notification.type);
      const matchesUnreadFilter = !unreadOnly || !notification.read;
      
      if (matchesType && matchesUnreadFilter) {
        setNotifications(prev => {
          // Check if notification already exists
          const exists = prev.some(n => n.id === notification.id);
          if (exists) return prev;
          
          // Add new notification at the beginning
          const newNotifications = [notification, ...prev];
          
          // Respect limit
          return newNotifications.slice(0, limit);
        });
        
        // Update unread count if notification is unread
        if (!notification.read) {
          setUnreadCount(prev => prev + 1);
        }
      }
    };

    // Listen for new notifications
    window.addEventListener('prescription-notification', handleNewNotification as EventListener);

    return () => {
      window.removeEventListener('prescription-notification', handleNewNotification as EventListener);
    };
  }, [types, unreadOnly, limit]);

  // Initialize notification service and load data
  useEffect(() => {
    if (user?.id) {
      PrescriptionNotificationService.initialize(user.id);
      refreshNotifications();
    }

    return () => {
      if (user?.id) {
        PrescriptionNotificationService.cleanup();
      }
    };
  }, [user?.id, refreshNotifications]);

  // Auto-refresh notifications
  useEffect(() => {
    if (!autoRefresh || !user?.id) return;

    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, user?.id, loadNotifications, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    updatePreferences,
    clearError
  };
};

export default useNotifications;