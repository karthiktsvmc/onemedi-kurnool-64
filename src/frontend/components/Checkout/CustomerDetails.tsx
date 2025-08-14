import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckoutUser } from '@/frontend/data/mockCheckoutData';
import { User, Edit3 } from 'lucide-react';

interface CustomerDetailsProps {
  user?: CheckoutUser;
  isLoggedIn?: boolean;
  onUpdate: (user: CheckoutUser) => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  user,
  isLoggedIn = false,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(!isLoggedIn);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [formData, setFormData] = useState<CheckoutUser>(
    user || {
      id: '',
      name: '',
      email: '',
      phone: '',
      gender: undefined,
      age: undefined
    }
  );

  const handleInputChange = (field: keyof CheckoutUser, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(formData);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer Details
          </div>
          {isLoggedIn && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-primary"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isLoggedIn && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Guest Checkout:</span> You can complete your order without creating an account.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
              className={!isEditing ? 'bg-secondary/30' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="+91 XXXXX XXXXX"
              className={!isEditing ? 'bg-secondary/30' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="your@email.com"
              className={!isEditing ? 'bg-secondary/30' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
              disabled={!isEditing}
              placeholder="Age (required for prescriptions)"
              className={!isEditing ? 'bg-secondary/30' : ''}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
            disabled={!isEditing}
          >
            <SelectTrigger className={!isEditing ? 'bg-secondary/30' : ''}>
              <SelectValue placeholder="Select gender (required for prescriptions)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isLoggedIn && (
          <div className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-lg">
            <Switch
              id="save-profile"
              checked={saveToProfile}
              onCheckedChange={setSaveToProfile}
            />
            <Label htmlFor="save-profile" className="text-sm">
              Save details for faster checkout next time
            </Label>
          </div>
        )}

        {isEditing && isLoggedIn && (
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} size="sm">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          * Required fields. Age and gender needed for prescription medicines and lab tests.
        </div>
      </CardContent>
    </Card>
  );
};