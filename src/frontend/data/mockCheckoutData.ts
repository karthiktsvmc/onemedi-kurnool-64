export interface CheckoutUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
}

export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  isServiceable: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price?: number;
  duration?: string;
}

export interface DateSlot {
  date: string;
  day: string;
  slots: TimeSlot[];
}

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod' | 'insurance' | 'emi';
  name: string;
  icon: string;
  enabled: boolean;
  description?: string;
}

export interface PrescriptionRequirement {
  required: boolean;
  items: string[];
  uploaded: boolean;
  files?: File[];
}

// Mock data
export const mockUser: CheckoutUser = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@gmail.com',
  phone: '+91 9876543210',
  gender: 'male',
  age: 35
};

export const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'Home',
    street: '123, MG Road, Sector 14',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    landmark: 'Near Metro Station',
    isDefault: true,
    isServiceable: true
  },
  {
    id: '2',
    type: 'office',
    name: 'Office',
    street: '456, Tech Park, Electronic City',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    landmark: 'Tower B, 5th Floor',
    isDefault: false,
    isServiceable: true
  }
];

export const mockDateSlots: DateSlot[] = [
  {
    date: '2024-01-15',
    day: 'Today',
    slots: [
      { id: '1', time: '09:00 AM', available: true, duration: '30 mins' },
      { id: '2', time: '10:30 AM', available: true, duration: '30 mins' },
      { id: '3', time: '02:00 PM', available: false, duration: '30 mins' },
      { id: '4', time: '04:30 PM', available: true, duration: '30 mins' }
    ]
  },
  {
    date: '2024-01-16',
    day: 'Tomorrow',
    slots: [
      { id: '5', time: '09:00 AM', available: true, duration: '30 mins' },
      { id: '6', time: '11:00 AM', available: true, duration: '30 mins' },
      { id: '7', time: '03:00 PM', available: true, duration: '30 mins' },
      { id: '8', time: '05:00 PM', available: true, duration: '30 mins' }
    ]
  },
  {
    date: '2024-01-17',
    day: 'Jan 17',
    slots: [
      { id: '9', time: '10:00 AM', available: true, duration: '30 mins' },
      { id: '10', time: '12:00 PM', available: true, duration: '30 mins' },
      { id: '11', time: '04:00 PM', available: true, duration: '30 mins' }
    ]
  }
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    type: 'upi',
    name: 'UPI',
    icon: 'Smartphone',
    enabled: true,
    description: 'Pay using Google Pay, PhonePe, Paytm'
  },
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    icon: 'CreditCard',
    enabled: true,
    description: 'Visa, Mastercard, RuPay'
  },
  {
    id: 'netbanking',
    type: 'netbanking',
    name: 'Net Banking',
    icon: 'Building',
    enabled: true,
    description: 'Pay using your bank account'
  },
  {
    id: 'wallet',
    type: 'wallet',
    name: 'Digital Wallets',
    icon: 'Wallet',
    enabled: true,
    description: 'Paytm, Amazon Pay, JioMoney'
  },
  {
    id: 'cod',
    type: 'cod',
    name: 'Cash on Delivery',
    icon: 'Banknote',
    enabled: true,
    description: 'Pay when order is delivered'
  },
  {
    id: 'insurance',
    type: 'insurance',
    name: 'Insurance',
    icon: 'Shield',
    enabled: false,
    description: 'Use your health insurance'
  },
  {
    id: 'emi',
    type: 'emi',
    name: 'EMI (No Cost)',
    icon: 'Calculator',
    enabled: true,
    description: 'Convert to easy installments'
  }
];

export const trustBadges = [
  {
    icon: 'CheckCircle',
    text: '100% Genuine Medicines',
    verified: true
  },
  {
    icon: 'Shield',
    text: 'Secure Payments',
    verified: true
  },
  {
    icon: 'Truck',
    text: 'Free Delivery Above ₹499',
    verified: true
  },
  {
    icon: 'Award',
    text: 'NABL Certified Labs',
    verified: true
  }
];