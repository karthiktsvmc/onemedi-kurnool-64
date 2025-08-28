// Prescription Cart Service
// Manages prescription-based items in cart and handles prescription validation during checkout

import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/frontend/data/mockCartData';
import { 
  Prescription, 
  PrescriptionItem,
  ExtractedMedicine 
} from '@/shared/types/prescription';

export interface PrescriptionCartItem extends CartItem {
  prescription_id?: string;
  prescription_item_id?: string;
  extracted_medicine_id?: string;
  requires_prescription: boolean;
  prescription_status?: 'pending' | 'uploaded' | 'verified' | 'rejected';
  prescription_file_urls?: string[];
  alternative_selected?: boolean;
  generic_substitution?: boolean;
}

export interface CartPrescriptionInfo {
  prescription_id: string;
  prescription_number?: string;
  doctor_name: string;
  prescription_date: string;
  items_count: number;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  files: Array<{
    id: string;
    url: string;
    file_name: string;
    upload_date: string;
  }>;
}

export interface CartValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  prescription_required_items: PrescriptionCartItem[];
  missing_prescriptions: string[];
}

export class PrescriptionCartService {
  /**
   * Adds prescription-based medicines to cart
   */
  static async addPrescriptionItemsToCart(
    userId: string,
    prescriptionId: string,
    selectedMedicines: Array<{
      medicine_id: string;
      extracted_medicine_id?: string;
      quantity: number;
      price: number;
      alternative_selected?: boolean;
    }>
  ): Promise<{ success: boolean; cart_items?: PrescriptionCartItem[]; error?: string }> {
    try {
      const cartItems: PrescriptionCartItem[] = [];

      for (const selectedMedicine of selectedMedicines) {
        // Get medicine details
        const { data: medicine, error: medicineError } = await supabase
          .from('medicines')
          .select('*')
          .eq('id', selectedMedicine.medicine_id)
          .single();

        if (medicineError || !medicine) {
          console.error('Error fetching medicine:', medicineError);
          continue;
        }

        // Create cart item
        const cartItem: PrescriptionCartItem = {
          id: `prescription-${prescriptionId}-${selectedMedicine.medicine_id}-${Date.now()}`,
          type: 'product',
          category: 'Prescription Medicines',
          image: medicine.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
          name: medicine.name,
          brand: medicine.brand,
          description: `Prescribed medicine from your prescription`,
          price: selectedMedicine.price,
          originalPrice: medicine.mrp,
          quantity: selectedMedicine.quantity,
          deliveryType: 'home',
          prescriptionRequired: true,
          requires_prescription: true,
          inStock: medicine.stock_qty > 0,
          stockLevel: medicine.stock_qty > 50 ? 'high' : medicine.stock_qty > 10 ? 'medium' : 'low',
          prescription_id: prescriptionId,
          extracted_medicine_id: selectedMedicine.extracted_medicine_id,
          prescription_status: 'uploaded',
          alternative_selected: selectedMedicine.alternative_selected || false,
          badges: ['Prescription Item', medicine.prescription_required ? 'Rx Required' : 'OTC']
        };

        cartItems.push(cartItem);

        // Save to database (prescription_cart_items table)
        const { error: insertError } = await supabase
          .from('prescription_cart_items')
          .insert({
            user_id: userId,
            prescription_id: prescriptionId,
            medicine_id: selectedMedicine.medicine_id,
            extracted_medicine_id: selectedMedicine.extracted_medicine_id,
            quantity: selectedMedicine.quantity,
            unit_price: selectedMedicine.price,
            total_price: selectedMedicine.price * selectedMedicine.quantity,
            alternative_selected: selectedMedicine.alternative_selected || false,
            status: 'active'
          });

        if (insertError) {
          console.error('Error saving cart item:', insertError);
        }
      }

      return { success: true, cart_items: cartItems };

    } catch (error) {
      console.error('Error adding prescription items to cart:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add items to cart' 
      };
    }
  }

  /**
   * Validates cart items for prescription requirements
   */
  static async validateCartForCheckout(
    cartItems: PrescriptionCartItem[]
  ): Promise<CartValidationResult> {
    const result: CartValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      prescription_required_items: [],
      missing_prescriptions: []
    };

