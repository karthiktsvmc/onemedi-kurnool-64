export interface OrderItem {
  id: string;
  name: string;
  type: 'medicine' | 'lab-test' | 'doctor-consult' | 'homecare' | 'scan' | 'subscription';
  price: number;
  quantity: number;
  image: string;
  prescriptionRequired?: boolean;
  slotInfo?: {
    date: string;
    time: string;
    type: 'home-visit' | 'clinic' | 'online';
  };
  deliveryInfo?: {
    eta: string;
    type: 'home-delivery' | 'pickup';
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  placedAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    deliveryFee: number;
    total: number;
  };
  prescriptionStatus: {
    required: boolean;
    uploaded: boolean;
    pendingItems: string[];
  };
  payment: {
    method: string;
    status: 'paid' | 'pending' | 'failed';
    transactionId: string;
  };
  tracking?: {
    url: string;
    currentStatus: string;
  };
}

export const mockOrder: Order = {
  id: 'ord_001',
  orderNumber: 'OM2024001234',
  status: 'confirmed',
  placedAt: '2024-01-15T10:30:00Z',
  customer: {
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210'
  },
  items: [
    {
      id: 'item_001',
      name: 'Complete Blood Count (CBC)',
      type: 'lab-test',
      price: 299,
      quantity: 1,
      image: '/placeholder.svg',
      slotInfo: {
        date: '2024-01-18',
        time: '09:00 AM',
        type: 'home-visit'
      }
    },
    {
      id: 'item_002',
      name: 'Metformin 500mg - Strip of 10',
      type: 'medicine',
      price: 45,
      quantity: 2,
      image: '/placeholder.svg',
      prescriptionRequired: true,
      deliveryInfo: {
        eta: '2024-01-16',
        type: 'home-delivery'
      }
    },
    {
      id: 'item_003',
      name: 'Dr. Rajesh Kumar - Diabetes Consultation',
      type: 'doctor-consult',
      price: 500,
      quantity: 1,
      image: '/placeholder.svg',
      slotInfo: {
        date: '2024-01-17',
        time: '02:30 PM',
        type: 'online'
      }
    }
  ],
  pricing: {
    subtotal: 889,
    discount: 89,
    tax: 96,
    deliveryFee: 0,
    total: 896
  },
  prescriptionStatus: {
    required: true,
    uploaded: false,
    pendingItems: ['Metformin 500mg - Strip of 10']
  },
  payment: {
    method: 'UPI',
    status: 'paid',
    transactionId: 'TXN_123456789'
  },
  tracking: {
    url: 'https://track.onemedi.com/OM2024001234',
    currentStatus: 'Order confirmed, preparing for dispatch'
  }
};

export const testimonials = [
  {
    id: 1,
    name: 'Rajesh M.',
    rating: 5,
    text: 'ONE MEDI made healthcare so convenient. Got my reports within 24 hours!',
    location: 'Mumbai',
    verified: true
  },
  {
    id: 2,
    name: 'Anitha R.',
    rating: 5,
    text: 'Genuine medicines delivered on time. Very reliable service.',
    location: 'Bangalore',
    verified: true
  },
  {
    id: 3,
    name: 'Vikram S.',
    rating: 5,
    text: 'Doctor consultation was excellent. Saved me a trip to the clinic.',
    location: 'Delhi',
    verified: true
  }
];

export const recommendedProducts = [
  {
    id: 'rec_001',
    name: 'HbA1c Test',
    type: 'lab-test',
    price: 399,
    originalPrice: 599,
    image: '/placeholder.svg',
    description: 'Track your 3-month blood sugar average',
    popular: true
  },
  {
    id: 'rec_002',
    name: 'Glucometer with 50 strips',
    type: 'medicine',
    price: 1299,
    originalPrice: 1699,
    image: '/placeholder.svg',
    description: 'Monitor blood sugar at home',
    popular: false
  },
  {
    id: 'rec_003',
    name: 'Monthly Diabetes Care Package',
    type: 'subscription',
    price: 2499,
    originalPrice: 3499,
    image: '/placeholder.svg',
    description: 'Complete diabetes management plan',
    popular: true
  }
];

export const supportOptions = [
  {
    type: 'phone',
    label: 'Call Support',
    value: '1800-123-4567',
    available: '24/7',
    icon: 'Phone'
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '+91 98765 00000',
    available: '9 AM - 9 PM',
    icon: 'MessageCircle'
  },
  {
    type: 'chat',
    label: 'Live Chat',
    value: 'Start Chat',
    available: '24/7',
    icon: 'MessageSquare'
  }
];