// Prescription Status Tracking Service
// Handles real-time status updates, notifications, and tracking for prescriptions

import { supabase } from '@/integrations/supabase/client';
import { 
  Prescription, 
  PrescriptionStatus, 
  PrescriptionValidationLog,
  PRESCRIPTION_STATUS_LABELS 
} from '@/shared/types/prescription';

export interface StatusUpdate {
  prescription_id: string;
  old_status: PrescriptionStatus;
  new_status: PrescriptionStatus;
  updated_by: string;
  notes?: string;
  timestamp: string;
}

export interface StatusTimeline {
  status: PrescriptionStatus;
  timestamp: string;
  duration?: number; // in minutes
  updated_by?: string;
  notes?: string;
  is_current: boolean;
}

export interface PrescriptionProgress {
  current_step: number;
  total_steps: number;
  current_status: PrescriptionStatus;
  progress_percentage: number;
  estimated_completion?: string;
  next_action?: string;
}

export interface NotificationPreference {
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  whatsapp_notifications: boolean;
}

export class PrescriptionStatusService {
  
  // Status progression order
  private static readonly STATUS_PROGRESSION: PrescriptionStatus[] = [
    'uploaded',
    'processing',
    'review_required',
    'validated',
    'fulfilled'
  ];

  /**
   * Updates prescription status and triggers notifications
   */
  static async updateStatus(
    prescriptionId: string,
    newStatus: PrescriptionStatus,
    updatedBy: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current prescription
      const { data: prescription, error: fetchError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('id', prescriptionId)
        .single();

      if (fetchError || !prescription) {
        return { success: false, error: 'Prescription not found' };
      }

      const oldStatus = prescription.status;

      // Validate status transition
      if (!this.isValidStatusTransition(oldStatus, newStatus)) {
        return { 
          success: false, 
          error: `Invalid status transition from ${oldStatus} to ${newStatus}` 
        };
      }

      // Update prescription status
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add specific fields based on status
      if (newStatus === 'validated') {
        updateData.verified_by = updatedBy;
        updateData.verified_at = new Date().toISOString();
      }

      if (newStatus === 'fulfilled') {
        updateData.processed_at = new Date().toISOString();
      }

      if (notes) {
        updateData.pharmacist_notes = notes;
      }

      const { error: updateError } = await supabase
        .from('prescriptions')
        .update(updateData)
        .eq('id', prescriptionId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Log the status change
      await this.logStatusChange(prescriptionId, oldStatus, newStatus, updatedBy, notes);

      // Send notifications
      await this.sendStatusNotifications(prescriptionId, prescription.user_id, oldStatus, newStatus);

      // Trigger real-time updates
      await this.broadcastStatusUpdate(prescriptionId, oldStatus, newStatus, updatedBy);

      return { success: true };

    } catch (error) {
      console.error('Error updating prescription status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Gets prescription status timeline
   */
  static async getStatusTimeline(prescriptionId: string): Promise<StatusTimeline[]> {
    try {
      // Get status changes from validation logs
      const { data: logs, error } = await supabase
        .from('prescription_validation_logs')
        .select(`
          created_at,
          validation_data,
          validated_by,
          notes,
          status
        `)
        .eq('prescription_id', prescriptionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching status timeline:', error);
        return [];
      }

      // Get current prescription status
      const { data: prescription } = await supabase
        .from('prescriptions')
        .select('status, created_at')
        .eq('id', prescriptionId)
        .single();

      const timeline: StatusTimeline[] = [];
      
      // Add initial upload status
      timeline.push({
        status: 'uploaded',
        timestamp: prescription?.created_at || new Date().toISOString(),
        is_current: false
      });

      // Process logs to build timeline
      const statusMap = new Map<PrescriptionStatus, StatusTimeline>();
      
      logs?.forEach(log => {
        const statusData = log.validation_data as any;
        if (statusData?.new_status) {
          const status = statusData.new_status as PrescriptionStatus;
          if (!statusMap.has(status)) {
            statusMap.set(status, {
              status,
              timestamp: log.created_at,
              updated_by: log.validated_by || undefined,
              notes: log.notes || undefined,
              is_current: false
            });
          }
        }
      });

      // Add statuses from map
      this.STATUS_PROGRESSION.forEach(status => {
        if (statusMap.has(status)) {
          timeline.push(statusMap.get(status)!);
        }
      });

      // Calculate durations and mark current status
      for (let i = 0; i < timeline.length; i++) {
        const current = timeline[i];
        const next = timeline[i + 1];
        
        if (next) {
          const currentTime = new Date(current.timestamp);
          const nextTime = new Date(next.timestamp);
          current.duration = Math.floor((nextTime.getTime() - currentTime.getTime()) / (1000 * 60));
        }
        
        // Mark current status
        current.is_current = current.status === prescription?.status;
      }

      return timeline;

    } catch (error) {
      console.error('Error getting status timeline:', error);
      return [];
    }
  }

  /**
   * Gets prescription progress information
   */
  static async getPrescriptionProgress(prescriptionId: string): Promise<PrescriptionProgress | null> {
    try {
      const { data: prescription, error } = await supabase
        .from('prescriptions')
        .select('status, created_at')
        .eq('id', prescriptionId)
        .single();

      if (error || !prescription) {
        return null;
      }

      const currentStatus = prescription.status;
      const currentStep = this.STATUS_PROGRESSION.indexOf(currentStatus) + 1;
      const totalSteps = this.STATUS_PROGRESSION.length;
      const progressPercentage = (currentStep / totalSteps) * 100;

      // Calculate estimated completion time
      const estimatedCompletion = this.calculateEstimatedCompletion(currentStatus, prescription.created_at);
      
      // Determine next action
      const nextAction = this.getNextAction(currentStatus);

      return {
        current_step: currentStep,
        total_steps: totalSteps,
        current_status: currentStatus,
        progress_percentage: progressPercentage,
        estimated_completion: estimatedCompletion,
        next_action: nextAction
      };

    } catch (error) {
      console.error('Error getting prescription progress:', error);
      return null;
    }
  }

  /**
   * Subscribes to real-time status updates for a prescription
   */
  static subscribeToStatusUpdates(
    prescriptionId: string,
    callback: (update: StatusUpdate) => void
  ): () => void {
    const channel = supabase
      .channel(`prescription-${prescriptionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'prescriptions',
          filter: `id=eq.${prescriptionId}`
        },
        (payload) => {
          const oldRecord = payload.old as Prescription;
          const newRecord = payload.new as Prescription;
          
          if (oldRecord.status !== newRecord.status) {
            callback({
              prescription_id: prescriptionId,
              old_status: oldRecord.status,
              new_status: newRecord.status,
              updated_by: newRecord.verified_by || 'system',
              timestamp: newRecord.updated_at
            });
          }
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Gets all prescriptions with their current status for a user
   */
  static async getUserPrescriptionsWithStatus(
    userId: string,
    limit: number = 20
  ): Promise<Array<Prescription & { progress: PrescriptionProgress }>> {
    try {
      const { data: prescriptions, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user prescriptions:', error);
        return [];
      }

      // Add progress information to each prescription
      const prescriptionsWithProgress = await Promise.all(
        (prescriptions || []).map(async (prescription) => {
          const progress = await this.getPrescriptionProgress(prescription.id);
          return {
            ...prescription,
            progress: progress || {
              current_step: 1,
              total_steps: this.STATUS_PROGRESSION.length,
              current_status: prescription.status,
              progress_percentage: 0
            }
          };
        })
      );

      return prescriptionsWithProgress;

    } catch (error) {
      console.error('Error fetching user prescriptions with status:', error);
      return [];
    }
  }

  /**
   * Private helper methods
   */

  private static isValidStatusTransition(
    oldStatus: PrescriptionStatus,
    newStatus: PrescriptionStatus
  ): boolean {
    const oldIndex = this.STATUS_PROGRESSION.indexOf(oldStatus);
    const newIndex = this.STATUS_PROGRESSION.indexOf(newStatus);

    // Allow moving forward in progression
    if (newIndex > oldIndex) return true;
    
    // Allow specific backward transitions
    if (oldStatus === 'validated' && newStatus === 'review_required') return true;
    if (oldStatus === 'review_required' && newStatus === 'rejected') return true;
    
    // Allow rejection from any status except fulfilled
    if (newStatus === 'rejected' && oldStatus !== 'fulfilled') return true;

    return false;
  }

  private static async logStatusChange(
    prescriptionId: string,
    oldStatus: PrescriptionStatus,
    newStatus: PrescriptionStatus,
    updatedBy: string,
    notes?: string
  ): Promise<void> {
    try {
      await supabase
        .from('prescription_validation_logs')
        .insert({
          prescription_id: prescriptionId,
          validation_type: 'pharmacist_approval',
          status: 'passed',
          validation_data: {
            action: 'status_updated',
            old_status: oldStatus,
            new_status: newStatus,
            timestamp: new Date().toISOString()
          },
          validated_by: updatedBy,
          notes,
          severity_level: 1
        });
    } catch (error) {
      console.error('Error logging status change:', error);
    }
  }

  private static async sendStatusNotifications(
    prescriptionId: string,
    userId: string,
    oldStatus: PrescriptionStatus,
    newStatus: PrescriptionStatus
  ): Promise<void> {
    try {
      // Get user notification preferences
      const { data: preferences } = await supabase
        .from('prescription_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!preferences) return;

      const message = this.getStatusNotificationMessage(newStatus, prescriptionId);
      
      // Send notifications based on preferences
      if (preferences.email_notifications) {
        // Send email notification (integrate with email service)
        console.log('Sending email notification:', message);
      }

      if (preferences.sms_notifications) {
        // Send SMS notification (integrate with SMS service)
        console.log('Sending SMS notification:', message);
      }

      if (preferences.push_notifications) {
        // Send push notification (integrate with push service)
        console.log('Sending push notification:', message);
      }

      if (preferences.whatsapp_notifications) {
        // Send WhatsApp notification (integrate with WhatsApp API)
        console.log('Sending WhatsApp notification:', message);
      }

    } catch (error) {
      console.error('Error sending status notifications:', error);
    }
  }

  private static async broadcastStatusUpdate(
    prescriptionId: string,
    oldStatus: PrescriptionStatus,
    newStatus: PrescriptionStatus,
    updatedBy: string
  ): Promise<void> {
    try {
      // Broadcast real-time update to all subscribers
      await supabase
        .from('prescriptions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', prescriptionId);

    } catch (error) {
      console.error('Error broadcasting status update:', error);
    }
  }

  private static calculateEstimatedCompletion(
    currentStatus: PrescriptionStatus,
    createdAt: string
  ): string | undefined {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    // Estimated completion times based on current status (in hours)
    const estimatedTimes = {
      uploaded: 24,      // 24 hours to complete processing
      processing: 12,    // 12 hours to complete review
      review_required: 6, // 6 hours for pharmacist review
      validated: 2,      // 2 hours to fulfill
      fulfilled: 0       // Already completed
    };

    const remainingHours = estimatedTimes[currentStatus];
    if (remainingHours === 0) return undefined;

    const completionTime = new Date(now.getTime() + remainingHours * 60 * 60 * 1000);
    return completionTime.toISOString();
  }

  private static getNextAction(currentStatus: PrescriptionStatus): string {
    const nextActions = {
      uploaded: 'Processing your prescription files',
      processing: 'Extracting medicine information',
      review_required: 'Waiting for pharmacist review',
      validated: 'Preparing your order',
      fulfilled: 'Order completed',
      rejected: 'Prescription rejected - please contact support'
    };

    return nextActions[currentStatus] || 'Processing...';
  }

  private static getStatusNotificationMessage(
    status: PrescriptionStatus,
    prescriptionId: string
  ): string {
    const messages = {
      uploaded: `Your prescription ${prescriptionId.slice(0, 8)} has been uploaded successfully and is being processed.`,
      processing: `Your prescription ${prescriptionId.slice(0, 8)} is being analyzed. We're extracting medicine information.`,
      review_required: `Your prescription ${prescriptionId.slice(0, 8)} requires pharmacist review. This may take a few hours.`,
      validated: `Great news! Your prescription ${prescriptionId.slice(0, 8)} has been validated. You can now proceed with your order.`,
      fulfilled: `Your prescription ${prescriptionId.slice(0, 8)} order has been completed successfully.`,
      rejected: `Your prescription ${prescriptionId.slice(0, 8)} could not be processed. Please contact our support team.`
    };

    return messages[status] || `Your prescription ${prescriptionId.slice(0, 8)} status has been updated.`;
  }

  /**
   * Updates user notification preferences
   */
  static async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreference>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('prescription_notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Gets prescription statistics for analytics
   */
  static async getPrescriptionStatistics(
    userId?: string,
    dateRange?: { start: string; end: string }
  ): Promise<{
    total: number;
    by_status: Record<PrescriptionStatus, number>;
    average_processing_time: number;
    success_rate: number;
  }> {
    try {
      let query = supabase
        .from('prescriptions')
        .select('status, created_at, processed_at');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data: prescriptions, error } = await query;

      if (error) {
        console.error('Error fetching prescription statistics:', error);
        return {
          total: 0,
          by_status: {} as Record<PrescriptionStatus, number>,
          average_processing_time: 0,
          success_rate: 0
        };
      }

      const total = prescriptions?.length || 0;
      const byStatus: Record<PrescriptionStatus, number> = {
        uploaded: 0,
        processing: 0,
        review_required: 0,
        validated: 0,
        rejected: 0,
        expired: 0,
        fulfilled: 0
      };

      let totalProcessingTime = 0;
      let processedCount = 0;
      let successCount = 0;

      prescriptions?.forEach(prescription => {
        byStatus[prescription.status] = (byStatus[prescription.status] || 0) + 1;

        if (prescription.processed_at && prescription.created_at) {
          const processingTime = new Date(prescription.processed_at).getTime() - 
                               new Date(prescription.created_at).getTime();
          totalProcessingTime += processingTime;
          processedCount++;
        }

        if (['validated', 'fulfilled'].includes(prescription.status)) {
          successCount++;
        }
      });

      const averageProcessingTime = processedCount > 0 ? 
        Math.floor(totalProcessingTime / processedCount / (1000 * 60 * 60)) : 0; // in hours

      const successRate = total > 0 ? (successCount / total) * 100 : 0;

      return {
        total,
        by_status: byStatus,
        average_processing_time: averageProcessingTime,
        success_rate: successRate
      };

    } catch (error) {
      console.error('Error calculating prescription statistics:', error);
      return {
        total: 0,
        by_status: {} as Record<PrescriptionStatus, number>,
        average_processing_time: 0,
        success_rate: 0
      };
    }
  }
}

export default PrescriptionStatusService;