import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { 
  ArrowLeft,
  Heart, 
  Share2,
  MapPin, 
  Clock, 
  Shield, 
  Award,
  Star,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Users,
  Activity,
  Droplets,
  Timer,
  Info
} from 'lucide-react';

interface DiagnosticCenter {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  homeCollection: boolean;
  nabl: boolean;
  offers?: string;
  address: string;
  distance: string;
}

export const LabTestDetails = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState<string>('1');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - replace with API call
  const testDetails = {
    id: testId,
    title: 'Complete Blood Count (CBC)',
    subtitle: 'Comprehensive blood analysis to check overall health',
    description: 'A Complete Blood Count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
    sampleType: 'Blood',
    fastingRequired: false,
    reportTime: '6-8 hours',
    parameters: 28,
    tags: ['NABL', 'Doctor Recommended', 'Home Collection'],
    benefits: [
      'Detects blood disorders and infections',
      'Monitors overall health status',
      'Tracks response to treatments',
      'Screens for various diseases'
    ],
    prerequisites: [
      'No special preparation required',
      'Can be done any time of the day',
      'Continue normal medications'
    ],
    parametersList: [
      'White Blood Cell Count (WBC)',
      'Red Blood Cell Count (RBC)', 
      'Hemoglobin',
      'Hematocrit',
      'Mean Corpuscular Volume (MCV)',
      'Mean Corpuscular Hemoglobin (MCH)',
      'Mean Corpuscular Hemoglobin Concentration (MCHC)',
      'Red Cell Distribution Width (RDW)',
      'Platelet Count',
      'Mean Platelet Volume (MPV)',
      // ... more parameters
    ],
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop'
  };

  const diagnosticCenters: DiagnosticCenter[] = [
    {
      id: '1',
      name: 'Vijaya Diagnostics',
      price: 299,
      originalPrice: 450,
      rating: 4.8,
      reviewCount: 2340,
      deliveryTime: '6-8 hours',
      homeCollection: true,
      nabl: true,
      offers: 'Free home collection + 10% cashback',
      address: 'Banjara Hills, Hyderabad',
      distance: '2.5 km'
    },
    {
      id: '2',
      name: 'Thyrocare',
      price: 320,
      originalPrice: 480,
      rating: 4.7,
      reviewCount: 1890,
      deliveryTime: '12-24 hours',
      homeCollection: true,
      nabl: true,
      address: 'Jubilee Hills, Hyderabad',
      distance: '3.2 km'
    },
    {
      id: '3',
      name: 'Dr. Lal PathLabs',
      price: 350,
      originalPrice: 500,
      rating: 4.6,
      reviewCount: 1520,
      deliveryTime: '8-12 hours',
      homeCollection: true,
      nabl: true,
      offers: 'Free consultation with report',
      address: 'Madhapur, Hyderabad',
      distance: '4.1 km'
    },
    {
      id: '4',
      name: 'Redcliffe Labs',
      price: 280,
      originalPrice: 420,
      rating: 4.5,
      reviewCount: 980,
      deliveryTime: '6-8 hours',
      homeCollection: false,
      nabl: true,
      address: 'Gachibowli, Hyderabad',
      distance: '5.5 km'
    }
  ];

  const relatedTests = [
    {
      id: '2',
      title: 'HbA1c (Diabetes Check)',
      price: 450,
      originalPrice: 650,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Lipid Profile',
      price: 580,
      originalPrice: 750,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
    }
  ];

  const selectedCenterData = diagnosticCenters.find(center => center.id === selectedCenter) || diagnosticCenters[0];
  const discount = Math.round(((selectedCenterData.originalPrice - selectedCenterData.price) / selectedCenterData.originalPrice) * 100);

  const handleBookNow = () => {
    navigate(`/checkout/lab-test/${testId}/${selectedCenter}`);
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', testId, selectedCenter);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-3 px-4">
          <div className="container mx-auto">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/lab-tests">Lab Tests</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>{testDetails.title}</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Header Actions */}
        <div className="sticky top-16 bg-background/95 backdrop-blur-sm border-b z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Test Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {testDetails.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag === 'NABL' && <Shield className="h-3 w-3" />}
                      {tag === 'Doctor Recommended' && <Award className="h-3 w-3" />}
                      {tag === 'Home Collection' && <MapPin className="h-3 w-3" />}
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{testDetails.title}</h1>
                <p className="text-muted-foreground mb-4">{testDetails.subtitle}</p>
                
                <img 
                  src={testDetails.image} 
                  alt={testDetails.title}
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
                />
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="centers">Centers</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Test Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Sample</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{testDetails.sampleType}</p>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Fasting</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testDetails.fastingRequired ? 'Required' : 'Not Required'}
                      </p>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Report Time</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{testDetails.reportTime}</p>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Parameters</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{testDetails.parameters}</p>
                    </Card>
                  </div>

                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        About This Test
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{testDetails.description}</p>
                    </CardContent>
                  </Card>

                  {/* Benefits & Prerequisites */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-health-green" />
                          Benefits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {testDetails.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-health-green mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          Prerequisites
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {testDetails.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="parameters">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Parameters ({testDetails.parameters})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-2">
                        {testDetails.parametersList.map((parameter, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                            <CheckCircle className="h-4 w-4 text-health-green" />
                            <span className="text-sm">{parameter}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="centers">
                  <div className="space-y-4">
                    {diagnosticCenters.map((center) => (
                      <Card key={center.id} className={`cursor-pointer transition-all ${selectedCenter === center.id ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="p-4" onClick={() => setSelectedCenter(center.id)}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{center.name}</h3>
                              <p className="text-sm text-muted-foreground">{center.address}</p>
                              <p className="text-xs text-muted-foreground">{center.distance} away</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{center.rating}</span>
                                <span className="text-sm text-muted-foreground">({center.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{center.deliveryTime}</span>
                              </div>
                              {center.homeCollection && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-health-green" />
                                  <span className="text-sm text-health-green">Home Collection</span>
                                </div>
                              )}
                              {center.nabl && (
                                <Badge variant="outline">
                                  <Shield className="h-3 w-3 mr-1" />
                                  NABL
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-primary">₹{center.price}</span>
                              <span className="text-sm text-muted-foreground line-through ml-2">₹{center.originalPrice}</span>
                              <span className="text-sm text-health-green ml-2">
                                {Math.round(((center.originalPrice - center.price) / center.originalPrice) * 100)}% OFF
                              </span>
                            </div>
                            {center.offers && (
                              <p className="text-xs text-health-green font-medium">{center.offers}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Reviews coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Related Tests */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Related Tests</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedTests.map((test) => (
                    <Card key={test.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img 
                            src={test.image} 
                            alt={test.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground mb-1">{test.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">₹{test.price}</span>
                              <span className="text-sm text-muted-foreground line-through">₹{test.originalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-4">
                {/* Pricing Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Book This Test</span>
                      {discount > 0 && (
                        <Badge className="bg-emergency text-white">{discount}% OFF</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Selected Center */}
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{selectedCenterData.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{selectedCenterData.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {selectedCenterData.deliveryTime}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">₹{selectedCenterData.price}</span>
                        {selectedCenterData.originalPrice > selectedCenterData.price && (
                          <span className="text-lg text-muted-foreground line-through">₹{selectedCenterData.originalPrice}</span>
                        )}
                      </div>
                      {selectedCenterData.originalPrice > selectedCenterData.price && (
                        <p className="text-sm text-health-green font-medium">
                          You save ₹{selectedCenterData.originalPrice - selectedCenterData.price}
                        </p>
                      )}
                    </div>

                    {/* Offers */}
                    {selectedCenterData.offers && (
                      <div className="p-3 bg-health-green-light rounded-lg">
                        <p className="text-sm text-health-green font-medium">{selectedCenterData.offers}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button className="w-full" onClick={handleBookNow}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleAddToCart}>
                        Add to Cart
                      </Button>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 pt-4 border-t">
                      {selectedCenterData.homeCollection && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-health-green" />
                          <span>Free home collection</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Digital reports</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>NABL certified lab</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};