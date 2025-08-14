import { useState } from 'react';
import { Camera, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockUserProfile } from '@/frontend/data/mockProfileData';
import { useToast } from '@/shared/hooks/use-toast';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);
  const [editedProfile, setEditedProfile] = useState(mockUserProfile);
  const { toast } = useToast();

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addCondition = (condition: string) => {
    if (condition && !editedProfile.chronicConditions?.includes(condition)) {
      setEditedProfile({
        ...editedProfile,
        chronicConditions: [...(editedProfile.chronicConditions || []), condition]
      });
    }
  };

  const removeCondition = (condition: string) => {
    setEditedProfile({
      ...editedProfile,
      chronicConditions: editedProfile.chronicConditions?.filter(c => c !== condition)
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profilePicture} alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
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
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
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
                    className="h-8"
                  >
                    <Save className="h-4 w-4 mr-2" />
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
                    value={isEditing ? editedProfile.name : profile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedProfile.phone : profile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={isEditing ? editedProfile.gender : profile.gender}
                    onValueChange={(value) => setEditedProfile({...editedProfile, gender: value as any})}
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
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={isEditing ? editedProfile.age : profile.age}
                    onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value)})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={isEditing ? editedProfile.weight || '' : profile.weight || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, weight: parseInt(e.target.value) || undefined})}
                    disabled={!isEditing}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={isEditing ? editedProfile.height || '' : profile.height || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, height: parseInt(e.target.value) || undefined})}
                    disabled={!isEditing}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                This information helps us provide better healthcare recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chronic Conditions</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(isEditing ? editedProfile.chronicConditions : profile.chronicConditions)?.map((condition, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1"
                    >
                      {condition}
                      {isEditing && (
                        <button
                          onClick={() => removeCondition(condition)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Select onValueChange={addCondition}>
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Add condition..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diabetes Type 1">Diabetes Type 1</SelectItem>
                        <SelectItem value="Diabetes Type 2">Diabetes Type 2</SelectItem>
                        <SelectItem value="Hypertension">Hypertension</SelectItem>
                        <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                        <SelectItem value="Asthma">Asthma</SelectItem>
                        <SelectItem value="Thyroid">Thyroid</SelectItem>
                        <SelectItem value="Arthritis">Arthritis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};