import React, { useState } from 'react';
import { Plus, Search, User, Star, MapPin, Phone } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { StatCard } from '@/admin/components/shared/StatCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useToast } from '@/shared/hooks/use-toast';

export function DoctorCatalogue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: doctors, loading, refetch } = useSupabaseQuery({
    table: 'doctors',
    select: `
      id, name, email, phone, qualification, experience, age, about,
      verified, active, languages, expertise, procedures, gender,
      registration_number, clinic_name, clinic_address, clinic_city,
      clinic_state, clinic_pincode, rating, review_count, created_at, specialty_id,
      doctor_specialties!left(name)
    `,
    orderBy: 'name',
  });

  const { data: specialties } = useSupabaseQuery({
    table: 'doctor_specialties',
    select: 'id, name',
    filters: { active: true },
  });

  const { create, update, remove } = useSupabaseMutation({
    table: 'doctors',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: editingItem ? "Doctor updated successfully" : "Doctor created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredDoctors = doctors?.filter(doctor =>
    doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor?.qualification?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor?.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor?.doctor_specialties?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalDoctors = doctors?.length || 0;
  const verifiedDoctors = doctors?.filter(d => d.verified && d.active)?.length || 0;
  const activeDoctors = doctors?.filter(d => d.active)?.length || 0;
  const avgRating = doctors?.reduce((sum, d) => sum + (d.rating || 0), 0) / (doctors?.length || 1) || 0;

  const formFields = [
    { name: 'name', label: 'Full Name', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const },
    { name: 'phone', label: 'Phone', type: 'tel' as const },
    { name: 'qualification', label: 'Qualification', type: 'text' as const },
    { 
      name: 'specialty_id', 
      label: 'Specialty', 
      type: 'select' as const, 
      options: specialties?.map(s => ({ value: s.id, label: s.name })) || [],
      required: true 
    },
    { name: 'experience', label: 'Experience (Years)', type: 'number' as const },
    { name: 'age', label: 'Age', type: 'number' as const },
    { name: 'gender', label: 'Gender', type: 'select' as const, options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]},
    { name: 'registration_number', label: 'Registration Number', type: 'text' as const },
    { name: 'about', label: 'About', type: 'textarea' as const },
    { name: 'languages', label: 'Languages', type: 'array' as const },
    { name: 'expertise', label: 'Expertise', type: 'array' as const },
    { name: 'procedures', label: 'Procedures', type: 'array' as const },
    { name: 'clinic_name', label: 'Clinic Name', type: 'text' as const },
    { name: 'clinic_address', label: 'Clinic Address', type: 'textarea' as const },
    { name: 'clinic_city', label: 'City', type: 'text' as const },
    { name: 'clinic_state', label: 'State', type: 'text' as const },
    { name: 'clinic_pincode', label: 'Pincode', type: 'text' as const },
    { name: 'verified', label: 'Verified', type: 'boolean' as const },
    { name: 'active', label: 'Active', type: 'boolean' as const },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Doctor', 
      sortable: true,
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-sm text-muted-foreground">{row.qualification}</span>
        </div>
      )
    },
    { 
      key: 'specialty',
      label: 'Specialty', 
      render: (_: any, row: any) => row?.doctor_specialties?.name || '-'
    },
    { 
      key: 'experience', 
      label: 'Experience', 
      render: (value: number) => value ? `${value} years` : '-'
    },
    { 
      key: 'clinic_city', 
      label: 'Location', 
      render: (value: string) => value || '-'
    },
    { 
      key: 'rating',
      label: 'Rating',
      render: (value: number, row: any) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{value?.toFixed(1) || '0.0'}</span>
          <span className="text-sm text-muted-foreground">({row.review_count || 0})</span>
        </div>
      )
    },
    { 
      key: 'verified', 
      label: 'Status', 
      render: (_: any, row: any) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.verified ? 'default' : 'secondary'}>
            {row.verified ? 'Verified' : 'Unverified'}
          </Badge>
          <Badge variant={row.active ? 'default' : 'secondary'}>
            {row.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      )
    },
  ];

  const handleSubmit = async (data: any) => {
    if (editingItem) {
      await update(editingItem.id, data);
    } else {
      await create(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          icon={User}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Doctors"
          value={activeDoctors}
          icon={User}
          iconColor="text-green-600"
        />
        <StatCard
          title="Verified Doctors"
          value={verifiedDoctors}
          icon={Star}
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Avg Rating"
          value={avgRating.toFixed(1)}
          icon={Star}
          iconColor="text-purple-600"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Doctors"
        description="Manage doctor profiles and information"
        data={filteredDoctors}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {/* Form Dialog */}
      {isDialogOpen && (
        <FormDialog
          title={editingItem ? "Edit Doctor" : "Add New Doctor"}
          fields={formFields}
          initialData={editingItem}
          onSubmit={handleSubmit}
          trigger={<Button style={{ display: 'none' }}>Hidden</Button>}
        />
      )}
    </div>
  );
}