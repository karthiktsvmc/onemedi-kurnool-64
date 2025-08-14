export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  age: number;
  expertise: string[];
  languages: string[];
  consultationTypes: ('online' | 'clinic' | 'home')[];
  rating: number;
  reviewCount: number;
  consultationFee: {
    online: number;
    clinic: number;
    home?: number;
  };
  availability: {
    today: boolean;
    nextAvailable: string;
  };
  image: string;
  about: string;
  clinicAddress?: string;
  verified: boolean;
  tags: string[];
}

export interface Speciality {
  id: string;
  name: string;
  image: string;
  doctorCount: number;
  popularConditions: string[];
}

export const specialities: Speciality[] = [
  {
    id: 'general-physician',
    name: 'General Physician',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=200&fit=crop&crop=face',
    doctorCount: 45,
    popularConditions: ['Fever', 'Cold', 'Headache', 'Body Pain']
  },
  {
    id: 'dermatologist',
    name: 'Skin & Hair',
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&crop=face',
    doctorCount: 32,
    popularConditions: ['Acne', 'Hair Fall', 'Skin Rash', 'Eczema']
  },
  {
    id: 'orthopedic',
    name: 'Orthopedic',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop&crop=face',
    doctorCount: 28,
    popularConditions: ['Joint Pain', 'Back Pain', 'Fracture', 'Arthritis']
  },
  {
    id: 'ent',
    name: 'ENT',
    image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=200&h=200&fit=crop&crop=face',
    doctorCount: 24,
    popularConditions: ['Throat Pain', 'Ear Pain', 'Hearing Loss', 'Sinusitis']
  },
  {
    id: 'pediatrician',
    name: 'Pediatrician',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=200&h=200&fit=crop&crop=face',
    doctorCount: 35,
    popularConditions: ['Child Fever', 'Vaccination', 'Growth Issues', 'Allergies']
  },
  {
    id: 'emergency',
    name: 'Emergency',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=200&fit=crop&crop=face',
    doctorCount: 18,
    popularConditions: ['Chest Pain', 'Breathing Issues', 'Accidents', 'Critical Care']
  },
  {
    id: 'anesthesia',
    name: 'Anesthesia',
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&crop=face',
    doctorCount: 15,
    popularConditions: ['Surgery Prep', 'Pain Management', 'Critical Care', 'ICU Care']
  },
  {
    id: 'physician-home',
    name: 'Home Visit',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop&crop=face',
    doctorCount: 22,
    popularConditions: ['Elder Care', 'Post Surgery', 'Chronic Care', 'Bedridden Care']
  }
];

