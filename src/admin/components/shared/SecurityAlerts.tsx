import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  dismissed?: boolean;
}

export const SecurityAlerts = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkSecurityStatus = async () => {
      try {
        // Check for failed login attempts
        const { data: authLogs } = await supabase
          .from('audit_logs')
          .select('*')
          .eq('action', 'auth_failed')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        if (authLogs && authLogs.length > 5) {
          setAlerts(prev => [...prev, {
            id: 'failed-logins',
            type: 'warning',
            title: 'Multiple Failed Login Attempts',
            message: `${authLogs.length} failed login attempts in the last 24 hours`,
            timestamp: new Date()
          }]);
        }

        // Check for system performance
        const { data: systemHealth } = await supabase
          .from('business_settings')
          .select('*')
          .single();

        if (systemHealth?.storefront_status === 'maintenance') {
          setAlerts(prev => [...prev, {
            id: 'maintenance-mode',
            type: 'info',
            title: 'Maintenance Mode Active',
            message: 'The platform is currently in maintenance mode',
            timestamp: new Date()
          }]);
        }

      } catch (error) {
        console.error('Error checking security status:', error);
      }
    };

    checkSecurityStatus();
    
    // Set up periodic security checks
    const interval = setInterval(checkSecurityStatus, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <Shield className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getAlertVariant = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getAlertVariant(alert.type)} className="relative">
          <div className="flex items-start gap-3">
            {getAlertIcon(alert.type)}
            <div className="flex-1">
              <AlertTitle className="text-sm font-medium">{alert.title}</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                {alert.message}
              </AlertDescription>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Dismiss
                  </Button>
                  {alert.type === 'warning' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Security Check Initiated",
                          description: "Running comprehensive security scan...",
                        });
                        dismissAlert(alert.id);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Investigate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};