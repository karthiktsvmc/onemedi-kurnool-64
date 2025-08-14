
export const medicinesData = {
  categories: [
    { id: 'pain-relief', name: 'Pain Relief', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop' },
    { id: 'diabetes', name: 'Diabetes', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop' },
    { id: 'heart', name: 'Heart Care', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop' },
    { id: 'vitamins', name: 'Vitamins', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=100&h=100&fit=crop' },
    { id: 'antibiotics', name: 'Antibiotics', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&h=100&fit=crop' },
    { id: 'blood-pressure', name: 'BP Care', image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=100&h=100&fit=crop' }
  ],
  products: [
    {
      id: 'med-1',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
      title: 'Paracetamol 500mg',
      subtitle: 'Pain Relief',
      brand: 'Cipla',
      price: '25',
      originalPrice: '35',
      rating: 4.5,
      reviewCount: 1240,
      discount: '29',
      savedAmount: '10',
      inStock: true,
      prescription: false,
      variants: [
        { id: '10-tablets', name: '10 Tablets', price: '25', originalPrice: '35' },
        { id: '30-tablets', name: '30 Tablets', price: '65', originalPrice: '85' },
        { id: '100-tablets', name: '100 Tablets', price: '200', originalPrice: '250' }
      ],
      badges: ['Generic Available']
    },
    {
      id: 'med-2',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'Vitamin D3 Tablets',
      subtitle: 'Vitamins',
      brand: 'Sun Pharma',
      price: '180',
      originalPrice: '220',
      rating: 4.7,
      reviewCount: 890,
      discount: '18',
      savedAmount: '40',
      inStock: true,
      prescription: false,
      variants: [
        { id: '30-tabs', name: '30 Tablets', price: '180', originalPrice: '220' },
        { id: '60-tabs', name: '60 Tablets', price: '320', originalPrice: '400' }
      ],
      badges: ['Branded']
    },
    {
      id: 'med-3',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      title: 'Metformin 500mg',
      subtitle: 'Diabetes',
      brand: 'Lupin',
      price: '45',
      originalPrice: '60',
      rating: 4.3,
      reviewCount: 567,
      discount: '25',
      savedAmount: '15',
      inStock: true,
      prescription: true,
      variants: [
        { id: '30-tabs', name: '30 Tablets', price: '45', originalPrice: '60' },
        { id: '90-tabs', name: '90 Tablets', price: '120', originalPrice: '150' }
      ],
      badges: ['Generic Available']
    },
    {
      id: 'med-4',
      image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=300&h=200&fit=crop',
      title: 'Amlodipine 5mg',
      subtitle: 'Blood Pressure',
      brand: 'Cipla',
      price: '35',
      originalPrice: '50',
      rating: 4.6,
      reviewCount: 743,
      discount: '30',
      savedAmount: '15',
      inStock: true,
      prescription: true,
      variants: [
        { id: '30-tabs', name: '30 Tablets', price: '35', originalPrice: '50' },
        { id: '100-tabs', name: '100 Tablets', price: '110', originalPrice: '150' }
      ],
      badges: ['Branded', 'Generic Available']
    },
    {
      id: 'med-5',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
      title: 'Azithromycin 500mg',
      subtitle: 'Antibiotics',
      brand: 'Dr. Reddy\'s',
      price: '85',
      originalPrice: '120',
      rating: 4.4,
      reviewCount: 456,
      discount: '29',
      savedAmount: '35',
      inStock: true,
      prescription: true,
      variants: [
        { id: '3-tabs', name: '3 Tablets', price: '85', originalPrice: '120' },
        { id: '5-tabs', name: '5 Tablets', price: '130', originalPrice: '180' }
      ],
      badges: ['Generic Available']
    },
    {
      id: 'med-6',
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=300&h=200&fit=crop',
      title: 'Vitamin B12 Complex',
      subtitle: 'Vitamins',
      brand: 'Himalaya',
      price: '140',
      originalPrice: '180',
      rating: 4.5,
      reviewCount: 623,
      discount: '22',
      savedAmount: '40',
      inStock: true,
      prescription: false,
      variants: [
        { id: '30-caps', name: '30 Capsules', price: '140', originalPrice: '180' },
        { id: '60-caps', name: '60 Capsules', price: '260', originalPrice: '320' }
      ],
      badges: ['Branded']
    },
    {
      id: 'med-7',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
      title: 'Ibuprofen 400mg',
      subtitle: 'Pain Relief',
      brand: 'Abbott',
      price: '42',
      originalPrice: '55',
      rating: 4.3,
      reviewCount: 892,
      discount: '24',
      savedAmount: '13',
      inStock: true,
      prescription: false,
      variants: [
        { id: '20-tabs', name: '20 Tablets', price: '42', originalPrice: '55' },
        { id: '50-tabs', name: '50 Tablets', price: '95', originalPrice: '125' }
      ],
      badges: ['Generic Available']
    },
    {
      id: 'med-8',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'Insulin Glargine',
      subtitle: 'Diabetes',
      brand: 'Sanofi',
      price: '850',
      originalPrice: '950',
      rating: 4.8,
      reviewCount: 234,
      discount: '11',
      savedAmount: '100',
      inStock: true,
      prescription: true,
      variants: [
        { id: '3ml-pen', name: '3ml Pen', price: '850', originalPrice: '950' },
        { id: '5ml-vial', name: '5ml Vial', price: '1200', originalPrice: '1350' }
      ],
      badges: ['Branded']
    },
    {
      id: 'med-9',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      title: 'Atorvastatin 20mg',
      subtitle: 'Heart Care',
      brand: 'Ranbaxy',
      price: '125',
      originalPrice: '160',
      rating: 4.5,
      reviewCount: 678,
      discount: '22',
      savedAmount: '35',
      inStock: true,
      prescription: true,
      variants: [
        { id: '30-tabs', name: '30 Tablets', price: '125', originalPrice: '160' },
        { id: '90-tabs', name: '90 Tablets', price: '350', originalPrice: '450' }
      ],
      badges: ['Generic Available']
    },
    {
      id: 'med-10',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop',
      title: 'Amoxicillin 250mg',
      subtitle: 'Antibiotics',
      brand: 'GSK',
      price: '65',
      originalPrice: '85',
      rating: 4.2,
      reviewCount: 445,
      discount: '24',
      savedAmount: '20',
      inStock: true,
      prescription: true,
      variants: [
        { id: '21-caps', name: '21 Capsules', price: '65', originalPrice: '85' },
        { id: '30-caps', name: '30 Capsules', price: '90', originalPrice: '120' }
      ],
      badges: ['Branded', 'Generic Available']
    }
  ]
};

export const labTestsData = {
  categories: [
    { id: 'blood-tests', name: 'Blood Tests', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop' },
    { id: 'diabetes', name: 'Diabetes', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop' },
    { id: 'heart', name: 'Heart', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop' },
    { id: 'packages', name: 'Packages', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop' },
    { id: 'women-health', name: 'Women Health', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop' },
    { id: 'thyroid', name: 'Thyroid', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop' }
  ],
  products: [
    {
      id: 'test-1',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
      title: 'Complete Blood Count (CBC)',
      subtitle: 'Blood Tests',
      center: 'Apollo Diagnostics',
      price: '250',
      originalPrice: '300',
      rating: 4.6,
      reviewCount: 2340,
      discount: '17',
      savedAmount: '50',
      inStock: true,
      centers: [
        { id: 'apollo', name: 'Apollo Diagnostics', price: '250', originalPrice: '300' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '280', originalPrice: '350' },
        { id: 'thyrocare', name: 'Thyrocare', price: '200', originalPrice: '250' }
      ]
    },
    {
      id: 'test-2',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'HbA1c Test',
      subtitle: 'Diabetes',
      center: 'Dr. Lal PathLabs',
      price: '400',
      originalPrice: '500',
      rating: 4.5,
      reviewCount: 1890,
      discount: '20',
      savedAmount: '100',
      inStock: true,
      centers: [
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '400', originalPrice: '500' },
        { id: 'apollo', name: 'Apollo Diagnostics', price: '450', originalPrice: '550' },
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '380', originalPrice: '480' }
      ]
    },
    {
      id: 'test-3',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      title: 'Lipid Profile',
      subtitle: 'Heart',
      center: 'Thyrocare',
      price: '300',
      originalPrice: '400',
      rating: 4.4,
      reviewCount: 1456,
      discount: '25',
      savedAmount: '100',
      inStock: true,
      centers: [
        { id: 'thyrocare', name: 'Thyrocare', price: '300', originalPrice: '400' },
        { id: 'apollo', name: 'Apollo Diagnostics', price: '350', originalPrice: '450' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '320', originalPrice: '420' }
      ]
    },
    {
      id: 'test-4',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      title: 'Master Health Checkup',
      subtitle: 'Packages',
      center: 'Apollo Diagnostics',
      price: '2500',
      originalPrice: '3200',
      rating: 4.7,
      reviewCount: 856,
      discount: '22',
      savedAmount: '700',
      inStock: true,
      centers: [
        { id: 'apollo', name: 'Apollo Diagnostics', price: '2500', originalPrice: '3200' },
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '2800', originalPrice: '3500' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '2650', originalPrice: '3300' }
      ]
    },
    {
      id: 'test-5',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      title: 'Hormonal Profile - Women',
      subtitle: 'Women Health',
      center: 'Metropolis Healthcare',
      price: '1800',
      originalPrice: '2200',
      rating: 4.6,
      reviewCount: 634,
      discount: '18',
      savedAmount: '400',
      inStock: true,
      centers: [
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '1800', originalPrice: '2200' },
        { id: 'apollo', name: 'Apollo Diagnostics', price: '1900', originalPrice: '2300' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '1750', originalPrice: '2150' }
      ]
    },
    {
      id: 'test-6',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      title: 'Thyroid Function Test',
      subtitle: 'Thyroid',
      center: 'Thyrocare',
      price: '350',
      originalPrice: '450',
      rating: 4.5,
      reviewCount: 1234,
      discount: '22',
      savedAmount: '100',
      inStock: true,
      centers: [
        { id: 'thyrocare', name: 'Thyrocare', price: '350', originalPrice: '450' },
        { id: 'apollo', name: 'Apollo Diagnostics', price: '380', originalPrice: '480' },
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '370', originalPrice: '470' }
      ]
    },
    {
      id: 'test-7',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
      title: 'Liver Function Test',
      subtitle: 'Blood Tests',
      center: 'Dr. Lal PathLabs',
      price: '450',
      originalPrice: '550',
      rating: 4.3,
      reviewCount: 987,
      discount: '18',
      savedAmount: '100',
      inStock: true,
      centers: [
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '450', originalPrice: '550' },
        { id: 'apollo', name: 'Apollo Diagnostics', price: '480', originalPrice: '580' },
        { id: 'thyrocare', name: 'Thyrocare', price: '420', originalPrice: '520' }
      ]
    },
    {
      id: 'test-8',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'Glucose Tolerance Test',
      subtitle: 'Diabetes',
      center: 'Apollo Diagnostics',
      price: '500',
      originalPrice: '650',
      rating: 4.4,
      reviewCount: 567,
      discount: '23',
      savedAmount: '150',
      inStock: true,
      centers: [
        { id: 'apollo', name: 'Apollo Diagnostics', price: '500', originalPrice: '650' },
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '520', originalPrice: '670' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '480', originalPrice: '630' }
      ]
    },
    {
      id: 'test-9',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      title: 'Cardiac Risk Markers',
      subtitle: 'Heart',
      center: 'Metropolis Healthcare',
      price: '1200',
      originalPrice: '1500',
      rating: 4.6,
      reviewCount: 445,
      discount: '20',
      savedAmount: '300',
      inStock: true,
      centers: [
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '1200', originalPrice: '1500' },
        { id: 'apollo', name: 'Apollo Diagnostics', price: '1250', originalPrice: '1550' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '1180', originalPrice: '1480' }
      ]
    },
    {
      id: 'test-10',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      title: 'Executive Health Package',
      subtitle: 'Packages',
      center: 'Apollo Diagnostics',
      price: '4500',
      originalPrice: '5500',
      rating: 4.8,
      reviewCount: 321,
      discount: '18',
      savedAmount: '1000',
      inStock: true,
      centers: [
        { id: 'apollo', name: 'Apollo Diagnostics', price: '4500', originalPrice: '5500' },
        { id: 'metropolis', name: 'Metropolis Healthcare', price: '4800', originalPrice: '5800' },
        { id: 'lal-path', name: 'Dr. Lal PathLabs', price: '4650', originalPrice: '5650' }
      ]
    }
  ]
};

export const scansData = {
  categories: [
    { id: 'mri', name: 'MRI', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop' },
    { id: 'ct-scan', name: 'CT Scan', image: 'https://images.unsplash.com/photo-1487058792275-0ad4902777e7?w=100&h=100&fit=crop' },
    { id: 'ultrasound', name: 'Ultrasound', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop' },
    { id: 'x-ray', name: 'X-Ray', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop' },
    { id: 'echo', name: 'ECHO', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop' }
  ],
  products: [
    {
      id: 'scan-1',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop',
      title: 'Brain MRI Scan',
      subtitle: 'MRI',
      center: 'Kurnool Imaging Center',
      price: '3500',
      originalPrice: '4000',
      rating: 4.8,
      reviewCount: 456,
      discount: '13',
      savedAmount: '500',
      inStock: true,
      centers: [
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '3500', originalPrice: '4000' },
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '3800', originalPrice: '4300' },
        { id: 'care-scan', name: 'Care Scan Center', price: '3600', originalPrice: '4100' }
      ]
    },
    {
      id: 'scan-2',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4902777e7?w=300&h=200&fit=crop',
      title: 'Chest CT Scan',
      subtitle: 'CT Scan',
      center: 'Apollo Imaging',
      price: '2800',
      originalPrice: '3200',
      rating: 4.7,
      reviewCount: 678,
      discount: '13',
      savedAmount: '400',
      inStock: true,
      centers: [
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '2800', originalPrice: '3200' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '2600', originalPrice: '3000' },
        { id: 'care-scan', name: 'Care Scan Center', price: '2750', originalPrice: '3150' }
      ]
    },
    {
      id: 'scan-3',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      title: 'Abdomen Ultrasound',
      subtitle: 'Ultrasound',
      center: 'Care Scan Center',
      price: '800',
      originalPrice: '1000',
      rating: 4.5,
      reviewCount: 892,
      discount: '20',
      savedAmount: '200',
      inStock: true,
      centers: [
        { id: 'care-scan', name: 'Care Scan Center', price: '800', originalPrice: '1000' },
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '900', originalPrice: '1100' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '850', originalPrice: '1050' }
      ]
    },
    {
      id: 'scan-4',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      title: 'Chest X-Ray',
      subtitle: 'X-Ray',
      center: 'Kurnool Imaging Center',
      price: '200',
      originalPrice: '250',
      rating: 4.3,
      reviewCount: 1234,
      discount: '20',
      savedAmount: '50',
      inStock: true,
      centers: [
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '200', originalPrice: '250' },
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '220', originalPrice: '270' },
        { id: 'care-scan', name: 'Care Scan Center', price: '210', originalPrice: '260' }
      ]
    },
    {
      id: 'scan-5',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      title: '2D ECHO',
      subtitle: 'ECHO',
      center: 'Apollo Imaging',
      price: '1200',
      originalPrice: '1500',
      rating: 4.6,
      reviewCount: 567,
      discount: '20',
      savedAmount: '300',
      inStock: true,
      centers: [
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '1200', originalPrice: '1500' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '1150', originalPrice: '1450' },
        { id: 'care-scan', name: 'Care Scan Center', price: '1180', originalPrice: '1480' }
      ]
    },
    {
      id: 'scan-6',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop',
      title: 'Spine MRI',
      subtitle: 'MRI',
      center: 'Care Scan Center',
      price: '4200',
      originalPrice: '4800',
      rating: 4.7,
      reviewCount: 334,
      discount: '13',
      savedAmount: '600',
      inStock: true,
      centers: [
        { id: 'care-scan', name: 'Care Scan Center', price: '4200', originalPrice: '4800' },
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '4500', originalPrice: '5100' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '4300', originalPrice: '4900' }
      ]
    },
    {
      id: 'scan-7',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4902777e7?w=300&h=200&fit=crop',
      title: 'Abdomen CT Scan',
      subtitle: 'CT Scan',
      center: 'Kurnool Imaging Center',
      price: '3200',
      originalPrice: '3600',
      rating: 4.5,
      reviewCount: 445,
      discount: '11',
      savedAmount: '400',
      inStock: true,
      centers: [
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '3200', originalPrice: '3600' },
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '3400', originalPrice: '3800' },
        { id: 'care-scan', name: 'Care Scan Center', price: '3300', originalPrice: '3700' }
      ]
    },
    {
      id: 'scan-8',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      title: 'Pregnancy Ultrasound',
      subtitle: 'Ultrasound',
      center: 'Apollo Imaging',
      price: '600',
      originalPrice: '750',
      rating: 4.8,
      reviewCount: 756,
      discount: '20',
      savedAmount: '150',
      inStock: true,
      centers: [
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '600', originalPrice: '750' },
        { id: 'care-scan', name: 'Care Scan Center', price: '580', originalPrice: '730' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '590', originalPrice: '740' }
      ]
    },
    {
      id: 'scan-9',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      title: 'Knee X-Ray',
      subtitle: 'X-Ray',
      center: 'Care Scan Center',
      price: '300',
      originalPrice: '400',
      rating: 4.4,
      reviewCount: 623,
      discount: '25',
      savedAmount: '100',
      inStock: true,
      centers: [
        { id: 'care-scan', name: 'Care Scan Center', price: '300', originalPrice: '400' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '280', originalPrice: '380' },
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '320', originalPrice: '420' }
      ]
    },
    {
      id: 'scan-10',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      title: 'Stress ECHO',
      subtitle: 'ECHO',
      center: 'Apollo Imaging',
      price: '2500',
      originalPrice: '3000',
      rating: 4.7,
      reviewCount: 234,
      discount: '17',
      savedAmount: '500',
      inStock: true,
      centers: [
        { id: 'apollo-imaging', name: 'Apollo Imaging', price: '2500', originalPrice: '3000' },
        { id: 'kurnool-imaging', name: 'Kurnool Imaging Center', price: '2400', originalPrice: '2900' },
        { id: 'care-scan', name: 'Care Scan Center', price: '2450', originalPrice: '2950' }
      ]
    }
  ]
};

