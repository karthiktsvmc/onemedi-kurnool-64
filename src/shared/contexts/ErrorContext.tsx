import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

interface ErrorLog {
  id: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  context?: any;
  timestamp: Date;
  userId?: string;
}

interface ErrorContextType {
  logError: (message: string, context?: any, level?: 'error' | 'warn' | 'info') => void;
  clearLogs: () => void;
  logs: ErrorLog[];
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorLogger = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorLogger must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const { toast } = useToast();

  const logError = async (message: string, context?: any, level: 'error' | 'warn' | 'info' = 'error') => {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      level,
      message,
      context,
      timestamp: new Date(),
      userId: (await supabase.auth.getUser()).data.user?.id
    };

    setLogs(prev => [errorLog, ...prev.slice(0, 99)]); // Keep last 100 logs

    // Show toast for errors and warnings
    if (level === 'error') {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Note: error_logs table would need to be created in database
        console.error('Production Error Log:', { level, message, context, userId: errorLog.userId });
      } catch (err) {
        console.error('Failed to log error:', err);
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <ErrorContext.Provider value={{ logError, clearLogs, logs }}>
      {children}
    </ErrorContext.Provider>
  );
};