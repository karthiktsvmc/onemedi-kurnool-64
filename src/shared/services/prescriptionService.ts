// Prescription Service - Main Business Logic
// Handles prescription CRUD operations, validation, and status management

import { supabase } from '@/integrations/supabase/client';
import { 
  Prescription, 
  PrescriptionInsert, 
  PrescriptionUpdate,
  PrescriptionMedicine,
  PrescriptionMedicineInsert,
  PrescriptionValidationLog,
  PrescriptionStatus,
  ValidationType,
  ValidationResults,
  ExtractedMedicine,
  PrescriptionWithMedicines,
  PrescriptionSummary,
  PrescriptionFilters,
  PrescriptionSearchParams,
  PRESCRIPTION_VALIDITY_MONTHS
} from '@/shared/types/prescription';
import PrescriptionStorageService from './prescriptionStorageService';

export interface CreatePrescriptionData {
  doctor_name: string;
  patient_name: string;
  prescription_date: string;
  doctor_registration?: string;
  doctor_phone?: string;
  clinic_name?: string;
  clinic_address?: string;
  patient_age?: number;
  patient_gender?: string;
  patient_phone?: string;
  diagnosis?: string;
  symptoms?: string;
  priority_level?: 1 | 2 | 3;
  source_channel?: string;
}

export interface PrescriptionServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export class PrescriptionService {
  
