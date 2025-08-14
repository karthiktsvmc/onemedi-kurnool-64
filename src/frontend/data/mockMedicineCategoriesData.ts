// Enhanced Medicine Categories Data
// This will be replaced with real-time Supabase queries

export interface MedicineCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  color: string;
  subcategories: string[];
  productCount: number;
  prescriptionRequired?: boolean;
  trending?: boolean;
}

export const medicineCategoriesData: MedicineCategory[] = [
  {
    id: "pain-relief",
    name: "Pain Relief",
    icon: "💊",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center",
    description: "Relief from headaches, body pain, joint pain, and muscle aches",
    color: "hsl(var(--red-500))",
    subcategories: ["Headache", "Body Pain", "Joint Pain", "Muscle Pain"],
    productCount: 145,
    trending: true
  },
  {
    id: "diabetes-care",
    name: "Diabetes Care",
    icon: "🩺",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center",
    description: "Blood sugar management, insulin, test strips, and monitoring devices",
    color: "hsl(var(--blue-500))",
    subcategories: ["Blood Sugar Management", "Insulin", "Test Strips", "Glucometers"],
    productCount: 89,
    prescriptionRequired: true
  },
  {
    id: "heart-health",
    name: "Heart Health",
    icon: "❤️",
    image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=100&h=100&fit=crop&crop=center",
    description: "Blood pressure, cholesterol, and cardiovascular support medicines",
    color: "hsl(var(--red-600))",
    subcategories: ["Blood Pressure", "Cholesterol", "Heart Support"],
    productCount: 76,
    prescriptionRequired: true
  },
  {
    id: "skin-care",
    name: "Skin Care",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop&crop=center",
    description: "Acne treatment, moisturizers, anti-fungal, and dermatitis care",
    color: "hsl(var(--pink-500))",
    subcategories: ["Acne Treatment", "Moisturizers", "Anti-fungal", "Dermatitis"],
    productCount: 132
  },
  {
    id: "digestive-health",
    name: "Digestive Health",
    icon: "🍃",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center",
    description: "Antacids, probiotics, digestive enzymes, and stomach care",
    color: "hsl(var(--green-500))",
    subcategories: ["Antacids", "Probiotics", "Digestive Enzymes"],
    productCount: 94
  },
  {
    id: "respiratory-care",
    name: "Respiratory Care",
    icon: "🫁",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&crop=center",
    description: "Cough & cold, asthma, allergies, and breathing support",
    color: "hsl(var(--cyan-500))",
    subcategories: ["Cough & Cold", "Asthma", "Allergies"],
    productCount: 156,
    trending: true
  },
  {
    id: "womens-health",
    name: "Women's Health",
    icon: "👩",
    image: "https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=100&h=100&fit=crop&crop=center",
    description: "Menstrual care, pregnancy care, PCOS support, and women's wellness",
    color: "hsl(var(--purple-500))",
    subcategories: ["Menstrual Care", "Pregnancy Care", "PCOS Support"],
    productCount: 67
  },
  {
    id: "mens-health",
    name: "Men's Health",
    icon: "👨",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=center",
    description: "Prostate care, sexual health, hair care, and men's wellness",
    color: "hsl(var(--indigo-500))",
    subcategories: ["Prostate Care", "Sexual Health", "Hair Care"],
    productCount: 54,
    prescriptionRequired: true
  },
  {
    id: "child-health",
    name: "Child Health",
    icon: "👶",
    image: "https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=100&h=100&fit=crop&crop=center",
    description: "Pediatric medicines, vitamins for kids, and child wellness",
    color: "hsl(var(--yellow-500))",
    subcategories: ["Pediatric Medicines", "Vitamins for Kids"],
    productCount: 78
  },
  {
    id: "elderly-care",
    name: "Elderly Care",
    icon: "👴",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=100&h=100&fit=crop&crop=center",
    description: "Bone health, memory support, joint care, and senior wellness",
    color: "hsl(var(--orange-500))",
    subcategories: ["Bone Health", "Memory Support", "Joint Care"],
    productCount: 43
  },
  {
    id: "vitamins-supplements",
    name: "Vitamins & Supplements",
    icon: "💊",
    image: "https://images.unsplash.com/photo-1550572017-34e1ee1e5314?w=100&h=100&fit=crop&crop=center",
    description: "Essential vitamins, minerals, and nutritional supplements",
    color: "hsl(var(--emerald-500))",
    subcategories: ["Multivitamins", "Protein Supplements", "Minerals"],
    productCount: 198,
    trending: true
  },
  {
    id: "first-aid",
    name: "First Aid",
    icon: "🩹",
    image: "https://images.unsplash.com/photo-1603398938425-d4de7de1a0ad?w=100&h=100&fit=crop&crop=center",
    description: "Bandages, antiseptics, wound care, and emergency supplies",
    color: "hsl(var(--slate-500))",
    subcategories: ["Bandages", "Antiseptics", "Wound Care"],
    productCount: 67
  }
];

// Supabase table structure for reference
export interface MedicineCategoryTable {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url: string;
  color: string;
  subcategories: string[];
  product_count: number;
  prescription_required: boolean;
  trending: boolean;
  created_at: string;
  updated_at: string;
}