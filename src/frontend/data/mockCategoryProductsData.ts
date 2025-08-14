// Enhanced Product Data for Categories
// This will be replaced with real-time Supabase queries

export interface PackSize {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: string;
  inStock: boolean;
  discount?: number;
}

export interface Alternative {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  composition: string;
  rating: number;
  reviewCount: number;
  image: string;
  savingsAmount: number;
  inStock: boolean;
  type: 'generic' | 'branded';
}

export interface Offer {
  id: string;
  type: 'discount' | 'combo' | 'freebie' | 'bogo';
  title: string;
  description: string;
  value: number;
  expiryDate: string;
  minOrderValue?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface EnhancedMedicineProduct {
  id: string;
  name: string;
  genericName?: string;
  brand: string;
  manufacturer: string;
  category: string;
  subCategory: string;
  composition: string;
  packSizes: PackSize[];
  prescriptionRequired: boolean;
  genericAlternatives?: Alternative[];
  brandedAlternatives?: Alternative[];
  healthConcerns: string[];
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
  dosageForm: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream';
  scheduleDrug: boolean;
  fastDelivery: boolean;
  sameDay: boolean;
  deliveryDate?: string;
  offers: Offer[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  inStock: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  freeDelivery?: boolean;
}

export const painReliefProducts: EnhancedMedicineProduct[] = [
  {
    id: "paracetamol-500",
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    brand: "Cipla",
    manufacturer: "Cipla Ltd.",
    category: "pain-relief",
    subCategory: "Headache",
    composition: "Paracetamol 500mg",
    packSizes: [
      {
        id: "pack-1",
        name: "1 Strip (10 tablets)",
        price: 25,
        originalPrice: 35,
        quantity: "10 tablets",
        inStock: true,
        discount: 29
      },
      {
        id: "pack-2",
        name: "3 Strips (30 tablets)",
        price: 65,
        originalPrice: 85,
        quantity: "30 tablets",
        inStock: true,
        discount: 24
      }
    ],
    prescriptionRequired: false,
    genericAlternatives: [
      {
        id: "crocin-500",
        name: "Crocin 500mg",
        brand: "GSK",
        price: 22,
        originalPrice: 30,
        composition: "Paracetamol 500mg",
        rating: 4.5,
        reviewCount: 1240,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop",
        savingsAmount: 3,
        inStock: true,
        type: 'generic'
      }
    ],
    healthConcerns: ["Headache", "Fever", "Body Pain"],
    uses: ["Pain relief", "Fever reduction", "Headache treatment"],
    sideEffects: ["Nausea", "Stomach upset", "Allergic reactions"],
    contraindications: ["Liver disease", "Alcohol dependency"],
    dosageForm: 'tablet',
    scheduleDrug: false,
    fastDelivery: true,
    sameDay: true,
    deliveryDate: "Today",
    offers: [
      {
        id: "offer-1",
        type: "discount",
        title: "29% OFF",
        description: "Save ₹10 on your first order",
        value: 29,
        expiryDate: "2024-12-31"
      }
    ],
    reviews: [
      {
        id: "review-1",
        userName: "Priya S.",
        rating: 5,
        comment: "Very effective for fever and headaches. Quick relief.",
        date: "2024-01-15",
        verified: true,
        helpful: 12
      }
    ],
    rating: 4.4,
    reviewCount: 2840,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop"
    ],
    description: "Effective pain reliever and fever reducer for common ailments",
    inStock: true,
    trending: true,
    bestSeller: true,
    freeDelivery: true
  },
  {
    id: "ibuprofen-400",
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    brand: "Abbott",
    manufacturer: "Abbott Healthcare",
    category: "pain-relief",
    subCategory: "Body Pain",
    composition: "Ibuprofen 400mg",
    packSizes: [
      {
        id: "pack-1",
        name: "1 Strip (10 tablets)",
        price: 45,
        originalPrice: 60,
        quantity: "10 tablets",
        inStock: true,
        discount: 25
      }
    ],
    prescriptionRequired: false,
    healthConcerns: ["Body Pain", "Inflammation", "Joint Pain"],
    uses: ["Anti-inflammatory", "Pain relief", "Fever reduction"],
    sideEffects: ["Stomach irritation", "Dizziness", "Nausea"],
    contraindications: ["Stomach ulcers", "Kidney disease"],
    dosageForm: 'tablet',
    scheduleDrug: false,
    fastDelivery: true,
    sameDay: false,
    deliveryDate: "Tomorrow",
    offers: [],
    reviews: [],
    rating: 4.2,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop"
    ],
    description: "Anti-inflammatory pain reliever for body aches and inflammation",
    inStock: true,
    freeDelivery: false
  },
  {
    id: "aspirin-75",
    name: "Aspirin 75mg",
    genericName: "Acetylsalicylic Acid",
    brand: "Bayer",
    manufacturer: "Bayer Pharmaceuticals",
    category: "pain-relief",
    subCategory: "Heart Health",
    composition: "Acetylsalicylic Acid 75mg",
    packSizes: [
      {
        id: "pack-1",
        name: "1 Strip (10 tablets)",
        price: 35,
        originalPrice: 45,
        quantity: "10 tablets",
        inStock: true,
        discount: 22
      }
    ],
    prescriptionRequired: true,
    healthConcerns: ["Heart Health", "Blood Clots", "Stroke Prevention"],
    uses: ["Blood thinner", "Heart protection", "Stroke prevention"],
    sideEffects: ["Stomach bleeding", "Bruising", "Heartburn"],
    contraindications: ["Bleeding disorders", "Stomach ulcers"],
    dosageForm: 'tablet',
    scheduleDrug: false,
    fastDelivery: true,
    sameDay: false,
    deliveryDate: "Tomorrow",
    offers: [],
    reviews: [],
    rating: 4.6,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop"
    ],
    description: "Low-dose aspirin for cardiovascular protection",
    inStock: true,
    bestSeller: true,
    freeDelivery: true
  }
];

