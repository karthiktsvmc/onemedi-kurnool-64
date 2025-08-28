// Medicine Matching Service
// Handles medicine availability checking, alternative suggestions, and pricing

import { supabase } from '@/integrations/supabase/client';
import { 
  ExtractedMedicine, 
  PrescriptionMedicine,
  PrescriptionMedicineInsert 
} from '@/shared/types/prescription';

export interface MedicineMatch {
  id: string;
  name: string;
  brand: string;
  generic_name?: string;
  mrp: number;
  sale_price: number;
  stock_qty: number;
  available: boolean;
  prescription_required: boolean;
  match_confidence: number;
  match_type: 'exact' | 'generic' | 'brand' | 'similar';
  dosage_match: boolean;
  category: string;
  image_url?: string;
}

export interface AlternativeMedicine {
  id: string;
  name: string;
  brand: string;
  type: 'generic' | 'brand' | 'therapeutic';
  price_difference: number;
  price_percentage: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  stock_qty: number;
  prescription_required: boolean;
  reason: string;
}

export interface MedicineAvailabilityResult {
  extracted_medicine: ExtractedMedicine;
  primary_match: MedicineMatch | null;
  alternatives: AlternativeMedicine[];
  total_matches: number;
  availability_status: 'available' | 'alternatives_available' | 'not_available';
  estimated_price: number;
  requires_prescription: boolean;
}

export class MedicineMatchingService {
  
  /**
   * Matches extracted medicines with available medicines in the database
   */
  static async matchExtractedMedicines(
    extractedMedicines: ExtractedMedicine[]
  ): Promise<MedicineAvailabilityResult[]> {
    const results: MedicineAvailabilityResult[] = [];

    for (const extractedMedicine of extractedMedicines) {
      const result = await this.findMedicineMatches(extractedMedicine);
      results.push(result);
    }

    return results;
  }

  /**
   * Finds matches for a single extracted medicine
   */
  static async findMedicineMatches(
    extractedMedicine: ExtractedMedicine
  ): Promise<MedicineAvailabilityResult> {
    try {
      // Search for exact matches first
      const exactMatches = await this.searchExactMatches(extractedMedicine.name);
      
      // Search for generic matches
      const genericMatches = await this.searchGenericMatches(extractedMedicine.name);
      
      // Search for brand matches
      const brandMatches = await this.searchBrandMatches(extractedMedicine.name);
      
      // Search for similar medicines
      const similarMatches = await this.searchSimilarMedicines(extractedMedicine.name);

      // Combine and rank all matches
      const allMatches = [
        ...exactMatches.map(m => ({ ...m, match_type: 'exact' as const, match_confidence: 1.0 })),
        ...genericMatches.map(m => ({ ...m, match_type: 'generic' as const, match_confidence: 0.9 })),
        ...brandMatches.map(m => ({ ...m, match_type: 'brand' as const, match_confidence: 0.8 })),
        ...similarMatches.map(m => ({ ...m, match_type: 'similar' as const, match_confidence: 0.6 }))
      ];

      // Filter and rank matches
      const rankedMatches = this.rankMatches(allMatches, extractedMedicine);
      
      // Get primary match (best match)
      const primaryMatch = rankedMatches.length > 0 ? rankedMatches[0] : null;
      
      // Find alternatives
      const alternatives = await this.findAlternatives(
        primaryMatch,
        extractedMedicine,
        rankedMatches.slice(1, 6) // Top 5 alternatives
      );

      // Determine availability status
      const availabilityStatus = this.determineAvailabilityStatus(primaryMatch, alternatives);
      
      // Estimate price
      const estimatedPrice = this.estimatePrice(primaryMatch, alternatives);
      
      // Check if prescription is required
      const requiresPrescription = primaryMatch?.prescription_required || 
        alternatives.some(alt => alt.prescription_required) || 
        this.isPrescriptionRequiredMedicine(extractedMedicine.name);

      return {
        extracted_medicine: extractedMedicine,
        primary_match: primaryMatch,
        alternatives,
        total_matches: rankedMatches.length,
        availability_status: availabilityStatus,
        estimated_price: estimatedPrice,
        requires_prescription: requiresPrescription
      };

    } catch (error) {
      console.error('Error matching medicine:', extractedMedicine.name, error);
      
      return {
        extracted_medicine: extractedMedicine,
        primary_match: null,
        alternatives: [],
        total_matches: 0,
        availability_status: 'not_available',
        estimated_price: 0,
        requires_prescription: false
      };
    }
  }

