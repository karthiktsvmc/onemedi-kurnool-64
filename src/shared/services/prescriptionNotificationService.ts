// Real-time Notification Service for Prescriptions
// Handles real-time updates for prescription status changes, order updates, and system notifications

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/hooks/use-toast';

export interface PrescriptionNotification {
  id: string;
  user_id: string;
  type: 'prescription_status' | 'order_update' | 'pharmacist_message' | 'system_alert';
  title: string;
  message: string;
  data?: {
    prescription_id?: string;
    order_id?: string;
    status?: string;
    action_url?: string;
  };
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  expires_at?: string;
}

export interface NotificationSubscription {
  unsubscribe: () => void;
}

export interface NotificationPreferences {
  push_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  prescription_updates: boolean;
  order_updates: boolean;
  promotional_messages: boolean;
  system_alerts: boolean;
}

class PrescriptionNotificationService {
  private static subscriptions: Map<string, any> = new Map();
  private static isInitialized = false;

  /**
   * Initialize the notification service for a user
   */
  static async initialize(userId: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set up real-time subscriptions
      await this.subscribeToNotifications(userId);
      await this.subscribeToPrescriptionUpdates(userId);
      await this.subscribeToOrderUpdates(userId);
      
      this.isInitialized = true;
      console.log('Prescription notification service initialized for user:', userId);
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  /**
   * Subscribe to general notifications
   */
  static async subscribeToNotifications(userId: string): Promise<NotificationSubscription> {
    const subscription = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const notification = payload.new as PrescriptionNotification;
          await this.handleNewNotification(notification);
        }
      )
      .subscribe();

