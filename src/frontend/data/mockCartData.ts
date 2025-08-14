export interface CartItem {
  id: string;
  type: 'service' | 'product' | 'subscription' | 'package';
  category: string;
  image: string;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  deliveryType: 'home' | 'clinic' | 'online' | 'lab_visit' | 'pickup';
  prescriptionRequired: boolean;
  inStock: boolean;
  stockLevel?: 'high' | 'medium' | 'low';
  autoRefillEligible?: boolean;
  expertAssigned?: string;
  duration?: string;
  availableSlots?: string[];
  badges?: string[];
}

export interface CrossSellItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  reason: string;
}

export interface TrustBadge {
  icon: string;
  text: string;
  subtext?: string;
  verified: boolean;
}

export const mockCartItems: CartItem[] = [
  // Services
  {
    id: 'srv-1',
    type: 'service',
    category: 'Lab Tests',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    name: 'Complete Blood Count (CBC)',
    description: 'Comprehensive blood analysis',
    price: 299,
    originalPrice: 450,
    quantity: 1,
    deliveryType: 'home',
    prescriptionRequired: false,
    inStock: true,
    availableSlots: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'],
    badges: ['NABL Certified']
  },
  {
    id: 'srv-2',
    type: 'service',
    category: 'Doctor Consult',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
    name: 'Cardiologist Consultation',
    description: 'Dr. Rajesh Kumar - Online',
    price: 800,
    quantity: 1,
    deliveryType: 'online',
    prescriptionRequired: false,
    inStock: true,
    expertAssigned: 'Dr. Rajesh Kumar',
    duration: '30 minutes',
    availableSlots: ['10:00 AM', '2:00 PM', '6:00 PM']
  },
  
  // Products
  {
    id: 'prd-1',
    type: 'product',
    category: 'Medicines',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
    name: 'Metformin 500mg',
    brand: 'Glycomet',
    price: 45,
    originalPrice: 60,
    quantity: 2,
    deliveryType: 'home',
    prescriptionRequired: true,
    inStock: true,
    stockLevel: 'high',
    autoRefillEligible: true,
    badges: ['Generic Available']
  },
  {
    id: 'prd-2',
    type: 'product',
    category: 'Devices',
    image: 'https://images.unsplash.com/photo-1615486511262-9cd0bb77b8b5?w=100&h=100&fit=crop',
    name: 'Accu-Chek Active Glucometer',
    brand: 'Roche',
    price: 1250,
    originalPrice: 1500,
    quantity: 1,
    deliveryType: 'home',
    prescriptionRequired: false,
    inStock: true,
    stockLevel: 'medium',
    badges: ['FDA Approved']
  },
  
  // Subscription
  {
    id: 'sub-1',
    type: 'subscription',
    category: 'Care Plans',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop',
    name: 'Diabetes Care Monthly Plan',
    description: 'Monthly monitoring + diet plan',
    price: 2999,
    originalPrice: 4000,
    quantity: 1,
    deliveryType: 'home',
    prescriptionRequired: false,
    inStock: true,
    duration: '30 days',
    badges: ['Most Popular', 'Expert Support']
  }
];

export const crossSellItems: CrossSellItem[] = [
  {
    id: 'cs-1',
    name: 'HbA1c Test',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    price: 399,
    originalPrice: 600,
    badge: 'Recommended',
    reason: 'Complete your diabetes screening'
  },
  {
    id: 'cs-2',
    name: 'Glucose Test Strips (50 pcs)',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop',
    price: 850,
    badge: 'Combo Offer',
    reason: 'For your glucometer'
  },
  {
    id: 'cs-3',
    name: 'Dietitian Consultation',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    price: 599,
    originalPrice: 800,
    badge: 'Save 25%',
    reason: 'Perfect with your care plan'
  }
];

export const trustBadges: TrustBadge[] = [
  {
    icon: 'Shield',
    text: '100% Genuine Medicines',
    subtext: 'Licensed pharmacy',
    verified: true
  },
  {
    icon: 'Truck',
    text: 'Free Delivery Above ₹499',
    subtext: 'Pan India delivery',
    verified: true
  },
  {
    icon: 'Award',
    text: 'NABL/NABH Certified Labs',
    subtext: 'Accurate results',
    verified: true
  },
  {
    icon: 'CreditCard',
    text: 'Secure Payments',
    subtext: '256-bit SSL encryption',
    verified: true
  },
  {
    icon: 'Star',
    text: 'Verified Doctors',
    subtext: 'Licensed practitioners',
    verified: true
  }
];

export const promoOffers = [
  {
    code: 'HEALTH20',
    discount: 20,
    description: 'Get 20% off on medicines',
    minOrder: 299,
    type: 'percentage'
  },
  {
    code: 'FIRSTORDER',
    discount: 100,
    description: 'Flat ₹100 off on first order',
    minOrder: 500,
    type: 'fixed'
  },
  {
    code: 'LABTEST15',
    discount: 15,
    description: '15% off on lab tests',
    minOrder: 200,
    type: 'percentage'
  }
];