  /**
   * Searches for exact medicine name matches
   */
  private static async searchExactMatches(medicineName: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        id, name, brand, mrp, sale_price, stock_qty, prescription_required,
        medicine_categories(name),
        medicine_brands(name)
      `)
      .ilike('name', medicineName)
      .eq('featured', true)
      .order('stock_qty', { ascending: false });

    if (error) {
      console.error('Error searching exact matches:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Searches for generic medicine matches
   */
  private static async searchGenericMatches(medicineName: string): Promise<any[]> {
    // Extract active ingredient from medicine name
    const activeIngredient = this.extractActiveIngredient(medicineName);
    
    if (!activeIngredient) return [];

    const { data, error } = await supabase
      .from('medicines')
      .select(`
        id, name, brand, mrp, sale_price, stock_qty, prescription_required,
        medicine_categories(name),
        medicine_brands(name)
      `)
      .or(`name.ilike.%${activeIngredient}%,tags.cs.{${activeIngredient.toLowerCase()}}`)
      .eq('featured', true)
      .order('sale_price', { ascending: true });

    if (error) {
      console.error('Error searching generic matches:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Searches for brand medicine matches
   */
  private static async searchBrandMatches(medicineName: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        id, name, brand, mrp, sale_price, stock_qty, prescription_required,
        medicine_categories(name),
        medicine_brands(name)
      `)
      .ilike('brand', `%${medicineName}%`)
      .eq('featured', true)
      .order('stock_qty', { ascending: false });

