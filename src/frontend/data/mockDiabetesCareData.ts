export interface DiabetesService {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  originalPrice?: number;
  duration: string;
  expert: string;
  badge?: string;
  redirectTo?: string;
}

export interface DiabetesProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  badges: string[];
  inStock: boolean;
}

export interface DiabetesExpert {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  experience: string;
  languages: string[];
  availability: string;
  consultationFee: number;
  specialization: string[];
}

export interface DiabetesTest {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  homeCollection: boolean;
  reportTime: string;
  fasting: boolean;
  badge?: string;
}

export interface DiabetesArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  category: string;
  author: string;
  publishedAt: string;
}

export interface DiabetesCarePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  includes: string[];
  badge?: string;
  popular?: boolean;
}

export const diabetesServices: DiabetesService[] = [
  {
    id: "endocrinologist",
    title: "Doctor Consultation",
    description: "Consult with experienced endocrinologists and diabetologists",
    icon: "👨‍⚕️",
    price: 500,
    originalPrice: 800,
    duration: "30 mins",
    expert: "Dr. Karthi",
    badge: "Most Booked",
    redirectTo: "/doctors/dr-karthi"
  },
  {
    id: "diet-plans",
    title: "Diet Plans",
    description: "Personalized nutrition plans for diabetes management",
    icon: "🥗",
    price: 1200,
    duration: "1 month",
    expert: "Nutritionist Team"
  },
  {
    id: "reversal-program",
    title: "Diabetes Reversal Program",
    description: "Comprehensive 6-month program to reverse pre-diabetes",
    icon: "🔄",
    price: 15000,
    originalPrice: 20000,
    duration: "6 months",
    expert: "Multi-disciplinary Team",
    badge: "Featured"
  },
  {
    id: "foot-care",
    title: "Foot Care Services",
    description: "Specialized diabetic foot care and screening",
    icon: "🦶",
    price: 800,
    duration: "45 mins",
    expert: "Podiatrist"
  },
  {
    id: "eye-screening",
    title: "Eye Screening",
    description: "Diabetic retinopathy screening and consultation",
    icon: "👁️",
    price: 1000,
    duration: "30 mins",
    expert: "Ophthalmologist"
  },
  {
    id: "home-collection",
    title: "Home Sample Collection",
    description: "HbA1c, FBS, PPBS, Lipid, Insulin resistance tests at home",
    icon: "🏠",
    price: 150,
    duration: "Next day",
    expert: "Certified Phlebotomist",
    badge: "Free Collection"
  }
];

export const diabetesProducts: DiabetesProduct[] = [
  {
    id: "glucometer-1",
    name: "Accu-Chek Active Glucometer",
    brand: "Accu-Chek",
    image: "/api/placeholder/300/200",
    price: 1200,
    originalPrice: 1500,
    rating: 4.5,
    reviewCount: 245,
    category: "Glucometers",
    badges: ["Best Seller", "Doctor Recommended"],
    inStock: true
  },
  {
    id: "test-strips",
    name: "Glucose Test Strips (50 count)",
    brand: "OneTouch",
    image: "/api/placeholder/300/200",
    price: 800,
    originalPrice: 1000,
    rating: 4.3,
    reviewCount: 156,
    category: "Test Strips",
    badges: ["Fast Results"],
    inStock: true
  },
  {
    id: "cgm-device",
    name: "Freestyle Libre CGM Sensor",
    brand: "Abbott",
    image: "/api/placeholder/300/200",
    price: 4500,
    rating: 4.8,
    reviewCount: 89,
    category: "CGM",
    badges: ["Latest Technology", "14-day Wear"],
    inStock: true
  },
  {
    id: "insulin-pen",
    name: "NovoPen Echo Insulin Pen",
    brand: "Novo Nordisk",
    image: "/api/placeholder/300/200",
    price: 2800,
    rating: 4.6,
    reviewCount: 67,
    category: "Insulin Pens",
    badges: ["Memory Function"],
    inStock: true
  },
  {
    id: "sugar-free-snacks",
    name: "Diabetic Snack Mix",
    brand: "HealthyBites",
    image: "/api/placeholder/300/200",
    price: 350,
    originalPrice: 450,
    rating: 4.2,
    reviewCount: 123,
    category: "Sugar-free Products",
    badges: ["Zero Sugar", "High Fiber"],
    inStock: true
  },
  {
    id: "diabetic-shoes",
    name: "Therapeutic Diabetic Shoes",
    brand: "ComfortFeet",
    image: "/api/placeholder/300/200",
    price: 3500,
    rating: 4.4,
    reviewCount: 78,
    category: "Diabetic Footwear",
    badges: ["Orthopedic", "Breathable"],
    inStock: true
  }
];