    this.subscriptions.set('notifications', subscription);

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        this.subscriptions.delete('notifications');
      }
    };
  }

  /**
   * Subscribe to prescription status changes
   */
  static async subscribeToPrescriptionUpdates(userId: string): Promise<NotificationSubscription> {
    const subscription = supabase
      .channel('prescription-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'prescriptions',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const oldRecord = payload.old;
          const newRecord = payload.new;
          
          // Check if status changed
          if (oldRecord.status !== newRecord.status) {
            await this.handlePrescriptionStatusChange(newRecord, oldRecord.status);
          }
        }
      )
      .subscribe();

    this.subscriptions.set('prescriptions', subscription);

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        this.subscriptions.delete('prescriptions');
      }
    };
  }

  /**
   * Subscribe to order status changes
   */
  static async subscribeToOrderUpdates(userId: string): Promise<NotificationSubscription> {
    const subscription = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const oldRecord = payload.old;
          const newRecord = payload.new;
          
          // Check if status changed
          if (oldRecord.status !== newRecord.status) {
            await this.handleOrderStatusChange(newRecord, oldRecord.status);
          }
        }
      )
      .subscribe();

    this.subscriptions.set('orders', subscription);

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        this.subscriptions.delete('orders');
      }
    };
  }

  /**
   * Handle new notification
   */
  private static async handleNewNotification(notification: PrescriptionNotification): Promise<void> {
    try {
      // Show toast notification based on priority
      const toastVariant = notification.priority === 'urgent' || notification.priority === 'high' 
        ? 'destructive' : 'default';

      toast({
        title: notification.title,
        description: notification.message,
        variant: toastVariant,
        duration: notification.priority === 'urgent' ? 10000 : 5000
      });

      // Play notification sound for high priority
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        this.playNotificationSound();
      }

      // Trigger custom event for UI updates
      window.dispatchEvent(new CustomEvent('prescription-notification', {
        detail: notification
      }));

    } catch (error) {
      console.error('Error handling new notification:', error);
    }
  }

  /**
   * Handle prescription status changes
   */
  private static async handlePrescriptionStatusChange(
    prescription: any, 
    oldStatus: string
  ): Promise<void> {
    try {
      const statusMessages = {
        'uploaded': {
          title: 'Prescription Uploaded',
          message: 'Your prescription has been successfully uploaded and is being reviewed.',
          priority: 'medium' as const
        },
        'processing': {
          title: 'Prescription Under Review',
          message: 'Our pharmacist is reviewing your prescription. You will be notified once verified.',
          priority: 'medium' as const
        },
        'validated': {
          title: 'Prescription Approved',
          message: 'Your prescription has been approved by our pharmacist. You can now add medicines to cart.',
          priority: 'high' as const
        },
        'rejected': {
          title: 'Prescription Rejected',
          message: 'Unfortunately, your prescription could not be verified. Please contact support for assistance.',
          priority: 'high' as const
        },
        'expired': {
          title: 'Prescription Expired',
          message: 'Your prescription has expired. Please upload a new prescription to continue.',
          priority: 'medium' as const
        }
      };

      const statusInfo = statusMessages[prescription.status as keyof typeof statusMessages];
      if (!statusInfo) return;

      // Create notification record
      await this.createNotification({
        user_id: prescription.user_id,
        type: 'prescription_status',
        title: statusInfo.title,
        message: statusInfo.message,
        priority: statusInfo.priority,
        data: {
          prescription_id: prescription.id,
          status: prescription.status,
          action_url: `/medicines/upload-prescription?prescription_id=${prescription.id}`
        }
      });

    } catch (error) {
      console.error('Error handling prescription status change:', error);
    }
  }

  /**
   * Handle order status changes
   */
  private static async handleOrderStatusChange(
    order: any, 
    oldStatus: string
  ): Promise<void> {
    try {
      const statusMessages = {
        'prescription_review': {
          title: 'Order Under Review',
          message: `Order #${order.order_number} - Prescription is being reviewed by our pharmacist.`,
          priority: 'medium' as const
        },
        'approved': {
          title: 'Order Approved',
          message: `Order #${order.order_number} - Your prescription order has been approved and is being prepared.`,
          priority: 'high' as const
        },
        'rejected': {
          title: 'Order Rejected',
          message: `Order #${order.order_number} - Your order was rejected. Please check prescription details.`,
          priority: 'high' as const
        },
        'packed': {
          title: 'Order Packed',
          message: `Order #${order.order_number} - Your medicines are packed and ready for dispatch.`,
          priority: 'high' as const
        },
        'dispatched': {
          title: 'Order Dispatched',
          message: `Order #${order.order_number} - Your order has been dispatched and is on the way.`,
          priority: 'high' as const
        },
        'delivered': {
          title: 'Order Delivered',
          message: `Order #${order.order_number} - Your order has been delivered successfully.`,
          priority: 'high' as const
        }
      };

      const statusInfo = statusMessages[order.status as keyof typeof statusMessages];
      if (!statusInfo) return;

      // Create notification record
      await this.createNotification({
        user_id: order.user_id,
        type: 'order_update',
        title: statusInfo.title,
        message: statusInfo.message,
        priority: statusInfo.priority,
        data: {
          order_id: order.id,
          status: order.status,
          action_url: `/orders/${order.id}`
        }
      });

    } catch (error) {
      console.error('Error handling order status change:', error);
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(
    notification: Omit<PrescriptionNotification, 'id' | 'read' | 'created_at'>
  ): Promise<{ success: boolean; notification?: PrescriptionNotification; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, notification: data };

    } catch (error) {
      console.error('Error creating notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create notification' 
      };
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(
    userId: string,
    options?: {
      limit?: number;
      unreadOnly?: boolean;
      types?: string[];
    }
  ): Promise<{ success: boolean; notifications?: PrescriptionNotification[]; error?: string }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.unreadOnly) {
        query = query.eq('read', false);
      }

      if (options?.types && options.types.length > 0) {
        query = query.in('type', options.types);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return { success: true, notifications: data };

    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications' 
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      return { success: true };

    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mark notification as read' 
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return { success: true };

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read' 
      };
    }
  }

  /**
   * Get notification preferences for user
   */
  static async getNotificationPreferences(
    userId: string
  ): Promise<{ success: boolean; preferences?: NotificationPreferences; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is okay
        throw error;
      }

      // Return default preferences if none found
      const defaultPreferences: NotificationPreferences = {
        push_notifications: true,
        email_notifications: true,
        sms_notifications: false,
        prescription_updates: true,
        order_updates: true,
        promotional_messages: false,
        system_alerts: true
      };

      return { 
        success: true, 
        preferences: data || defaultPreferences 
      };

    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch preferences' 
      };
    }
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      return { success: true };

    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update preferences' 
      };
    }
  }

  /**
   * Send push notification (placeholder for future implementation)
   */
  private static async sendPushNotification(
    userId: string,
    notification: PrescriptionNotification
  ): Promise<void> {
    // This would integrate with a push notification service like FCM
    console.log('Push notification would be sent:', { userId, notification });
  }

  /**
   * Send email notification (placeholder for future implementation)
   */
  private static async sendEmailNotification(
    userId: string,
    notification: PrescriptionNotification
  ): Promise<void> {
    // This would integrate with an email service like SendGrid or Resend
    console.log('Email notification would be sent:', { userId, notification });
  }

  /**
   * Send SMS notification (placeholder for future implementation)
   */
  private static async sendSMSNotification(
    userId: string,
    notification: PrescriptionNotification
  ): Promise<void> {
    // This would integrate with an SMS service like Twilio
    console.log('SMS notification would be sent:', { userId, notification });
  }

  /**
   * Play notification sound
   */
  private static playNotificationSound(): void {
    try {
      // Create audio element for notification sound
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
      });
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }

  /**
   * Clean up all subscriptions
   */
  static cleanup(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    this.isInitialized = false;
    console.log('Prescription notification service cleaned up');
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return count || 0;

    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

export default PrescriptionNotificationService;