import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Search, Activity, AlertTriangle, Info, Check } from 'lucide-react';
import { useErrorLogger } from '@/shared/contexts/ErrorContext';

export const ErrorLogsViewer = () => {
  const { logs, clearLogs } = useErrorLogger();

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warn':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Error Logs</CardTitle>
            <CardDescription>Monitor application errors and warnings</CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearLogs}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No errors logged</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getLevelIcon(log.level)}
                    <Badge variant={getLevelBadgeVariant(log.level) as any}>
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-medium">{log.message}</p>
                {log.context && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Context</summary>
                    <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};