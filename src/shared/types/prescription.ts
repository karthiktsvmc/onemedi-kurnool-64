// Prescription Upload Feature - TypeScript Types and Interfaces
// This file contains all types related to prescription functionality

export type PrescriptionStatus = 
  | 'uploaded'
  | 'processing' 
  | 'review_required'
  | 'validated'
  | 'rejected'
  | 'expired'
  | 'fulfilled';

export type ValidationType = 
  | 'format_validation'
  | 'content_validation'
  | 'medicine_validation'
  | 'regulatory_compliance'
  | 'pharmacist_approval';

export type PrescriptionPriorityLevel = 1 | 2 | 3; // 1=normal, 2=urgent, 3=emergency

export type SourceChannel = 'web' | 'mobile' | 'whatsapp' | 'email';

export type OrderType = 'regular' | 'prescription' | 'emergency';

// Base prescription interface
export interface Prescription {
  id: string;
  user_id: string;
  prescription_number: string | null;
  
  // Doctor Information
  doctor_name: string;
  doctor_registration: string | null;
  doctor_phone: string | null;
  clinic_name: string | null;
  clinic_address: string | null;
  
  // Patient Information
  patient_name: string;
  patient_age: number | null;
  patient_gender: string | null;
  patient_phone: string | null;
  
  // Prescription Details
  prescription_date: string; // ISO date string
  expiry_date: string; // ISO date string
  diagnosis: string | null;
  symptoms: string | null;
  
  // Status and Processing
  status: PrescriptionStatus;
  priority_level: PrescriptionPriorityLevel;
  
  // File Information
  file_urls: string[]; // JSON array as string[]
  original_file_names: string[]; // JSON array as string[]
  file_sizes: number[]; // JSON array as number[]
  
  // OCR and Processing Results
  ocr_text: string | null;
  ocr_confidence: number | null;
  extracted_medicines: ExtractedMedicine[]; // JSON array
  processing_notes: string | null;
  
  // Validation Results
  validation_results: ValidationResults; // JSON object
  validation_score: number | null;
  rejection_reasons: string[] | null;
  
  // Pharmacist Review
  verified_by: string | null;
  verified_at: string | null; // ISO timestamp
  pharmacist_notes: string | null;
  
  // Analytics and Tracking
  source_channel: SourceChannel;
  location_data: LocationData | null; // JSON object
  device_info: DeviceInfo | null; // JSON object
  
  // Timestamps
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  processed_at: string | null; // ISO timestamp
}

// Insert type for prescriptions (for creating new prescriptions)
export interface PrescriptionInsert {
  user_id: string;
  doctor_name: string;
  patient_name: string;
  prescription_date: string;
  expiry_date: string;
  doctor_registration?: string;
  doctor_phone?: string;
  clinic_name?: string;
  clinic_address?: string;
  patient_age?: number;
  patient_gender?: string;
  patient_phone?: string;
  diagnosis?: string;
  symptoms?: string;
  priority_level?: PrescriptionPriorityLevel;
  source_channel?: SourceChannel;
  location_data?: LocationData;
  device_info?: DeviceInfo;
}

// Update type for prescriptions
export interface PrescriptionUpdate {
  doctor_name?: string;
  doctor_registration?: string;
  doctor_phone?: string;
  clinic_name?: string;
  clinic_address?: string;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  patient_phone?: string;
  prescription_date?: string;
  expiry_date?: string;
  diagnosis?: string;
  symptoms?: string;
  status?: PrescriptionStatus;
  priority_level?: PrescriptionPriorityLevel;
  file_urls?: string[];
  original_file_names?: string[];
  file_sizes?: number[];
  ocr_text?: string;
  ocr_confidence?: number;
  extracted_medicines?: ExtractedMedicine[];
  processing_notes?: string;
  validation_results?: ValidationResults;
  validation_score?: number;
  rejection_reasons?: string[];
  verified_by?: string;
  verified_at?: string;
  pharmacist_notes?: string;
  processed_at?: string;
}

// Prescription Medicine interface
export interface PrescriptionMedicine {
  id: string;
  prescription_id: string;
  
  // Medicine Information
  medicine_name: string;
  generic_name: string | null;
  brand_name: string | null;
  medicine_id: string | null; // Link to actual medicine
  
