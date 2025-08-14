// Mock data for user profile and related features
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  weight?: number;
  height?: number;
  chronicConditions?: string[];
  profilePicture?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  type: 'Product' | 'Service';
  category: 'Medicines' | 'Lab Tests' | 'Doctor Consult' | 'Home Care' | 'Scans';
  status: 'Active' | 'Delivered' | 'Canceled' | 'Processing' | 'Confirmed';
  items: {
    name: string;
    quantity?: number;
    price: number;
    image?: string;
  }[];
  total: number;
  deliveryDate?: string;
  appointmentDate?: string;
  prescriptionRequired?: boolean;
  invoiceUrl?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  type: 'Medicine' | 'Lab Test' | 'Service';
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  addedDate: string;
}

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  addedDate: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  type: 'Prescription' | 'Lab Report' | 'Scan Report' | 'Medical Certificate' | 'Other';
  date: string;
  fileUrl: string;
  fileType: 'PDF' | 'Image';
  doctorName?: string;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'Credit' | 'Debit';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  discountType: 'Percentage' | 'Fixed';
  minOrder?: number;
  validTill: string;
  category?: string;
}

// Mock data
export const mockUserProfile: UserProfile = {
  id: 'user-123',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@gmail.com',
  phone: '+91 9876543210',
  gender: 'Male',
  age: 35,
  weight: 75,
  height: 175,
  chronicConditions: ['Diabetes Type 2', 'Hypertension'],
  profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  createdAt: '2023-01-15T10:30:00Z'
};

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'OM2024001',
    date: '2024-01-20T14:30:00Z',
    type: 'Service',
    category: 'Lab Tests',
    status: 'Confirmed',
    items: [
      { name: 'Complete Blood Count (CBC)', price: 299, image: '🩸' },
      { name: 'HbA1c Test', price: 450, image: '🧪' }
    ],
    total: 749,
    appointmentDate: '2024-01-22T09:00:00Z',
    invoiceUrl: '/invoices/OM2024001.pdf'
  },
  {
    id: 'ord-002',
    orderNumber: 'OM2024002',
    date: '2024-01-18T16:45:00Z',
    type: 'Product',
    category: 'Medicines',
    status: 'Delivered',
    items: [
      { name: 'Metformin 500mg', quantity: 30, price: 125, image: '💊' },
      { name: 'Amlodipine 5mg', quantity: 30, price: 89, image: '💊' }
    ],
    total: 214,
    deliveryDate: '2024-01-19T18:00:00Z',
    prescriptionRequired: true,
    invoiceUrl: '/invoices/OM2024002.pdf'
  },
  {
    id: 'ord-003',
    orderNumber: 'OM2024003',
    date: '2024-01-15T11:20:00Z',
    type: 'Service',
    category: 'Doctor Consult',
    status: 'Active',
    items: [
      { name: 'Dr. Priya Sharma - Cardiologist Consultation', price: 600, image: '👩‍⚕️' }
    ],
    total: 600,
    appointmentDate: '2024-01-25T15:30:00Z'
  }
];

export const mockWishlistItems: WishlistItem[] = [
  {
    id: 'wish-001',
    name: 'Vitamin D3 60K Capsules',
    type: 'Medicine',
    price: 85,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop',
    inStock: true,
    addedDate: '2024-01-10T12:00:00Z'
  },
  {
    id: 'wish-002',
    name: 'Thyroid Function Test',
    type: 'Lab Test',
    price: 550,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop',
    inStock: true,
    addedDate: '2024-01-08T15:30:00Z'
  }
];

export const mockSavedAddresses: SavedAddress[] = [
  {
    id: 'addr-001',
    type: 'Home',
    name: 'Home',
    address: '123, Green Valley Apartments, MG Road',
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    pincode: '518002',
    landmark: 'Near Apollo Hospital',
    isDefault: true
  },
  {
    id: 'addr-002',
    type: 'Work',
    name: 'Office',
    address: '456, Tech Park, IT Corridor',
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    pincode: '518003',
    landmark: 'Opposite City Mall',
    isDefault: false
  }
];

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'fam-001',
    name: 'Sunita Kumar',
    relation: 'Spouse',
    age: 32,
    gender: 'Female',
    addedDate: '2023-01-15T10:30:00Z'
  },
  {
    id: 'fam-002',
    name: 'Arjun Kumar',
    relation: 'Child',
    age: 8,
    gender: 'Male',
    addedDate: '2023-01-15T10:35:00Z'
  }
];

export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'health-001',
    title: 'Blood Sugar Report - January 2024',
    type: 'Lab Report',
    date: '2024-01-15T09:00:00Z',
    fileUrl: '/reports/blood-sugar-jan2024.pdf',
    fileType: 'PDF',
    doctorName: 'Dr. Anil Gupta',
    notes: 'HbA1c levels slightly elevated, continue medication'
  },
  {
    id: 'health-002',
    title: 'Prescription - Diabetes Medication',
    type: 'Prescription',
    date: '2024-01-10T14:30:00Z',
    fileUrl: '/prescriptions/diabetes-med-jan2024.pdf',
    fileType: 'PDF',
    doctorName: 'Dr. Anil Gupta'
  }
];

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'txn-001',
    type: 'Credit',
    amount: 100,
    description: 'Referral Bonus - Friend Signup',
    date: '2024-01-20T10:30:00Z'
  },
  {
    id: 'txn-002',
    type: 'Debit',
    amount: 50,
    description: 'Used in Order #OM2024001',
    date: '2024-01-18T16:45:00Z',
    orderId: 'ord-001'
  },
  {
    id: 'txn-003',
    type: 'Credit',
    amount: 25,
    description: 'Cashback on Medicine Order',
    date: '2024-01-15T18:00:00Z',
    orderId: 'ord-002'
  }
];

export const mockOffers: Offer[] = [
  {
    id: 'offer-001',
    title: 'First Time User',
    description: 'Get 20% off on your first medicine order',
    code: 'FIRST20',
    discount: 20,
    discountType: 'Percentage',
    minOrder: 500,
    validTill: '2024-02-29T23:59:59Z',
    category: 'Medicines'
  },
  {
    id: 'offer-002',
    title: 'Lab Test Special',
    description: 'Flat ₹100 off on lab test packages',
    code: 'LAB100',
    discount: 100,
    discountType: 'Fixed',
    minOrder: 1000,
    validTill: '2024-01-31T23:59:59Z',
    category: 'Lab Tests'
  }
];

export const mockFAQs = [
  {
    category: 'Orders',
    questions: [
      {
        question: 'How can I track my order?',
        answer: 'You can track your order by going to "My Orders" section in your profile or clicking the tracking link sent to your email/SMS.'
      },
      {
        question: 'Can I cancel my order?',
        answer: 'Yes, you can cancel your order before it\'s shipped. For medicine orders, cancellation is allowed within 1 hour of placing the order.'
      }
    ]
  },
  {
    category: 'Payments',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery (for eligible orders).'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payments are processed through secure, encrypted gateways. We don\'t store your card details.'
      }
    ]
  },
  {
    category: 'Prescription',
    questions: [
      {
        question: 'Do I need a prescription for all medicines?',
        answer: 'Prescription is required for Schedule H and H1 drugs. OTC medicines can be purchased without prescription.'
      },
      {
        question: 'How do I upload my prescription?',
        answer: 'You can upload prescription during checkout, via WhatsApp, or in the "Health Records" section of your profile.'
      }
    ]
  }
];

export const walletBalance = 275;