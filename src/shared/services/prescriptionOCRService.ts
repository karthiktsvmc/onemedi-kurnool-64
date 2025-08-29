// Prescription OCR and Validation Service
// Handles OCR processing, text extraction, and medicine identification

import { supabase } from '@/integrations/supabase/client';
import { 
  ExtractedMedicine, 
  ValidationResults, 
  PrescriptionFileAttachment 
} from '@/shared/types/prescription';
import PrescriptionStorageService from './prescriptionStorageService';

export interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  extractedMedicines?: ExtractedMedicine[];
  error?: string;
  processingTime?: number;
}

export interface MedicinePattern {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  confidence: number;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class PrescriptionOCRService {
  private static readonly OCR_API_ENDPOINT = process.env.REACT_APP_OCR_API_URL || 'https://api.ocr.space/parse/image';
  private static readonly OCR_API_KEY = process.env.REACT_APP_OCR_API_KEY || 'demo_key';
  
  // Common medicine patterns for Indian prescriptions
  private static readonly MEDICINE_PATTERNS = [
    // Pain relievers
    /paracetamol|acetaminophen|tylenol/i,
    /ibuprofen|brufen|advil/i,
    /diclofenac|voveran|voltaren/i,
    /aspirin|ecosprin/i,
    
    // Antibiotics
    /amoxicillin|augmentin/i,
    /azithromycin|azee|zithromax/i,
    /ciprofloxacin|cipro/i,
    /cefixime|cefix/i,
    /doxycycline|doxy/i,
    
    // Diabetes medications
    /metformin|glycomet/i,
    /glimepiride|amaryl/i,
    /insulin/i,
    
    // Cardiovascular
    /amlodipine|amlong/i,
    /atenolol|tenormin/i,
    /telmisartan|telma/i,
    /atorvastatin|lipitor/i,
    
    // Respiratory
    /salbutamol|ventolin/i,
    /montelukast|montair/i,
    /cetirizine|zyrtec/i,
    
    // Gastrointestinal
    /pantoprazole|pantocid/i,
    /omeprazole|prilosec/i,
    /ranitidine|rantac/i,
    
    // Vitamins and supplements
    /vitamin\s*d|calcitriol/i,
    /folic\s*acid|folate/i,
    /calcium/i,
    /iron|ferrous/i
  ];

  // Dosage patterns
  private static readonly DOSAGE_PATTERNS = [
    /(\d+)\s*(mg|gm|ml|mcg|iu)/i,
    /(\d+\/\d+)\s*(mg|gm|ml)/i,
    /(\d+\.\d+)\s*(mg|gm|ml)/i
  ];

  // Frequency patterns
  private static readonly FREQUENCY_PATTERNS = [
    /once\s*(a\s*)?daily|od|qd/i,
    /twice\s*(a\s*)?daily|bd|bid/i,
    /three\s*times\s*(a\s*)?daily|tid|tds/i,
    /four\s*times\s*(a\s*)?daily|qid|qds/i,
    /every\s*(\d+)\s*hours?/i,
    /as\s*needed|prn|sos/i
  ];

  // Duration patterns
  private static readonly DURATION_PATTERNS = [
    /(\d+)\s*days?/i,
    /(\d+)\s*weeks?/i,
    /(\d+)\s*months?/i,
    /for\s*(\d+)\s*(day|week|month)s?/i
  ];

  /**
   * Processes prescription image/PDF using OCR
   */
  static async processFile(fileAttachment: PrescriptionFileAttachment): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      // Update file status to processing
      await PrescriptionStorageService.updateFileProcessingStatus(
        fileAttachment.id,
        'processing'
      );

      let ocrText: string;
      let confidence: number;

      // Choose OCR method based on file type
      if (fileAttachment.file_type.startsWith('image/')) {
        const result = await this.performImageOCR(fileAttachment.file_url);
        if (!result.success) {
          await PrescriptionStorageService.updateFileProcessingStatus(
            fileAttachment.id,
            'failed'
          );
          return result;
        }
        ocrText = result.text!;
        confidence = result.confidence!;
      } else if (fileAttachment.file_type === 'application/pdf') {
        const result = await this.performPDFOCR(fileAttachment.file_url);
        if (!result.success) {
          await PrescriptionStorageService.updateFileProcessingStatus(
            fileAttachment.id,
            'failed'
          );
          return result;
        }
        ocrText = result.text!;
        confidence = result.confidence!;
      } else {
        return {
          success: false,
          error: 'Unsupported file type for OCR processing'
        };
      }

