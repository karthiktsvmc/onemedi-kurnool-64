// Prescription Order Processing Service
// Handles the complete order lifecycle for prescription-based orders

import { supabase } from '@/integrations/supabase/client';
import { PrescriptionCartItem } from './prescriptionCartService';

export interface PrescriptionOrder {
  id: string;
  order_number: string;
  user_id: string;
  prescription_id: string;
  order_type: 'prescription' | 'mixed' | 'regular';
  status: PrescriptionOrderStatus;
  total_amount: number;
  prescription_discount: number;
  delivery_charges: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  delivery_address: any;
  delivery_type: 'home' | 'pickup' | 'express';
  estimated_delivery: string;
  pharmacist_verified: boolean;
  pharmacist_verified_by?: string;
  pharmacist_notes?: string;
  created_at: string;
  updated_at: string;
  prescription_order_items: PrescriptionOrderItem[];
}

export interface PrescriptionOrderItem {
  id: string;
  order_id: string;
  medicine_id: string;
  prescription_item_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  substituted: boolean;
  substitute_medicine_id?: string;
  substitute_reason?: string;
  fulfillment_status: 'pending' | 'verified' | 'dispensed' | 'substituted' | 'unavailable';
  pharmacist_notes?: string;
  medicine: {
    name: string;
    brand: string;
    generic_name?: string;
    strength?: string;
    form?: string;
  };
}

export type PrescriptionOrderStatus = 
  | 'placed'
  | 'prescription_review'
  | 'pharmacist_verification'
  | 'approved'
  | 'rejected'
  | 'preparing'
  | 'quality_check'
  | 'packed'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderWorkflowStep {
  status: PrescriptionOrderStatus;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  active: boolean;
  estimated_time?: string;
  notes?: string;
}

export interface PharmacistVerification {
  order_id: string;
  pharmacist_id: string;
  verification_status: 'approved' | 'rejected' | 'requires_substitution';
  verified_items: Array<{
    item_id: string;
    status: 'approved' | 'rejected' | 'substituted';
    substitute_medicine_id?: string;
    reason?: string;
    notes?: string;
  }>;
  overall_notes?: string;
  verification_date: string;
}

export class PrescriptionOrderService {
  /**
   * Creates a new prescription order from cart items
   */
  static async createOrderFromCart(
    userId: string,
    cartItems: PrescriptionCartItem[],
    orderDetails: {
      delivery_address: any;
      delivery_type: 'home' | 'pickup' | 'express';
      payment_method: string;
      special_instructions?: string;
    }
  ): Promise<{ success: boolean; order?: PrescriptionOrder; error?: string }> {
    try {
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const prescription_discount = subtotal * 0.05; // 5% prescription discount
      const delivery_charges = subtotal >= 200 ? 0 : 40;
      const total_amount = subtotal - prescription_discount + delivery_charges;

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_type: 'prescription',
          status: 'placed',
          total_amount,
          prescription_discount,
          delivery_charges,
          payment_status: 'pending',
          payment_method: orderDetails.payment_method,
          delivery_address: orderDetails.delivery_address,
          delivery_type: orderDetails.delivery_type,
          special_instructions: orderDetails.special_instructions,
          prescription_verified: false,
          estimated_delivery: this.calculateEstimatedDelivery(orderDetails.delivery_type)
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        medicine_id: item.prescription_item_id || item.id,
        prescription_item_id: item.extracted_medicine_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        substituted: item.alternative_selected || false,
        fulfillment_status: 'pending' as const
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update prescription status
      const prescriptionIds = [...new Set(cartItems.map(item => item.prescription_id).filter(Boolean))];
      if (prescriptionIds.length > 0) {
        await supabase
          .from('prescriptions')
          .update({ 
            status: 'processing',
            order_id: orderData.id
          })
          .in('id', prescriptionIds);
      }

      // Remove items from cart
      const cartItemIds = cartItems.map(item => item.prescription_item_id).filter(Boolean);
      if (cartItemIds.length > 0) {
        await supabase
          .from('prescription_cart_items')
          .update({ status: 'ordered' })
          .in('id', cartItemIds);
      }

      // Create initial workflow entry
      await this.createWorkflowStep(orderData.id, 'placed', 'Order placed successfully');

      return { success: true, order: orderData };

    } catch (error) {
      console.error('Error creating prescription order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create order' 
      };
    }
  }

