
export interface AmbulanceService {
  id: string;
  name: string;
  image: string;
  type: 'Basic' | 'ICU' | 'Neonatal' | 'Advanced';
  rating: number;
  reviewCount: number;
  basePrice: number;
  pricePerKm: number;
  features: string[];
  availability: 'Available' | 'Busy' | 'Offline';
  eta: number; // in minutes
  contactNumber: string;
  badge?: string;
  coverageArea: string;
}

export const mockAmbulanceServices: AmbulanceService[] = [
  {
    id: '1',
    name: 'MedRescue Emergency Services',
    image: '/placeholder.svg',
    type: 'ICU',
    rating: 4.8,
    reviewCount: 245,
    basePrice: 1500,
    pricePerKm: 25,
    features: ['Ventilator', 'Cardiac Monitor', 'Paramedic Staff', 'GPS Tracking'],
    availability: 'Available',
    eta: 8,
    contactNumber: '+91-9876543210',
    badge: 'Verified Partner',
    coverageArea: 'Kurnool & 50km radius'
  },
  {
    id: '2',
    name: 'LifeLine Ambulance',
    image: '/placeholder.svg',
    type: 'Basic',
    rating: 4.6,
    reviewCount: 189,
    basePrice: 800,
    pricePerKm: 15,
    features: ['First Aid Kit', 'Oxygen Support', 'Trained Driver'],
    availability: 'Available',
    eta: 12,
    contactNumber: '+91-9876543211',
    coverageArea: 'Kurnool City'
  },
  {
    id: '3',
    name: 'Apollo Emergency Care',
    image: '/placeholder.svg',
    type: 'Advanced',
    rating: 4.9,
    reviewCount: 356,
    basePrice: 2000,
    pricePerKm: 30,
    features: ['ICU Setup', 'Doctor on Board', 'Defibrillator', 'Blood Bank'],
    availability: 'Busy',
    eta: 15,
    contactNumber: '+91-9876543212',
    badge: 'Premium Partner',
    coverageArea: 'Kurnool & Neighboring Districts'
  },
  {
    id: '4',
    name: 'BabyCare Neonatal Transport',
    image: '/placeholder.svg',
    type: 'Neonatal',
    rating: 4.7,
    reviewCount: 98,
    basePrice: 2500,
    pricePerKm: 35,
    features: ['Incubator', 'Neonatal Specialist', 'Temperature Control'],
    availability: 'Available',
    eta: 20,
    contactNumber: '+91-9876543213',
    badge: 'Specialist Care',
    coverageArea: 'Regional Coverage'
  }
];

export interface BookingHistory {
  id: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  pickupAddress: string;
  dropAddress: string;
  patientCondition: string;
  status: 'Completed' | 'Cancelled' | 'In Progress';
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending';
}

export const mockBookingHistory: BookingHistory[] = [
  {
    id: 'B001',
    serviceId: '1',
    serviceName: 'MedRescue Emergency Services',
    bookingDate: '2024-01-25 14:30',
    pickupAddress: 'Apollo Hospital, Kurnool',
    dropAddress: 'Government General Hospital, Kurnool',
    patientCondition: 'Cardiac Emergency',
    status: 'Completed',
    totalAmount: 1850,
    paymentStatus: 'Paid'
  },
  {
    id: 'B002',
    serviceId: '2',
    serviceName: 'LifeLine Ambulance',
    bookingDate: '2024-01-20 09:15',
    pickupAddress: 'Home - Kurnool',
    dropAddress: 'Kurnool Medical College',
    patientCondition: 'Regular Transfer',
    status: 'Completed',
    totalAmount: 950,
    paymentStatus: 'Paid'
  }
];
