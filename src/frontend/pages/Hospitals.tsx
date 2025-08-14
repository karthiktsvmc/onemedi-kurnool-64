import React, { useState } from 'react';
import { MapPin, Star, Phone, Clock } from 'lucide-react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { NavigationBreadcrumb } from '@/frontend/components/Common/NavigationBreadcrumb';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export const Hospitals = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const hospitals = [
    {
      id: '1',
      name: 'Apollo Hospital',
      address: 'Jubilee Hills, Hyderabad',
      rating: 4.5,
      reviews: 2500,
      specialties: ['Cardiology', 'Oncology', 'Neurology'],
      distance: '2.5 km',
      phone: '+91 40 2345 6789',
      available24x7: true
    },
    {
      id: '2',
      name: 'Care Hospital',
      address: 'Banjara Hills, Hyderabad',
      rating: 4.3,
      reviews: 1800,
      specialties: ['Orthopedics', 'Gastroenterology', 'Pediatrics'],
      distance: '3.2 km',
      phone: '+91 40 2345 6790',
      available24x7: true
    }
  ];

  const breadcrumbItems = [{ label: 'Hospitals' }];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 pt-16">
        <NavigationBreadcrumb items={breadcrumbItems} />
        
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Find Hospitals Near You
            </h1>
            <p className="text-muted-foreground">
              Book appointments at top-rated hospitals in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {hospital.name}
                    </h3>
                    {hospital.available24x7 && (
                      <Badge variant="secondary" className="text-green-600">
                        24x7
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{hospital.rating}</span>
                      <span className="text-muted-foreground">({hospital.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm">
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};