export const doctors: Doctor[] = [
  {
    id: 'dr-karthik',
    name: 'Dr. T. Karthik',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    experience: 12,
    age: 38,
    expertise: ['Diabetes', 'Hypertension', 'Fever', 'General Health', 'Preventive Care'],
    languages: ['English', 'Telugu', 'Hindi'],
    consultationTypes: ['online', 'clinic'],
    rating: 4.8,
    reviewCount: 324,
    consultationFee: {
      online: 300,
      clinic: 500
    },
    availability: {
      today: true,
      nextAvailable: 'Today 2:30 PM'
    },
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=300&fit=crop&crop=face',
    about: 'Experienced General Physician with expertise in managing chronic conditions and preventive healthcare.',
    clinicAddress: 'Apollo Clinic, Jubilee Hills, Hyderabad',
    verified: true,
    tags: ['Top Rated', 'Quick Response', 'Insurance Accepted']
  },
  {
    id: 'dr-ramya',
    name: 'Dr. K. Ramya',
    specialization: 'Skin & Hair Specialist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    age: 34,
    expertise: ['Acne Treatment', 'Hair Fall', 'Skin Whitening', 'Laser Treatment', 'Cosmetic Dermatology'],
    languages: ['English', 'Telugu', 'Tamil'],
    consultationTypes: ['online', 'clinic'],
    rating: 4.9,
    reviewCount: 256,
    consultationFee: {
      online: 400,
      clinic: 600
    },
    availability: {
      today: false,
      nextAvailable: 'Tomorrow 10:00 AM'
    },
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=300&h=300&fit=crop&crop=face',
    about: 'Specialist in advanced dermatology treatments with focus on cosmetic and therapeutic procedures.',
    clinicAddress: 'Kamineni Skin Clinic, Banjara Hills, Hyderabad',
    verified: true,
    tags: ['Cosmetic Expert', 'Latest Technology', 'Female Doctor']
  },
  {
    id: 'dr-subba-reddy',
    name: 'Dr. D.V. Subba Reddy',
    specialization: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 15,
    age: 45,
    expertise: ['Joint Replacement', 'Spine Surgery', 'Sports Injuries', 'Arthroscopy', 'Fracture Care'],
    languages: ['English', 'Telugu', 'Hindi'],
    consultationTypes: ['clinic'],
    rating: 4.7,
    reviewCount: 428,
    consultationFee: {
      online: 0,
      clinic: 800
    },
    availability: {
      today: true,
      nextAvailable: 'Today 4:00 PM'
    },
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop&crop=face',
    about: 'Senior Orthopedic Surgeon specializing in complex joint replacements and minimally invasive procedures.',
    clinicAddress: 'KIMS Hospital, Secunderabad',
    verified: true,
    tags: ['Senior Consultant', 'Surgery Expert', 'Insurance Accepted']
  },
  {
    id: 'dr-abhilash',
    name: 'Dr. R. Abhilash',
    specialization: 'ENT Surgeon',
    qualification: 'MBBS, MS (ENT)',
    experience: 10,
    age: 36,
    expertise: ['Sinus Surgery', 'Hearing Loss', 'Throat Disorders', 'Nasal Problems', 'Voice Disorders'],
    languages: ['English', 'Telugu', 'Hindi'],
    consultationTypes: ['online', 'clinic'],
    rating: 4.6,
    reviewCount: 189,
    consultationFee: {
      online: 350,
      clinic: 550
    },
    availability: {
      today: true,
      nextAvailable: 'Today 3:15 PM'
    },
    image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=300&h=300&fit=crop&crop=face',
    about: 'ENT Specialist with expertise in endoscopic sinus surgery and advanced hearing restoration procedures.',
    clinicAddress: 'Care Hospital, Hi-Tech City, Hyderabad',
    verified: true,
    tags: ['Microsurgery Expert', 'Advanced Procedures', 'Quick Recovery']
  },
  {
    id: 'dr-eshwar',
    name: 'Dr. Eshwar',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 9,
    age: 35,
    expertise: ['Child Development', 'Vaccination', 'Newborn Care', 'Growth Disorders', 'Childhood Infections'],
    languages: ['English', 'Telugu', 'Hindi'],
    consultationTypes: ['online', 'clinic', 'home'],
    rating: 4.8,
    reviewCount: 312,
    consultationFee: {
      online: 300,
      clinic: 450,
      home: 800
    },
    availability: {
      today: true,
      nextAvailable: 'Today 1:45 PM'
    },
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop&crop=face',
    about: 'Caring pediatrician with special interest in child development and preventive healthcare.',
    clinicAddress: 'Rainbow Children Hospital, Kondapur',
    verified: true,
    tags: ['Child Friendly', 'Home Visits Available', 'Vaccination Expert']
  },
  {
    id: 'dr-pramod-kumar',
    name: 'Dr. Pramod Kumar',
    specialization: 'Physician - Home Visits',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: 11,
    age: 40,
    expertise: ['Elder Care', 'Chronic Disease Management', 'Post-Surgery Care', 'Bedridden Patients', 'IV Therapy'],
    languages: ['English', 'Telugu', 'Hindi'],
    consultationTypes: ['home', 'online'],
    rating: 4.7,
    reviewCount: 267,
    consultationFee: {
      online: 250,
      clinic: 0,
      home: 700
    },
    availability: {
      today: true,
      nextAvailable: 'Today 5:00 PM'
    },
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=300&fit=crop&crop=face',
    about: 'Dedicated physician specializing in home healthcare services for elderly and chronic patients.',
    clinicAddress: 'Home Visit Service - Covers all Hyderabad',
    verified: true,
    tags: ['Home Visit Specialist', 'Elder Care Expert', '24/7 Available']
  },
  {
    id: 'dr-ramesh-naik',
    name: 'Dr. Ramesh Naik',
    specialization: 'Emergency Physician',
    qualification: 'MBBS, MD (Emergency Medicine)',
    experience: 7,
    age: 33,
    expertise: ['Critical Care', 'Trauma Management', 'Cardiac Emergencies', 'Stroke Care', 'Emergency Procedures'],
    languages: ['English', 'Telugu', 'Hindi'],
    consultationTypes: ['clinic'],
    rating: 4.5,
    reviewCount: 156,
    consultationFee: {
      online: 0,
      clinic: 600
    },
    availability: {
      today: true,
      nextAvailable: 'Available 24/7'
    },
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop&crop=face',
    about: 'Emergency medicine specialist with extensive experience in critical care and trauma management.',
    clinicAddress: 'Apollo Emergency, Multiple Locations',
    verified: true,
    tags: ['24/7 Emergency', 'Critical Care', 'Trauma Expert']
  },
  {
    id: 'dr-ragu-praveen',
    name: 'Dr. Ragu Praveen Kumar',
    specialization: 'Anesthesia & Critical Care',
    qualification: 'MBBS, MD (Anesthesiology)',
    experience: 13,
    age: 42,
    expertise: ['ICU Management', 'Pain Management', 'Anesthesia', 'Critical Care', 'Ventilator Management'],
    languages: ['English', 'Telugu', 'Tamil'],
    consultationTypes: ['clinic'],
    rating: 4.6,
    reviewCount: 98,
    consultationFee: {
      online: 0,
      clinic: 700
    },
    availability: {
      today: false,
      nextAvailable: 'Tomorrow 9:00 AM'
    },
    image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=300&h=300&fit=crop&crop=face',
    about: 'Critical care specialist with expertise in ICU management and advanced life support systems.',
    clinicAddress: 'NIMS Hospital, Punjagutta',
    verified: true,
    tags: ['ICU Specialist', 'Pain Management', 'Advanced Care']
  }
];