  /**
   * Creates a new prescription record
   */
  static async createPrescription(
    userId: string, 
    prescriptionData: CreatePrescriptionData
  ): Promise<PrescriptionServiceResponse<Prescription>> {
    try {
      // Calculate expiry date (6 months from prescription date)
      const prescriptionDate = new Date(prescriptionData.prescription_date);
      const expiryDate = new Date(prescriptionDate);
      expiryDate.setMonth(expiryDate.getMonth() + PRESCRIPTION_VALIDITY_MONTHS);

      // Generate unique prescription number
      const prescriptionNumber = await this.generatePrescriptionNumber();

      const insertData: PrescriptionInsert = {
        user_id: userId,
        prescription_number: prescriptionNumber,
        expiry_date: expiryDate.toISOString().split('T')[0],
        ...prescriptionData
      };

      const { data, error } = await supabase
        .from('prescriptions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating prescription:', error);
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Log the creation
      await this.logValidation(data.id, 'format_validation', 'passed', {
        action: 'prescription_created',
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error creating prescription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Updates prescription status and related fields
   */
  static async updatePrescriptionStatus(
    prescriptionId: string,
    status: PrescriptionStatus,
    updates?: Partial<PrescriptionUpdate>
  ): Promise<PrescriptionServiceResponse<Prescription>> {
    try {
      const updateData: PrescriptionUpdate = {
        status,
        ...updates
      };

      // Add processed_at timestamp for certain status changes
      if (['validated', 'rejected', 'fulfilled'].includes(status)) {
        updateData.processed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('prescriptions')
        .update(updateData)
        .eq('id', prescriptionId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Log the status change
      await this.logValidation(prescriptionId, 'pharmacist_approval', 'passed', {
        action: 'status_updated',
        old_status: data.status,
        new_status: status,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Gets a prescription with all related data
   */
  static async getPrescriptionWithDetails(
    prescriptionId: string
  ): Promise<PrescriptionServiceResponse<PrescriptionWithMedicines>> {
    try {
      // Get prescription
      const { data: prescription, error: prescriptionError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('id', prescriptionId)
        .single();

      if (prescriptionError) {
        return {
          success: false,
          error: prescriptionError.message,
          code: prescriptionError.code
        };
      }

      // Get medicines
      const { data: medicines, error: medicinesError } = await supabase
        .from('prescription_medicines')
        .select('*')
        .eq('prescription_id', prescriptionId);

      if (medicinesError) {
        console.error('Error fetching medicines:', medicinesError);
      }

      // Get validation logs
      const { data: validationLogs, error: logsError } = await supabase
        .from('prescription_validation_logs')
        .select('*')
        .eq('prescription_id', prescriptionId)
        .order('created_at', { ascending: false });

      if (logsError) {
        console.error('Error fetching validation logs:', logsError);
      }

      // Get file attachments
      const fileAttachments = await PrescriptionStorageService.getPrescriptionFiles(prescriptionId);

      return {
        success: true,
        data: {
          ...prescription,
          medicines: medicines || [],
          validation_logs: validationLogs || [],
          file_attachments: fileAttachments
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Gets user's prescriptions with filtering and pagination
   */
  static async getUserPrescriptions(
    userId: string,
    params?: PrescriptionSearchParams
  ): Promise<PrescriptionServiceResponse<{
    prescriptions: PrescriptionSummary[];
    total: number;
    page: number;
    limit: number;
  }>> {
    try {
      let query = supabase
        .from('prescriptions')
        .select(`
          id,
          prescription_number,
          patient_name,
          doctor_name,
          status,
          created_at,
          prescription_date,
          prescription_medicines(count)
        `, { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (params?.filters) {
        const filters = params.filters;
        
        if (filters.status && filters.status.length > 0) {
          query = query.in('status', filters.status);
        }
        
        if (filters.date_range) {
          query = query
            .gte('prescription_date', filters.date_range.start)
            .lte('prescription_date', filters.date_range.end);
        }
        
        if (filters.doctor_name) {
          query = query.ilike('doctor_name', `%${filters.doctor_name}%`);
        }
        
        if (filters.patient_name) {
          query = query.ilike('patient_name', `%${filters.patient_name}%`);
        }
        
        if (filters.priority_level && filters.priority_level.length > 0) {
          query = query.in('priority_level', filters.priority_level);
        }
      }

      // Apply search
      if (params?.query) {
        query = query.or(`
          doctor_name.ilike.%${params.query}%,
          patient_name.ilike.%${params.query}%,
          prescription_number.ilike.%${params.query}%,
          diagnosis.ilike.%${params.query}%
        `);
      }

      // Apply sorting
      const sortBy = params?.sort_by || 'created_at';
      const sortOrder = params?.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Transform data to include medicine count
      const prescriptions: PrescriptionSummary[] = (data || []).map(item => ({
        id: item.id,
        prescription_number: item.prescription_number,
        patient_name: item.patient_name,
        doctor_name: item.doctor_name,
        status: item.status,
        created_at: item.created_at,
        prescription_date: item.prescription_date,
        medicine_count: Array.isArray(item.prescription_medicines) 
          ? item.prescription_medicines.length 
          : item.prescription_medicines?.count || 0
      }));

      return {
        success: true,
        data: {
          prescriptions,
          total: count || 0,
          page,
          limit
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Adds extracted medicines to a prescription
   */
  static async addExtractedMedicines(
    prescriptionId: string,
    extractedMedicines: ExtractedMedicine[]
  ): Promise<PrescriptionServiceResponse<PrescriptionMedicine[]>> {
    try {
      const medicines: PrescriptionMedicineInsert[] = extractedMedicines.map(medicine => ({
        prescription_id: prescriptionId,
        medicine_name: medicine.name,
        generic_name: medicine.generic_name,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        quantity_prescribed: medicine.quantity,
        extraction_method: 'ocr',
        confidence_score: medicine.confidence,
        requires_verification: medicine.confidence < 0.9,
        verification_status: 'pending'
      }));

      const { data, error } = await supabase
        .from('prescription_medicines')
        .insert(medicines)
        .select();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Update prescription with extracted medicines
      await supabase
        .from('prescriptions')
        .update({
          extracted_medicines: extractedMedicines,
          status: 'processing'
        })
        .eq('id', prescriptionId);

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Updates medicine availability and pricing
   */
  static async updateMedicineAvailability(
    medicineId: string,
    updates: {
      available?: boolean;
      in_stock?: boolean;
      price?: number;
      discount_price?: number;
      stock_quantity?: number;
      alternatives?: string[];
    }
  ): Promise<PrescriptionServiceResponse<PrescriptionMedicine>> {
    try {
      const { data, error } = await supabase
        .from('prescription_medicines')
        .update(updates)
        .eq('id', medicineId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Logs validation results
   */
  static async logValidation(
    prescriptionId: string,
    validationType: ValidationType,
    status: string,
    validationData: Record<string, any>,
    validatedBy?: string,
    notes?: string
  ): Promise<PrescriptionServiceResponse<PrescriptionValidationLog>> {
    try {
      const logData = {
        prescription_id: prescriptionId,
        validation_type: validationType,
        status,
        validation_data: validationData,
        validated_by: validatedBy,
        validator_type: validatedBy ? 'pharmacist' : 'system',
        notes,
        severity_level: status === 'failed' ? 3 : status === 'warning' ? 2 : 1
      };

      const { data, error } = await supabase
        .from('prescription_validation_logs')
        .insert(logData)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validates prescription data and updates validation results
   */
  static async validatePrescription(
    prescriptionId: string,
    validatedBy?: string
  ): Promise<PrescriptionServiceResponse<ValidationResults>> {
    try {
      // Get prescription with medicines
      const { success, data: prescription } = await this.getPrescriptionWithDetails(prescriptionId);
      
      if (!success || !prescription) {
        return {
          success: false,
          error: 'Prescription not found'
        };
      }

      // Perform validation checks
      const validationResults: ValidationResults = {
        format_check: await this.validateFormat(prescription),
        content_validation: await this.validateContent(prescription),
        medicine_validation: await this.validateMedicines(prescription),
        regulatory_compliance: await this.validateRegulatory(prescription)
      };

      // Calculate overall validation score
      const validationScore = this.calculateValidationScore(validationResults);

      // Update prescription with validation results
      const { error: updateError } = await supabase
        .from('prescriptions')
        .update({
          validation_results: validationResults,
          validation_score: validationScore,
          status: validationScore >= 0.8 ? 'validated' : 'review_required',
          verified_by: validatedBy,
          verified_at: validatedBy ? new Date().toISOString() : null
        })
        .eq('id', prescriptionId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message
        };
      }

      // Log validation completion
      await this.logValidation(
        prescriptionId,
        'pharmacist_approval',
        validationScore >= 0.8 ? 'passed' : 'review_required',
        { validation_score: validationScore, ...validationResults },
        validatedBy,
        `Validation completed with score: ${validationScore}`
      );

      return {
        success: true,
        data: validationResults
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Rejects a prescription with reasons
   */
  static async rejectPrescription(
    prescriptionId: string,
    reasons: string[],
    rejectedBy: string,
    notes?: string
  ): Promise<PrescriptionServiceResponse<Prescription>> {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .update({
          status: 'rejected',
          rejection_reasons: reasons,
          verified_by: rejectedBy,
          verified_at: new Date().toISOString(),
          pharmacist_notes: notes
        })
        .eq('id', prescriptionId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Log rejection
      await this.logValidation(
        prescriptionId,
        'pharmacist_approval',
        'failed',
        { rejection_reasons: reasons },
        rejectedBy,
        notes
      );

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Private helper methods
   */

  private static async generatePrescriptionNumber(): Promise<string> {
    const prefix = 'RX';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  private static async validateFormat(prescription: PrescriptionWithMedicines) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!prescription.doctor_name) {
      errors.push('Doctor name is missing');
    }
    if (!prescription.patient_name) {
      errors.push('Patient name is missing');
    }
    if (!prescription.prescription_date) {
      errors.push('Prescription date is missing');
    }

    // Check date validity
    const prescDate = new Date(prescription.prescription_date);
    const today = new Date();
    if (prescDate > today) {
      errors.push('Prescription date cannot be in the future');
    }

    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - PRESCRIPTION_VALIDITY_MONTHS);
    if (prescDate < monthsAgo) {
      warnings.push('Prescription is older than 6 months');
    }

    return {
      passed: errors.length === 0,
      errors,
      warnings
    };
  }

  private static async validateContent(prescription: PrescriptionWithMedicines) {
    return {
      doctor_info_valid: !!prescription.doctor_name,
      patient_info_valid: !!prescription.patient_name,
      prescription_date_valid: !!prescription.prescription_date,
      medicines_identified: prescription.medicines.length > 0,
      readability_score: 0.9 // This would be calculated from OCR
    };
  }

  private static async validateMedicines(prescription: PrescriptionWithMedicines) {
    const unrecognized: string[] = [];
    const controlled: string[] = [];

    prescription.medicines.forEach(medicine => {
      if (!medicine.medicine_id) {
        unrecognized.push(medicine.medicine_name);
      }
      // Add logic to check for controlled substances
    });

    return {
      medicines_found: prescription.medicines.length,
      medicines_validated: prescription.medicines.filter(m => m.medicine_id).length,
      unrecognized_medicines: unrecognized,
      controlled_substances: controlled
    };
  }

  private static async validateRegulatory(prescription: PrescriptionWithMedicines) {
    const issues: string[] = [];
    const requirementsMet: string[] = [];

    // Add regulatory compliance checks
    if (prescription.doctor_registration) {
      requirementsMet.push('Doctor registration provided');
    } else {
      issues.push('Doctor registration number missing');
    }

    return {
      compliant: issues.length === 0,
      issues,
      requirements_met: requirementsMet
    };
  }

  private static calculateValidationScore(results: ValidationResults): number {
    let score = 0;
    let totalChecks = 0;

    // Format check (25% weight)
    if (results.format_check.passed) score += 0.25;
    totalChecks++;

    // Content validation (25% weight)
    const contentScore = (
      (results.content_validation.doctor_info_valid ? 1 : 0) +
      (results.content_validation.patient_info_valid ? 1 : 0) +
      (results.content_validation.prescription_date_valid ? 1 : 0) +
      (results.content_validation.medicines_identified ? 1 : 0)
    ) / 4;
    score += contentScore * 0.25;

    // Medicine validation (25% weight)
    const medicineScore = results.medicine_validation.medicines_found > 0 
      ? results.medicine_validation.medicines_validated / results.medicine_validation.medicines_found 
      : 0;
    score += medicineScore * 0.25;

    // Regulatory compliance (25% weight)
    if (results.regulatory_compliance.compliant) score += 0.25;

    return Math.round(score * 100) / 100;
  }
}

export default PrescriptionService;