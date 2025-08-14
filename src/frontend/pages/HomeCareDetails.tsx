import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Phone, MapPin, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { homeCareServices } from '@/frontend/data/mockHomeCareData';

export const HomeCareDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    careType: ''
  });

  const service = homeCareServices.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <Button asChild>
            <Link to="/home-care">Back to Home Care</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getCurrentPrice = () => {
    const duration = service.durations.find(d => d.id === selectedDuration);
    return duration?.price;
  };

  const getCurrentUnit = () => {
    const duration = service.durations.find(d => d.id === selectedDuration);
    return duration?.unit;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Enquiry submitted:', formData);
    alert('Thank you for your enquiry! Our team will contact you shortly.');
    setShowEnquiryForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/home-care">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Service Details</h1>
            </div>
            <Button size="sm" onClick={() => setShowEnquiryForm(true)}>
              Enquire Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Service Hero */}
        <div className="mb-8">
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{service.serviceIcon}</span>
                {service.featured && (
                  <Badge variant="destructive">Featured</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h1>
            </div>
          </div>

          {/* Rating and Basic Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{service.rating}</span>
                <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call Expert
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {service.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">About This Service</h2>
              <p className="text-muted-foreground leading-relaxed">{service.fullDescription}</p>
            </div>

            {/* Care Plan */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Care Plan Includes</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.carePlan.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Staff Qualifications</h2>
              <div className="space-y-3">
                {service.qualifications.map((qualification, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{qualification}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {service.faq.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Book This Service</h3>
              
              {/* Duration Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Duration
                </label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {service.durations.map((duration) => (
                      <SelectItem key={duration.id} value={duration.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{duration.label}</span>
                          {duration.price && (
                            <span className="ml-2 font-medium">₹{duration.price.toLocaleString()}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Display */}
              {getCurrentPrice() && (
                <div className="bg-primary/10 rounded-lg p-4 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{getCurrentPrice()?.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per {getCurrentUnit()}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => setShowEnquiryForm(true)}
                  disabled={!selectedDuration}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Enquire Now
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Expert: +91-9876543210
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                Our team will contact you within 30 minutes to confirm your booking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Enquiry Form</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEnquiryForm(false)}
              >
                ×
              </Button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Full Name *
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Contact Number *
                </label>
                <Input
                  required
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Location *
                </label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Type of Care Needed
                </label>
                <Textarea
                  value={formData.careType}
                  onChange={(e) => setFormData(prev => ({ ...prev, careType: e.target.value }))}
                  placeholder="Describe your care requirements..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Submit Enquiry
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEnquiryForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};