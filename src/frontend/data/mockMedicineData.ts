// Mock data structure ready for Supabase integration
// This will be replaced with real-time Supabase queries

export const mockMedicineData = {
  id: "med-001",
  name: "Paracetamol 500mg",
  genericName: "Acetaminophen",
  manufacturer: "Cipla Ltd.",
  composition: "Paracetamol 500mg",
  packSize: "10 tablets per strip",
  prescriptionRequired: false,
  inStock: true,
  verifiedByPharmacist: true,
  
  // Variants for pack sizes
  variants: [
    {
      id: "var-1",
      name: "1 Strip (10 tablets)",
      price: 25,
      originalPrice: 35,
      inStock: true
    },
    {
      id: "var-2", 
      name: "3 Strips (30 tablets)",
      price: 65,
      originalPrice: 85,
      inStock: true
    },
    {
      id: "var-3",
      name: "10 Strips (100 tablets)",
      price: 200,
      originalPrice: 250,
      inStock: false
    }
  ],

  // Product details for tabs
  description: "Paracetamol is a widely used over-the-counter pain reliever and fever reducer. It's effective for mild to moderate pain including headaches, muscle aches, and fever.",
  
  uses: [
    "Relief from mild to moderate pain",
    "Reduction of fever",
    "Treatment of headaches and migraines", 
    "Relief from muscle aches and pains",
    "Treatment of cold and flu symptoms"
  ],

  dosage: "Adults and children over 12 years: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours. Children 6-12 years: Half to one tablet every 4-6 hours.",

  sideEffects: [
    "Nausea",
    "Stomach upset", 
    "Allergic reactions",
    "Skin rash",
    "Liver damage (with overdose)"
  ],

  warnings: [
    "Do not exceed the recommended dose",
    "Avoid alcohol while taking this medication",
    "Consult doctor if symptoms persist beyond 3 days",
    "Not suitable for children under 6 years without medical advice"
  ],

  ingredients: [
    "Paracetamol 500mg (Active)",
    "Microcrystalline Cellulose",
    "Starch",
    "Povidone", 
    "Magnesium Stearate",
    "Talc"
  ],

  howToUse: [
    "Take with a full glass of water",
    "Can be taken with or without food",
    "Swallow tablets whole, do not crush or chew",
    "Maintain 4-6 hour gaps between doses",
    "Store in a cool, dry place"
  ],

  safetyInfo: [
    "Read the label carefully before use",
    "Keep out of reach of children",
    "Do not use if allergic to paracetamol",
    "Consult healthcare provider if pregnant or breastfeeding"
  ],

  storageInstructions: [
    "Store below 30°C in a dry place",
    "Protect from direct sunlight",
    "Keep in original packaging",
    "Do not use after expiry date"
  ],

  expertAdvice: [
    "Take this medication exactly as prescribed by your doctor",
    "Never exceed the maximum daily dose to avoid liver damage",
    "Inform your pharmacist about any other medications you're taking",
    "Perfect for fever reduction in viral infections like cold and flu"
  ],

  // Alternatives
  alternatives: [
    {
      id: "alt-1",
      name: "Crocin 500mg",
      manufacturer: "GSK",
      price: 22,
      originalPrice: 30,
      rating: 4.5,
      reviewCount: 1240,
      image: "/api/placeholder/100/100",
      composition: "Paracetamol 500mg",
      savingsAmount: 3,
      inStock: true
    },
    {
      id: "alt-2", 
      name: "Dolo 500mg",
      manufacturer: "Micro Labs",
      price: 18,
      originalPrice: 28,
      rating: 4.3,
      reviewCount: 890,
      image: "/api/placeholder/100/100", 
      composition: "Paracetamol 500mg",
      savingsAmount: 7,
      inStock: true
    }
  ],

  // Reviews
  averageRating: 4.4,
  totalReviews: 2840,
  ratingBreakdown: [
    { rating: 5, count: 1420, percentage: 50 },
    { rating: 4, count: 852, percentage: 30 },
    { rating: 3, count: 426, percentage: 15 },
    { rating: 2, count: 142, percentage: 5 },
    { rating: 1, count: 0, percentage: 0 }
  ],

  reviews: [
    {
      id: "rev-1",
      userName: "Priya S.",
      rating: 5,
      comment: "Very effective for fever and headaches. Quick relief and no side effects.",
      date: "2024-01-15",
      verified: true,
      helpful: 12,
      images: []
    },
    {
      id: "rev-2",
      userName: "Rajesh K.", 
      rating: 4,
      comment: "Good quality medicine. Works well for pain relief. Fast delivery too.",
      date: "2024-01-10",
      verified: true,
      helpful: 8,
      images: []
    }
  ],

  // Frequently bought together
  bundleItems: [
    {
      id: "bundle-1",
      name: "Vitamin C Tablets",
      image: "/api/placeholder/100/100",
      price: 120,
      originalPrice: 150,
      category: "supplement" as const
    },
    {
      id: "bundle-2",
      name: "Digital Thermometer", 
      image: "/api/placeholder/100/100",
      price: 180,
      originalPrice: 220,
      category: "device" as const
    }
  ]
};

// Supabase table structures (for reference)
export interface ProductTable {
  id: string;
  name: string;
  generic_name?: string;
  manufacturer: string;
  composition: string;
  pack_size: string;
  prescription_required: boolean;
  verified_by_pharmacist: boolean;
  description: string;
  uses: string[];
  dosage: string;
  side_effects: string[];
  warnings: string[];
  ingredients: string[];
  how_to_use: string[];
  safety_info: string[];
  storage_instructions: string[];
  expert_advice: string[];
  created_at: string;
  updated_at: string;
}

export interface StockLevelsTable {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  updated_at: string;
}

export interface ProductReviewsTable {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}