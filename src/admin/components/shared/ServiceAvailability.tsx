import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Filter
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServiceSchedule {
  id: string;
  service_type: 'lab_test' | 'scan' | 'doctor' | 'homecare' | 'ambulance';
  service_id: string;
  service_name: string;
  provider_name: string;
  provider_contact: string;
  location_id: string;
  location_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_capacity: number;
  booked_slots: number;
  available_slots: number;
  status: 'active' | 'cancelled' | 'completed';
  recurring_pattern?: string;
  special_instructions?: string;
  price: number;
  created_at: string;
  updated_at: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  booked: number;
  capacity: number;
}

interface ServiceAvailabilityProps {
  onScheduleUpdate?: () => void;
}

export const ServiceAvailability: React.FC<ServiceAvailabilityProps> = ({ 
  onScheduleUpdate 
}) => {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockSchedules: ServiceSchedule[] = [
    {
      id: '1',
      service_type: 'lab_test',
      service_id: 'lab_001',
      service_name: 'Complete Blood Count',
      provider_name: 'City Diagnostics',
      provider_contact: '+91 9876543210',
      location_id: 'loc_001',
      location_name: 'Main Branch, Kurnool',
      date: new Date().toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '17:00',
      duration_minutes: 30,
      max_capacity: 20,
      booked_slots: 12,
      available_slots: 8,
      status: 'active',
      price: 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      service_type: 'doctor',
      service_id: 'doc_001',
      service_name: 'General Consultation',
      provider_name: 'Dr. Rajesh Kumar',
      provider_contact: '+91 9876543211',
      location_id: 'loc_002',
      location_name: 'Medical Center, Kurnool',
      date: new Date().toISOString().split('T')[0],
      start_time: '10:00',
      end_time: '16:00',
      duration_minutes: 15,
      max_capacity: 24,
      booked_slots: 18,
      available_slots: 6,
      status: 'active',
      price: 300,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      service_type: 'homecare',
      service_id: 'home_001',
      service_name: 'Nursing Care',
      provider_name: 'Home Health Services',
      provider_contact: '+91 9876543212',
      location_id: 'loc_003',
      location_name: 'Kurnool Area',
      date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      end_time: '20:00',
      duration_minutes: 60,
      max_capacity: 10,
      booked_slots: 7,
      available_slots: 3,
      status: 'active',
      price: 800,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  useEffect(() => {
    setSchedules(mockSchedules);
  }, []);

  const generateTimeSlots = (schedule: ServiceSchedule): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const start = new Date(`${schedule.date}T${schedule.start_time}`);
    const end = new Date(`${schedule.date}T${schedule.end_time}`);
    
    while (start < end) {
      const timeString = start.toTimeString().substr(0, 5);
      const booked = Math.floor(Math.random() * 3); // Mock booking data
      slots.push({
        time: timeString,
        available: booked < schedule.max_capacity / ((end.getTime() - new Date(`${schedule.date}T${schedule.start_time}`).getTime()) / (schedule.duration_minutes * 60000)),
        booked: booked,
        capacity: Math.floor(schedule.max_capacity / ((end.getTime() - new Date(`${schedule.date}T${schedule.start_time}`).getTime()) / (schedule.duration_minutes * 60000)))
      });
      start.setMinutes(start.getMinutes() + schedule.duration_minutes);
    }
    
    return slots;
  };

  const handleAddSchedule = async (scheduleData: any) => {
    setLoading(true);
    try {
      const newSchedule: ServiceSchedule = {
        id: Math.random().toString(36).substr(2, 9),
        ...scheduleData,
        booked_slots: 0,
        available_slots: scheduleData.max_capacity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setSchedules(prev => [...prev, newSchedule]);
      
      toast({
        title: "Schedule Added",
        description: "Service schedule has been created successfully",
      });
      
      setShowAddDialog(false);
      onScheduleUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async (scheduleId: string, updates: Partial<ServiceSchedule>) => {
    setLoading(true);
    try {
      setSchedules(prev => 
        prev.map(schedule => 
          schedule.id === scheduleId 
            ? { ...schedule, ...updates, updated_at: new Date().toISOString() }
            : schedule
        )
      );
      
      toast({
        title: "Schedule Updated",
        description: "Service schedule has been updated successfully",
      });
      
      setEditingSchedule(null);
      onScheduleUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSchedule = async (scheduleId: string) => {
    await handleUpdateSchedule(scheduleId, { status: 'cancelled' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'lab_test': return 'bg-purple-100 text-purple-800';
      case 'scan': return 'bg-blue-100 text-blue-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'homecare': return 'bg-orange-100 text-orange-800';
      case 'ambulance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesDate = schedule.date === selectedDate;
    const matchesService = selectedService === 'all' || schedule.service_type === selectedService;
    const matchesLocation = selectedLocation === 'all' || schedule.location_id === selectedLocation;
    return matchesDate && matchesService && matchesLocation;
  });

  const totalSlots = filteredSchedules.reduce((sum, schedule) => sum + schedule.max_capacity, 0);
  const bookedSlots = filteredSchedules.reduce((sum, schedule) => sum + schedule.booked_slots, 0);
  const availableSlots = totalSlots - bookedSlots;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Schedules</p>
                <p className="text-xl font-bold">{filteredSchedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Slots</p>
                <p className="text-xl font-bold text-green-600">{availableSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Booked Slots</p>
                <p className="text-xl font-bold text-orange-600">{bookedSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilization</p>
                <p className="text-xl font-bold text-purple-600">
                  {totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Service Scheduling</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="lab_test">Lab Tests</SelectItem>
                  <SelectItem value="scan">Scans</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="homecare">Home Care</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="loc_001">Main Branch</SelectItem>
                  <SelectItem value="loc_002">Medical Center</SelectItem>
                  <SelectItem value="loc_003">Kurnool Area</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Service Schedule</DialogTitle>
                    <DialogDescription>
                      Create a new scheduling slot for a service
                    </DialogDescription>
                  </DialogHeader>
                  <ScheduleForm
                    onSubmit={handleAddSchedule}
                    loading={loading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No schedules found for selected date and filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.service_name}</div>
                          <Badge className={getServiceTypeColor(schedule.service_type)}>
                            {schedule.service_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.provider_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {schedule.provider_contact}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {schedule.location_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{schedule.start_time} - {schedule.end_time}</div>
                          <div className="text-muted-foreground">
                            {schedule.duration_minutes} min slots
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-green-600">{schedule.available_slots} available</span>
                            <span className="text-muted-foreground">/</span>
                            <span>{schedule.max_capacity} total</span>
                          </div>
                          <div className="text-muted-foreground">
                            {schedule.booked_slots} booked
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{schedule.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Schedule</DialogTitle>
                                <DialogDescription>
                                  Modify schedule details for {schedule.service_name}
                                </DialogDescription>
                              </DialogHeader>
                              <ScheduleForm
                                initialData={schedule}
                                onSubmit={(data) => handleUpdateSchedule(schedule.id, data)}
                                loading={loading}
                              />
                            </DialogContent>
                          </Dialog>
                          
                          {schedule.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelSchedule(schedule.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Schedule Form Component
interface ScheduleFormProps {
  initialData?: Partial<ServiceSchedule>;
  onSubmit: (data: any) => void;
  loading: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ 
  initialData, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    service_type: initialData?.service_type || 'lab_test',
    service_id: initialData?.service_id || '',
    service_name: initialData?.service_name || '',
    provider_name: initialData?.provider_name || '',
    provider_contact: initialData?.provider_contact || '',
    location_id: initialData?.location_id || '',
    location_name: initialData?.location_name || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    start_time: initialData?.start_time || '09:00',
    end_time: initialData?.end_time || '17:00',
    duration_minutes: initialData?.duration_minutes || 30,
    max_capacity: initialData?.max_capacity || 10,
    price: initialData?.price || 0,
    status: initialData?.status || 'active',
    special_instructions: initialData?.special_instructions || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="service_type">Service Type</Label>
          <Select value={formData.service_type} onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lab_test">Lab Test</SelectItem>
              <SelectItem value="scan">Scan</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="homecare">Home Care</SelectItem>
              <SelectItem value="ambulance">Ambulance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="service_name">Service Name</Label>
          <Input
            id="service_name"
            value={formData.service_name}
            onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="provider_name">Provider Name</Label>
          <Input
            id="provider_name"
            value={formData.provider_name}
            onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="provider_contact">Provider Contact</Label>
          <Input
            id="provider_contact"
            value={formData.provider_contact}
            onChange={(e) => setFormData(prev => ({ ...prev, provider_contact: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="location_name">Location</Label>
          <Input
            id="location_name"
            value={formData.location_name}
            onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="duration_minutes">Slot Duration (minutes)</Label>
          <Input
            id="duration_minutes"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
            min="15"
            step="15"
            required
          />
        </div>

        <div>
          <Label htmlFor="max_capacity">Max Capacity</Label>
          <Input
            id="max_capacity"
            type="number"
            value={formData.max_capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, max_capacity: parseInt(e.target.value) }))}
            min="1"
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="special_instructions">Special Instructions</Label>
        <Textarea
          id="special_instructions"
          value={formData.special_instructions}
          onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
          placeholder="Any special instructions for this schedule..."
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (initialData ? 'Update Schedule' : 'Create Schedule')}
        </Button>
      </DialogFooter>
    </form>
  );
};