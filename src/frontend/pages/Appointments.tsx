import React, { useState, useEffect } from 'react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  VideoIcon as Video, 
  Plus,
  Edit,
  Trash,
  CheckCircle,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

interface Appointment {
  id: string;
  doctor_name: string;
  doctor_specialty: string;
  doctor_image?: string;
  appointment_date: string;
  appointment_time: string;
  type: 'in_person' | 'telemedicine';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  hospital_name?: string;
  hospital_address?: string;
  reason: string;
  notes?: string;
  consultation_fee: number;
  created_at: string;
}

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock appointments data
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      doctor_name: 'Dr. Sarah Johnson',
      doctor_specialty: 'Cardiologist',
      appointment_date: '2024-02-15',
      appointment_time: '10:30',
      type: 'in_person',
      status: 'confirmed',
      hospital_name: 'Heart Care Clinic',
      hospital_address: '123 Medical Center Dr, Kurnool',
      reason: 'Regular checkup',
      consultation_fee: 800,
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      doctor_name: 'Dr. Michael Chen',
      doctor_specialty: 'General Physician',
      appointment_date: '2024-02-18',
      appointment_time: '14:00',
      type: 'telemedicine',
      status: 'scheduled',
      reason: 'Follow-up consultation',
      consultation_fee: 500,
      created_at: '2024-01-22T15:30:00Z'
    },
    {
      id: '3',
      doctor_name: 'Dr. Emily Davis',
      doctor_specialty: 'Dermatologist',
      appointment_date: '2024-01-10',
      appointment_time: '11:15',
      type: 'in_person',
      status: 'completed',
      hospital_name: 'Skin Care Center',
      hospital_address: '456 Health Plaza, Kurnool',
      reason: 'Skin condition',
      notes: 'Prescribed topical treatment',
      consultation_fee: 700,
      created_at: '2024-01-05T09:00:00Z'
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      scheduled: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />,
      rescheduled: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const upcomingAppointments = appointments.filter(app => 
    new Date(app.appointment_date + 'T' + app.appointment_time) > new Date() &&
    app.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(app => 
    new Date(app.appointment_date + 'T' + app.appointment_time) <= new Date() ||
    app.status === 'completed'
  );

  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

  const handleBookAppointment = async (formData: FormData) => {
    // Implementation for booking appointment would go here
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been scheduled successfully.",
    });
    setIsBookingOpen(false);
  };

  const rescheduleAppointment = (appointmentId: string) => {
    toast({
      title: "Reschedule Request",
      description: "Your reschedule request has been sent to the clinic.",
    });
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: 'cancelled' as const } : app
      )
    );
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-6 px-4 border-b border-border">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
              
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleBookAppointment(formData);
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select name="doctor" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-sarah">Dr. Sarah Johnson - Cardiologist</SelectItem>
                          <SelectItem value="dr-michael">Dr. Michael Chen - General Physician</SelectItem>
                          <SelectItem value="dr-emily">Dr. Emily Davis - Dermatologist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Consultation Type</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_person">In-Person Visit</SelectItem>
                          <SelectItem value="telemedicine">Telemedicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select name="time" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea id="reason" name="reason" placeholder="Describe your concern..." required />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsBookingOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-muted-foreground">Manage your medical appointments</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledAppointments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground mb-6">Book your next appointment with our healthcare providers.</p>
                  <Button onClick={() => setIsBookingOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{appointment.doctor_name}</h3>
                              <p className="text-sm text-muted-foreground">{appointment.doctor_specialty}</p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1 capitalize">{appointment.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{appointment.appointment_time}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {appointment.type === 'telemedicine' ? (
                                <>
                                  <Video className="h-4 w-4" />
                                  <span>Video Consultation</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4" />
                                  <span>{appointment.hospital_name}</span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Reason:</span>
                              <span>{appointment.reason}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Fee:</span>
                              <span>₹{appointment.consultation_fee}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {appointment.type === 'telemedicine' && appointment.status === 'confirmed' && (
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-2" />
                              Join Call
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => rescheduleAppointment(appointment.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{appointment.doctor_name}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.doctor_specialty}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{appointment.appointment_time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Reason:</span>
                            <span>{appointment.reason}</span>
                          </div>
                          
                          {appointment.notes && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Notes:</span>
                              <span>{appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="cancelled" className="space-y-4">
              {cancelledAppointments.map((appointment) => (
                <Card key={appointment.id} className="opacity-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-red-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{appointment.doctor_name}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.doctor_specialty}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{appointment.appointment_time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Reason:</span>
                            <span>{appointment.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};