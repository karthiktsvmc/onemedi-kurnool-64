export interface HomeCareCategory {
  id: string;
  name: string;
  image: string;
  description: string;
  redirectTo?: string;
}

export interface HomeCareService {
  id: string;
  categoryId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  serviceIcon: string;
  qualifications: string[];
  carePlan: string[];
  faq: { question: string; answer: string }[];
  durations: {
    id: string;
    label: string;
    price?: number;
    unit: string;
  }[];
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export const homeCareCategories: HomeCareCategory[] = [
  {
    id: 'nursing',
    name: 'Nursing Care',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=face',
    description: 'Professional nursing care at home'
  },
  {
    id: 'care-attendant',
    name: 'Care Attendant',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    description: 'Personal care assistance'
  },
  {
    id: 'rehabilitation',
    name: 'Rehabilitation',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
    description: 'Physical therapy and rehabilitation'
  },
  {
    id: 'icu-setup',
    name: 'ICU Setup',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=400&fit=crop&crop=center',
    description: 'Complete ICU setup at home'
  },
  {
    id: 'post-discharge',
    name: 'Post Discharge Care',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&crop=center',
    description: 'Care after hospital discharge'
  },
  {
    id: 'elder-care',
    name: 'Elder Care',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=400&fit=crop&crop=face',
    description: 'Specialized elderly care services'
  },
  {
    id: 'post-surgical',
    name: 'Post-surgical Care',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center',
    description: 'Recovery care after surgery'
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop&crop=face',
    description: 'Newborn and infant care'
  },
  {
    id: 'palliative-care',
    name: 'Palliative Care',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=center',
    description: 'Comfort and pain management'
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop&crop=center',
    description: 'Home diagnostic services',
    redirectTo: '/lab-tests'
  },
  {
    id: 'doctors',
    name: 'Doctors',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    description: 'Doctor consultation at home',
    redirectTo: '/doctors'
  }
];

export const homeCareServices: HomeCareService[] = [
  {
    id: 'home-nursing-1',
    categoryId: 'nursing',
    title: 'Professional Home Nursing',
    shortDescription: 'Skilled nursing care for medical conditions, medication management, and wound care.',
    fullDescription: 'Our certified nurses provide comprehensive medical care at home including medication administration, wound dressing, injection services, and monitoring vital signs. Perfect for patients recovering from illness or managing chronic conditions.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    serviceIcon: '🏥',
    qualifications: [
      'Registered Nurse (RN) with 3+ years experience',
      'Certified in Basic Life Support (BLS)',
      'Background verified and trained'
    ],
    carePlan: [
      'Initial health assessment',
      'Medication management',
      'Vital signs monitoring',
      'Wound care and dressing',
      'Regular progress reports'
    ],
    faq: [
      {
        question: 'What qualifications do your nurses have?',
        answer: 'All our nurses are registered professionals with minimum 3 years of experience and certified in emergency care.'
      },
      {
        question: 'Can nurses handle emergency situations?',
        answer: 'Yes, our nurses are trained in emergency response and will coordinate with doctors and hospitals as needed.'
      }
    ],
    durations: [
      { id: 'visit', label: 'Per Visit', price: 800, unit: 'visit' },
      { id: '8hr', label: '8 Hours', price: 2500, unit: 'day' },
      { id: '12hr', label: '12 Hours', price: 3500, unit: 'day' },
      { id: '24hr', label: '24 Hours', price: 6000, unit: 'day' },
      { id: '1week', label: '1 Week', price: 35000, unit: 'week' }
    ],
    tags: ['Doctor Recommended', 'Female Staff Available', 'Equipment Included'],
    rating: 4.8,
    reviewCount: 127,
    featured: true
  },
  {
    id: 'care-attendant-1',
    categoryId: 'care-attendant',
    title: 'Personal Care Attendant',
    shortDescription: 'Compassionate personal care assistance for daily activities and companionship.',
    fullDescription: 'Our trained care attendants provide personal care assistance including bathing, dressing, feeding, mobility support, and companionship. Ideal for elderly patients or those with disabilities.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop',
    serviceIcon: '🤝',
    qualifications: [
      'Certified Nursing Assistant (CNA)',
      'Training in elderly care',
      'CPR certified'
    ],
    carePlan: [
      'Personal hygiene assistance',
      'Mobility and transfer support',
      'Meal preparation and feeding',
      'Medication reminders',
      'Companionship and emotional support'
    ],
    faq: [
      {
        question: 'What personal care services are included?',
        answer: 'Services include bathing, dressing, grooming, toileting, mobility assistance, and meal support.'
      },
      {
        question: 'Are attendants available 24/7?',
        answer: 'Yes, we provide round-the-clock care attendants based on your needs.'
      }
    ],
    durations: [
      { id: '8hr', label: '8 Hours', price: 1800, unit: 'day' },
      { id: '12hr', label: '12 Hours', price: 2500, unit: 'day' },
      { id: '24hr', label: '24 Hours', price: 4500, unit: 'day' },
      { id: '1week', label: '1 Week', price: 28000, unit: 'week' }
    ],
    tags: ['Female Staff Available', 'Urgent'],
    rating: 4.6,
    reviewCount: 89,
    featured: false
  },
  {
    id: 'physiotherapy-1',
    categoryId: 'rehabilitation',
    title: 'Home Physiotherapy',
    shortDescription: 'Professional physiotherapy sessions at home for rehabilitation and pain management.',
    fullDescription: 'Certified physiotherapists provide personalized rehabilitation programs at home. Services include exercise therapy, manual therapy, and specialized treatments for various conditions.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    serviceIcon: '🏃‍♂️',
    qualifications: [
      'Licensed Physiotherapist (BPT/MPT)',
      'Specialized in home rehabilitation',
      '5+ years clinical experience'
    ],
    carePlan: [
      'Initial assessment and goal setting',
      'Customized exercise program',
      'Manual therapy techniques',
      'Progress monitoring',
      'Home exercise guidance'
    ],
    faq: [
      {
        question: 'What conditions can be treated at home?',
        answer: 'We treat post-surgery recovery, stroke rehabilitation, sports injuries, chronic pain, and mobility issues.'
      },
      {
        question: 'Do you bring equipment?',
        answer: 'Yes, we bring all necessary physiotherapy equipment and mobility aids.'
      }
    ],
    durations: [
      { id: 'session', label: 'Per Session', price: 1200, unit: 'session' },
      { id: '5sessions', label: '5 Sessions', price: 5500, unit: 'package' },
      { id: '10sessions', label: '10 Sessions', price: 10000, unit: 'package' }
    ],
    tags: ['Doctor Recommended', 'Equipment Included'],
    rating: 4.9,
    reviewCount: 156,
    featured: true
  },
  {
    id: 'icu-setup-1',
    categoryId: 'icu-setup',
    title: 'Complete ICU Setup at Home',
    shortDescription: 'Full ICU facility setup at home with ventilator, monitors, and 24/7 critical care.',
    fullDescription: 'Transform your home into a fully equipped ICU with ventilators, cardiac monitors, infusion pumps, and round-the-clock critical care nursing. Ideal for patients requiring intensive monitoring.',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=600&fit=crop',
    serviceIcon: '🏥',
    qualifications: [
      'ICU trained nurses and technicians',
      'Critical care certified staff',
      'Doctor on-call 24/7'
    ],
    carePlan: [
      'Complete ICU equipment setup',
      '24/7 critical care monitoring',
      'Ventilator management',
      'Regular doctor consultations',
      'Emergency response protocol'
    ],
    faq: [
      {
        question: 'What equipment is included in ICU setup?',
        answer: 'Ventilator, cardiac monitor, infusion pumps, suction unit, oxygen concentrator, and all necessary medical devices.'
      },
      {
        question: 'Is 24/7 nursing included?',
        answer: 'Yes, round-the-clock ICU trained nursing staff is included in the package.'
      }
    ],
    durations: [
      { id: '24hr', label: '24 Hours', price: 15000, unit: 'day' },
      { id: '1week', label: '1 Week', price: 95000, unit: 'week' },
      { id: '1month', label: '1 Month', price: 350000, unit: 'month' }
    ],
    tags: ['Doctor Recommended', 'Equipment Included', 'Urgent'],
    rating: 4.7,
    reviewCount: 34,
    featured: true
  },
  {
    id: 'elder-care-1',
    categoryId: 'elder-care',
    title: 'Comprehensive Elder Care',
    shortDescription: 'Specialized care for elderly patients including medical care, companionship, and daily assistance.',
    fullDescription: 'Our elder care specialists provide comprehensive care for senior citizens including medication management, fall prevention, cognitive support, and companionship services.',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop',
    serviceIcon: '👴',
    qualifications: [
      'Geriatric care specialist',
      'Training in dementia care',
      'First aid certified'
    ],
    carePlan: [
      'Health and safety assessment',
      'Medication management',
      'Fall prevention measures',
      'Cognitive engagement activities',
      'Family communication and updates'
    ],
    faq: [
      {
        question: 'Do you provide dementia care?',
        answer: 'Yes, our caregivers are specially trained in dementia and Alzheimer\'s care.'
      },
      {
        question: 'Can families visit anytime?',
        answer: 'Absolutely, we encourage family involvement and provide regular updates.'
      }
    ],
    durations: [
      { id: '8hr', label: '8 Hours', price: 2000, unit: 'day' },
      { id: '12hr', label: '12 Hours', price: 2800, unit: 'day' },
      { id: '24hr', label: '24 Hours', price: 5000, unit: 'day' },
      { id: '1month', label: '1 Month', price: 120000, unit: 'month' }
    ],
    tags: ['Female Staff Available', 'Doctor Recommended'],
    rating: 4.8,
    reviewCount: 203,
    featured: false
  }
];