export const diabetesCareProducts: EnhancedMedicineProduct[] = [
  {
    id: "metformin-500",
    name: "Metformin 500mg",
    genericName: "Metformin HCl",
    brand: "Sun Pharma",
    manufacturer: "Sun Pharmaceutical",
    category: "diabetes-care",
    subCategory: "Blood Sugar Management",
    composition: "Metformin Hydrochloride 500mg",
    packSizes: [
      {
        id: "pack-1",
        name: "1 Strip (10 tablets)",
        price: 18,
        originalPrice: 25,
        quantity: "10 tablets",
        inStock: true,
        discount: 28
      },
      {
        id: "pack-2",
        name: "10 Strips (100 tablets)",
        price: 150,
        originalPrice: 200,
        quantity: "100 tablets",
        inStock: true,
        discount: 25
      }
    ],
    prescriptionRequired: true,
    healthConcerns: ["Type 2 Diabetes", "Blood Sugar Control", "Insulin Resistance"],
    uses: ["Blood sugar control", "Type 2 diabetes management", "PCOS treatment"],
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
    dosageForm: 'tablet',
    scheduleDrug: false,
    fastDelivery: true,
    sameDay: true,
    deliveryDate: "Today",
    offers: [
      {
        id: "offer-1",
        type: "discount",
        title: "28% OFF",
        description: "Bulk discount on 100 tablets",
        value: 28,
        expiryDate: "2024-12-31",
        minOrderValue: 100
      }
    ],
    reviews: [
      {
        id: "review-1",
        userName: "Rajesh K.",
        rating: 5,
        comment: "Excellent for blood sugar control. No side effects.",
        date: "2024-01-10",
        verified: true,
        helpful: 24
      }
    ],
    rating: 4.7,
    reviewCount: 1560,
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop"
    ],
    description: "First-line medication for Type 2 diabetes management",
    inStock: true,
    trending: true,
    bestSeller: true,
    freeDelivery: true
  }
];

export const skinCareProducts: EnhancedMedicineProduct[] = [
  {
    id: "acne-cream",
    name: "Acne Clear Gel",
    brand: "Himalaya",
    manufacturer: "Himalaya Drug Company",
    category: "skin-care",
    subCategory: "Acne Treatment",
    composition: "Benzoyl Peroxide 2.5%, Niacinamide 2%",
    packSizes: [
      {
        id: "pack-1",
        name: "20g Tube",
        price: 125,
        originalPrice: 150,
        quantity: "20g",
        inStock: true,
        discount: 17
      }
    ],
    prescriptionRequired: false,
    healthConcerns: ["Acne", "Pimples", "Oily Skin"],
    uses: ["Acne treatment", "Pimple reduction", "Oil control"],
    sideEffects: ["Skin dryness", "Mild irritation", "Peeling"],
    contraindications: ["Sensitive skin", "Open wounds"],
    dosageForm: 'cream',
    scheduleDrug: false,
    fastDelivery: true,
    sameDay: false,
    deliveryDate: "Tomorrow",
    offers: [],
    reviews: [],
    rating: 4.3,
    reviewCount: 245,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop"
    ],
    description: "Gentle yet effective acne treatment gel for clearer skin",
    inStock: true,
    freeDelivery: false
  }
];

// Category-wise product mapping
export const categoryProductsMap = {
  "pain-relief": painReliefProducts,
  "diabetes-care": diabetesCareProducts,
  "skin-care": skinCareProducts,
  "heart-health": [],
  "digestive-health": [],
  "respiratory-care": [],
  "womens-health": [],
  "mens-health": [],
  "child-health": [],
  "elderly-care": [],
  "vitamins-supplements": [],
  "first-aid": []
};

// Function to get products by category
export const getProductsByCategory = (categoryId: string): EnhancedMedicineProduct[] => {
  return categoryProductsMap[categoryId as keyof typeof categoryProductsMap] || [];
};