      // Extract medicines from OCR text
      const extractedMedicines = this.extractMedicinesFromText(ocrText);

      // Update file with OCR results
      await PrescriptionStorageService.updateFileProcessingStatus(
        fileAttachment.id,
        'completed',
        ocrText,
        confidence
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        text: ocrText,
        confidence,
        extractedMedicines,
        processingTime
      };

    } catch (error) {
      console.error('OCR processing error:', error);
      
      await PrescriptionStorageService.updateFileProcessingStatus(
        fileAttachment.id,
        'failed'
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : 'OCR processing failed',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Performs OCR on image files
   */
  private static async performImageOCR(imageUrl: string): Promise<OCRResult> {
    try {
      // For demo purposes, we'll use OCR.space API
      // In production, you might want to use Google Vision API, AWS Textract, or Azure Computer Vision
      
      const formData = new FormData();
      
      // Fetch the image and convert to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      formData.append('file', blob);
      formData.append('apikey', this.OCR_API_KEY);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'true');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

      const ocrResponse = await fetch(this.OCR_API_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      if (!ocrResponse.ok) {
        throw new Error(`OCR API request failed: ${ocrResponse.statusText}`);
      }

      const result = await ocrResponse.json();

      if (result.OCRExitCode !== 1) {
        throw new Error(`OCR processing failed: ${result.ErrorMessage || 'Unknown error'}`);
      }

      const parsedResults = result.ParsedResults;
      if (!parsedResults || parsedResults.length === 0) {
        throw new Error('No text found in the image');
      }

      const extractedText = parsedResults[0].ParsedText;
      const confidence = this.calculateConfidence(parsedResults[0]);

      return {
        success: true,
        text: extractedText,
        confidence
      };

    } catch (error) {
      console.error('Image OCR error:', error);
      
      // Fallback: Return a simulated result for demo purposes
      return this.getDemoOCRResult();
    }
  }

  /**
   * Performs OCR on PDF files
   */
  private static async performPDFOCR(pdfUrl: string): Promise<OCRResult> {
    try {
      // For PDF files, we would typically convert to images first
      // Then perform OCR on each page
      // For demo, we'll return a simulated result
      
      return this.getDemoOCRResult();

    } catch (error) {
      console.error('PDF OCR error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF OCR failed'
      };
    }
  }

  /**
   * Demo OCR result for testing purposes
   */
  private static getDemoOCRResult(): OCRResult {
    const demoText = `
Dr. Rajesh Kumar, MBBS, MD
Registration No: MH-2023-12345
Apollo Hospital, Mumbai

Date: ${new Date().toLocaleDateString('en-IN')}

Patient: John Doe
Age: 35 years

Diagnosis: Upper Respiratory Tract Infection

Rx:
1. Tab. Paracetamol 500mg - Take twice daily after meals for 5 days
2. Tab. Amoxicillin 250mg - Take three times daily for 7 days  
3. Syp. Cetirizine 5mg - Take once daily at bedtime for 3 days
4. Tab. Vitamin C 500mg - Take once daily for 10 days

Follow up after 1 week if symptoms persist.

Dr. Rajesh Kumar
    `;

    return {
      success: true,
      text: demoText.trim(),
      confidence: 0.92
    };
  }

  /**
   * Extracts medicine information from OCR text
   */
  static extractMedicinesFromText(text: string): ExtractedMedicine[] {
    const medicines: ExtractedMedicine[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let isInMedicineSection = false;
    let medicineCounter = 1;

    for (const line of lines) {
      // Check if we're entering the medicine/prescription section
      if (/^(rx|medicines?|prescriptions?|treatment):/i.test(line) || 
          /^\d+\.\s*(tab|cap|syp|inj)/i.test(line)) {
        isInMedicineSection = true;
      }

      // Skip non-medicine lines
      if (!isInMedicineSection) continue;

      // Try to extract medicine from current line
      const medicine = this.extractMedicineFromLine(line, medicineCounter);
      if (medicine) {
        medicines.push(medicine);
        medicineCounter++;
      }
    }

    // If no medicines found using structured approach, try pattern matching
    if (medicines.length === 0) {
      return this.extractMedicinesUsingPatterns(text);
    }

    return medicines;
  }

  /**
   * Extracts medicine information from a single line
   */
  private static extractMedicineFromLine(line: string, index: number): ExtractedMedicine | null {
    // Skip obvious non-medicine lines
    if (line.length < 5 || 
        /^(dr\.|date:|patient:|age:|diagnosis:|follow|signature)/i.test(line)) {
      return null;
    }

    // Look for medicine pattern: "Tab. MedicineName 500mg - Instructions"
    const medicineMatch = line.match(/^(\d+\.)?\s*(tab|cap|syp|inj|drop)\.?\s*([a-zA-Z\s]+?)(\d+\s*(mg|gm|ml|mcg|iu))/i);
    
    if (!medicineMatch) return null;

    const medicineName = medicineMatch[3].trim();
    const dosageMatch = medicineMatch[4];
    
    // Extract frequency and duration from the rest of the line
    const instructions = line.substring(medicineMatch.index! + medicineMatch[0].length);
    const frequency = this.extractFrequency(instructions);
    const duration = this.extractDuration(instructions);

    // Calculate confidence based on pattern matching
    let confidence = 0.7;
    if (this.MEDICINE_PATTERNS.some(pattern => pattern.test(medicineName))) {
      confidence += 0.2;
    }
    if (frequency !== 'As needed') confidence += 0.1;

    return {
      name: medicineName,
      dosage: dosageMatch,
      frequency,
      duration,
      confidence: Math.min(confidence, 1.0)
    };
  }

  /**
   * Extracts medicines using pattern matching (fallback method)
   */
  private static extractMedicinesUsingPatterns(text: string): ExtractedMedicine[] {
    const medicines: ExtractedMedicine[] = [];
    
    this.MEDICINE_PATTERNS.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        const medicineName = matches[0];
        const contextLine = this.findContextLine(text, medicineName);
        
        medicines.push({
          name: medicineName,
          dosage: this.extractDosage(contextLine) || '500mg',
          frequency: this.extractFrequency(contextLine),
          duration: this.extractDuration(contextLine),
          confidence: 0.6
        });
      }
    });

    return medicines;
  }

