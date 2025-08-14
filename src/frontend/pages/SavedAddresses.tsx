import { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Home, Building, MoreHorizontal, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockSavedAddresses } from '@/frontend/data/mockProfileData';
import { useToast } from '@/shared/hooks/use-toast';

export const SavedAddresses = () => {
  const [addresses, setAddresses] = useState(mockSavedAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const { toast } = useToast();

  const [newAddress, setNewAddress] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return <Home className="h-4 w-4" />;
      case 'Work':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const handleAddAddress = () => {
    const address = {
      id: `addr-${Date.now()}`,
      ...newAddress
    };
    
    let updatedAddresses = [...addresses, address];
    
    // If this is set as default, remove default from others
    if (address.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id !== address.id ? { ...addr, isDefault: false } : addr
      );
    }
    
    setAddresses(updatedAddresses);
    setIsAddDialogOpen(false);
    setNewAddress({
      type: 'Home',
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      isDefault: false
    });
    
    toast({
      title: "Address Added",
      description: "Your new address has been saved successfully.",
    });
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    
    toast({
      title: "Default Address Updated",
      description: "This address is now set as your default.",
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    toast({
      title: "Address Deleted",
      description: "The address has been removed from your account.",
    });
  };

  const AddressForm = ({ address, isEdit = false }: { address: any; isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Address Type</Label>
          <Select
            value={address.type}
            onValueChange={(value) => 
              isEdit 
                ? setEditingAddress({...address, type: value})
                : setNewAddress({...address, type: value as any})
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Address Name</Label>
          <Input
            placeholder="e.g. Home, Office"
            value={address.name}
            onChange={(e) => 
              isEdit 
                ? setEditingAddress({...address, name: e.target.value})
                : setNewAddress({...address, name: e.target.value})
            }
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Complete Address</Label>
        <Textarea
          placeholder="House/Flat No, Street, Area"
          value={address.address}
          onChange={(e) => 
            isEdit 
              ? setEditingAddress({...address, address: e.target.value})
              : setNewAddress({...address, address: e.target.value})
          }
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={address.city}
            onChange={(e) => 
              isEdit 
                ? setEditingAddress({...address, city: e.target.value})
                : setNewAddress({...address, city: e.target.value})
            }
          />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={address.state}
            onChange={(e) => 
              isEdit 
                ? setEditingAddress({...address, state: e.target.value})
                : setNewAddress({...address, state: e.target.value})
            }
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pincode</Label>
          <Input
            value={address.pincode}
            onChange={(e) => 
              isEdit 
                ? setEditingAddress({...address, pincode: e.target.value})
                : setNewAddress({...address, pincode: e.target.value})
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Landmark (Optional)</Label>
          <Input
            placeholder="Near..."
            value={address.landmark}
            onChange={(e) => 
              isEdit 
                ? setEditingAddress({...address, landmark: e.target.value})
                : setNewAddress({...address, landmark: e.target.value})
            }
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="default-address"
          checked={address.isDefault}
          onCheckedChange={(checked) => 
            isEdit 
              ? setEditingAddress({...address, isDefault: checked})
              : setNewAddress({...address, isDefault: checked})
          }
        />
        <Label htmlFor="default-address">Set as default address</Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Saved Addresses</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <AddressForm address={newAddress} />
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddAddress}
                    className="flex-1"
                    disabled={!newAddress.name || !newAddress.address || !newAddress.city}
                  >
                    Save Address
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className={address.isDefault ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAddressIcon(address.type)}
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {address.name}
                          {address.isDefault && (
                            <Badge variant="default" className="text-xs gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              Default
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {address.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingAddress(address)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">{address.address}</p>
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.landmark && (
                      <p className="text-muted-foreground text-xs">
                        Near {address.landmark}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="flex-1"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {addresses.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Saved Addresses</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your addresses for faster checkout
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Edit Address Dialog */}
      {editingAddress && (
        <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <AddressForm address={editingAddress} isEdit />
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setEditingAddress(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const updatedAddresses = addresses.map(addr => 
                    addr.id === editingAddress.id ? editingAddress : 
                    editingAddress.isDefault ? { ...addr, isDefault: false } : addr
                  );
                  setAddresses(updatedAddresses);
                  setEditingAddress(null);
                  toast({
                    title: "Address Updated",
                    description: "Your address has been updated successfully.",
                  });
                }}
                className="flex-1"
              >
                Update Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <BottomNav />
    </div>
  );
};