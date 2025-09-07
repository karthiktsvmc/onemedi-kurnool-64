import { createWorker, Worker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  medicines: ExtractedMedicine[];
  dosages: ExtractedDosage[];
}

export interface ExtractedMedicine {
  name: string;
  confidence: number;
  position: { x: number; y: number; width: number; height: number };
}

export interface ExtractedDosage {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  confidence: number;
}

class OCRService {
  private worker: Worker | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.worker = await createWorker('eng');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      throw new Error('OCR initialization failed');
    }
  }

  async processImage(file: File): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize();
    }

    try {
      const { data } = await this.worker!.recognize(file);
      
      const medicines = this.extractMedicines(data.text);
      const dosages = this.extractDosages(data.text);

      return {
        text: data.text,
        confidence: data.confidence,
        medicines,
        dosages
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Failed to process prescription image');
    }
  }

  private extractMedicines(text: string): ExtractedMedicine[] {
    const medicines: ExtractedMedicine[] = [];
    
    // Common medicine patterns
    const medicinePatterns = [
      /(?:tab|tablet|cap|capsule|syrup|injection|drops?)\s+([a-z]+(?:\s+[a-z]+)*)/gi,
      /([a-z]+(?:\s+[a-z]+)*)\s+(?:\d+mg|\d+ml|\d+%)/gi,
      /R[x\/]\s*([a-z]+(?:\s+[a-z]+)*)/gi
    ];

    medicinePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const name = match[1]?.trim();
        if (name && name.length > 2 && !this.isCommonWord(name)) {
          medicines.push({
            name: this.capitalizeFirst(name),
            confidence: 0.8, // Base confidence
            position: { x: 0, y: 0, width: 0, height: 0 } // Position would need coordinate data from Tesseract
          });
        }
      }
    });

    return this.deduplicateMedicines(medicines);
  }

  private extractDosages(text: string): ExtractedDosage[] {
    const dosages: ExtractedDosage[] = [];
    const lines = text.split('\n');

    lines.forEach(line => {
      // Look for dosage patterns
      const dosagePattern = /(\w+(?:\s+\w+)*)\s+(\d+(?:\.\d+)?\s*(?:mg|ml|g|%|tabs?))\s+(?:(?:take|x|×)\s*)?(\d+)\s*(?:times?\s*)?(?:daily|per\s*day|od|bd|td|qid|q\d+h)?\s*(?:for\s+(\d+\s*(?:days?|weeks?|months?)))?/gi;
      
      const match = dosagePattern.exec(line);
      if (match) {
        dosages.push({
          medicine: this.capitalizeFirst(match[1]),
          dosage: match[2],
          frequency: match[3] + ' times daily',
          duration: match[4] || 'As prescribed',
          confidence: 0.7
        });
      }
    });

    return dosages;
  }

  private isCommonWord(word: string): boolean {
    const commonWords = ['the', 'and', 'for', 'take', 'daily', 'times', 'with', 'after', 'before', 'food', 'water'];
    return commonWords.includes(word.toLowerCase());
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private deduplicateMedicines(medicines: ExtractedMedicine[]): ExtractedMedicine[] {
    const unique = new Map<string, ExtractedMedicine>();
    
    medicines.forEach(med => {
      const key = med.name.toLowerCase();
      if (!unique.has(key) || unique.get(key)!.confidence < med.confidence) {
        unique.set(key, med);
      }
    });

    return Array.from(unique.values());
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

export const ocrService = new OCRService();