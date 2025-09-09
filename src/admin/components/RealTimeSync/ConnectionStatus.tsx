import { useRealtime } from './RealtimeProvider';
import { Badge } from '@/shared/components/ui/badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export const ConnectionStatus = () => {
  const { isConnected, connectionStatus, subscriptions } = useRealtime();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3" />;
      case 'error':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${getStatusColor()} flex items-center gap-1.5 px-2 py-1`}
      >
        {getStatusIcon()}
        <span className="text-xs font-medium capitalize">{connectionStatus}</span>
      </Badge>
      {subscriptions.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {subscriptions.length} active
        </Badge>
      )}
    </div>
  );
};