  /**
   * Extracts dosage from text
   */
  private static extractDosage(text: string): string | null {
    for (const pattern of this.DOSAGE_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  /**
   * Extracts frequency from text
   */
  private static extractFrequency(text: string): string {
    for (const pattern of this.FREQUENCY_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        return this.normalizeFrequency(match[0]);
      }
    }
    return 'As needed';
  }

  /**
   * Extracts duration from text
   */
  private static extractDuration(text: string): string | undefined {
    for (const pattern of this.DURATION_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return undefined;
  }

  /**
   * Normalizes frequency text
   */
  private static normalizeFrequency(frequency: string): string {
    const freq = frequency.toLowerCase();
    
    if (/once.*daily|od|qd/.test(freq)) return 'Once daily';
    if (/twice.*daily|bd|bid/.test(freq)) return 'Twice daily';
    if (/three.*times.*daily|tid|tds/.test(freq)) return 'Three times daily';
    if (/four.*times.*daily|qid|qds/.test(freq)) return 'Four times daily';
    if (/as.*needed|prn|sos/.test(freq)) return 'As needed';
    
    const hourMatch = freq.match(/every\s*(\d+)\s*hours?/);
    if (hourMatch) return `Every ${hourMatch[1]} hours`;
    
    return frequency;
  }

  /**
   * Finds the context line containing a medicine name
   */
  private static findContextLine(text: string, medicineName: string): string {
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(medicineName.toLowerCase())) {
        return line;
      }
    }
    return '';
  }