export const promotionalStrips = {
  'general-physician': [
    'Book General Physician Consultation - Get 20% OFF on first visit',
    'Free Health Checkup with GP Consultation - Limited Time',
    'Online GP Consultation at ₹199 - Available 24/7',
    'Diabetes & BP Management - Expert GP Care',
    'Preventive Health Packages with GP Consultation'
  ],
  'dermatologist': [
    'Skin & Hair Treatment - Get Glowing Skin in 30 Days',
    'Hair Fall Treatment - 90% Success Rate Guaranteed',
    'Acne Treatment Package - Clear Skin in 6 Weeks',
    'Laser Hair Removal - 50% OFF this Month',
    'Anti-Aging Treatment - Look 10 Years Younger'
  ],
  'orthopedic': [
    'Joint Pain Relief - Advanced Orthopedic Care',
    'Knee Replacement Surgery - Minimal Invasive Technique',
    'Sports Injury Treatment - Get Back to Action Fast',
    'Spine Surgery - Pain-Free Life Guaranteed',
    'Physiotherapy Package - Complete Recovery Program'
  ],
  'ent': [
    'Sinus Treatment - Breathe Easy Again',
    'Hearing Aid Consultation - Free Hearing Test',
    'Throat Surgery - Latest Minimally Invasive Techniques',
    'Voice Therapy - Professional Voice Training',
    'Allergy Treatment - Permanent Solution Available'
  ],
  'pediatrician': [
    'Child Health Checkup - Complete Growth Assessment',
    'Vaccination Package - Protect Your Child',
    'Newborn Care - Expert Pediatric Support',
    'Child Development Program - Ensure Healthy Growth',
    'Childhood Allergy Treatment - Safe & Effective'
  ],
  'emergency': [
    '24/7 Emergency Care - Critical Care Specialists',
    'Ambulance Service - Equipped with ICU Facilities',
    'Heart Attack Emergency - Golden Hour Treatment',
    'Stroke Care - Advanced Neuro Emergency',
    'Trauma Care - Expert Emergency Surgeons'
  ],
  'anesthesia': [
    'Pain Management Clinic - Advanced Pain Relief',
    'ICU Care - State-of-the-art Critical Care',
    'Surgery Support - Expert Anesthesia Services',
    'Chronic Pain Treatment - Long-term Relief',
    'Post-Surgery Care - Complete Recovery Support'
  ],
  'physician-home': [
    'Home Visit Doctor - Healthcare at Your Doorstep',
    'Elder Care at Home - Comprehensive Health Support',
    'IV Therapy at Home - Professional Medical Care',
    'Post-Surgery Home Care - Expert Recovery Support',
    'Chronic Disease Management - Home Healthcare'
  ]
};

export const diseases = [
  'Diabetes', 'Hypertension', 'Fever', 'Cold', 'Cough', 'Headache', 'Back Pain',
  'Joint Pain', 'Skin Problems', 'Hair Fall', 'Acne', 'Hearing Loss', 'Sinus',
  'Allergies', 'Heart Problems', 'Kidney Problems', 'Liver Problems', 'Thyroid',
  'PCOS', 'Pregnancy Care', 'Child Care', 'Elder Care', 'Mental Health'
];