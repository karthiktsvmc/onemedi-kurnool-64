import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { StatCard } from '@/admin/components/shared/StatCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useToast } from '@/shared/hooks/use-toast';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function DoctorSchedules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const { data: schedules, loading, refetch } = useSupabaseQuery({
    table: 'doctor_schedules',
    select: `
      id, consultation_type, day_of_week, start_time, end_time, 
      slot_duration_minutes, active, created_at,
      doctors(name, clinic_name)
    `,
    orderBy: 'day_of_week',
  });

  const { data: doctors } = useSupabaseQuery({
    table: 'doctors',
    select: 'id, name, clinic_name',
    filters: { active: true },
  });

  const { create, update, remove } = useSupabaseMutation({
    table: 'doctor_schedules',
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Success",
        description: editingItem ? "Schedule updated successfully" : "Schedule created successfully",
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

  const filteredSchedules = schedules?.filter(schedule =>
    schedule.doctors?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.consultation_type?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalSchedules = schedules?.length || 0;
  const activeSchedules = schedules?.filter(s => s.active)?.length || 0;
  const onlineSchedules = schedules?.filter(s => s.consultation_type === 'online' && s.active)?.length || 0;
  const clinicSchedules = schedules?.filter(s => s.consultation_type === 'clinic' && s.active)?.length || 0;

  const formFields = [
    { 
      name: 'doctor_id', 
      label: 'Doctor', 
      type: 'select' as const, 
      options: doctors?.map(d => ({ value: d.id, label: `${d.name} - ${d.clinic_name || 'No Clinic'}` })) || [],
      required: true 
    },
    { 
      name: 'consultation_type', 
      label: 'Consultation Type', 
      type: 'select' as const, 
      options: [
        { value: 'online', label: 'Online Consultation' },
        { value: 'clinic', label: 'Clinic Visit' },
        { value: 'home', label: 'Home Visit' }
      ],
      required: true 
    },
    { 
      name: 'day_of_week', 
      label: 'Day of Week', 
      type: 'select' as const, 
      options: DAYS_OF_WEEK,
      required: true 
    },
    { name: 'start_time', label: 'Start Time', type: 'text' as const, placeholder: 'HH:MM (e.g., 09:00)', required: true },
    { name: 'end_time', label: 'End Time', type: 'text' as const, placeholder: 'HH:MM (e.g., 17:00)', required: true },
    { name: 'slot_duration_minutes', label: 'Slot Duration (Minutes)', type: 'number' as const },
    { name: 'active', label: 'Active', type: 'boolean' as const },
  ];

  const getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || 'Unknown';
  };

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
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
      key: 'consultation_type', 
      label: 'Type',
      render: (value: string) => (
        <Badge className={getTypeColor(value)}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'day_of_week', 
      label: 'Day',
      render: (value: number) => getDayName(value)
    },
    { 
      key: 'time_slot', 
      label: 'Time Slot',
      render: (_: any, row: any) => (
        <div className="flex flex-col">
          <span>{formatTime(row.start_time)} - {formatTime(row.end_time)}</span>
          <span className="text-sm text-muted-foreground">{row.slot_duration_minutes || 30} min slots</span>
        </div>
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
          title="Total Schedules"
          value={totalSchedules}
          icon="calendar"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Schedules"
          value={activeSchedules}
          icon="clock"
          iconColor="text-green-600"
        />
        <StatCard
          title="Online Schedules"
          value={onlineSchedules}
          icon="user"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Clinic Schedules"
          value={clinicSchedules}
          icon="user"
          iconColor="text-orange-600"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Doctor Schedules"
        description="Manage doctor availability and time slots"
        data={filteredSchedules}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {/* Form Dialog */}
      {isDialogOpen && (
        <FormDialog
          title={editingItem ? "Edit Schedule" : "Add New Schedule"}
          fields={formFields}
          initialData={editingItem}
          onSubmit={handleSubmit}
          trigger={<Button style={{ display: 'none' }}>Hidden</Button>}
        />
      )}
    </div>
  );
}