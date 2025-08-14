import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { ProductHeader } from '@/frontend/components/ProductDetails/ProductHeader';
import { PricingSection } from '@/frontend/components/ProductDetails/PricingSection';
import { PrescriptionUpload } from '@/frontend/components/ProductDetails/PrescriptionUpload';
import { ProductTabs } from '@/frontend/components/ProductDetails/ProductTabs';
import { AlternativesSection } from '@/frontend/components/ProductDetails/AlternativesSection';
import { RatingReviews } from '@/frontend/components/ProductDetails/RatingReviews';
import { FrequentlyBought } from '@/frontend/components/ProductDetails/FrequentlyBought';
import { StickyBottomCTA } from '@/frontend/components/ProductDetails/StickyBottomCTA';
import { TrustBadges } from '@/frontend/components/ProductDetails/TrustBadges';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { MessageCircle, Truck, Clock, MapPin, Phone } from 'lucide-react';
import { mockMedicineData } from '@/frontend/data/mockMedicineData';
import { getImageWithFallback, handleImageError } from '@/frontend/utils/imageUtils';

export const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedVariant, setSelectedVariant] = useState(mockMedicineData.variants[0]?.id || '');
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [socialProofCount, setSocialProofCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get current variant details
  const currentVariant = mockMedicineData.variants.find(v => v.id === selectedVariant) || mockMedicineData.variants[0];

  useEffect(() => {
    // Simulate social proof counter
    const interval = setInterval(() => {
      setSocialProofCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handler functions (ready for Supabase integration)
  const handleAddToCart = (variantId: string, quantity: number) => {
    console.log('Add to cart:', { variantId, quantity });
    // TODO: Integrate with Supabase cart table
  };

  const handleBuyNow = (variantId: string, quantity: number) => {
    console.log('Buy now:', { variantId, quantity });
    // TODO: Navigate to checkout with Supabase session
  };

  const handleSubscribe = (variantId: string) => {
    console.log('Subscribe:', variantId);
    // TODO: Create subscription in Supabase
  };

  const handlePrescriptionUpload = (files: File[]) => {
    console.log('Prescription files:', files);
    // TODO: Upload to Supabase Storage
  };

  const handleSelectAlternative = (alternativeId: string) => {
    console.log('Select alternative:', alternativeId);
    // TODO: Navigate to alternative product
  };

  const handleConsultPharmacist = () => {
    console.log('Consult pharmacist');
    // TODO: Open chat or call functionality
  };

  const handleWriteReview = () => {
    console.log('Write review');
    // TODO: Open review modal with Supabase auth
  };

  const handleReportReview = (reviewId: string) => {
    console.log('Report review:', reviewId);
    // TODO: Report functionality with Supabase
  };

  const handleMarkHelpful = (reviewId: string) => {
    console.log('Mark helpful:', reviewId);
    // TODO: Update helpful count in Supabase
  };

  const handleAddBundle = (selectedItems: string[]) => {
    console.log('Add bundle:', selectedItems);
    // TODO: Add multiple items to cart
  };

  const handleAskExpert = () => {
    setShowPrescriptionUpload(false);
    // TODO: Open expert chat
  };

  if (!currentVariant) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-6">
          {/* Product Images & Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={getImageWithFallback("/api/placeholder/500/500", 'medical')}
                  alt={mockMedicineData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, 'medical')}
                />
              </div>
              
              {/* Thumbnail gallery */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="aspect-square rounded border overflow-hidden">
                    <img
                      src={getImageWithFallback(`/api/placeholder/100/100?${i}`, 'medical')}
                      alt={`${mockMedicineData.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, 'medical')}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Header & Pricing */}
            <div className="space-y-6">
              <ProductHeader
                name={mockMedicineData.name}
                genericName={mockMedicineData.genericName}
                manufacturer={mockMedicineData.manufacturer}
                composition={mockMedicineData.composition}
                packSize={mockMedicineData.packSize}
                prescriptionRequired={mockMedicineData.prescriptionRequired}
                inStock={mockMedicineData.inStock}
                verifiedByPharmacist={mockMedicineData.verifiedByPharmacist}
              />

              <PricingSection
                variants={mockMedicineData.variants}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onSubscribe={handleSubscribe}
              />

              {/* Social Proof */}
              {socialProofCount > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <p className="text-sm text-green-700">
                      🔥 <strong>{socialProofCount + 15}</strong> people in Kurnool bought this medicine this week
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">Delivery by tomorrow 2 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-foreground">Same Day Delivery</p>
                      <p className="text-sm text-muted-foreground">Order within 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-foreground">Serving Kurnool</p>
                      <p className="text-sm text-muted-foreground">15+ pharmacies in your area</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Prescription Upload (Conditional) */}
          {(mockMedicineData.prescriptionRequired || showPrescriptionUpload) && (
            <div className="mb-8">
              <PrescriptionUpload 
                onUpload={handlePrescriptionUpload}
                required={mockMedicineData.prescriptionRequired}
              />
            </div>
          )}

          {/* Product Details Tabs */}
          <div className="mb-8">
            <ProductTabs
              description={mockMedicineData.description}
              uses={mockMedicineData.uses}
              dosage={mockMedicineData.dosage}
              sideEffects={mockMedicineData.sideEffects}
              warnings={mockMedicineData.warnings}
              ingredients={mockMedicineData.ingredients}
              composition={mockMedicineData.composition}
              howToUse={mockMedicineData.howToUse}
              safetyInfo={mockMedicineData.safetyInfo}
              storageInstructions={mockMedicineData.storageInstructions}
              expertAdvice={mockMedicineData.expertAdvice}
            />
          </div>

          {/* Alternatives Section */}
          <div className="mb-8">
            <AlternativesSection
              alternatives={mockMedicineData.alternatives}
              onSelectAlternative={handleSelectAlternative}
              onConsultPharmacist={handleConsultPharmacist}
            />
          </div>

          {/* Frequently Bought Together */}
          <div className="mb-8">
            <FrequentlyBought
              currentProduct={{
                id: mockMedicineData.id,
                name: mockMedicineData.name,
                image: "/api/placeholder/100/100",
                price: currentVariant.price,
                originalPrice: currentVariant.originalPrice,
                category: 'medicine'
              }}
              bundleItems={mockMedicineData.bundleItems}
              onAddBundle={handleAddBundle}
            />
          </div>

          {/* Expert Consultation CTA */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Have questions about this medicine?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with our licensed pharmacists for personalized advice
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleConsultPharmacist}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Now
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Expert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div className="mb-8">
            <RatingReviews
              averageRating={mockMedicineData.averageRating}
              totalReviews={mockMedicineData.totalReviews}
              ratingBreakdown={mockMedicineData.ratingBreakdown}
              reviews={mockMedicineData.reviews}
              onWriteReview={handleWriteReview}
              onReportReview={handleReportReview}
              onMarkHelpful={handleMarkHelpful}
            />
          </div>
        </div>

        {/* Trust Badges */}
        <TrustBadges />
      </main>

      {/* Floating Expert Button (Desktop) */}
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-40 hidden md:flex"
        size="lg"
        onClick={handleAskExpert}
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Ask Expert
      </Button>

      {/* Sticky Bottom CTA (Mobile) */}
      <StickyBottomCTA
        price={currentVariant.price}
        originalPrice={currentVariant.originalPrice}
        onAddToCart={() => handleAddToCart(selectedVariant, 1)}
        onBuyNow={() => handleBuyNow(selectedVariant, 1)}
        onAskExpert={handleAskExpert}
        inStock={currentVariant.inStock}
      />

      <BottomNav />
    </div>
  );
};