  // Prescription Details
  dosage: string;
  strength: string | null;
  frequency: string;
  duration: string | null;
  quantity_prescribed: number | null;
  route_of_administration: string | null;
  
  // Instructions
  before_after_food: string | null;
  special_instructions: string | null;
  warnings: string | null;
  
  // Availability and Pricing
  available: boolean;
  in_stock: boolean;
  price: number | null;
  discount_price: number | null;
  stock_quantity: number;
  
  // Alternative Suggestions
  alternatives: string[]; // Array of alternative medicine IDs
  generic_alternatives: string[]; // Array of generic alternative IDs
  
  // Processing Information
  extraction_method: string | null;
  confidence_score: number | null;
  requires_verification: boolean;
  verification_status: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Insert type for prescription medicines
export interface PrescriptionMedicineInsert {
  prescription_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  generic_name?: string;
  brand_name?: string;
  medicine_id?: string;
  strength?: string;
  duration?: string;
  quantity_prescribed?: number;
  route_of_administration?: string;
  before_after_food?: string;
  special_instructions?: string;
  warnings?: string;
  available?: boolean;
  in_stock?: boolean;
  price?: number;
  discount_price?: number;
  stock_quantity?: number;
  alternatives?: string[];
  generic_alternatives?: string[];
  extraction_method?: string;
  confidence_score?: number;
  requires_verification?: boolean;
  verification_status?: string;
}

// Prescription Validation Log interface
export interface PrescriptionValidationLog {
  id: string;
  prescription_id: string;
  validation_type: ValidationType;
  status: string; // passed, failed, warning
  validation_data: Record<string, any>; // JSON object
  error_details: Record<string, any>; // JSON object
  suggested_corrections: Record<string, any>; // JSON object
  validated_by: string | null;
  validator_type: string | null; // system, pharmacist, admin
  notes: string | null;
  severity_level: number; // 1=info, 2=warning, 3=error, 4=critical
  created_at: string;
}

// Prescription File Attachment interface
export interface PrescriptionFileAttachment {
  id: string;
  prescription_id: string;
  file_name: string;
  original_file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  processing_status: string; // pending, processing, completed, failed
  ocr_text: string | null;
  ocr_confidence: number | null;
  storage_bucket: string;
  storage_path: string;
  access_level: string; // private, restricted, public
  encryption_key: string | null;
  uploaded_at: string;
  processed_at: string | null;
}

// Supporting types and interfaces

export interface ExtractedMedicine {
  name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  duration?: string;
  quantity?: number;
  confidence: number;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ValidationResults {
  format_check: {
    passed: boolean;
    errors: string[];
    warnings: string[];
  };
  content_validation: {
    doctor_info_valid: boolean;
    patient_info_valid: boolean;
    prescription_date_valid: boolean;
    medicines_identified: boolean;
    readability_score: number;
  };
  medicine_validation: {
    medicines_found: number;
    medicines_validated: number;
    unrecognized_medicines: string[];
    controlled_substances: string[];
  };
  regulatory_compliance: {
    compliant: boolean;
    issues: string[];
    requirements_met: string[];
  };
}

export interface LocationData {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  ip_address?: string;
}

export interface DeviceInfo {
  user_agent?: string;
  device_type?: string; // mobile, tablet, desktop
  operating_system?: string;
  browser?: string;
  screen_resolution?: string;
  is_mobile?: boolean;
}

// Notification Preferences interface
export interface PrescriptionNotificationPreferences {
  id: string;
  user_id: string;
  
  // Notification Channels
  email_notifications: boolean;
  sms_notifications: boolean;
  whatsapp_notifications: boolean;
  push_notifications: boolean;
  
  // Notification Types
  upload_confirmation: boolean;
  processing_updates: boolean;
  validation_results: boolean;
  medicine_availability: boolean;
  order_updates: boolean;
  
