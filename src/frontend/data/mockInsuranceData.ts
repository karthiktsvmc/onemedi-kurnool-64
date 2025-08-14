
export interface InsurancePlan {
  id: string;
  insurerName: string;
  insurerLogo: string;
  planName: string;
  type: 'Health' | 'Life' | 'Critical Illness';
  monthlyPremium: number;
  annualPremium: number;
  coverageAmount: number;
  keyBenefits: string[];
  hospitalNetwork: number;
  features: string[];
  ageLimit: { min: number; max: number };
  waitingPeriod: string;
  rating: number;
  reviewCount: number;
  taxBenefit: boolean;
  cashlessClaims: boolean;
  preExistingCoverage: boolean;
}

export const mockInsurancePlans: InsurancePlan[] = [
  {
    id: '1',
    insurerName: 'Star Health Insurance',
    insurerLogo: '/placeholder.svg',
    planName: 'Star Health Comprehensive',
    type: 'Health',
    monthlyPremium: 850,
    annualPremium: 9500,
    coverageAmount: 500000,
    keyBenefits: [
      'Hospitalization Coverage',
      'Pre & Post Hospitalization',
      'Day Care Procedures',
      'Ambulance Coverage'
    ],
    hospitalNetwork: 9500,
    features: ['Cashless Claims', '24/7 Customer Support', 'Online Policy Management'],
    ageLimit: { min: 18, max: 65 },
    waitingPeriod: '30 days',
    rating: 4.3,
    reviewCount: 1250,
    taxBenefit: true,
    cashlessClaims: true,
    preExistingCoverage: true
  },
  {
    id: '2',
    insurerName: 'HDFC ERGO',
    insurerLogo: '/placeholder.svg',
    planName: 'My Health Suraksha',
    type: 'Health',
    monthlyPremium: 920,
    annualPremium: 10200,
    coverageAmount: 300000,
    keyBenefits: [
      'OPD Coverage',
      'Health Check-ups',
      'Maternity Coverage',
      'Mental Health Coverage'
    ],
    hospitalNetwork: 8200,
    features: ['Wellness Benefits', 'Telemedicine', 'Health Coach'],
    ageLimit: { min: 18, max: 75 },
    waitingPeriod: '45 days',
    rating: 4.5,
    reviewCount: 890,
    taxBenefit: true,
    cashlessClaims: true,
    preExistingCoverage: false
  },
  {
    id: '3',
    insurerName: 'ICICI Prudential',
    insurerLogo: '/placeholder.svg',
    planName: 'iProtect Smart Term',
    type: 'Life',
    monthlyPremium: 1200,
    annualPremium: 13500,
    coverageAmount: 2000000,
    keyBenefits: [
      'Life Coverage',
      'Accidental Death Benefit',
      'Terminal Illness Coverage',
      'Premium Waiver'
    ],
    hospitalNetwork: 0,
    features: ['Online Claims', 'Flexible Payment Options', 'Tax Benefits'],
    ageLimit: { min: 18, max: 60 },
    waitingPeriod: 'None',
    rating: 4.6,
    reviewCount: 2100,
    taxBenefit: true,
    cashlessClaims: false,
    preExistingCoverage: false
  },
  {
    id: '4',
    insurerName: 'Max Bupa',
    insurerLogo: '/placeholder.svg',
    planName: 'Critical Illness Protect',
    type: 'Critical Illness',
    monthlyPremium: 650,
    annualPremium: 7200,
    coverageAmount: 1000000,
    keyBenefits: [
      'Cancer Coverage',
      'Heart Disease Coverage',
      'Stroke Coverage',
      'Organ Transplant'
    ],
    hospitalNetwork: 6500,
    features: ['Lump Sum Payout', 'Second Opinion', 'Recovery Support'],
    ageLimit: { min: 25, max: 65 },
    waitingPeriod: '90 days',
    rating: 4.4,
    reviewCount: 750,
    taxBenefit: true,
    cashlessClaims: true,
    preExistingCoverage: true
  }
];

export interface InsuranceFAQ {
  question: string;
  answer: string;
  category: 'claims' | 'tax' | 'coverage' | 'general';
}

export const mockInsuranceFAQs: InsuranceFAQ[] = [
  {
    question: 'How do I claim my insurance?',
    answer: 'You can claim your insurance by calling our 24/7 helpline, using our mobile app, or visiting any network hospital for cashless treatment.',
    category: 'claims'
  },
  {
    question: 'What tax benefits do I get?',
    answer: 'You can claim deduction up to ₹1.5 lakh under Section 80C for life insurance premiums and up to ₹25,000 under Section 80D for health insurance premiums.',
    category: 'tax'
  },
  {
    question: 'Are pre-existing conditions covered?',
    answer: 'Pre-existing conditions are covered after a waiting period as specified in your policy. This varies by insurer and condition.',
    category: 'coverage'
  },
  {
    question: 'Can I buy insurance online?',
    answer: 'Yes, you can purchase insurance online through our platform. The process is completely digital and secure.',
    category: 'general'
  }
];