export const diabetesExperts: DiabetesExpert[] = [
  {
    id: "diabetes-educator",
    name: "Priya Sharma",
    title: "Certified Diabetes Educator",
    image: "/api/placeholder/300/400",
    rating: 4.8,
    experience: "8 years",
    languages: ["Hindi", "English", "Telugu"],
    availability: "Available Today",
    consultationFee: 600,
    specialization: ["Diabetes Education", "Lifestyle Counseling"]
  },
  {
    id: "endocrinologist",
    name: "Dr. Karthi",
    title: "Endocrinologist",
    image: "/api/placeholder/300/400",
    rating: 4.9,
    experience: "15 years",
    languages: ["English", "Telugu", "Tamil"],
    availability: "Available Tomorrow",
    consultationFee: 800,
    specialization: ["Type 1 Diabetes", "Type 2 Diabetes", "Insulin Management"]
  },
  {
    id: "dietitian",
    name: "Anita Reddy",
    title: "Clinical Dietitian",
    image: "/api/placeholder/300/400",
    rating: 4.7,
    experience: "10 years",
    languages: ["Hindi", "English", "Telugu"],
    availability: "Available Today",
    consultationFee: 500,
    specialization: ["Diabetic Diet", "Weight Management", "PCOS"]
  }
];

export const diabetesTests: DiabetesTest[] = [
  {
    id: "hba1c",
    name: "HbA1c Test",
    price: 400,
    originalPrice: 600,
    description: "3-month average blood sugar levels",
    homeCollection: true,
    reportTime: "Same day",
    fasting: false,
    badge: "Most Popular"
  },
  {
    id: "glucose-profile",
    name: "Complete Glucose Profile",
    price: 800,
    originalPrice: 1200,
    description: "FBS, PPBS, Random Glucose, HbA1c",
    homeCollection: true,
    reportTime: "Same day",
    fasting: true
  },
  {
    id: "diabetic-panel",
    name: "Comprehensive Diabetic Panel",
    price: 1500,
    originalPrice: 2000,
    description: "Complete diabetes monitoring package",
    homeCollection: true,
    reportTime: "Next day",
    fasting: true,
    badge: "Complete Package"
  },
  {
    id: "insulin-resistance",
    name: "Insulin Resistance Test",
    price: 1200,
    description: "HOMA-IR calculation with fasting glucose and insulin",
    homeCollection: true,
    reportTime: "Same day",
    fasting: true
  }
];

export const diabetesArticles: DiabetesArticle[] = [
  {
    id: "diabetes-myths",
    title: "10 Common Diabetes Myths Busted",
    excerpt: "Separating fact from fiction about diabetes management",
    image: "/api/placeholder/400/250",
    readTime: "5 min",
    category: "Myth Busters",
    author: "Dr. Karthi",
    publishedAt: "2024-01-15"
  },
  {
    id: "glycemic-index",
    title: "Understanding Glycemic Index for Better Control",
    excerpt: "Learn how to choose foods that won't spike your blood sugar",
    image: "/api/placeholder/400/250",
    readTime: "7 min",
    category: "Nutrition",
    author: "Anita Reddy",
    publishedAt: "2024-01-12"
  },
  {
    id: "exercise-diabetes",
    title: "Best Exercises for Diabetes Management",
    excerpt: "Safe and effective workout routines for diabetics",
    image: "/api/placeholder/400/250",
    readTime: "6 min",
    category: "Lifestyle",
    author: "Fitness Team",
    publishedAt: "2024-01-10"
  }
];

export const diabetesCarePackages: DiabetesCarePackage[] = [
  {
    id: "monthly-monitoring",
    title: "Monthly Diabetes Monitoring",
    description: "Complete monthly care package with tests and consultation",
    price: 3000,
    originalPrice: 4500,
    duration: "1 month",
    includes: [
      "2 Doctor Consultations",
      "HbA1c + Glucose Profile",
      "Diet Plan Review",
      "Medicine Reminders"
    ],
    popular: true
  },
  {
    id: "reversal-support",
    title: "Diabetes Reversal Support",
    description: "Comprehensive program to reverse pre-diabetes",
    price: 15000,
    originalPrice: 25000,
    duration: "6 months",
    includes: [
      "Weekly Doctor Consultations",
      "Personalized Diet Plan",
      "Monthly Lab Tests",
      "Lifestyle Coaching",
      "24/7 Support"
    ],
    badge: "Most Effective"
  },
  {
    id: "complete-care",
    title: "Complete Diabetes Care Bundle",
    description: "All-in-one solution for diabetes management",
    price: 8000,
    originalPrice: 12000,
    duration: "3 months",
    includes: [
      "Monthly Doctor Visits",
      "Quarterly Tests",
      "Nutrition Counseling",
      "Free Glucometer",
      "Medicine Delivery"
    ]
  }
];

export const diabetesCategories = [
  { id: "consultation", name: "Doctor Consultation", icon: "👨‍⚕️" },
  { id: "diet", name: "Diet Plans", icon: "🥗" },
  { id: "devices", name: "Devices", icon: "📱" },
  { id: "tests", name: "Lab Tests", icon: "🧪" },
  { id: "care", name: "Care Programs", icon: "❤️" },
  { id: "education", name: "Education", icon: "📚" }
];