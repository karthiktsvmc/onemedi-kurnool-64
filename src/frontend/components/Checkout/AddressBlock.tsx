import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Address } from '@/frontend/data/mockCheckoutData';
import { 
  MapPin, 
  Home, 
  Building, 
  User, 
  Plus, 
  Check,
  MapPinned,
  Clock,
  Video
} from 'lucide-react';

interface AddressBlockProps {
  addresses: Address[];
  selectedAddress?: Address;
  serviceType: 'delivery' | 'home-visit' | 'clinic' | 'online';
  onAddressSelect: (address: Address) => void;
  onServiceTypeChange: (type: 'delivery' | 'home-visit' | 'clinic' | 'online') => void;
}

export const AddressBlock: React.FC<AddressBlockProps> = ({
  addresses,
  selectedAddress,
  serviceType,
  onAddressSelect,
  onServiceTypeChange
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Home className="h-4 w-4" />;
      case 'home-visit': return <MapPinned className="h-4 w-4" />;
      case 'clinic': return <Building className="h-4 w-4" />;
      case 'online': return <Video className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'office': return <Building className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const serviceOptions = [
    {
      id: 'delivery',
      name: 'Home Delivery',
      description: 'Get medicines & products delivered',
      icon: 'delivery'
    },
    {
      id: 'home-visit',
      name: 'Home Visit',
      description: 'Lab tests & consultations at home',
      icon: 'home-visit'
    },
    {
      id: 'clinic',
      name: 'Visit Clinic',
      description: 'Visit our partner clinics',
      icon: 'clinic'
    },
    {
      id: 'online',
      name: 'Online Consultation',
      description: 'Video/audio consultation',
      icon: 'online'
    }
  ];

  const handleAddAddress = () => {
    // In real app, this would save to Supabase
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress as Address,
      isDefault: false,
      isServiceable: true
    };
    
    setShowAddForm(false);
    setNewAddress({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Service Type & Address
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Service Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">How would you like to receive this service?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceOptions.map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  serviceType === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onServiceTypeChange(option.id as any)}
              >
                <div className="flex items-center gap-2">
                  {getServiceIcon(option.icon)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{option.name}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  {serviceType === option.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address Selection (only for delivery and home-visit) */}
        {(serviceType === 'delivery' || serviceType === 'home-visit') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select Address</Label>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <Select
                        value={newAddress.type}
                        onValueChange={(value) => setNewAddress({...newAddress, type: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Address Name</Label>
                      <Input
                        placeholder="e.g., Home, Office"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input
                        placeholder="House/Flat No, Street, Area"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pincode</Label>
                        <Input
                          placeholder="000000"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Landmark (Optional)</Label>
                      <Input
                        placeholder="Near metro station, mall, etc."
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                      />
                    </div>
                    
                    <Button onClick={handleAddAddress} className="w-full">
                      Save Address
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAddress?.id === address.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onAddressSelect(address)}
                >
                  <div className="flex items-start gap-3">
                    {getAddressIcon(address.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{address.name}</span>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            Default
                          </Badge>
                        )}
                        {!address.isServiceable && (
                          <Badge variant="destructive" className="text-xs px-2 py-0.5">
                            Not Serviceable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.landmark && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Near: {address.landmark}
                        </p>
                      )}
                    </div>
                    {selectedAddress?.id === address.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinic Selection */}
        {serviceType === 'clinic' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Partner Clinic Selection
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              You'll be able to choose a nearby clinic during appointment booking.
            </p>
          </div>
        )}

        {/* Online Consultation Info */}
        {serviceType === 'online' && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Online Consultation
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              You'll receive a video/audio call link before your appointment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};