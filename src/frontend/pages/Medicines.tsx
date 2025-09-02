import { useState } from 'react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { ServiceCard } from '@/frontend/components/Services/ServiceCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { PrescriptionUploadWidget } from '@/frontend/components/Prescriptions/PrescriptionUploadWidget';
import { Filter, Search, ChevronDown, Upload, Shield, Truck, Clock } from 'lucide-react';
export const Medicines = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const categories = [{
    id: 'all',
    name: 'All Medicines',
    count: 1250
  }, {
    id: 'fever',
    name: 'Fever & Pain',
    count: 180
  }, {
    id: 'diabetes',
    name: 'Diabetes Care',
    count: 95
  }, {
    id: 'vitamins',
    name: 'Vitamins',
    count: 220
  }, {
    id: 'antibiotics',
    name: 'Antibiotics',
    count: 85
  }, {
    id: 'heart',
    name: 'Heart Care',
    count: 120
  }, {
    id: 'skincare',
    name: 'Skin Care',
    count: 160
  }];
  const medicines = [{
    id: '1',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
    title: 'Paracetamol 500mg',
    subtitle: 'Fever & Pain Relief - Strip of 10 tablets',
    price: '25',
    originalPrice: '35',
    rating: 4.5,
    reviewCount: 1240,
    discount: '29',
    inStock: true,
    prescription: false
  }, {
    id: '2',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    title: 'Vitamin D3 60K IU',
    subtitle: 'Bone Health - 4 Capsules',
    price: '180',
    originalPrice: '220',
    rating: 4.7,
    reviewCount: 890,
    discount: '18',
    inStock: true,
    prescription: false
  }, {
    id: '3',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=200&fit=crop',
    title: 'Azithromycin 500mg',
    subtitle: 'Antibiotic - 3 tablets',
    price: '120',
    originalPrice: '150',
    rating: 4.3,
    reviewCount: 520,
    discount: '20',
    inStock: true,
    prescription: true
  }, {
    id: '4',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=300&h=200&fit=crop',
    title: 'Metformin 500mg',
    subtitle: 'Diabetes Management - 30 tablets',
    price: '85',
    originalPrice: '100',
    rating: 4.6,
    reviewCount: 750,
    discount: '15',
    inStock: false,
    prescription: true
  }];
  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
  };
  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite:', id);
  };

  const handlePrescriptionUpload = (prescriptionIds: string[]) => {
    console.log('Prescription uploaded:', prescriptionIds);
    setPrescriptionDialogOpen(false);
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-3 px-4">
          <div className="container mx-auto">
            <div className="text-sm text-muted-foreground">
              <span>Home</span> / <span className="text-primary font-medium">Medicines</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-6 px-4">
          <div className="container mx-auto px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Medicines</h1>
                <p className="text-muted-foreground">Order medicines online with fast delivery</p>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-health-green-light px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4 text-health-green" />
                  <span className="text-health-green font-medium">100% Authentic</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-light px-3 py-2 rounded-lg">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-600 font-medium">2 Hour Delivery</span>
                </div>
              </div>
            </div>

            {/* Prescription Upload Banner */}
            <div className="bg-gradient-to-r from-primary-light to-health-green-light p-4 rounded-xl mb-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Have a prescription?</h3>
                    <p className="text-sm text-muted-foreground">Upload and order your medicines</p>
                  </div>
                </div>
                <Dialog open={prescriptionDialogOpen} onOpenChange={setPrescriptionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-dark">
                      Upload Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Upload Prescription</DialogTitle>
                    </DialogHeader>
                    <PrescriptionUploadWidget 
                      onUploadComplete={handlePrescriptionUpload}
                      multiple={true}
                      className="border-0"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Search medicines by name, salt, or brand..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4" />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  Sort by: Popular
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 mb-6 pb-2">
              {categories.map(category => <Badge key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} className={`whitespace-nowrap cursor-pointer px-4 py-2 ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`} onClick={() => setSelectedCategory(category.id)}>
                  {category.name} ({category.count})
                </Badge>)}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">1,250 medicines</span> 
                {selectedCategory !== 'all' && <span> in <span className="font-medium text-primary">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </span></span>}
              </p>
            </div>

            {/* Medicines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {medicines.map(medicine => <ServiceCard key={medicine.id} {...medicine} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />)}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Medicines
              </Button>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>;
};