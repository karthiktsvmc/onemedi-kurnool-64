// Prescription Status Tracker Component
// Displays real-time prescription status with timeline and progress

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Button } from '@/shared/components/ui/button';
import {
  Upload,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  User,
  Calendar,
  ChevronRight,
  Bell,
  RefreshCw,
  MessageCircle,
  Phone
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import PrescriptionStatusService, { 
  StatusTimeline, 
  PrescriptionProgress,
  StatusUpdate 
} from '@/shared/services/prescriptionStatusService';
import { 
  PrescriptionStatus, 
  PRESCRIPTION_STATUS_LABELS 
} from '@/shared/types/prescription';

interface PrescriptionStatusTrackerProps {
  prescriptionId: string;
  userId: string;
  onStatusUpdate?: (update: StatusUpdate) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const PrescriptionStatusTracker: React.FC<PrescriptionStatusTrackerProps> = ({
  prescriptionId,
  userId,
  onStatusUpdate,
  showActions = true,
  compact = false
}) => {
  const { toast } = useToast();
  const [timeline, setTimeline] = useState<StatusTimeline[]>([]);
  const [progress, setProgress] = useState<PrescriptionProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadStatusData();
  }, [prescriptionId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = PrescriptionStatusService.subscribeToStatusUpdates(
      prescriptionId,
      (update) => {
        handleStatusUpdate(update);
        onStatusUpdate?.(update);
      }
    );

    return unsubscribe;
  }, [prescriptionId, onStatusUpdate]);

  const loadStatusData = async () => {
    try {
      setIsLoading(true);
      
      const [timelineData, progressData] = await Promise.all([
        PrescriptionStatusService.getStatusTimeline(prescriptionId),
        PrescriptionStatusService.getPrescriptionProgress(prescriptionId)
      ]);

      setTimeline(timelineData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading status data:', error);
      toast({
        title: "Error loading status",
        description: "Failed to load prescription status information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (update: StatusUpdate) => {
    // Refresh timeline and progress
    loadStatusData();
    
    // Show notification
    toast({
      title: "Status Updated",
      description: `Prescription status changed to ${PRESCRIPTION_STATUS_LABELS[update.new_status]}`,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStatusData();
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: PrescriptionStatus) => {
    const iconClass = "h-5 w-5";
    
    switch (status) {
      case 'uploaded':
        return <Upload className={iconClass} />;
      case 'processing':
        return <FileText className={iconClass} />;
      case 'review_required':
        return <Eye className={iconClass} />;
      case 'validated':
        return <CheckCircle className={iconClass} />;
      case 'fulfilled':
        return <Package className={iconClass} />;
      case 'rejected':
        return <AlertCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getStatusColor = (status: PrescriptionStatus, isActive: boolean = false) => {
    const baseClasses = isActive ? "text-white" : "";
    
    switch (status) {
      case 'uploaded':
        return isActive ? "bg-blue-500" : "text-blue-600 bg-blue-50";
      case 'processing':
        return isActive ? "bg-yellow-500" : "text-yellow-600 bg-yellow-50";
      case 'review_required':
        return isActive ? "bg-orange-500" : "text-orange-600 bg-orange-50";
      case 'validated':
        return isActive ? "bg-green-500" : "text-green-600 bg-green-50";
      case 'fulfilled':
        return isActive ? "bg-green-600" : "text-green-700 bg-green-50";
      case 'rejected':
        return isActive ? "bg-red-500" : "text-red-600 bg-red-50";
      default:
        return isActive ? "bg-gray-500" : "text-gray-600 bg-gray-50";
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {progress && getStatusIcon(progress.current_status)}
              <div>
                <p className="font-medium text-foreground">
                  {progress && PRESCRIPTION_STATUS_LABELS[progress.current_status]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Step {progress?.current_step} of {progress?.total_steps}
                </p>
              </div>
            </div>
            
            {progress && (
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {Math.round(progress.progress_percentage)}%
                </p>
                <Progress 
                  value={progress.progress_percentage} 
                  className="w-20 h-2 mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {progress && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Prescription Progress</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                getStatusColor(progress.current_status, true)
              )}>
                {getStatusIcon(progress.current_status)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {PRESCRIPTION_STATUS_LABELS[progress.current_status]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {progress.next_action}
                </p>
              </div>
              <Badge variant="secondary">
                Step {progress.current_step}/{progress.total_steps}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress.progress_percentage)}%</span>
              </div>
              <Progress value={progress.progress_percentage} className="h-2" />
            </div>

            {/* Estimated Completion */}
            {progress.estimated_completion && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Estimated completion: {formatTimestamp(progress.estimated_completion)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={`${item.status}-${index}`} className="relative">
                {/* Timeline connector */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={cn(
                    "p-2 rounded-full border-2",
                    item.is_current 
                      ? "border-primary bg-primary text-white" 
                      : "border-border bg-background",
                    !item.is_current && timeline.some(t => t.is_current) && 
                    timeline.findIndex(t => t.is_current) > index
                      ? "bg-green-50 border-green-200 text-green-600"
                      : ""
                  )}>
                    {getStatusIcon(item.status)}
                  </div>

                  {/* Status Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium",
                        item.is_current ? "text-primary" : "text-foreground"
                      )}>
                        {PRESCRIPTION_STATUS_LABELS[item.status]}
                      </h4>
                      {item.is_current && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatTimestamp(item.timestamp)}</span>
                      
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(item.duration)}
                        </span>
                      )}
                      
                      {item.updated_by && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.updated_by}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {showActions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Pharmacist
              </Button>
              
              <Button variant="outline" className="justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              
              <Button variant="outline" className="justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
              
              <Button variant="outline" className="justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Request Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionStatusTracker;