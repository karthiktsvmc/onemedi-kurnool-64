import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from './use-toast';

interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
}

interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export const useNotifications = () => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    permission: 'default',
    supported: false,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window;
    setNotificationState({
      permission: supported ? Notification.permission : 'denied',
      supported,
    });
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!notificationState.supported) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationState(prev => ({ ...prev, permission }));
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications for order updates.",
        });
        return true;
      } else if (permission === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings to receive order updates.",
          variant: "destructive",
        });
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendNotification = (notification: PushNotification) => {
    if (notificationState.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/favicon.ico',
        tag: notification.tag,
        data: notification.data,
        requireInteraction: true,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
        
        // Handle notification click based on data
        if (notification.data?.orderId) {
          window.location.href = `/order-tracking/${notification.data.orderId}`;
        }
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notif.close();
      }, 10000);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const sendOrderNotification = (orderData: {
    orderId: string;
    orderNumber: string;
    status: string;
    message?: string;
  }) => {
    const statusIcons = {
      confirmed: '✅',
      processing: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
    };

    const statusMessages = {
      confirmed: "Your order has been confirmed!",
      processing: "Your order is being processed.",
      shipped: "Your order is out for delivery!",
      delivered: "Your order has been delivered!",
      cancelled: "Your order has been cancelled.",
    };

    sendNotification({
      title: `Order ${orderData.orderNumber}`,
      body: orderData.message || statusMessages[orderData.status as keyof typeof statusMessages] || 
            `Order status updated to ${orderData.status}`,
      icon: '/favicon.ico',
      tag: `order-${orderData.orderId}`,
      data: {
        orderId: orderData.orderId,
        orderNumber: orderData.orderNumber,
        status: orderData.status,
      },
    });
  };

  const sendInventoryNotification = (inventoryData: {
    medicineName: string;
    currentStock: number;
    threshold: number;
  }) => {
    sendNotification({
      title: "Low Stock Alert",
      body: `${inventoryData.medicineName} is running low (${inventoryData.currentStock} left)`,
      icon: '/favicon.ico',
      tag: `inventory-alert`,
      data: {
        type: 'inventory',
        medicineName: inventoryData.medicineName,
        currentStock: inventoryData.currentStock,
      },
    });
  };

  const sendAppointmentNotification = (appointmentData: {
    doctorName: string;
    appointmentTime: string;
    type: 'reminder' | 'confirmed' | 'cancelled';
  }) => {
    const messages = {
      reminder: `Appointment with Dr. ${appointmentData.doctorName} in 30 minutes`,
      confirmed: `Appointment with Dr. ${appointmentData.doctorName} has been confirmed`,
      cancelled: `Appointment with Dr. ${appointmentData.doctorName} has been cancelled`,
    };

    sendNotification({
      title: "Appointment Update",
      body: messages[appointmentData.type],
      icon: '/favicon.ico',
      tag: `appointment-${appointmentData.type}`,
      data: {
        type: 'appointment',
        doctorName: appointmentData.doctorName,
        appointmentTime: appointmentData.appointmentTime,
      },
    });
  };

  return {
    notificationState,
    requestPermission,
    sendNotification,
    sendOrderNotification,
    sendInventoryNotification,
    sendAppointmentNotification,
  };
};