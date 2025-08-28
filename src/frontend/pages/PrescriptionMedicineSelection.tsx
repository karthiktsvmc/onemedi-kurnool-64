// Prescription Medicine Selection Page
// Allows users to review extracted medicines, check availability, and select alternatives

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { 
  ShoppingCart,
  Check,
  X,
  AlertTriangle,
  Package,
  DollarSign,
  Clock,
  Plus,
  Minus,
  ChevronRight,
  Info,
  Heart,
  Star,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuthRedirect } from '@/frontend/hooks/useAuthRedirect';
import MedicineMatchingService, { 
  MedicineAvailabilityResult,
  MedicineMatch,
  AlternativeMedicine 
} from '@/shared/services/medicineMatchingService';
import { ExtractedMedicine } from '@/shared/types/prescription';

interface SelectedMedicine {
  extractedMedicine: ExtractedMedicine;
  selectedMatch: MedicineMatch | null;
  selectedAlternative: AlternativeMedicine | null;
  quantity: number;
  addToCart: boolean;
}

interface LocationState {
  prescriptionId?: string;
  prescriptionFiles?: any[];
  extractedMedicines?: ExtractedMedicine[];
}

export const PrescriptionMedicineSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuthRedirect();
  
  const [availabilityResults, setAvailabilityResults] = useState<MedicineAvailabilityResult[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('review');
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Get data from navigation state
  const state = location.state as LocationState;
  const extractedMedicines = state?.extractedMedicines || [];
  const prescriptionId = state?.prescriptionId;

  useEffect(() => {
    if (extractedMedicines.length === 0) {
      toast({
        title: "No prescription data",
        description: "Please upload a prescription first",
        variant: "destructive"
      });
      navigate('/medicines/upload-prescription');
      return;
    }

    loadMedicineAvailability();
  }, [extractedMedicines]);

  useEffect(() => {
    calculateTotalAmount();
  }, [selectedMedicines]);

  const loadMedicineAvailability = async () => {
    try {
      setIsLoading(true);
      
      const results = await MedicineMatchingService.matchExtractedMedicines(extractedMedicines);
      setAvailabilityResults(results);
      
      // Initialize selected medicines
      const initialSelections: SelectedMedicine[] = results.map(result => ({
        extractedMedicine: result.extracted_medicine,
        selectedMatch: result.primary_match,
        selectedAlternative: null,
        quantity: result.extracted_medicine.quantity || 1,
        addToCart: result.availability_status !== 'not_available'
      }));
      
      setSelectedMedicines(initialSelections);
      
    } catch (error) {
      console.error('Error loading medicine availability:', error);
      toast({
        title: "Error loading medicines",
        description: "Failed to check medicine availability",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    const total = selectedMedicines.reduce((sum, selection) => {
      if (!selection.addToCart) return sum;
      
      const price = selection.selectedAlternative 
        ? (selection.selectedMatch?.sale_price || 0) + selection.selectedAlternative.price_difference
        : selection.selectedMatch?.sale_price || 0;
      
      return sum + (price * selection.quantity);
    }, 0);
    
    setTotalAmount(total);
  };

  const handleMedicineSelection = (
    index: number, 
    match: MedicineMatch | null, 
    alternative: AlternativeMedicine | null = null
  ) => {
    setSelectedMedicines(prev => prev.map((selection, i) => 
      i === index 
        ? { 
            ...selection, 
            selectedMatch: match,
            selectedAlternative: alternative,
            addToCart: match !== null
          }
        : selection
    ));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedMedicines(prev => prev.map((selection, i) => 
      i === index ? { ...selection, quantity } : selection
    ));
  };

  const handleAddToCartToggle = (index: number) => {
    setSelectedMedicines(prev => prev.map((selection, i) => 
      i === index ? { ...selection, addToCart: !selection.addToCart } : selection
    ));
  };

  const handleProceedToCart = () => {
    const cartItems = selectedMedicines
      .filter(selection => selection.addToCart && selection.selectedMatch)
      .map(selection => ({
        medicine_id: selection.selectedMatch!.id,
        prescription_id: prescriptionId,
        quantity: selection.quantity,
        price: selection.selectedAlternative 
          ? selection.selectedMatch!.sale_price + selection.selectedAlternative.price_difference
          : selection.selectedMatch!.sale_price,
        extracted_medicine_id: selection.extractedMedicine.name // Using name as reference for now
      }));

    if (cartItems.length === 0) {
      toast({
        title: "No medicines selected",
        description: "Please select at least one medicine to add to cart",
        variant: "destructive"
      });
      return;
    }

    // Navigate to cart with selected items and prescription info
    navigate('/cart', {
      state: {
        prescriptionItems: cartItems,
        prescriptionId,
        extractedMedicines: selectedMedicines
          .filter(selection => selection.addToCart)
          .map(selection => selection.extractedMedicine)
      }
    });
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'alternatives_available':
        return <Badge variant="secondary">Alternatives Available</Badge>;
      case 'not_available':
        return <Badge variant="destructive">Not Available</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Checking Medicine Availability
              </h2>
              <p className="text-muted-foreground">
                We're matching your prescription with available medicines...
              </p>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        {/* Breadcrumb */}
        <NavigationBreadcrumb 
          items={[
            { label: 'Medicines', href: '/medicines' },
            { label: 'Upload Prescription', href: '/medicines/upload-prescription' },
            { label: 'Select Medicines' }
          ]} 
        />

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Select Your Medicines
            </h1>
            <p className="text-muted-foreground">
              Review extracted medicines from your prescription and select the ones you want to order.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Medicines</p>
                    <p className="text-xl font-bold">{availabilityResults.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-xl font-bold text-green-600">
                      {availabilityResults.filter(r => r.availability_status === 'available').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Alternatives</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {availabilityResults.filter(r => r.availability_status === 'alternatives_available').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">{formatPrice(totalAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="review">Review Medicines</TabsTrigger>
              <TabsTrigger value="summary">Order Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="space-y-4">
              {availabilityResults.map((result, index) => {
                const selection = selectedMedicines[index];
                if (!selection) return null;

                return (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {result.extracted_medicine.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {result.extracted_medicine.dosage}
                            </Badge>
                            <Badge variant="outline">
                              {result.extracted_medicine.frequency}
                            </Badge>
                            {result.extracted_medicine.duration && (
                              <Badge variant="outline">
                                {result.extracted_medicine.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {getAvailabilityBadge(result.availability_status)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Primary Match */}
                      {result.primary_match && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Recommended Match</h4>
                          <div 
                            className={cn(
                              "p-4 rounded-lg border cursor-pointer transition-colors",
                              selection.selectedMatch?.id === result.primary_match.id && !selection.selectedAlternative
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => handleMedicineSelection(index, result.primary_match)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-foreground">
                                  {result.primary_match.name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  by {result.primary_match.brand}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-lg font-bold text-foreground">
                                    {formatPrice(result.primary_match.sale_price)}
                                  </span>
                                  {result.primary_match.mrp > result.primary_match.sale_price && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatPrice(result.primary_match.mrp)}
                                    </span>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round(((result.primary_match.mrp - result.primary_match.sale_price) / result.primary_match.mrp) * 100)}% OFF
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                {result.primary_match.available ? (
                                  <Badge className="bg-green-500">In Stock</Badge>
                                ) : (
                                  <Badge variant="destructive">Out of Stock</Badge>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  Stock: {result.primary_match.stock_qty}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Alternatives */}
                      {result.alternatives.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Alternative Options</h4>
                          <div className="space-y-2">
                            {result.alternatives.slice(0, 3).map((alternative, altIndex) => (
                              <div
                                key={altIndex}
                                className={cn(
                                  "p-3 rounded-lg border cursor-pointer transition-colors",
                                  selection.selectedAlternative?.id === alternative.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                )}
                                onClick={() => handleMedicineSelection(index, result.primary_match, alternative)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-foreground">{alternative.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {alternative.reason}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {formatPrice((result.primary_match?.sale_price || 0) + alternative.price_difference)}
                                    </p>
                                    <Badge 
                                      variant={alternative.availability === 'in_stock' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {alternative.availability.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity and Actions */}
                      {(selection.selectedMatch || selection.selectedAlternative) && (
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(index, selection.quantity - 1)}
                                disabled={selection.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{selection.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(index, selection.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant={selection.addToCart ? "default" : "outline"}
                            onClick={() => handleAddToCartToggle(index)}
                          >
                            {selection.addToCart ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Added to Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Not Available Message */}
                      {result.availability_status === 'not_available' && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            This medicine is currently not available. Please consult with our pharmacist for alternatives.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedMedicines
                    .filter(selection => selection.addToCart)
                    .map((selection, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                        <div>
                          <p className="font-medium text-foreground">
                            {selection.selectedMatch?.name || selection.extractedMedicine.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {selection.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(
                            ((selection.selectedAlternative 
                              ? (selection.selectedMatch?.sale_price || 0) + selection.selectedAlternative.price_difference
                              : selection.selectedMatch?.sale_price || 0
                            ) * selection.quantity)
                          )}
                        </p>
                      </div>
                    ))}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('review')}
                  className="flex-1"
                >
                  Back to Review
                </Button>
                <Button
                  onClick={handleProceedToCart}
                  className="flex-1"
                  disabled={selectedMedicines.filter(s => s.addToCart).length === 0}
                >
                  Proceed to Cart
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};