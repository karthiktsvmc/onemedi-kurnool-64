import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  Shield, 
  Heart, 
  Share2,
  Calendar,
  FileText,
  AlertCircle,
  Home,
  Award
} from 'lucide-react';
import { mockScans } from '@/frontend/data/mockScansData';

export const ScanDetails = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(mockScans.find(s => s.id === scanId));
  const [selectedCenter, setSelectedCenter] = useState(scan?.centers[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundScan = mockScans.find(s => s.id === scanId);
    setScan(foundScan);
    setSelectedCenter(foundScan?.centers[0]);
  }, [scanId]);

  if (!scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Scan not found</h2>
          <p className="text-muted-foreground mb-4">The scan you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const discount = selectedCenter ? Math.round(((selectedCenter.originalPrice - selectedCenter.price) / selectedCenter.originalPrice) * 100) : 0;

  const handleBookNow = () => {
    // Navigate to booking flow with selected center
    navigate(`/scans/${scan.id}/book?center=${selectedCenter?.id}`);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', scan.id, selectedCenter?.id);
    // Integration with cart state/Supabase
  };

  const relatedScans = mockScans.filter(s => 
    scan.relatedScans.includes(s.id) || 
    (s.category === scan.category && s.id !== scan.id)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Scans</span>
              <span>•</span>
              <span className="capitalize">{scan.category}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{scan.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Image and Basic Info */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={scan.image} 
                      alt={scan.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About this scan</h3>
                      <p className="text-muted-foreground">{scan.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{scan.duration}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fasting:</span>
                        <p className="font-medium">{scan.fastingRequired ? 'Required' : 'Not Required'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Parameters:</span>
                        <p className="font-medium">{scan.parameters}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium capitalize">{scan.category}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {scan.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag === 'NABL' && <Shield className="h-3 w-3 mr-1" />}
                          {tag.toLowerCase().includes('expert') && <Award className="h-3 w-3 mr-1" />}
                          {tag.toLowerCase().includes('home') && <Home className="h-3 w-3 mr-1" />}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Scan Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="purpose">
                    <AccordionTrigger>Purpose & Benefits</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{scan.purpose}</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="preparation">
                    <AccordionTrigger>Preparation Required</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{scan.preparation}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faqs">
                    <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {scan.faqs.map((faq, index) => (
                          <div key={index}>
                            <h4 className="font-medium mb-1">{faq.question}</h4>
                            <p className="text-muted-foreground text-sm">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Related Scans */}
            {relatedScans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedScans.map((relatedScan) => (
                      <div 
                        key={relatedScan.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/scans/${relatedScan.id}`)}
                      >
                        <img 
                          src={relatedScan.image} 
                          alt={relatedScan.title}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{relatedScan.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{relatedScan.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-primary">
                            ₹{Math.min(...relatedScan.centers.map(c => c.price))}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {relatedScan.category.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Center Selection & Pricing */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Select Diagnostic Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue={selectedCenter?.id} onValueChange={(value) => {
                  setSelectedCenter(scan.centers.find(c => c.id === value));
                }}>
                  <TabsList className="grid w-full grid-cols-1 h-auto">
                    {scan.centers.map((center) => (
                      <TabsTrigger 
                        key={center.id} 
                        value={center.id}
                        className="text-left p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-white"
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{center.name}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{center.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold">₹{center.price}</span>
                            {center.originalPrice > center.price && (
                              <span className="text-xs line-through opacity-70">₹{center.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {scan.centers.map((center) => (
                    <TabsContent key={center.id} value={center.id} className="mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">₹{center.price}</span>
                          {center.originalPrice > center.price && (
                            <div className="text-right">
                              <div className="text-lg text-muted-foreground line-through">₹{center.originalPrice}</div>
                              <div className="text-sm text-health-green font-medium">{discount}% OFF</div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Report delivery:</span>
                            <span className="font-medium">{center.deliveryTime}</span>
                          </div>
                          
                          {center.nabl && (
                            <div className="flex items-center gap-2 text-health-green">
                              <Shield className="h-4 w-4" />
                              <span>NABL Accredited</span>
                            </div>
                          )}
                          
                          {center.homePickup && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Home className="h-4 w-4" />
                              <span>Home pickup available</span>
                            </div>
                          )}
                          
                          {center.offers && (
                            <div className="p-2 bg-green-50 rounded text-health-green text-sm">
                              {center.offers}
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            onClick={handleBookNow}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Now
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleAddToCart}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Need Help?</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      📞 Call Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};