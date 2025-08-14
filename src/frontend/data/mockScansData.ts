export interface DiagnosticCenter {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  deliveryTime: string;
  homePickup: boolean;
  nabl: boolean;
  offers?: string;
}

export interface Scan {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  purpose: string;
  preparation: string;
  duration: string;
  fastingRequired: boolean;
  parameters: number;
  centers: DiagnosticCenter[];
  tags: string[];
  relatedScans: string[];
  faqs: { question: string; answer: string }[];
}

export const scanCategories = [
  {
    id: 'mri',
    name: 'MRI',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop',
    count: 45
  },
  {
    id: 'ct',
    name: 'CT Scan',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4618c5f?w=300&h=300&fit=crop',
    count: 38
  },
  {
    id: 'ultrasound',
    name: 'Ultrasound',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
    count: 52
  },
  {
    id: 'xray',
    name: 'X-Ray',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop',
    count: 67
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    count: 24
  },
  {
    id: 'nuclear',
    name: 'Nuclear',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop',
    count: 15
  },
  {
    id: 'cardiac',
    name: 'Cardiac',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&h=300&fit=crop',
    count: 28
  }
];

export const promotionalStrips = [
  {
    id: 1,
    title: 'Sleep Study',
    subtitle: 'Comprehensive sleep analysis at home',
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=200&fit=crop',
    cta: 'Book Now',
    offer: '30% OFF'
  },
  {
    id: 2,
    title: 'Digital ECG at Home',
    subtitle: 'Professional ECG monitoring service',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=200&fit=crop',
    cta: 'Schedule',
    offer: 'Starting ₹299'
  },
  {
    id: 3,
    title: 'Home Pickup Available',
    subtitle: 'For select diagnostic centres',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    cta: 'View Centers',
    offer: 'Free Pickup'
  },
  {
    id: 4,
    title: 'CT/MRI Best Quality',
    subtitle: 'Premium scans with best offers',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
    cta: 'Book Now',
    offer: 'Best Offers'
  },
  {
    id: 5,
    title: 'PET CT Whole Body',
    subtitle: 'Advanced nuclear scan technology',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4618c5f?w=400&h=200&fit=crop',
    cta: 'Learn More',
    offer: 'Expert Care'
  }
];

