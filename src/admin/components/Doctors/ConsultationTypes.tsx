import React, { useState } from 'react';
import { Plus, Search, Video, Building, Home, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { StatCard } from '@/admin/components/shared/StatCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useToast } from '@/shared/hooks/use-toast';

export function ConsultationTypes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: consultationTypes, loading, refetch } = useSupabaseQuery({
    table: 'consultation_types',
    select: `
      id, type, available, fee, duration_minutes, created_at, doctor_id,
      doctors!inner(name, clinic_name)
    `,
    orderBy: 'created_at',
  });

  const { data: doctors } = useSupabaseQuery({
    table: 'doctors',
    select: 'id, name, clinic_name',
    filters: { active: true },
  });

  const { create, update, remove } = useSupabaseMutation({
    table: 'consultation_types',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: editingItem ? "Consultation type updated successfully" : "Consultation type created successfully",
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

  const filteredConsultationTypes = consultationTypes?.filter(ct =>
    ct.doctors?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ct.type?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalConsultations = consultationTypes?.length || 0;
  const onlineConsultations = consultationTypes?.filter(ct => ct.type === 'online' && ct.available)?.length || 0;
  const clinicConsultations = consultationTypes?.filter(ct => ct.type === 'clinic' && ct.available)?.length || 0;
  const homeConsultations = consultationTypes?.filter(ct => ct.type === 'home' && ct.available)?.length || 0;

  const formFields = [
    { 
      name: 'doctor_id', 
      label: 'Doctor', 
      type: 'select' as const, 
      options: doctors?.map(d => ({ value: d.id, label: `${d.name} - ${d.clinic_name || 'No Clinic'}` })) || [],
      required: true 
    },
    { 
      name: 'type', 
      label: 'Consultation Type', 
      type: 'select' as const, 
      options: [
        { value: 'online', label: 'Online Consultation' },
        { value: 'clinic', label: 'Clinic Visit' },
        { value: 'home', label: 'Home Visit' }
      ],
      required: true 
    },
    { name: 'fee', label: 'Consultation Fee (₹)', type: 'number' as const, required: true },
    { name: 'duration_minutes', label: 'Duration (Minutes)', type: 'number' as const },
    { name: 'available', label: 'Available', type: 'boolean' as const },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'clinic':
        return <Building className="h-4 w-4 text-green-600" />;
      case 'home':
        return <Home className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'text-blue-600 bg-blue-50';
      case 'clinic':
        return 'text-green-600 bg-green-50';
      case 'home':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const columns = [
    { 
      key: 'doctor',
      label: 'Doctor', 
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.doctors?.name || 'N/A'}</span>
          <span className="text-sm text-muted-foreground">{row.doctors?.clinic_name || 'No Clinic'}</span>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(value)}
          <Badge className={getTypeColor(value)}>
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </Badge>
        </div>
      )
    },
    { 
      key: 'fee', 
      label: 'Fee',
      render: (value: number) => `₹${value || 0}`
    },
    { 
      key: 'duration_minutes', 
      label: 'Duration',
      render: (value: number) => `${value || 30} mins`
    },
    { 
      key: 'available', 
      label: 'Status', 
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Available' : 'Unavailable'}
        </Badge>
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
          title="Total Consultations"
          value={totalConsultations}
          icon={Clock}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Online"
          value={onlineConsultations}
          icon={Video}
          iconColor="text-green-600"
        />
        <StatCard
          title="Clinic"
          value={clinicConsultations}
          icon={Building}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Home Visit"
          value={homeConsultations}
          icon={Home}
          iconColor="text-orange-600"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search consultation types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Consultation Type
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Consultation Types"
        description="Manage consultation types, fees, and availability"
        data={filteredConsultationTypes}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {/* Form Dialog */}
      {isDialogOpen && (
        <FormDialog
          title={editingItem ? "Edit Consultation Type" : "Add New Consultation Type"}
          fields={formFields}
          initialData={editingItem}
          onSubmit={handleSubmit}
          trigger={<Button style={{ display: 'none' }}>Hidden</Button>}
        />
      )}
    </div>
  );
}