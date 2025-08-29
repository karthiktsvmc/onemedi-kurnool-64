// Notification Bell Component
// Displays notification bell with unread count and dropdown list of notifications

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  FileText,
  Package,
  AlertTriangle,
  Info,
  X,
  Settings,
  Loader2
} from 'lucide-react';

interface NotificationBellProps {
  className?: string;
  showCount?: boolean;
  maxNotifications?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
  showCount = true,
  maxNotifications = 10
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearError
  } = useNotifications({
    limit: maxNotifications,
    autoRefresh: true
  });

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-4 w-4 ${
      priority === 'urgent' || priority === 'high' ? 'text-red-500' :
      priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
    }`;

    switch (type) {
      case 'prescription_status':
        return <FileText className={iconClass} />;
      case 'order_update':
        return <Package className={iconClass} />;
      case 'pharmacist_message':
        return <AlertTriangle className={iconClass} />;
      case 'system_alert':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.data?.action_url) {
      navigate(notification.data.action_url);
    }

    setIsOpen(false);
  };

  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative h-9 w-9 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        {unreadCount > 0 ? (
          <BellRing className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        
        {showCount && unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <Card className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50 shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs h-7 px-2"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="h-5 w-5 p-0 text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <Separator />
            
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll receive updates about your prescriptions and orders here
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-80">
                  <div className="space-y-1 p-2">
                    {notifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={`
                          group cursor-pointer p-3 rounded-lg border-l-4 transition-all duration-200
                          hover:shadow-sm hover:bg-secondary/50
                          ${getPriorityColor(notification.priority)}
                          ${!notification.read ? 'bg-opacity-70' : 'bg-opacity-30'}
                        `}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium leading-5 ${
                                !notification.read ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            
                            <p className={`text-xs mt-1 line-clamp-2 ${
                              !notification.read ? 'text-muted-foreground' : 'text-muted-foreground/70'
                            }`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground/60">
                                {formatNotificationTime(notification.created_at)}
                              </span>
                              
                              {notification.priority === 'urgent' && (
                                <Badge variant="destructive" className="text-xs h-4 px-1">
                                  Urgent
                                </Badge>
                              )}
                              
                              {notification.priority === 'high' && (
                                <Badge variant="secondary" className="text-xs h-4 px-1 bg-orange-100 text-orange-700">
                                  High
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Mark as read button on hover */}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {/* Footer */}
              <Separator />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate('/profile?tab=notifications');
                      setIsOpen(false);
                    }}
                    className="text-xs"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Notification Settings
                  </Button>
                  
                  <span className="text-xs text-muted-foreground">
                    {notifications.length} of {unreadCount + notifications.filter(n => n.read).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationBell;