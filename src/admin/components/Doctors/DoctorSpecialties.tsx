import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { StatCard } from '@/admin/components/shared/StatCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useToast } from '@/shared/hooks/use-toast';

export function DoctorSpecialties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: specialties, loading, refetch } = useSupabaseQuery({
    table: 'doctor_specialties',
    select: 'id, name, description, image_url, active, created_at, updated_at',
    orderBy: 'name',
  });

  const { data: doctors } = useSupabaseQuery({
    table: 'doctors',
    select: 'id, specialty_id, active',
  });

  const { create, update, remove } = useSupabaseMutation({
    table: 'doctor_specialties',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: editingItem ? "Specialty updated successfully" : "Specialty created successfully",
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

  const getDoctorCount = (specialtyId: string) => {
    return doctors?.filter(d => d.specialty_id === specialtyId && d.active)?.length || 0;
  };

  const filteredSpecialties = specialties?.filter(specialty =>
    specialty.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    specialty.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalSpecialties = specialties?.length || 0;
  const activeSpecialties = specialties?.filter(s => s.active)?.length || 0;
  const totalDoctors = doctors?.filter(d => d.active)?.length || 0;

  const formFields = [
    { name: 'name', label: 'Specialty Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'active', label: 'Active', type: 'boolean' as const },
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', render: (value: string) => value || '-' },
    { 
      key: 'doctor_count', 
      label: 'Doctors', 
      render: (_: any, row: any) => (
        <Badge variant="secondary">{getDoctorCount(row.id)}</Badge>
      )
    },
    { 
      key: 'active', 
      label: 'Status', 
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { key: 'created_at', label: 'Created', render: (value: string) => new Date(value).toLocaleDateString() },
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
    const doctorCount = getDoctorCount(id);
    if (doctorCount > 0) {
      toast({
        title: "Cannot Delete",
        description: `This specialty has ${doctorCount} doctors assigned. Please reassign doctors first.`,
        variant: "destructive",
      });
      return;
    }
    await remove(id);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Specialties"
          value={totalSpecialties}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Specialties"
          value={activeSpecialties}
          icon={Eye}
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          icon={Users}
          iconColor="text-purple-600"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Specialty
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Doctor Specialties"
        description="Manage medical specialties and their information"
        data={filteredSpecialties}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {/* Form Dialog */}
      <FormDialog
        title={editingItem ? "Edit Specialty" : "Add New Specialty"}
        fields={formFields}
        initialData={editingItem}
        onSubmit={handleSubmit}
        trigger={
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className={isDialogOpen ? "hidden" : ""}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Specialty (Dialog)
          </Button>
        }
      />
    </div>
  );
}