import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { AdminCard } from '../components/shared/AdminCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Plus, Edit2, Trash2, MapPin, Users, Package } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'city' | 'area' | 'pincode';
  state: string;
  country: string;
  pincode: string;
  coordinates: { lat: number; lng: number };
  isActive: boolean;
  serviceRadius: number; // in km
  enabledServices: string[];
  deliveryCharges: {
    medicines: number;
    homecare: number;
    labTests: number;
  };
  partnersCount: number;
  ordersCount: number;
  population?: number;
  createdAt: string;
  updatedAt: string;
}

const services = [
  'medicines',
  'lab-tests',
  'scans', 
  'doctors',
  'homecare',
  'diabetes-care',
  'ambulance',
  'blood-banks'
];

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Hyderabad',
    type: 'city',
    state: 'Telangana',
    country: 'India',
    pincode: '500001',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    isActive: true,
    serviceRadius: 50,
    enabledServices: ['medicines', 'lab-tests', 'scans', 'doctors', 'homecare'],
    deliveryCharges: { medicines: 50, homecare: 100, labTests: 0 },
    partnersCount: 145,
    ordersCount: 2847,
    population: 10000000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jubilee Hills',
    type: 'area',
    state: 'Telangana',
    country: 'India',
    pincode: '500033',
    coordinates: { lat: 17.4126, lng: 78.4071 },
    isActive: true,
    serviceRadius: 10,
    enabledServices: ['medicines', 'lab-tests', 'doctors', 'homecare'],
    deliveryCharges: { medicines: 30, homecare: 80, labTests: 0 },
    partnersCount: 23,
    ordersCount: 456,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Mumbai',
    type: 'city',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    isActive: false,
    serviceRadius: 60,
    enabledServices: ['medicines', 'lab-tests'],
    deliveryCharges: { medicines: 60, homecare: 120, labTests: 25 },
    partnersCount: 89,
    ordersCount: 1234,
    population: 20000000,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  }
];

export default function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.pincode.includes(searchTerm);
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'active' && location.isActive) ||
                      (selectedTab === 'inactive' && !location.isActive) ||
                      location.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const handleToggleActive = (id: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, isActive: !loc.isActive } : loc
    ));
  };

  const LocationForm = ({ location, onClose }: { location?: Location; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: location?.name || '',
      type: location?.type || 'city' as const,
      state: location?.state || '',
      country: location?.country || 'India',
      pincode: location?.pincode || '',
      lat: location?.coordinates.lat?.toString() || '',
      lng: location?.coordinates.lng?.toString() || '',
      serviceRadius: location?.serviceRadius?.toString() || '10',
      isActive: location?.isActive ?? true,
      enabledServices: location?.enabledServices || [],
      medicineDelivery: location?.deliveryCharges.medicines?.toString() || '50',
      homecareDelivery: location?.deliveryCharges.homecare?.toString() || '100',
      labTestDelivery: location?.deliveryCharges.labTests?.toString() || '0',
      population: location?.population?.toString() || ''
    });

    const handleServiceToggle = (service: string) => {
      setFormData(prev => ({
        ...prev,
        enabledServices: prev.enabledServices.includes(service)
          ? prev.enabledServices.filter(s => s !== service)
          : [...prev.enabledServices, service]
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const locationData = {
        ...formData,
        coordinates: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        },
        serviceRadius: parseInt(formData.serviceRadius),
        deliveryCharges: {
          medicines: parseInt(formData.medicineDelivery),
          homecare: parseInt(formData.homecareDelivery),
          labTests: parseInt(formData.labTestDelivery)
        },
        population: formData.population ? parseInt(formData.population) : undefined
      };

      if (location) {
        setLocations(prev => prev.map(loc => 
          loc.id === location.id 
            ? { 
                ...loc, 
                ...locationData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : loc
        ));
      } else {
        const newLocation: Location = {
          id: Date.now().toString(),
          ...locationData,
          partnersCount: 0,
          ordersCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setLocations(prev => [...prev, newLocation]);
      }
      
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: 'city' | 'area' | 'pincode') => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="pincode">Pincode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={formData.lat}
              onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              value={formData.lng}
              onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="serviceRadius">Service Radius (km)</Label>
            <Input
              id="serviceRadius"
              type="number"
              value={formData.serviceRadius}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceRadius: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label>Enabled Services</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {services.map(service => (
              <div key={service} className="flex items-center space-x-2">
                <Switch
                  checked={formData.enabledServices.includes(service)}
                  onCheckedChange={() => handleServiceToggle(service)}
                />
                <span className="text-sm">{service.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="medicineDelivery">Medicine Delivery Charge (₹)</Label>
            <Input
              id="medicineDelivery"
              type="number"
              value={formData.medicineDelivery}
              onChange={(e) => setFormData(prev => ({ ...prev, medicineDelivery: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="homecareDelivery">Homecare Service Charge (₹)</Label>
            <Input
              id="homecareDelivery"
              type="number"
              value={formData.homecareDelivery}
              onChange={(e) => setFormData(prev => ({ ...prev, homecareDelivery: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="labTestDelivery">Lab Test Collection Charge (₹)</Label>
            <Input
              id="labTestDelivery"
              type="number"
              value={formData.labTestDelivery}
              onChange={(e) => setFormData(prev => ({ ...prev, labTestDelivery: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="population">Population (optional)</Label>
            <Input
              id="population"
              type="number"
              value={formData.population}
              onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label>Active Location</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{location ? 'Update' : 'Create'} Location</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Location Management"
        description="Manage service areas, delivery zones and location-based settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard title="Total Locations">{locations.length.toString()}</AdminCard>
        <AdminCard title="Active Locations">{locations.filter(l => l.isActive).length.toString()}</AdminCard>
        <AdminCard title="Total Partners">{locations.reduce((sum, l) => sum + l.partnersCount, 0).toString()}</AdminCard>
        <AdminCard title="Total Orders">{locations.reduce((sum, l) => sum + l.ordersCount, 0).toString()}</AdminCard>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="city">Cities</TabsTrigger>
            <TabsTrigger value="area">Areas</TabsTrigger>
            <TabsTrigger value="pincode">Pincodes</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <LocationForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value={selectedTab} className="mt-0">
          <AdminCard title="Locations">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Enabled Services</TableHead>
                  <TableHead>Service Radius</TableHead>
                  <TableHead>Delivery Charges</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.state}, {location.country} - {location.pincode}
                          </div>
                          {location.population && (
                            <div className="text-xs text-muted-foreground">
                              Population: {location.population.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{location.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {location.enabledServices.slice(0, 3).map(service => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service.replace('-', ' ')}
                          </Badge>
                        ))}
                        {location.enabledServices.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{location.enabledServices.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{location.serviceRadius} km</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>Medicine: ₹{location.deliveryCharges.medicines}</div>
                        <div>Homecare: ₹{location.deliveryCharges.homecare}</div>
                        <div>Lab: ₹{location.deliveryCharges.labTests}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{location.partnersCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>{location.ordersCount}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={location.isActive}
                          onCheckedChange={() => handleToggleActive(location.id)}
                        />
                        <span className="text-sm">{location.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingLocation(location)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Location</DialogTitle>
                            </DialogHeader>
                            {editingLocation && (
                              <LocationForm 
                                location={editingLocation} 
                                onClose={() => setEditingLocation(null)} 
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}