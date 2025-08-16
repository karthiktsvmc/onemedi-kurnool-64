import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ScanCard } from '@/frontend/components/Scans/ScanCard';
import { ScanFilters } from '@/frontend/components/Scans/ScanFilters';
import { LocationPicker } from '@/frontend/components/Layout/LocationPicker';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { 
  mockScans, 
  scanCategories, 
  promotionalStrips, 
  scanPackages 
} from '@/frontend/data/mockScansData';
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Scan as ScanIcon,
  Home
} from 'lucide-react';

export const Scans = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredScans, setFilteredScans] = useState(mockScans);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentLocation, setCurrentLocation] = useState('Hyderabad, Telangana');
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('scans');
  const [currentPage, setCurrentPage] = useState(1);
  const [scansPerPage] = useState(12);

  // Auto-rotate promotional strips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotionalStrips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...mockScans];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(scan => scan.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(scan => {
        const minPrice = Math.min(...scan.centers.map(c => c.price));
        return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
      });
    }

    // Service filters
    if (filters.homePickupOnly) {
      filtered = filtered.filter(scan => 
        scan.centers.some(center => center.homePickup)
      );
    }

    if (filters.nablOnly) {
      filtered = filtered.filter(scan => 
        scan.centers.some(center => center.nabl)
      );
    }

    if (filters.doctorRecommended) {
      filtered = filtered.filter(scan => 
        scan.tags.some(tag => tag.toLowerCase().includes('doctor') || tag.toLowerCase().includes('recommended'))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.centers.map(c => c.price));
          const bMin = Math.min(...b.centers.map(c => c.price));
          return aMin - bMin;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aMax = Math.max(...a.centers.map(c => c.price));
          const bMax = Math.max(...b.centers.map(c => c.price));
          return bMax - aMax;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const aAvg = a.centers.reduce((sum, c) => sum + c.rating, 0) / a.centers.length;
          const bAvg = b.centers.reduce((sum, c) => sum + c.rating, 0) / b.centers.length;
          return bAvg - aAvg;
        });
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const aDuration = parseInt(a.duration) || 0;
          const bDuration = parseInt(b.duration) || 0;
          return aDuration - bDuration;
        });
        break;
    }

    setFilteredScans(filtered);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleFiltersChange({ category: categoryId });
  };

  const handleLocationSelect = (location: { address: string; coordinates: { lat: number; lng: number } }) => {
    setCurrentLocation(location.address);
  };

  const handleAddToCart = (scanId: string, centerId: string) => {
    console.log('Add to cart:', scanId, centerId);
    // Integration with cart state/Supabase
  };

  const handleToggleFavorite = (scanId: string) => {
    console.log('Toggle favorite:', scanId);
    // Integration with favorites state/Supabase
  };

  const handleViewDetails = (scanId: string) => {
    navigate(`/scans/${scanId}`);
  };

  const handleBookNow = (scanId: string, centerId: string) => {
    navigate(`/scans/${scanId}/book?center=${centerId}`);
  };

  const nextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promotionalStrips.length);
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promotionalStrips.length) % promotionalStrips.length);
  };

  // Pagination logic
  const indexOfLastScan = currentPage * scansPerPage;
  const indexOfFirstScan = indexOfLastScan - scansPerPage;
  const currentScans = filteredScans.slice(indexOfFirstScan, indexOfLastScan);
  const totalPages = Math.ceil(filteredScans.length / scansPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Location Picker */}
      {/* Location handled by header */}
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Scans</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Diagnostic Scans</h1>
          <p className="text-muted-foreground">Advanced imaging services near you</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {currentLocation}
          </div>
        </div>

        {/* Promotional Strips */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-32 md:h-40">
              {promotionalStrips.map((strip, index) => (
                <div
                  key={strip.id}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    index === currentPromoIndex ? 'translate-x-0' : 
                    index < currentPromoIndex ? '-translate-x-full' : 'translate-x-full'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${strip.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="flex items-center justify-between h-full px-6 text-white">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-1">{strip.title}</h3>
                      <p className="text-sm md:text-base opacity-90 mb-2">{strip.subtitle}</p>
                      <Badge className="bg-white text-primary">{strip.offer}</Badge>
                    </div>
                    <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                      {strip.cta}
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                onClick={prevPromo}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                onClick={nextPromo}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {promotionalStrips.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPromoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentPromoIndex(index)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Browse by Category</h2>
          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {scanCategories.slice(0, 10).map((category) => (
              <button
                key={category.id}
                className={`flex flex-col items-center p-2 space-y-2 rounded-lg transition-all hover:scale-105 ${
                  selectedCategory === category.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-colors ${
                  selectedCategory === category.id ? 'border-primary' : 'border-border'
                }`}>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className={`text-xs md:text-sm font-medium transition-colors ${
                    selectedCategory === category.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {category.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{category.count}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs for Scans vs Packages */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="scans" className="flex items-center gap-2">
              <ScanIcon className="h-4 w-4" />
              Individual Scans
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Scan Packages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scans" className="space-y-6">
            {/* Filters */}
            <ScanFilters 
              onFiltersChange={handleFiltersChange} 
              resultCount={filteredScans.length}
            />

            {/* Scans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {currentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(scan.id)}
                >
                  <ScanCard
                    {...scan}
                    onAddToCart={(scanId, centerId) => {
                      handleAddToCart(scanId, centerId);
                    }}
                    onToggleFavorite={(scanId) => {
                      handleToggleFavorite(scanId);
                    }}
                    onViewDetails={(scanId) => {
                      handleViewDetails(scanId);
                    }}
                    onBookNow={(scanId, centerId) => {
                      handleBookNow(scanId, centerId);
                    }}
                  />
                </div>
              ))}
            </div>

            {filteredScans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No scans found matching your criteria</p>
                <Button variant="outline" onClick={() => handleFiltersChange({})}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scanPackages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg line-clamp-2">{pkg.title}</h3>
                      <Badge className="bg-primary text-white">Package</Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">₹{pkg.discountedPrice}</span>
                        <span className="text-lg text-muted-foreground line-through">₹{pkg.originalPrice}</span>
                      </div>
                      <p className="text-sm text-health-green font-medium">
                        Save ₹{pkg.originalPrice - pkg.discountedPrice}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {pkg.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">Book Package</Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};