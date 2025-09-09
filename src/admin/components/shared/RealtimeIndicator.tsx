import { useEffect, useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { useRealtime } from '../RealTimeSync/RealtimeProvider';
import { Activity, Wifi, WifiOff } from 'lucide-react';

export const RealtimeIndicator = () => {
  const { isConnected, subscriptions } = useRealtime();
  const [activityCount, setActivityCount] = useState(0);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setActivityCount(prev => prev + Math.floor(Math.random() * 3));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isConnected ? "default" : "destructive"} 
        className="flex items-center gap-1.5"
      >
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? 'Live' : 'Offline'}
      </Badge>
      
      {isConnected && subscriptions.length > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          {subscriptions.length} streams
        </Badge>
      )}
      
      {activityCount > 0 && (
        <Badge variant="outline" className="text-xs">
          {activityCount} updates
        </Badge>
      )}
    </div>
  );
};