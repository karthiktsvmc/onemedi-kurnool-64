import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAddresses, Address } from '@/shared/hooks/useAddresses';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Plus, MapPin, Phone, User, Edit, Trash2, Check } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface AddressFormData {
  type: 'home' | 'work' | 'other';
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const initialFormData: AddressFormData = {
  type: 'home',
  full_name: '',
  phone: '',
  address_line_1: '',
  address_line_2: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  is_default: false,
};

interface AddressManagerProps {
  onAddressSelect?: (address: Address) => void;
  selectedAddressId?: string;
  showSelection?: boolean;
}

export const AddressManager: React.FC<AddressManagerProps> = ({
  onAddressSelect,
  selectedAddressId,
  showSelection = false,
}) => {
  const { addresses, loading, createAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await createAddress(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(addressId);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    await setDefaultAddress(addressId);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {showSelection ? 'Select Delivery Address' : 'Saved Addresses'}
        </h3>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Address Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => handleInputChange('is_default', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is_default" className="text-sm">
                    Default Address
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address_line_1">Address Line 1</Label>
                <Input
                  id="address_line_1"
                  value={formData.address_line_1}
                  onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line_2"
                  value={formData.address_line_2}
                  onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? 'Saving...' : editingAddress ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-4">
              Add your first address to start ordering
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`transition-all ${
                showSelection 
                  ? selectedAddressId === address.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'cursor-pointer hover:shadow-md'
                  : ''
              }`}
              onClick={() => showSelection && onAddressSelect?.(address)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium capitalize">{address.type}</span>
                      {address.is_default && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      {showSelection && selectedAddressId === address.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{address.full_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{address.phone}</span>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 mt-0.5" />
                        <div>
                          <div>{address.address_line_1}</div>
                          {address.address_line_2 && <div>{address.address_line_2}</div>}
                          {address.landmark && <div>Near {address.landmark}</div>}
                          <div>{address.city}, {address.state} - {address.pincode}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!showSelection && (
                    <div className="flex gap-2 ml-4">
                      {!address.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          title="Set as default"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(address)}
                        title="Edit address"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        title="Delete address"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};