  /**
   * Gets order details with complete information
   */
  static async getOrderDetails(orderId: string): Promise<{ success: boolean; order?: PrescriptionOrder; error?: string }> {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            medicines (name, brand, generic_name, strength, form)
          ),
          prescriptions (
            id,
            prescription_number,
            doctor_name,
            status
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        throw error;
      }

      return { success: true, order };

    } catch (error) {
      console.error('Error fetching order details:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch order' 
      };
    }
  }

  /**
   * Updates order status and creates workflow step
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: PrescriptionOrderStatus,
    notes?: string,
    updatedBy?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(updatedBy && { last_updated_by: updatedBy })
        })
        .eq('id', orderId);

      if (updateError) {
        throw updateError;
      }

      // Create workflow step
      await this.createWorkflowStep(orderId, newStatus, notes);

      return { success: true };

    } catch (error) {
      console.error('Error updating order status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update order status' 
      };
    }
  }

  /**
   * Handles pharmacist verification of prescription order
   */
  static async verifyPrescriptionOrder(
    orderId: string,
    pharmacistId: string,
    verification: PharmacistVerification
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Update order with pharmacist verification
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          pharmacist_verified: verification.verification_status === 'approved',
          pharmacist_verified_by: pharmacistId,
          pharmacist_notes: verification.overall_notes,
          status: verification.verification_status === 'approved' ? 'approved' : 'rejected'
        })
        .eq('id', orderId);

      if (orderError) {
        throw orderError;
      }

      // Update individual order items
      for (const item of verification.verified_items) {
        const updateData: any = {
          fulfillment_status: item.status,
          pharmacist_notes: item.notes
        };

        if (item.substitute_medicine_id) {
          updateData.substituted = true;
          updateData.substitute_medicine_id = item.substitute_medicine_id;
          updateData.substitute_reason = item.reason;
        }

        await supabase
          .from('order_items')
          .update(updateData)
          .eq('id', item.item_id);
      }

      // Create verification record
      await supabase
        .from('prescription_verifications')
        .insert({
          order_id: orderId,
          pharmacist_id: pharmacistId,
          verification_status: verification.verification_status,
          verified_items: verification.verified_items,
          notes: verification.overall_notes,
          verified_at: new Date().toISOString()
        });

      // Update workflow
      const statusMessage = verification.verification_status === 'approved' 
        ? 'Prescription verified and approved by pharmacist'
        : verification.verification_status === 'rejected'
        ? 'Prescription rejected by pharmacist'
        : 'Prescription approved with substitutions';

      await this.createWorkflowStep(orderId, verification.verification_status === 'approved' ? 'approved' : 'rejected', statusMessage);

      return { success: true };

    } catch (error) {
      console.error('Error verifying prescription order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify order' 
      };
    }
  }

  /**
   * Gets order workflow steps
   */
  static async getOrderWorkflow(orderId: string): Promise<OrderWorkflowStep[]> {
    try {
      const { data: steps } = await supabase
        .from('order_workflow_steps')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      // Get current order status
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      const currentStatus = order?.status;

      // Define the complete workflow
      const workflowDefinition: Array<{ status: PrescriptionOrderStatus; title: string; description: string; estimated_time?: string }> = [
        { status: 'placed', title: 'Order Placed', description: 'Your order has been received', estimated_time: '0 min' },
        { status: 'prescription_review', title: 'Prescription Review', description: 'Pharmacist reviewing your prescription', estimated_time: '30 min' },
        { status: 'pharmacist_verification', title: 'Medicine Verification', description: 'Verifying medicine availability and dosage', estimated_time: '45 min' },
        { status: 'approved', title: 'Order Approved', description: 'Order approved and ready for preparation', estimated_time: '1 hour' },
        { status: 'preparing', title: 'Preparing Order', description: 'Medicines being prepared and packed', estimated_time: '2 hours' },
        { status: 'quality_check', title: 'Quality Check', description: 'Final quality verification', estimated_time: '2.5 hours' },
        { status: 'packed', title: 'Order Packed', description: 'Order packed and ready for dispatch', estimated_time: '3 hours' },
        { status: 'dispatched', title: 'Dispatched', description: 'Order dispatched from pharmacy', estimated_time: '4 hours' },
        { status: 'in_transit', title: 'In Transit', description: 'Order is on the way', estimated_time: '6 hours' },
        { status: 'out_for_delivery', title: 'Out for Delivery', description: 'Order is out for delivery', estimated_time: '24 hours' },
        { status: 'delivered', title: 'Delivered', description: 'Order successfully delivered', estimated_time: '48 hours' }
      ];

      const currentStatusIndex = workflowDefinition.findIndex(w => w.status === currentStatus);

      return workflowDefinition.map((workflow, index) => {
        const step = steps?.find(s => s.status === workflow.status);
        return {
          status: workflow.status,
          title: workflow.title,
          description: workflow.description,
          timestamp: step?.created_at,
          completed: index <= currentStatusIndex,
          active: index === currentStatusIndex,
          estimated_time: workflow.estimated_time,
          notes: step?.notes
        };
      });

    } catch (error) {
      console.error('Error fetching order workflow:', error);
      return [];
    }
  }

  /**
   * Gets user's prescription orders
   */
  static async getUserOrders(
    userId: string,
    filters?: {
      status?: PrescriptionOrderStatus[];
      dateFrom?: string;
      dateTo?: string;
      limit?: number;
    }
  ): Promise<{ success: boolean; orders?: PrescriptionOrder[]; error?: string }> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            medicines (name, brand)
          ),
          prescriptions (
            prescription_number,
            doctor_name
          )
        `)
        .eq('user_id', userId)
        .eq('order_type', 'prescription')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data: orders, error } = await query;

      if (error) {
        throw error;
      }

      return { success: true, orders };

    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch orders' 
      };
    }
  }

  /**
   * Cancels a prescription order
   */
  static async cancelOrder(
    orderId: string,
    reason: string,
    cancelledBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if order can be cancelled
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (!order) {
        throw new Error('Order not found');
      }

      const cancellableStatuses = ['placed', 'prescription_review', 'pharmacist_verification', 'approved'];
      if (!cancellableStatuses.includes(order.status)) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_by: cancelledBy,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId);

      // Create workflow step
      await this.createWorkflowStep(orderId, 'cancelled', `Order cancelled: ${reason}`);

      return { success: true };

    } catch (error) {
      console.error('Error cancelling order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to cancel order' 
      };
    }
  }

  /**
   * Creates a workflow step
   */
  private static async createWorkflowStep(
    orderId: string,
    status: PrescriptionOrderStatus,
    notes?: string
  ): Promise<void> {
    try {
      await supabase
        .from('order_workflow_steps')
        .insert({
          order_id: orderId,
          status,
          notes,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error creating workflow step:', error);
    }
  }

  /**
   * Calculates estimated delivery time
   */
  private static calculateEstimatedDelivery(deliveryType: string): string {
    const now = new Date();
    let hoursToAdd = 48; // Default 48 hours

    switch (deliveryType) {
      case 'express':
        hoursToAdd = 24;
        break;
      case 'pickup':
        hoursToAdd = 4;
        break;
      default:
        hoursToAdd = 48;
    }

    const estimatedDate = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
    return estimatedDate.toISOString();
  }

  /**
   * Sends order notifications
   */
  static async sendOrderNotification(
    orderId: string,
    notificationType: 'status_update' | 'delivery_update' | 'cancellation',
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get order and user details
      const { data: order } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (phone, email, notification_preferences)
        `)
        .eq('id', orderId)
        .single();

      if (!order) {
        throw new Error('Order not found');
      }

      // Here you would integrate with SMS/Email/Push notification services
      // For now, we'll just log the notification
      console.log('Sending notification:', {
        orderId,
        type: notificationType,
        message,
        recipient: order.profiles
      });

      return { success: true };

    } catch (error) {
      console.error('Error sending notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send notification' 
      };
    }
  }
}

export default PrescriptionOrderService;