export const mockScans: Scan[] = [
  {
    id: 'mri-brain',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    title: 'Brain MRI Scan',
    description: 'Detailed brain imaging for neurological conditions',
    category: 'mri',
    purpose: 'Diagnose brain tumors, strokes, multiple sclerosis, and other neurological conditions',
    preparation: 'Remove all metal objects. Inform about implants or claustrophobia.',
    duration: '45-60 minutes',
    fastingRequired: false,
    parameters: 25,
    centers: [
      {
        id: 'vijaya-1',
        name: 'Vijaya Diagnostics',
        price: 4500,
        originalPrice: 6000,
        rating: 4.8,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true,
        offers: 'Free consultation with radiologist'
      },
      {
        id: 'lucid-1',
        name: 'Lucid Diagnostics',
        price: 4200,
        originalPrice: 5500,
        rating: 4.6,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true
      }
    ],
    tags: ['NABL', 'Expert Radiologist', 'High Resolution'],
    relatedScans: ['ct-brain', 'mri-spine'],
    faqs: [
      {
        question: 'Is MRI scan safe?',
        answer: 'Yes, MRI uses magnetic fields and radio waves, no ionizing radiation.'
      },
      {
        question: 'Can I eat before MRI?',
        answer: 'Usually yes, unless specific contrast study is planned.'
      }
    ]
  },
  {
    id: 'ct-chest',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4618c5f?w=400&h=300&fit=crop',
    title: 'CT Chest Scan',
    description: 'High-resolution chest imaging for lung conditions',
    category: 'ct',
    purpose: 'Detect lung diseases, pneumonia, tumors, and chest injuries',
    preparation: 'Remove metal objects. May require contrast injection.',
    duration: '10-30 minutes',
    fastingRequired: false,
    parameters: 20,
    centers: [
      {
        id: 'apollo-1',
        name: 'Apollo Diagnostics',
        price: 2800,
        originalPrice: 3500,
        rating: 4.7,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true,
        offers: '20% off on package booking'
      },
      {
        id: 'sitaram-1',
        name: 'Sitaram Nuclear Scans',
        price: 3200,
        originalPrice: 4000,
        rating: 4.8,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true
      }
    ],
    tags: ['NABL', 'Fast Reporting', 'AI Enhanced'],
    relatedScans: ['chest-xray', 'hrct-chest'],
    faqs: [
      {
        question: 'Is CT scan radiation safe?',
        answer: 'CT scans use low-dose radiation. Benefits outweigh minimal risks.'
      }
    ]
  },
  {
    id: 'ultrasound-abdomen',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    title: 'Abdominal Ultrasound',
    description: 'Complete abdominal organ screening',
    category: 'ultrasound',
    purpose: 'Examine liver, kidney, gallbladder, pancreas, and other abdominal organs',
    preparation: 'Fasting for 8-12 hours required',
    duration: '20-30 minutes',
    fastingRequired: true,
    parameters: 15,
    centers: [
      {
        id: 'vijaya-2',
        name: 'Vijaya Diagnostics',
        price: 1200,
        originalPrice: 1600,
        rating: 4.7,
        deliveryTime: 'Same day',
        homePickup: true,
        nabl: true,
        offers: 'Free home pickup'
      },
      {
        id: 'lucid-2',
        name: 'Lucid Diagnostics',
        price: 1100,
        originalPrice: 1400,
        rating: 4.5,
        deliveryTime: 'Same day',
        homePickup: true,
        nabl: true
      }
    ],
    tags: ['NABL', 'Home Pickup', 'Quick Results'],
    relatedScans: ['pelvic-ultrasound', 'kidney-ultrasound'],
    faqs: [
      {
        question: 'Why is fasting required?',
        answer: 'Fasting ensures clear visualization of organs without gas interference.'
      }
    ]
  },
  {
    id: 'chest-xray',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    title: 'Chest X-Ray',
    description: 'Digital chest radiography for lung screening',
    category: 'xray',
    purpose: 'Screen for pneumonia, tuberculosis, lung diseases, and chest infections',
    preparation: 'Remove upper body clothing and metal objects',
    duration: '5-10 minutes',
    fastingRequired: false,
    parameters: 8,
    centers: [
      {
        id: 'apollo-2',
        name: 'Apollo Diagnostics',
        price: 350,
        originalPrice: 500,
        rating: 4.6,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true,
        offers: 'Digital reporting within 2 hours'
      },
      {
        id: 'vijaya-3',
        name: 'Vijaya Diagnostics',
        price: 400,
        originalPrice: 550,
        rating: 4.7,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true
      }
    ],
    tags: ['NABL', 'Digital', 'Instant Results'],
    relatedScans: ['ct-chest', 'lung-function-test'],
    faqs: [
      {
        question: 'Is chest X-ray safe during pregnancy?',
        answer: 'Generally avoided unless medically necessary. Consult your doctor.'
      }
    ]
  },
  {
    id: 'nt-scan',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
    title: 'NT Scan (Nuchal Translucency)',
    description: 'First trimester screening for chromosomal abnormalities',
    category: 'pregnancy',
    purpose: 'Screen for Down syndrome and other chromosomal conditions',
    preparation: 'Drink water 1 hour before scan. Do not empty bladder.',
    duration: '15-30 minutes',
    fastingRequired: false,
    parameters: 12,
    centers: [
      {
        id: 'apollo-3',
        name: 'Apollo Diagnostics',
        price: 2200,
        originalPrice: 2800,
        rating: 4.9,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true,
        offers: 'Free genetic counseling included'
      },
      {
        id: 'lucid-3',
        name: 'Lucid Diagnostics',
        price: 2500,
        originalPrice: 3000,
        rating: 4.8,
        deliveryTime: 'Same day',
        homePickup: false,
        nabl: true,
        offers: 'Expert fetal medicine specialist'
      }
    ],
    tags: ['NABL', 'Specialist Care', 'Genetic Counseling'],
    relatedScans: ['tiffa-scan', 'anomaly-scan'],
    faqs: [
      {
        question: 'When should NT scan be done?',
        answer: 'Between 11-14 weeks of pregnancy for accurate results.'
      }
    ]
  },
  {
    id: 'pet-ct',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    title: 'PET CT Whole Body',
    description: 'Advanced nuclear imaging for cancer detection',
    category: 'nuclear',
    purpose: 'Detect cancer, monitor treatment response, and check for metastasis',
    preparation: 'Fasting 6 hours. Avoid strenuous activity 24 hours before.',
    duration: '2-3 hours',
    fastingRequired: true,
    parameters: 35,
    centers: [
      {
        id: 'sitaram-2',
        name: 'Sitaram Nuclear Scans',
        price: 28000,
        originalPrice: 35000,
        rating: 4.9,
        deliveryTime: '24 hours',
        homePickup: false,
        nabl: true,
        offers: 'Oncologist consultation included'
      },
      {
        id: 'apollo-nuclear',
        name: 'Apollo Diagnostics',
        price: 30000,
        originalPrice: 38000,
        rating: 4.8,
        deliveryTime: '24 hours',
        homePickup: false,
        nabl: true
      }
    ],
    tags: ['NABL', 'Cancer Specialist', 'Advanced Technology'],
    relatedScans: ['ct-chest', 'bone-scan'],
    faqs: [
      {
        question: 'Is PET CT scan safe?',
        answer: 'Yes, uses small amounts of radioactive tracer that clears from body quickly.'
      }
    ]
  },
  {
    id: 'ecg-home',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop',
    title: 'Digital ECG at Home',
    description: 'Professional ECG monitoring at your convenience',
    category: 'cardiac',
    purpose: 'Monitor heart rhythm, detect arrhythmias and cardiac conditions',
    preparation: 'Wear comfortable clothing. Avoid caffeine 2 hours before.',
    duration: '15-20 minutes',
    fastingRequired: false,
    parameters: 10,
    centers: [
      {
        id: 'vijaya-home',
        name: 'Vijaya Diagnostics',
        price: 299,
        originalPrice: 500,
        rating: 4.7,
        deliveryTime: 'Same day',
        homePickup: true,
        nabl: true,
        offers: 'Cardiologist review included'
      },
      {
        id: 'lucid-home',
        name: 'Lucid Diagnostics',
        price: 350,
        originalPrice: 600,
        rating: 4.6,
        deliveryTime: 'Same day',
        homePickup: true,
        nabl: true
      }
    ],
    tags: ['Home Service', 'NABL', 'Quick Report'],
    relatedScans: ['echo-2d', 'stress-test'],
    faqs: [
      {
        question: 'How accurate is home ECG?',
        answer: 'Very accurate when performed by trained technicians with hospital-grade equipment.'
      }
    ]
  }
];