    const prescriptionRequiredItems = cartItems.filter(item => item.requires_prescription);
    result.prescription_required_items = prescriptionRequiredItems;

    if (prescriptionRequiredItems.length === 0) {
      return result; // No prescription items, validation passes
    }

    // Group items by prescription
    const prescriptionGroups = new Map<string, PrescriptionCartItem[]>();
    const itemsWithoutPrescription: PrescriptionCartItem[] = [];

    prescriptionRequiredItems.forEach(item => {
      if (item.prescription_id) {
        if (!prescriptionGroups.has(item.prescription_id)) {
          prescriptionGroups.set(item.prescription_id, []);
        }
        prescriptionGroups.get(item.prescription_id)!.push(item);
      } else {
        itemsWithoutPrescription.push(item);
      }
    });

    // Check items without prescription
    if (itemsWithoutPrescription.length > 0) {
      result.valid = false;
      result.errors.push(
        `${itemsWithoutPrescription.length} prescription items require a valid prescription`
      );
      result.missing_prescriptions.push('general');
    }

    // Validate each prescription group
    for (const [prescriptionId, items] of prescriptionGroups) {
      try {
        const { data: prescription, error } = await supabase
          .from('prescriptions')
          .select(`
            id,
            status,
            prescription_date,
            expiry_date,
            doctor_name,
            prescription_file_attachments(*)
          `)
          .eq('id', prescriptionId)
          .single();

        if (error || !prescription) {
          result.valid = false;
          result.errors.push(`Invalid prescription for ${items.length} items`);
          result.missing_prescriptions.push(prescriptionId);
          continue;
        }

        // Check prescription status
        if (prescription.status === 'rejected') {
          result.valid = false;
          result.errors.push(`Prescription has been rejected and cannot be used`);
        } else if (prescription.status === 'pending') {
          result.warnings.push(`Prescription is still being reviewed`);
        }

        // Check expiry
        const expiryDate = new Date(prescription.expiry_date);
        const now = new Date();
        if (expiryDate < now) {
          result.valid = false;
          result.errors.push(`Prescription has expired on ${expiryDate.toLocaleDateString()}`);
        }

        // Check if prescription has files
        if (!prescription.prescription_file_attachments || 
            prescription.prescription_file_attachments.length === 0) {
          result.valid = false;
          result.errors.push(`No prescription files uploaded for ${items.length} items`);
        }

      } catch (error) {
        console.error('Error validating prescription:', error);
        result.valid = false;
        result.errors.push(`Error validating prescription for ${items.length} items`);
      }
    }