  // Delivery Preferences
  notification_frequency: string; // immediate, daily, weekly
  quiet_hours_start: string | null; // HH:MM format
  quiet_hours_end: string | null; // HH:MM format
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Frontend Component Props Types

export interface PrescriptionUploadProps {
  onUpload: (files: File[]) => void;
  required?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

export interface PrescriptionStatusProps {
  prescription: Prescription;
  onStatusUpdate?: (prescriptionId: string, newStatus: PrescriptionStatus) => void;
  showActions?: boolean;
}

export interface MedicineMatchingProps {
  extractedMedicines: ExtractedMedicine[];
  onMedicineSelect: (medicines: PrescriptionMedicine[]) => void;
  onAlternativeSelect?: (medicineId: string, alternativeId: string) => void;
}

export interface PrescriptionReviewProps {
  prescription: Prescription;
  medicines: PrescriptionMedicine[];
  validationLogs: PrescriptionValidationLog[];
  onApprove: (prescriptionId: string, notes?: string) => void;
  onReject: (prescriptionId: string, reasons: string[], notes?: string) => void;
  onRequestMoreInfo: (prescriptionId: string, requirements: string[]) => void;
}

// API Response Types

export interface PrescriptionUploadResponse {
  success: boolean;
  prescription_id: string;
  message: string;
  processing_status: PrescriptionStatus;
  estimated_completion_time?: string;
}

export interface MedicineAvailabilityResponse {
  medicine_id: string;
  medicine_name: string;
  available: boolean;
  in_stock: boolean;
  stock_quantity: number;
  price: number;
  discount_price?: number;
  alternatives: Array<{
    id: string;
    name: string;
    price: number;
    availability: string;
  }>;
}

export interface PrescriptionAnalysisResponse {
  prescription_id: string;
  analysis_status: string;
  extracted_medicines: ExtractedMedicine[];
  validation_results: ValidationResults;
  confidence_score: number;
  requires_manual_review: boolean;
  estimated_processing_time: number; // in minutes
}

// Utility Types

export type PrescriptionWithMedicines = Prescription & {
  medicines: PrescriptionMedicine[];
  validation_logs: PrescriptionValidationLog[];
  file_attachments: PrescriptionFileAttachment[];
};

export type PrescriptionSummary = Pick<
  Prescription,
  'id' | 'prescription_number' | 'patient_name' | 'doctor_name' | 'status' | 'created_at' | 'prescription_date'
> & {
  medicine_count: number;
  total_amount?: number;
};

// Filter and Search Types

export interface PrescriptionFilters {
  status?: PrescriptionStatus[];
  date_range?: {
    start: string;
    end: string;
  };
  doctor_name?: string;
  patient_name?: string;
  priority_level?: PrescriptionPriorityLevel[];
  source_channel?: SourceChannel[];
  requires_verification?: boolean;
}

export interface PrescriptionSearchParams {
  query?: string;
  filters?: PrescriptionFilters;
  sort_by?: 'created_at' | 'prescription_date' | 'status' | 'priority_level';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Error Types

export interface PrescriptionError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationError extends PrescriptionError {
  validation_type: ValidationType;
  severity: 'info' | 'warning' | 'error' | 'critical';
  suggestions?: string[];
}

// Constants

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  uploaded: 'Uploaded',
  processing: 'Processing',
  review_required: 'Review Required',
  validated: 'Validated',
  rejected: 'Rejected',
  expired: 'Expired',
  fulfilled: 'Fulfilled'
};

export const PRESCRIPTION_PRIORITY_LABELS: Record<PrescriptionPriorityLevel, string> = {
  1: 'Normal',
  2: 'Urgent',
  3: 'Emergency'
};

export const VALIDATION_TYPE_LABELS: Record<ValidationType, string> = {
  format_validation: 'Format Validation',
  content_validation: 'Content Validation',
  medicine_validation: 'Medicine Validation',
  regulatory_compliance: 'Regulatory Compliance',
  pharmacist_approval: 'Pharmacist Approval'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES_PER_PRESCRIPTION = 10;
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
export const PRESCRIPTION_VALIDITY_MONTHS = 6;

export default {
  PRESCRIPTION_STATUS_LABELS,
  PRESCRIPTION_PRIORITY_LABELS,
  VALIDATION_TYPE_LABELS,
  MAX_FILE_SIZE,
  MAX_FILES_PER_PRESCRIPTION,
  ACCEPTED_FILE_TYPES,
  PRESCRIPTION_VALIDITY_MONTHS
};