export const scanPackages = [
  {
    id: 'comprehensive-health',
    title: 'Comprehensive Health Screening',
    description: 'Complete body scan package with multiple imaging modalities',
    originalPrice: 8500,
    discountedPrice: 6800,
    scans: ['chest-xray', 'ultrasound-abdomen', 'ecg-home'],
    centers: ['vijaya-diagnostics', 'thyrocare', 'redcliffe'],
    tags: ['Best Value', 'NABL', 'Complete Screening']
  },
  {
    id: 'cardiac-screening',
    title: 'Cardiac Health Package',
    description: 'Comprehensive heart health assessment',
    originalPrice: 4500,
    discountedPrice: 3600,
    scans: ['ecg-home', 'echo-2d', 'stress-test'],
    centers: ['apollo-cardiac', 'fortis-heart'],
    tags: ['Heart Health', 'Cardiologist Review', 'NABL']
  },
  {
    id: 'pregnancy-care',
    title: 'Pregnancy Care Package',
    description: 'Complete pregnancy monitoring scans',
    originalPrice: 6000,
    discountedPrice: 4800,
    scans: ['nt-scan', 'anomaly-scan', 'growth-scan'],
    centers: ['fetal-medicine', 'mother-care'],
    tags: ['Pregnancy Care', 'Expert Monitoring', 'NABL']
  }
];