import { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { useProfile } from '@/shared/hooks/useProfile';
import { useAuth } from '@/shared/contexts/AuthContext';
import { AuthGuard } from '@/shared/components/AuthGuard';

export const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updating, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    phone: '',
    email: '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        gender: profile.gender || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const success = await updateProfile(editedProfile);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        gender: profile.gender || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.profile_image_url} alt={profile?.full_name || 'User'} />
                    <AvatarFallback className="text-lg">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl">{profile?.full_name || 'User Profile'}</CardTitle>
                <p className="text-muted-foreground">{profile?.email || user?.email}</p>
              </CardHeader>
            </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updating}
                    className="h-8"
                  >
                    {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editedProfile.full_name : (profile?.full_name || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedProfile.phone : (profile?.phone || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile.email : (profile?.email || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={isEditing ? editedProfile.gender : (profile?.gender || '')}
                    onValueChange={(value) => setEditedProfile({...editedProfile, gender: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={isEditing ? editedProfile.date_of_birth : (profile?.date_of_birth || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, date_of_birth: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={isEditing ? editedProfile.address : (profile?.address || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={isEditing ? editedProfile.city : (profile?.city || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={isEditing ? editedProfile.state : (profile?.state || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, state: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={isEditing ? editedProfile.pincode : (profile?.pincode || '')}
                    onChange={(e) => setEditedProfile({...editedProfile, pincode: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button 
                variant="destructive" 
                onClick={signOut}
                className="w-full"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

        <BottomNav />
      </div>
    </AuthGuard>
  );
};