
import React, { useState } from 'react';
import { MapPin, Clock, History } from 'lucide-react';
import { ServiceHeader } from '@/frontend/components/Common/ServiceHeader';
import { FilterBar } from '@/frontend/components/Common/FilterBar';
import { FloatingHelp } from '@/frontend/components/Common/FloatingHelp';
import { AmbulanceCard } from '@/frontend/components/Ambulance/AmbulanceCard';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { mockAmbulanceServices, mockBookingHistory } from '@/frontend/data/mockAmbulanceData';

export const Ambulance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');

  const filters = [
    {
      key: 'type',
      label: 'Ambulance Type',
      options: [
        { value: 'Basic', label: 'Basic Life Support', count: 8 },
        { value: 'ICU', label: 'ICU Ambulance', count: 5 },
        { value: 'Advanced', label: 'Advanced Life Support', count: 3 },
        { value: 'Neonatal', label: 'Neonatal Transport', count: 2 }
      ]
    },
    {
      key: 'availability',
      label: 'Availability',
      options: [
        { value: 'Available', label: 'Available Now', count: 12 },
        { value: 'Busy', label: 'Busy', count: 4 }
      ]
    },
    {
      key: 'features',
      label: 'Features',
      options: [
        { value: 'GPS Tracking', label: 'GPS Tracking', count: 15 },
        { value: 'Paramedic Staff', label: 'Paramedic on Board', count: 10 },
        { value: 'Oxygen Support', label: 'Oxygen Support', count: 18 }
      ]
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Ambulance Booking' }
  ];

  const handleBookAmbulance = (serviceId: string) => {
    console.log('Booking ambulance:', serviceId);
    // TODO: Implement booking logic with Supabase
  };

  const handleCallService = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const filteredServices = mockAmbulanceServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(activeFilters).every(([filterKey, values]) => {
      if (values.length === 0) return true;
      
      switch (filterKey) {
        case 'type':
          return values.includes(service.type);
        case 'availability':
          return values.includes(service.availability);
        case 'features':
          return values.some(feature => service.features.includes(feature));
        default:
          return true;
      }
    });
    
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="min-h-screen bg-background">
      <ServiceHeader
        title="Ambulance Services"
        subtitle="24/7 Emergency & Scheduled Medical Transport"
        breadcrumbs={breadcrumbs}
        showEmergencyCall={true}
        emergencyNumber="108"
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="book" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Book Ambulance
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Booking History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6">
            {/* Quick Location Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Journey Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Pickup Location</label>
                  <Input
                    placeholder="Enter pickup address"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Drop Location</label>
                  <Input
                    placeholder="Enter destination address"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                  />
                </div>
                <Button className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Find Available Ambulances
                </Button>
              </CardContent>
            </Card>

            {/* Filter Bar */}
            <FilterBar
              searchPlaceholder="Search ambulance services..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={(key, values) => 
                setActiveFilters(prev => ({ ...prev, [key]: values }))
              }
              onClearFilters={() => setActiveFilters({})}
            />

            {/* Available Services */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Available Services ({filteredServices.length})</h2>
              {filteredServices.map((service) => (
                <AmbulanceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookAmbulance}
                  onCall={handleCallService}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h2 className="text-lg font-semibold">Previous Bookings</h2>
            {mockBookingHistory.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{booking.serviceName}</h3>
                      <p className="text-xs text-muted-foreground">{booking.bookingDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{booking.totalAmount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><strong>From:</strong> {booking.pickupAddress}</p>
                    <p><strong>To:</strong> {booking.dropAddress}</p>
                    <p><strong>Condition:</strong> {booking.patientCondition}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <FloatingHelp />
    </div>
  );
};