    if (error) {
      console.error('Error searching brand matches:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Searches for similar medicines using text similarity
   */
  private static async searchSimilarMedicines(medicineName: string): Promise<any[]> {
    // Use PostgreSQL's similarity functions if available
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        id, name, brand, mrp, sale_price, stock_qty, prescription_required,
        medicine_categories(name),
        medicine_brands(name)
      `)
      .textSearch('name', medicineName)
      .eq('featured', true)
      .limit(5);

    if (error) {
      console.error('Error searching similar medicines:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Ranks medicine matches based on various factors
   */
  private static rankMatches(matches: any[], extractedMedicine: ExtractedMedicine): MedicineMatch[] {
    return matches
      .map(match => ({
        id: match.id,
        name: match.name,
        brand: match.brand,
        generic_name: match.generic_name,
        mrp: match.mrp,
        sale_price: match.sale_price,
        stock_qty: match.stock_qty,
        available: match.stock_qty > 0,
        prescription_required: match.prescription_required,
        match_confidence: this.calculateMatchConfidence(match, extractedMedicine),
        match_type: match.match_type,
        dosage_match: this.checkDosageMatch(match.name, extractedMedicine.dosage),
        category: match.medicine_categories?.name || 'General',
        image_url: match.image_url
      }))
      .sort((a, b) => {
        // Primary sort by availability
        if (a.available !== b.available) {
          return b.available ? 1 : -1;
        }
        
        // Secondary sort by match confidence
        if (a.match_confidence !== b.match_confidence) {
          return b.match_confidence - a.match_confidence;
        }
        
        // Tertiary sort by dosage match
        if (a.dosage_match !== b.dosage_match) {
          return b.dosage_match ? 1 : -1;
        }
        
        // Final sort by price (lower is better)
        return a.sale_price - b.sale_price;
      });
  }

  /**
   * Calculates match confidence based on name similarity and other factors
   */
  private static calculateMatchConfidence(match: any, extractedMedicine: ExtractedMedicine): number {
    let confidence = match.match_confidence || 0.5;
    
    // Boost confidence for exact name matches
    if (match.name.toLowerCase() === extractedMedicine.name.toLowerCase()) {
      confidence += 0.3;
    }
    
    // Boost confidence for dosage matches
    if (this.checkDosageMatch(match.name, extractedMedicine.dosage)) {
      confidence += 0.1;
    }
    
    // Boost confidence for in-stock medicines
    if (match.stock_qty > 0) {
      confidence += 0.1;
    }
    
    // Boost confidence for featured medicines
    if (match.featured) {
      confidence += 0.05;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Checks if dosage matches between extracted medicine and database medicine
   */
  private static checkDosageMatch(medicineName: string, extractedDosage: string): boolean {
    if (!extractedDosage) return false;
    
    // Extract dosage from medicine name or description
    const dosagePattern = /(\d+(?:\.\d+)?)\s*(mg|gm|ml|mcg|iu)/i;
    const medicineMatch = medicineName.match(dosagePattern);
    const extractedMatch = extractedDosage.match(dosagePattern);
    
    if (!medicineMatch || !extractedMatch) return false;
    
    return medicineMatch[1] === extractedMatch[1] && 
           medicineMatch[2].toLowerCase() === extractedMatch[2].toLowerCase();
  }

  /**
   * Finds alternative medicines
   */
  private static async findAlternatives(
    primaryMatch: MedicineMatch | null,
    extractedMedicine: ExtractedMedicine,
    otherMatches: MedicineMatch[]
  ): Promise<AlternativeMedicine[]> {
    const alternatives: AlternativeMedicine[] = [];
    
    // Add alternatives from other matches
    otherMatches.forEach(match => {
      if (match.id !== primaryMatch?.id) {
        const alternative: AlternativeMedicine = {
          id: match.id,
          name: match.name,
          brand: match.brand,
          type: this.determineAlternativeType(match, primaryMatch),
          price_difference: primaryMatch ? match.sale_price - primaryMatch.sale_price : 0,
          price_percentage: primaryMatch ? 
            ((match.sale_price - primaryMatch.sale_price) / primaryMatch.sale_price) * 100 : 0,
          availability: this.getAvailabilityStatus(match.stock_qty),
          stock_qty: match.stock_qty,
          prescription_required: match.prescription_required,
          reason: this.getAlternativeReason(match, primaryMatch)
        };
        
        alternatives.push(alternative);
      }
    });

    // Find generic alternatives if primary is brand
    if (primaryMatch && primaryMatch.match_type === 'brand') {
      const genericAlternatives = await this.findGenericAlternatives(primaryMatch);
      alternatives.push(...genericAlternatives);
    }

    // Sort alternatives by preference (availability, price, etc.)
    return alternatives
      .sort((a, b) => {
        // Prefer available medicines
        if (a.availability !== b.availability) {
          if (a.availability === 'in_stock') return -1;
          if (b.availability === 'in_stock') return 1;
        }
        
        // Prefer cheaper alternatives
        return a.price_difference - b.price_difference;
      })
      .slice(0, 5); // Limit to top 5 alternatives
  }

  /**
   * Finds generic alternatives for a brand medicine
   */
  private static async findGenericAlternatives(brandMedicine: MedicineMatch): Promise<AlternativeMedicine[]> {
    const activeIngredient = this.extractActiveIngredient(brandMedicine.name);
    if (!activeIngredient) return [];

    const { data, error } = await supabase
      .from('medicines')
      .select('id, name, brand, sale_price, stock_qty, prescription_required')
      .ilike('name', `%${activeIngredient}%`)
      .neq('id', brandMedicine.id)
      .lt('sale_price', brandMedicine.sale_price)
      .order('sale_price', { ascending: true })
      .limit(3);

    if (error || !data) return [];

    return data.map(medicine => ({
      id: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      type: 'generic' as const,
      price_difference: medicine.sale_price - brandMedicine.sale_price,
      price_percentage: ((medicine.sale_price - brandMedicine.sale_price) / brandMedicine.sale_price) * 100,
      availability: this.getAvailabilityStatus(medicine.stock_qty),
      stock_qty: medicine.stock_qty,
      prescription_required: medicine.prescription_required,
      reason: `Generic alternative - Save ₹${(brandMedicine.sale_price - medicine.sale_price).toFixed(2)}`
    }));
  }

  /**
   * Extracts active ingredient from medicine name
   */
  private static extractActiveIngredient(medicineName: string): string | null {
    // Common patterns for extracting active ingredients
    const patterns = [
      /^([a-zA-Z]+)(?:\s+\d+(?:mg|gm|ml))?/i, // Extract first word before dosage
      /([a-zA-Z]+)$/i // Last word if no dosage
    ];

    for (const pattern of patterns) {
      const match = medicineName.match(pattern);
      if (match && match[1].length > 3) { // Ignore very short matches
        return match[1].toLowerCase();
      }
    }

    return null;
  }

  /**
   * Determines alternative type
   */
  private static determineAlternativeType(
    alternative: MedicineMatch, 
    primary: MedicineMatch | null
  ): 'generic' | 'brand' | 'therapeutic' {
    if (!primary) return 'therapeutic';
    
    if (alternative.sale_price < primary.sale_price) return 'generic';
    if (alternative.brand !== primary.brand) return 'brand';
    return 'therapeutic';
  }

  /**
   * Gets availability status based on stock quantity
   */
  private static getAvailabilityStatus(stockQty: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (stockQty === 0) return 'out_of_stock';
    if (stockQty < 10) return 'low_stock';
    return 'in_stock';
  }

  /**
   * Gets reason for alternative suggestion
   */
  private static getAlternativeReason(
    alternative: MedicineMatch, 
    primary: MedicineMatch | null
  ): string {
    if (!primary) return 'Similar medicine';
    
    if (alternative.sale_price < primary.sale_price) {
      const savings = primary.sale_price - alternative.sale_price;
      return `Save ₹${savings.toFixed(2)} (${((savings / primary.sale_price) * 100).toFixed(1)}% cheaper)`;
    }
    
    if (alternative.stock_qty > primary.stock_qty) {
      return 'Better availability';
    }
    
    if (alternative.match_confidence > primary.match_confidence) {
      return 'Better match for your prescription';
    }
    
    return 'Alternative option';
  }

  /**
   * Determines overall availability status
   */
  private static determineAvailabilityStatus(
    primaryMatch: MedicineMatch | null,
    alternatives: AlternativeMedicine[]
  ): 'available' | 'alternatives_available' | 'not_available' {
    if (primaryMatch?.available) {
      return 'available';
    }
    
    if (alternatives.some(alt => alt.availability === 'in_stock')) {
      return 'alternatives_available';
    }
    
    return 'not_available';
  }

  /**
   * Estimates price for the medicine
   */
  private static estimatePrice(
    primaryMatch: MedicineMatch | null,
    alternatives: AlternativeMedicine[]
  ): number {
    if (primaryMatch?.available) {
      return primaryMatch.sale_price;
    }
    
    const availableAlternative = alternatives.find(alt => alt.availability === 'in_stock');
    if (availableAlternative) {
      return primaryMatch ? primaryMatch.sale_price + availableAlternative.price_difference : 0;
    }
    
    return primaryMatch?.sale_price || 0;
  }

  /**
   * Checks if medicine typically requires prescription
   */
  private static isPrescriptionRequiredMedicine(medicineName: string): boolean {
    const prescriptionMedicines = [
      'antibiotic', 'insulin', 'steroid', 'controlled', 'narcotic',
      'amoxicillin', 'azithromycin', 'ciprofloxacin', 'doxycycline'
    ];
    
    const lowerName = medicineName.toLowerCase();
    return prescriptionMedicines.some(keyword => lowerName.includes(keyword));
  }

  /**
   * Creates prescription medicine records from availability results
   */
  static async createPrescriptionMedicines(
    prescriptionId: string,
    availabilityResults: MedicineAvailabilityResult[]
  ): Promise<PrescriptionMedicine[]> {
    const medicineInserts: PrescriptionMedicineInsert[] = [];

    for (const result of availabilityResults) {
      const primaryMatch = result.primary_match;
      const extracted = result.extracted_medicine;

      const medicineInsert: PrescriptionMedicineInsert = {
        prescription_id: prescriptionId,
        medicine_name: extracted.name,
        generic_name: extracted.generic_name,
        medicine_id: primaryMatch?.id,
        dosage: extracted.dosage,
        frequency: extracted.frequency,
        duration: extracted.duration,
        quantity_prescribed: extracted.quantity,
        available: result.availability_status !== 'not_available',
        in_stock: primaryMatch?.available || false,
        price: result.estimated_price,
        stock_quantity: primaryMatch?.stock_qty || 0,
        alternatives: result.alternatives.map(alt => alt.id),
        extraction_method: 'ocr',
        confidence_score: extracted.confidence,
        requires_verification: extracted.confidence < 0.8 || result.availability_status === 'not_available',
        verification_status: extracted.confidence >= 0.8 && result.availability_status === 'available' ? 'verified' : 'pending'
      };

      medicineInserts.push(medicineInsert);
    }

    // Insert into database
    const { data, error } = await supabase
      .from('prescription_medicines')
      .insert(medicineInserts)
      .select();

    if (error) {
      console.error('Error creating prescription medicines:', error);
      throw new Error(`Failed to create prescription medicines: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Updates medicine availability in real-time
   */
  static async updateMedicineAvailability(
    medicineId: string,
    updates: {
      stock_qty?: number;
      available?: boolean;
      price?: number;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('medicines')
        .update(updates)
        .eq('id', medicineId);

      if (error) {
        console.error('Error updating medicine availability:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating medicine availability:', error);
      return false;
    }
  }

  /**
   * Gets real-time stock information for medicines
   */
  static async getStockInformation(medicineIds: string[]): Promise<Map<string, number>> {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('id, stock_qty')
        .in('id', medicineIds);

      if (error) {
        console.error('Error getting stock information:', error);
        return new Map();
      }

      const stockMap = new Map<string, number>();
      data?.forEach(medicine => {
        stockMap.set(medicine.id, medicine.stock_qty);
      });

      return stockMap;
    } catch (error) {
      console.error('Error getting stock information:', error);
      return new Map();
    }
  }
}

export default MedicineMatchingService;