    return result;
  }

  /**
   * Gets prescription information for cart items
   */
  static async getCartPrescriptionInfo(
    cartItems: PrescriptionCartItem[]
  ): Promise<CartPrescriptionInfo[]> {
    const prescriptionIds = [...new Set(
      cartItems
        .filter(item => item.prescription_id)
        .map(item => item.prescription_id!)
    )];

    if (prescriptionIds.length === 0) {
      return [];
    }

    const prescriptionInfo: CartPrescriptionInfo[] = [];

    for (const prescriptionId of prescriptionIds) {
      try {
        const { data: prescription, error } = await supabase
          .from('prescriptions')
          .select(`
            id,
            prescription_number,
            doctor_name,
            prescription_date,
            status,
            prescription_file_attachments(
              id,
              file_url,
              file_name,
              uploaded_at
            )
          `)
          .eq('id', prescriptionId)
          .single();

        if (error || !prescription) {
          console.error('Error fetching prescription info:', error);
          continue;
        }

        const itemsCount = cartItems.filter(item => item.prescription_id === prescriptionId).length;

        prescriptionInfo.push({
          prescription_id: prescriptionId,
          prescription_number: prescription.prescription_number,
          doctor_name: prescription.doctor_name,
          prescription_date: prescription.prescription_date,
          items_count: itemsCount,
          status: prescription.status,
          files: prescription.prescription_file_attachments.map((file: any) => ({
            id: file.id,
            url: file.file_url,
            file_name: file.file_name,
            upload_date: file.uploaded_at
          }))
        });

      } catch (error) {
        console.error('Error fetching prescription info:', error);
      }
    }

    return prescriptionInfo;
  }

  /**
   * Updates prescription cart item quantity
   */
  static async updateCartItemQuantity(
    userId: string,
    cartItemId: string,
    newQuantity: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('prescription_cart_items')
        .update({
          quantity: newQuantity,
          total_price: supabase.sql`unit_price * ${newQuantity}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return { success: true };

    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update quantity' 
      };
    }
  }

  /**
   * Removes prescription cart item
   */
  static async removeCartItem(
    userId: string,
    cartItemId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('prescription_cart_items')
        .update({ status: 'removed' })
        .eq('id', cartItemId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return { success: true };

    } catch (error) {
      console.error('Error removing cart item:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove item' 
      };
    }
  }

  /**
   * Gets user's prescription cart items
   */
  static async getUserCartItems(
    userId: string
  ): Promise<{ success: boolean; items?: PrescriptionCartItem[]; error?: string }> {
    try {
      const { data: cartItems, error } = await supabase
        .from('prescription_cart_items')
        .select(`
          *,
          medicines(*),
          prescriptions(
            id,
            prescription_number,
            doctor_name,
            status
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      const formattedItems: PrescriptionCartItem[] = cartItems.map((item: any) => ({
        id: item.id,
        type: 'product',
        category: 'Prescription Medicines',
        image: item.medicines.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
        name: item.medicines.name,
        brand: item.medicines.brand,
        description: `From prescription by Dr. ${item.prescriptions.doctor_name}`,
        price: item.unit_price,
        originalPrice: item.medicines.mrp,
        quantity: item.quantity,
        deliveryType: 'home',
        prescriptionRequired: true,
        requires_prescription: true,
        inStock: item.medicines.stock_qty > 0,
        stockLevel: item.medicines.stock_qty > 50 ? 'high' : item.medicines.stock_qty > 10 ? 'medium' : 'low',
        prescription_id: item.prescription_id,
        prescription_item_id: item.id,
        prescription_status: item.prescriptions.status,
        alternative_selected: item.alternative_selected,
        badges: ['Prescription Item', item.medicines.prescription_required ? 'Rx Required' : 'OTC']
      }));

      return { success: true, items: formattedItems };

    } catch (error) {
      console.error('Error fetching user cart items:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart items' 
      };
    }
  }

  /**
   * Checks if a medicine substitution is allowed
   */
  static async checkSubstitutionAllowed(
    originalMedicineId: string,
    substituteMedicineId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const { data: original } = await supabase
        .from('medicines')
        .select('name, generic_name, therapeutic_class')
        .eq('id', originalMedicineId)
        .single();

      const { data: substitute } = await supabase
        .from('medicines')
        .select('name, generic_name, therapeutic_class')
        .eq('id', substituteMedicineId)
        .single();

      if (!original || !substitute) {
        return { allowed: false, reason: 'Medicine not found' };
      }

      // Allow substitution if same generic name or therapeutic class
      if (original.generic_name === substitute.generic_name) {
        return { allowed: true };
      }

      if (original.therapeutic_class === substitute.therapeutic_class) {
        return { allowed: true };
      }

      return { 
        allowed: false, 
        reason: 'Different therapeutic class - requires doctor approval' 
      };

    } catch (error) {
      console.error('Error checking substitution:', error);
      return { allowed: false, reason: 'Error checking substitution' };
    }
  }

  /**
   * Calculates prescription-specific pricing
   */
  static calculatePrescriptionPricing(
    cartItems: PrescriptionCartItem[]
  ): {
    subtotal: number;
    prescription_discount: number;
    delivery_charges: number;
    total: number;
  } {
    const prescriptionItems = cartItems.filter(item => item.requires_prescription);
    const regularItems = cartItems.filter(item => !item.requires_prescription);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply prescription discount (5% for prescription items)
    const prescriptionSubtotal = prescriptionItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const prescription_discount = prescriptionSubtotal * 0.05;

    // Free delivery for prescription orders above ₹200
    const delivery_charges = prescriptionItems.length > 0 && subtotal >= 200 ? 0 : 40;

    const total = subtotal - prescription_discount + delivery_charges;

    return {
      subtotal,
      prescription_discount,
      delivery_charges,
      total
    };
  }
}

export default PrescriptionCartService;