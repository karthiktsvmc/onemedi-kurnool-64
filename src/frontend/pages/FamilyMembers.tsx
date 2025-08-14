import { useState } from 'react';
import { Plus, Users, Edit, Trash2, User, Baby, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockFamilyMembers } from '@/frontend/data/mockProfileData';
import { useToast } from '@/shared/hooks/use-toast';

export const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const { toast } = useToast();

  const [newMember, setNewMember] = useState({
    name: '',
    relation: 'Spouse' as 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other'
  });

  const getRelationIcon = (relation: string) => {
    switch (relation) {
      case 'Child':
        return <Baby className="h-4 w-4" />;
      case 'Parent':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case 'Spouse':
        return 'bg-pink-100 text-pink-800';
      case 'Parent':
        return 'bg-blue-100 text-blue-800';
      case 'Child':
        return 'bg-green-100 text-green-800';
      case 'Sibling':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddMember = () => {
    const member = {
      id: `fam-${Date.now()}`,
      name: newMember.name,
      relation: newMember.relation,
      age: parseInt(newMember.age),
      gender: newMember.gender,
      addedDate: new Date().toISOString()
    };
    
    setFamilyMembers([...familyMembers, member]);
    setIsAddDialogOpen(false);
    setNewMember({
      name: '',
      relation: 'Spouse',
      age: '',
      gender: 'Male'
    });
    
    toast({
      title: "Family Member Added",
      description: `${member.name} has been added to your family.`,
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
    toast({
      title: "Member Removed",
      description: `${member?.name} has been removed from your family.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const MemberForm = ({ member, isEdit = false }: { member: any; isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          placeholder="Enter full name"
          value={member.name}
          onChange={(e) => 
            isEdit 
              ? setEditingMember({...member, name: e.target.value})
              : setNewMember({...member, name: e.target.value})
          }
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Relation</Label>
          <Select
            value={member.relation}
            onValueChange={(value) => 
              isEdit 
                ? setEditingMember({...member, relation: value})
                : setNewMember({...member, relation: value as any})
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={member.gender}
            onValueChange={(value) => 
              isEdit 
                ? setEditingMember({...member, gender: value})
                : setNewMember({...member, gender: value as any})
            }
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
      </div>
      
      <div className="space-y-2">
        <Label>Age</Label>
        <Input
          type="number"
          placeholder="Enter age"
          value={isEdit ? member.age : member.age}
          onChange={(e) => 
            isEdit 
              ? setEditingMember({...member, age: parseInt(e.target.value)})
              : setNewMember({...member, age: e.target.value})
          }
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Family Members
            </h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Family Member</DialogTitle>
                </DialogHeader>
                <MemberForm member={newMember} />
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddMember}
                    className="flex-1"
                    disabled={!newMember.name || !newMember.age}
                  >
                    Add Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg bg-primary/10">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs gap-1 ${getRelationColor(member.relation)}`}
                            >
                              {getRelationIcon(member.relation)}
                              {member.relation}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {member.age} years, {member.gender}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingMember(member)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(member.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Added on {formatDate(member.addedDate)}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          Book for {member.name.split(' ')[0]}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Health Records
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {familyMembers.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Family Members Added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your family members to book appointments and manage their health
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Family Member
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {familyMembers.length > 0 && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Family Health Benefits</h4>
                    <p className="text-sm text-blue-700">
                      • Book appointments for any family member<br/>
                      • Manage all health records in one place<br/>
                      • Get family health plan recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Member Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Family Member</DialogTitle>
            </DialogHeader>
            <MemberForm member={editingMember} isEdit />
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setEditingMember(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const updatedMembers = familyMembers.map(member => 
                    member.id === editingMember.id ? editingMember : member
                  );
                  setFamilyMembers(updatedMembers);
                  setEditingMember(null);
                  toast({
                    title: "Member Updated",
                    description: `${editingMember.name}'s details have been updated.`,
                  });
                }}
                className="flex-1"
              >
                Update Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <BottomNav />
    </div>
  );
};