export const doctorsData = {
  categories: [
    { id: 'general', name: 'General', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face' },
    { id: 'cardiologist', name: 'Cardiologist', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face' },
    { id: 'diabetologist', name: 'Diabetologist', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face' },
    { id: 'gynecologist', name: 'Gynecologist', image: 'https://images.unsplash.com/photo-1594824804732-ca4db0acf421?w=100&h=100&fit=crop&crop=face' },
    { id: 'neurologist', name: 'Neurologist', image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face' }
  ],
  products: [
    {
      id: 'doc-1',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Rajesh Kumar',
      subtitle: 'General Physician',
      center: 'Kurnool Medical Center',
      price: '300',
      originalPrice: '400',
      rating: 4.7,
      reviewCount: 1240,
      discount: '25',
      savedAmount: '100',
      inStock: true,
      experience: '15 years'
    },
    {
      id: 'doc-2',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Priya Sharma',
      subtitle: 'Cardiologist',
      center: 'Apollo Hospital',
      price: '500',
      originalPrice: '600',
      rating: 4.8,
      reviewCount: 890,
      discount: '17',
      savedAmount: '100',
      inStock: true,
      experience: '20 years'
    },
    {
      id: 'doc-3',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Suresh Reddy',
      subtitle: 'Diabetologist',
      center: 'Care Hospital',
      price: '400',
      originalPrice: '500',
      rating: 4.6,
      reviewCount: 567,
      discount: '20',
      savedAmount: '100',
      inStock: true,
      experience: '12 years'
    },
    {
      id: 'doc-4',
      image: 'https://images.unsplash.com/photo-1594824804732-ca4db0acf421?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Lakshmi Devi',
      subtitle: 'Gynecologist',
      center: 'Women Care Clinic',
      price: '350',
      originalPrice: '450',
      rating: 4.9,
      reviewCount: 743,
      discount: '22',
      savedAmount: '100',
      inStock: true,
      experience: '18 years'
    },
    {
      id: 'doc-5',
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Venkat Rao',
      subtitle: 'Neurologist',
      center: 'Neuro Care Hospital',
      price: '600',
      originalPrice: '750',
      rating: 4.5,
      reviewCount: 456,
      discount: '20',
      savedAmount: '150',
      inStock: true,
      experience: '25 years'
    },
    {
      id: 'doc-6',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Ravi Kumar',
      subtitle: 'General Physician',
      center: 'City Hospital',
      price: '250',
      originalPrice: '350',
      rating: 4.4,
      reviewCount: 623,
      discount: '29',
      savedAmount: '100',
      inStock: true,
      experience: '10 years'
    },
    {
      id: 'doc-7',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Anita Rao',
      subtitle: 'Cardiologist',
      center: 'Heart Care Center',
      price: '550',
      originalPrice: '650',
      rating: 4.7,
      reviewCount: 892,
      discount: '15',
      savedAmount: '100',
      inStock: true,
      experience: '22 years'
    },
    {
      id: 'doc-8',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Krishna Murthy',
      subtitle: 'Diabetologist',
      center: 'Diabetes Care Clinic',
      price: '450',
      originalPrice: '550',
      rating: 4.8,
      reviewCount: 734,
      discount: '18',
      savedAmount: '100',
      inStock: true,
      experience: '16 years'
    },
    {
      id: 'doc-9',
      image: 'https://images.unsplash.com/photo-1594824804732-ca4db0acf421?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Sunitha Reddy',
      subtitle: 'Gynecologist',
      center: 'Apollo Hospital',
      price: '400',
      originalPrice: '500',
      rating: 4.6,
      reviewCount: 567,
      discount: '20',
      savedAmount: '100',
      inStock: true,
      experience: '14 years'
    },
    {
      id: 'doc-10',
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=200&fit=crop&crop=face',
      title: 'Dr. Ramesh Babu',
      subtitle: 'Neurologist',
      center: 'Brain Care Hospital',
      price: '650',
      originalPrice: '800',
      rating: 4.7,
      reviewCount: 445,
      discount: '19',
      savedAmount: '150',
      inStock: true,
      experience: '28 years'
    }
  ]
};

export const homeCareData = {
  categories: [
    { id: 'nursing', name: 'Nursing', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop' },
    { id: 'physiotherapy', name: 'Physiotherapy', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop' },
    { id: 'elder-care', name: 'Elder Care', image: 'https://images.unsplash.com/photo-1721322800607-8c38375e9999?w=100&h=100&fit=crop' },
    { id: 'baby-care', name: 'Baby Care', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop' }
  ],
  products: [
    {
      id: 'home-1',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      title: 'Home Nursing Care',
      subtitle: 'Nursing',
      center: 'CareGivers Kurnool',
      price: '800',
      originalPrice: '1000',
      rating: 4.6,
      reviewCount: 340,
      discount: '20',
      savedAmount: '200',
      inStock: true,
      durations: [
        { id: 'single', name: 'Single Visit', price: '800', originalPrice: '1000' },
        { id: '8-hours', name: '8 Hours', price: '2400', originalPrice: '3000' },
        { id: '12-hours', name: '12 Hours', price: '3600', originalPrice: '4500' },
        { id: '24-hours', name: '24 Hours', price: '6000', originalPrice: '7500' },
        { id: '1-week', name: '1 Week', price: '35000', originalPrice: '45000' }
      ]
    },
    {
      id: 'home-2',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      title: 'Physiotherapy at Home',
      subtitle: 'Physiotherapy',
      center: 'PhysioCare Kurnool',
      price: '600',
      originalPrice: '750',
      rating: 4.7,
      reviewCount: 567,
      discount: '20',
      savedAmount: '150',
      inStock: true,
      durations: [
        { id: 'single', name: 'Single Session', price: '600', originalPrice: '750' },
        { id: '5-sessions', name: '5 Sessions', price: '2750', originalPrice: '3500' },
        { id: '10-sessions', name: '10 Sessions', price: '5000', originalPrice: '6500' },
        { id: '20-sessions', name: '20 Sessions', price: '9500', originalPrice: '12500' }
      ]
    },
    {
      id: 'home-3',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375e9999?w=100&h=100&fit=crop',
      title: 'Elder Care Services',
      subtitle: 'Elder Care',
      center: 'Senior Care Kurnool',
      price: '1000',
      originalPrice: '1200',
      rating: 4.5,
      reviewCount: 234,
      discount: '17',
      savedAmount: '200',
      inStock: true,
      durations: [
        { id: '4-hours', name: '4 Hours', price: '1000', originalPrice: '1200' },
        { id: '8-hours', name: '8 Hours', price: '1800', originalPrice: '2200' },
        { id: '12-hours', name: '12 Hours', price: '2500', originalPrice: '3000' },
        { id: '24-hours', name: '24 Hours', price: '4000', originalPrice: '5000' },
        { id: '1-week', name: '1 Week', price: '25000', originalPrice: '30000' }
      ]
    },
    {
      id: 'home-4',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      title: 'New Born Baby Care',
      subtitle: 'Baby Care',
      center: 'Baby Care Specialists',
      price: '1200',
      originalPrice: '1500',
      rating: 4.8,
      reviewCount: 445,
      discount: '20',
      savedAmount: '300',
      inStock: true,
      durations: [
        { id: '4-hours', name: '4 Hours', price: '1200', originalPrice: '1500' },
        { id: '8-hours', name: '8 Hours', price: '2200', originalPrice: '2750' },
        { id: '12-hours', name: '12 Hours', price: '3000', originalPrice: '3750' },
        { id: '24-hours', name: '24 Hours', price: '5000', originalPrice: '6250' },
        { id: '1-week', name: '1 Week', price: '30000', originalPrice: '37500' }
      ]
    },
    {
      id: 'home-5',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      title: 'ICU Nursing at Home',
      subtitle: 'Nursing',
      center: 'Critical Care at Home',
      price: '1500',
      originalPrice: '1800',
      rating: 4.7,
      reviewCount: 156,
      discount: '17',
      savedAmount: '300',
      inStock: true,
      durations: [
        { id: '12-hours', name: '12 Hours', price: '1500', originalPrice: '1800' },
        { id: '24-hours', name: '24 Hours', price: '2800', originalPrice: '3400' },
        { id: '1-week', name: '1 Week', price: '18000', originalPrice: '22000' }
      ]
    },
    {
      id: 'home-6',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      title: 'Orthopedic Physiotherapy',
      subtitle: 'Physiotherapy',
      center: 'OrthoPhysio Care',
      price: '700',
      originalPrice: '900',
      rating: 4.6,
      reviewCount: 334,
      discount: '22',
      savedAmount: '200',
      inStock: true,
      durations: [
        { id: 'single', name: 'Single Session', price: '700', originalPrice: '900' },
        { id: '5-sessions', name: '5 Sessions', price: '3200', originalPrice: '4200' },
        { id: '10-sessions', name: '10 Sessions', price: '6000', originalPrice: '8000' }
      ]
    },
    {
      id: 'home-7',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375e9999?w=100&h=100&fit=crop',
      title: 'Post Surgery Care',
      subtitle: 'Elder Care',
      center: 'Recovery Care Services',
      price: '1100',
      originalPrice: '1400',
      rating: 4.8,
      reviewCount: 267,
      discount: '21',
      savedAmount: '300',
      inStock: true,
      durations: [
        { id: '8-hours', name: '8 Hours', price: '1100', originalPrice: '1400' },
        { id: '12-hours', name: '12 Hours', price: '1600', originalPrice: '2000' },
        { id: '24-hours', name: '24 Hours', price: '2800', originalPrice: '3500' },
        { id: '1-week', name: '1 Week', price: '18000', originalPrice: '22500' }
      ]
    },
    {
      id: 'home-8',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      title: 'Mother & Baby Care',
      subtitle: 'Baby Care',
      center: 'Maternity Care Services',
      price: '1000',
      originalPrice: '1250',
      rating: 4.7,
      reviewCount: 389,
      discount: '20',
      savedAmount: '250',
      inStock: true,
      durations: [
        { id: '8-hours', name: '8 Hours', price: '1000', originalPrice: '1250' },
        { id: '12-hours', name: '12 Hours', price: '1400', originalPrice: '1750' },
        { id: '24-hours', name: '24 Hours', price: '2400', originalPrice: '3000' },
        { id: '1-week', name: '1 Week', price: '15000', originalPrice: '18750' }
      ]
    },
    {
      id: 'home-9',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      title: 'Wound Care Nursing',
      subtitle: 'Nursing',
      center: 'Specialized Wound Care',
      price: '900',
      originalPrice: '1100',
      rating: 4.5,
      reviewCount: 178,
      discount: '18',
      savedAmount: '200',
      inStock: true,
      durations: [
        { id: 'single', name: 'Single Visit', price: '900', originalPrice: '1100' },
        { id: '5-visits', name: '5 Visits', price: '4000', originalPrice: '5000' },
        { id: '10-visits', name: '10 Visits', price: '7500', originalPrice: '9500' }
      ]
    },
    {
      id: 'home-10',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      title: 'Neurological Physiotherapy',
      subtitle: 'Physiotherapy',
      center: 'NeuroPhysio Care',
      price: '800',
      originalPrice: '1000',
      rating: 4.6,
      reviewCount: 223,
      discount: '20',
      savedAmount: '200',
      inStock: true,
      durations: [
        { id: 'single', name: 'Single Session', price: '800', originalPrice: '1000' },
        { id: '5-sessions', name: '5 Sessions', price: '3600', originalPrice: '4500' },
        { id: '10-sessions', name: '10 Sessions', price: '6800', originalPrice: '8500' }
      ]
    }
  ]
};

export const diabetesCareData = {
  categories: [
    { id: 'monitoring', name: 'Monitoring', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop' },
    { id: 'supplies', name: 'Supplies', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop' },
    { id: 'consultation', name: 'Consultation', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face' },
    { id: 'nutrition', name: 'Nutrition', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop' }
  ],
  products: [
    {
      id: 'diab-1',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'Glucose Monitor Kit',
      subtitle: 'Monitoring',
      brand: 'OneTouch',
      price: '1200',
      originalPrice: '1500',
      rating: 4.4,
      reviewCount: 670,
      discount: '20',
      savedAmount: '300',
      inStock: true,
      variants: [
        { id: 'basic', name: 'Basic Kit', price: '1200', originalPrice: '1500' },
        { id: 'advanced', name: 'Advanced Kit with Bluetooth', price: '2200', originalPrice: '2800' }
      ]
    },
    {
      id: 'diab-2',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
      title: 'Test Strips - 50 Count',
      subtitle: 'Supplies',
      brand: 'Accu-Chek',
      price: '450',
      originalPrice: '550',
      rating: 4.5,
      reviewCount: 890,
      discount: '18',
      savedAmount: '100',
      inStock: true,
      variants: [
        { id: '25-strips', name: '25 Strips', price: '250', originalPrice: '300' },
        { id: '50-strips', name: '50 Strips', price: '450', originalPrice: '550' },
        { id: '100-strips', name: '100 Strips', price: '800', originalPrice: '1000' }
      ]
    },
    {
      id: 'diab-3',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop&crop=face',
      title: 'Diabetes Consultation',
      subtitle: 'Consultation',
      center: 'Dr. Krishna Murthy',
      price: '400',
      originalPrice: '500',
      rating: 4.7,
      reviewCount: 456,
      discount: '20',
      savedAmount: '100',
      inStock: true
    },
    {
      id: 'diab-4',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      title: 'Diabetic Diet Plan',
      subtitle: 'Nutrition',
      center: 'Certified Nutritionist',
      price: '800',
      originalPrice: '1000',
      rating: 4.6,
      reviewCount: 234,
      discount: '20',
      savedAmount: '200',
      inStock: true,
      durations: [
        { id: '1-month', name: '1 Month Plan', price: '800', originalPrice: '1000' },
        { id: '3-months', name: '3 Months Plan', price: '2200', originalPrice: '2800' },
        { id: '6-months', name: '6 Months Plan', price: '4000', originalPrice: '5000' }
      ]
    },
    {
      id: 'diab-5',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'Continuous Glucose Monitor',
      subtitle: 'Monitoring',
      brand: 'FreeStyle Libre',
      price: '3500',
      originalPrice: '4200',
      rating: 4.8,
      reviewCount: 567,
      discount: '17',
      savedAmount: '700',
      inStock: true,
      variants: [
        { id: '14-day', name: '14 Day Sensor', price: '3500', originalPrice: '4200' },
        { id: '28-day', name: '2 Sensors (28 Days)', price: '6500', originalPrice: '8000' }
      ]
    },
    {
      id: 'diab-6',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
      title: 'Insulin Pen Needles',
      subtitle: 'Supplies',
      brand: 'BD Ultra-Fine',
      price: '180',
      originalPrice: '230',
      rating: 4.3,
      reviewCount: 445,
      discount: '22',
      savedAmount: '50',
      inStock: true,
      variants: [
        { id: '32g-4mm', name: '32G 4mm - 100 Count', price: '180', originalPrice: '230' },
        { id: '31g-5mm', name: '31G 5mm - 100 Count', price: '190', originalPrice: '240' },
        { id: '30g-8mm', name: '30G 8mm - 100 Count', price: '200', originalPrice: '250' }
      ]
    },
    {
      id: 'diab-7',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop&crop=face',
      title: 'Diabetic Eye Screening',
      subtitle: 'Consultation',
      center: 'Eye Care Specialist',
      price: '600',
      originalPrice: '750',
      rating: 4.5,
      reviewCount: 334,
      discount: '20',
      savedAmount: '150',
      inStock: true
    },
    {
      id: 'diab-8',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      title: 'Diabetic Foot Care Kit',
      subtitle: 'Nutrition',
      brand: 'Diabetic Care Plus',
      price: '950',
      originalPrice: '1200',
      rating: 4.4,
      reviewCount: 223,
      discount: '21',
      savedAmount: '250',
      inStock: true,
      variants: [
        { id: 'basic', name: 'Basic Care Kit', price: '950', originalPrice: '1200' },
        { id: 'premium', name: 'Premium Care Kit', price: '1500', originalPrice: '1900' }
      ]
    },
    {
      id: 'diab-9',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      title: 'HbA1c Home Test Kit',
      subtitle: 'Monitoring',
      brand: 'A1C Now',
      price: '850',
      originalPrice: '1000',
      rating: 4.2,
      reviewCount: 178,
      discount: '15',
      savedAmount: '150',
      inStock: true,
      variants: [
        { id: 'single', name: 'Single Test', price: '850', originalPrice: '1000' },
        { id: '3-tests', name: '3 Test Pack', price: '2300', originalPrice: '2800' }
      ]
    },
    {
      id: 'diab-10',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop&crop=face',
      title: 'Diabetes Management Program',
      subtitle: 'Consultation',
      center: 'Diabetes Care Center',
      price: '2500',
      originalPrice: '3200',
      rating: 4.8,
      reviewCount: 156,
      discount: '22',
      savedAmount: '700',
      inStock: true,
      durations: [
        { id: '1-month', name: '1 Month Program', price: '2500', originalPrice: '3200' },
        { id: '3-months', name: '3 Months Program', price: '6800', originalPrice: '8800' },
        { id: '6-months', name: '6 Months Program', price: '12000', originalPrice: '15600' }
      ]
    }
  ]
};

// Hero banners data
export const heroBannersData = [
  {
    id: 'banner-1',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    title: 'Sleep Study at Home',
    subtitle: 'Comprehensive sleep disorder diagnosis',
    description: 'Get professional sleep study done at the comfort of your home with latest technology',
    cta: 'Book Now',
    ctaLink: '/sleep-study',
    bgGradient: 'from-blue-600 to-purple-700'
  },
  {
    id: 'banner-2',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    title: 'FreeStyle Libre CGM',
    subtitle: 'Continuous Glucose Monitoring',
    description: 'Monitor your glucose levels 24/7 without finger pricks. Now available in Kurnool',
    cta: 'Learn More',
    ctaLink: '/freestyle-libre',
    bgGradient: 'from-green-500 to-teal-600'
  },
  {
    id: 'banner-3',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    title: '24 Hour BP Monitoring',
    subtitle: 'Ambulatory Blood Pressure',
    description: 'Get accurate BP readings throughout the day with our advanced ABPM service',
    cta: 'Book Service',
    ctaLink: '/bp-monitoring',
    bgGradient: 'from-red-500 to-pink-600'
  },
  {
    id: 'banner-4',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    title: 'Heart Screening Packages',
    subtitle: 'Complete Cardiac Checkup',
    description: 'Comprehensive heart health screening with 2D ECHO, ECG, and Stress Test',
    cta: 'View Packages',
    ctaLink: '/heart-screening',
    bgGradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'banner-5',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=400&fit=crop',
    title: 'Best Lab Offers',
    subtitle: 'Up to 50% Off on Tests',
    description: 'Get the best prices on all lab tests from NABL certified laboratories',
    cta: 'Browse Offers',
    ctaLink: '/lab-offers',
    bgGradient: 'from-indigo-500 to-purple-600'
  }
];

// Testimonials data
export const testimonialsData = [
  {
    id: 'test-1',
    name: 'Ramesh Kumar',
    location: 'Kurnool',
    rating: 5,
    comment: 'Very convenient! Got my medicines delivered within 2 hours. Excellent service and genuine products.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    service: 'Medicines'
  },
  {
    id: 'test-2',
    name: 'Lakshmi Devi',
    location: 'Kurnool',
    rating: 5,
    comment: 'The lab test booking was so easy. Technician came home on time. Great experience with professional service!',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    service: 'Lab Tests'
  },
  {
    id: 'test-3',
    name: 'Dr. Suresh',
    location: 'Kurnool',
    rating: 5,
    comment: 'As a doctor, I appreciate the quality and authenticity of medicines. Highly recommended for patients.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=60&h=60&fit=crop&crop=face',
    service: 'Medicines'
  },
  {
    id: 'test-4',
    name: 'Priya Sharma',
    location: 'Kurnool',
    rating: 5,
    comment: 'Excellent physiotherapy service at home. The therapist was very professional and caring. Highly satisfied!',
    avatar: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=60&h=60&fit=crop&crop=face',
    service: 'Home Care'
  },
  {
    id: 'test-5',
    name: 'Venkat Reddy',
    location: 'Kurnool',
    rating: 5,
    comment: 'Got my MRI scan done at a great price. The staff was helpful and the report was delivered on time.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    service: 'Scans'
  }
];

// Partners data
export const partnersData = [
  {
    id: 'partner-1',
    name: 'Apollo Hospitals',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=150&h=80&fit=crop',
    category: 'Healthcare'
  },
  {
    id: 'partner-2',
    name: 'Dr. Lal PathLabs',
    logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=80&fit=crop',
    category: 'Diagnostics'
  },
  {
    id: 'partner-3',
    name: 'Thyrocare',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=80&fit=crop',
    category: 'Lab Tests'
  },
  {
    id: 'partner-4',
    name: 'Metropolis Healthcare',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=150&h=80&fit=crop',
    category: 'Diagnostics'
  },
  {
    id: 'partner-5',
    name: 'Care Hospitals',
    logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=80&fit=crop',
    category: 'Healthcare'
  },
  {
    id: 'partner-6',
    name: 'Cipla Pharmaceuticals',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=80&fit=crop',
    category: 'Pharmacy'
  }
];

// Trust badges data
export const trustBadgesData = [
  {
    id: 'badge-1',
    icon: 'Shield',
    title: '100% Genuine Medicines',
    description: 'Licensed pharmacy with authentic products'
  },
  {
    id: 'badge-2',
    icon: 'Award',
    title: 'Best Doctors in Kurnool',
    description: 'Verified and experienced specialists'
  },
  {
    id: 'badge-3',
    icon: 'CheckCircle',
    title: 'NABL Certified Labs',
    description: 'Accredited diagnostic centers'
  },
  {
    id: 'badge-4',
    icon: 'Heart',
    title: 'Top Hospitals',
    description: 'Premium healthcare facilities'
  }
];

// Health tips data
export const healthTipsData = [
  {
    id: 'tip-1',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    title: 'Managing Diabetes in Summer',
    excerpt: 'Essential tips to keep your blood sugar levels stable during hot weather conditions.',
    readTime: '5 min read',
    category: 'Diabetes',
    publishDate: '2024-01-15'
  },
  {
    id: 'tip-2',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop',
    title: 'Heart-Healthy Diet Plans',
    excerpt: 'Nutritionist-approved meal plans for better cardiovascular health and wellness.',
    readTime: '7 min read',
    category: 'Nutrition',
    publishDate: '2024-01-12'
  },
  {
    id: 'tip-3',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
    title: 'Home Exercise Routines',
    excerpt: 'Simple exercises you can do at home to stay fit and healthy without gym equipment.',
    readTime: '4 min read',
    category: 'Fitness',
    publishDate: '2024-01-10'
  },
  {
    id: 'tip-4',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop',
    title: 'Blood Pressure Management',
    excerpt: 'Learn how to monitor and maintain healthy blood pressure levels naturally.',
    readTime: '6 min read',
    category: 'Heart Care',
    publishDate: '2024-01-08'
  },
  {
    id: 'tip-5',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
    title: 'Mental Health Wellness',
    excerpt: 'Tips for maintaining good mental health and managing stress in daily life.',
    readTime: '8 min read',
    category: 'Mental Health',
    publishDate: '2024-01-05'
  }
];