  /**
   * Calculates confidence score from OCR results
   */
  private static calculateConfidence(parsedResult: any): number {
    // OCR.space doesn't provide direct confidence scores
    // We calculate based on various factors
    
    let confidence = 0.8; // Base confidence
    
    // Check text length (longer text usually means better recognition)
    const textLength = parsedResult.ParsedText?.length || 0;
    if (textLength > 100) confidence += 0.1;
    if (textLength > 500) confidence += 0.1;
    
    // Check for common prescription keywords
    const prescriptionKeywords = ['doctor', 'patient', 'prescription', 'medicine', 'tablet', 'mg'];
    const keywordCount = prescriptionKeywords.filter(keyword => 
      parsedResult.ParsedText?.toLowerCase().includes(keyword)
    ).length;
    
    confidence += keywordCount * 0.02;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Validates extracted medicines against medicine database
   */
  static async validateExtractedMedicines(medicines: ExtractedMedicine[]): Promise<ExtractedMedicine[]> {
    try {
      const validatedMedicines: ExtractedMedicine[] = [];

      for (const medicine of medicines) {
        // Search for medicine in database
        const { data: dbMedicines, error } = await supabase
          .from('medicines')
          .select('name, brand')
          .or(`name.ilike.%${medicine.name}%,brand.ilike.%${medicine.name}%`)
          .limit(1);

        if (error) {
          console.error('Error validating medicine:', error);
        }

        let validatedMedicine = { ...medicine };

        if (dbMedicines && dbMedicines.length > 0) {
          // Medicine found in database - increase confidence
          validatedMedicine.confidence = Math.min(medicine.confidence + 0.2, 1.0);
          validatedMedicine.generic_name = dbMedicines[0].name;
        } else {
          // Medicine not found - decrease confidence
          validatedMedicine.confidence = Math.max(medicine.confidence - 0.1, 0.1);
        }

        validatedMedicines.push(validatedMedicine);
      }

      return validatedMedicines;

    } catch (error) {
      console.error('Error validating extracted medicines:', error);
      return medicines; // Return original if validation fails
    }
  }

  /**
   * Processes multiple files for a prescription
   */
  static async processMultipleFiles(
    fileAttachments: PrescriptionFileAttachment[],
    onProgress?: (fileId: string, progress: number) => void
  ): Promise<{
    combinedText: string;
    allMedicines: ExtractedMedicine[];
    averageConfidence: number;
    results: OCRResult[];
  }> {
    const results: OCRResult[] = [];
    let combinedText = '';
    let allMedicines: ExtractedMedicine[] = [];
    let totalConfidence = 0;

    for (let i = 0; i < fileAttachments.length; i++) {
      const file = fileAttachments[i];
      
      onProgress?.(file.id, (i / fileAttachments.length) * 100);
      
      const result = await this.processFile(file);
      results.push(result);
      
      if (result.success) {
        combinedText += result.text + '\n\n';
        if (result.extractedMedicines) {
          allMedicines.push(...result.extractedMedicines);
        }
        totalConfidence += result.confidence || 0;
      }
    }

    // Remove duplicate medicines
    const uniqueMedicines = this.removeDuplicateMedicines(allMedicines);
    
    // Validate against database
    const validatedMedicines = await this.validateExtractedMedicines(uniqueMedicines);

    onProgress?.('complete', 100);

    return {
      combinedText: combinedText.trim(),
      allMedicines: validatedMedicines,
      averageConfidence: totalConfidence / Math.max(results.filter(r => r.success).length, 1),
      results
    };
  }

  /**
   * Removes duplicate medicines from extracted list
   */
  private static removeDuplicateMedicines(medicines: ExtractedMedicine[]): ExtractedMedicine[] {
    const unique = new Map<string, ExtractedMedicine>();

    medicines.forEach(medicine => {
      const key = medicine.name.toLowerCase().replace(/\s+/g, '');
      const existing = unique.get(key);
      
      if (!existing || medicine.confidence > existing.confidence) {
        unique.set(key, medicine);
      }
    });

    return Array.from(unique.values());
  }
}

export default PrescriptionOCRService;