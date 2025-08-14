export interface BloodBank {
  id: string;
  name: string;
  image: string;
  services: string[];
  bloodGroups: string[];
  address: string;
  phone: string;
  email: string;
  timings: string;
  isVerified: boolean;
}

export const mockBloodBanks: BloodBank[] = [
  {
    id: '1',
    name: 'Red Cross Blood Bank',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&auto=format',
    services: ['Blood Collection', 'Blood Testing', 'Platelet Donation', 'Plasma Collection'],
    bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    address: '123 Main Street, Kurnool, Andhra Pradesh - 518001',
    phone: '+91 9876543210',
    email: 'contact@redcrossbloodbank.org',
    timings: '24/7 Emergency | 9:00 AM - 6:00 PM Regular',
    isVerified: true
  },
  {
    id: '2',
    name: 'Akshaya Blood Bank',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&auto=format',
    services: ['Blood Donation', 'Blood Storage', 'Emergency Supply', 'Blood Components'],
    bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'O-', 'A-'],
    address: '456 Hospital Road, Kurnool, Andhra Pradesh - 518002',
    phone: '+91 9876543211',
    email: 'info@akshayabloodbank.com',
    timings: '8:00 AM - 8:00 PM | Emergency 24/7',
    isVerified: true
  },
  {
    id: '3',
    name: 'RR Blood Bank',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop&auto=format',
    services: ['Voluntary Donation', 'Blood Testing', 'Rare Blood Groups', 'Mobile Collection'],
    bloodGroups: ['A+', 'A-', 'B+', 'O+', 'AB+'],
    address: '789 Medical Complex, Kurnool, Andhra Pradesh - 518003',
    phone: '+91 9876543212',
    email: 'support@rrbloodbank.in',
    timings: '9:00 AM - 7:00 PM | Closed Sundays',
    isVerified: false
  }
];