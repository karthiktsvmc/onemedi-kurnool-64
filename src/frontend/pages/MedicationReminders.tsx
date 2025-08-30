import React, { useState, useEffect } from 'react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Pill, 
  Clock, 
  Bell, 
  Plus, 
  Edit, 
  Trash, 
  Check, 
  X,
  Calendar,
  AlarmClock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';
import { useNotifications } from '@/shared/hooks/useNotifications';

interface MedicationReminder {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  times: string[];
  start_date: string;
  end_date?: string;
  notes?: string;
  active: boolean;
  taken_today: boolean[];
  created_at: string;
}

export const MedicationReminders = () => {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { notificationState, requestPermission, sendNotification } = useNotifications();

  // Mock reminders data
  const mockReminders: MedicationReminder[] = [
    {
      id: '1',
      medication_name: 'Metformin',
      dosage: '500mg',
      frequency: 'twice_daily',
      times: ['08:00', '20:00'],
      start_date: '2024-01-01',
      end_date: '2024-06-01',
      notes: 'Take with food to reduce stomach upset',
      active: true,
      taken_today: [true, false],
      created_at: '2024-01-01T08:00:00Z'
    },
    {
      id: '2',
      medication_name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'once_daily',
      times: ['09:00'],
      start_date: '2024-01-15',
      notes: 'Take with breakfast',
      active: true,
      taken_today: [false],
      created_at: '2024-01-15T09:00:00Z'
    },
    {
      id: '3',
      medication_name: 'Blood Pressure Medication',
      dosage: '10mg',
      frequency: 'once_daily',
      times: ['07:00'],
      start_date: '2024-01-10',
      notes: 'Take at the same time every day',
      active: true,
      taken_today: [true],
      created_at: '2024-01-10T07:00:00Z'
    }
  ];

  useEffect(() => {
    setReminders(mockReminders);
    
    // Request notification permission if not already granted
    if (notificationState.supported && notificationState.permission === 'default') {
      requestPermission();
    }
  }, []);

  // Set up medication reminder notifications
  useEffect(() => {
    const scheduleNotifications = () => {
      reminders.forEach(reminder => {
        if (!reminder.active) return;
        
        reminder.times.forEach((time, index) => {
          const [hours, minutes] = time.split(':').map(Number);
          const now = new Date();
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);
          
          // If the time has passed today, schedule for tomorrow
          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
          
          const timeUntilReminder = scheduledTime.getTime() - now.getTime();
          
          setTimeout(() => {
            if (notificationState.permission === 'granted') {
              sendNotification({
                title: "Medication Reminder",
                body: `Time to take ${reminder.medication_name} (${reminder.dosage})`,
                icon: '/favicon.ico',
                tag: `medication-${reminder.id}-${index}`,
                data: {
                  type: 'medication',
                  reminderId: reminder.id,
                  medicationName: reminder.medication_name,
                  dosage: reminder.dosage,
                }
              });
            }
          }, timeUntilReminder);
        });
      });
    };

    scheduleNotifications();
  }, [reminders, notificationState.permission, sendNotification]);

  const handleAddReminder = async (formData: FormData) => {
    const newReminder: MedicationReminder = {
      id: Date.now().toString(),
      medication_name: formData.get('medication_name') as string,
      dosage: formData.get('dosage') as string,
      frequency: formData.get('frequency') as string,
      times: getTimesForFrequency(formData.get('frequency') as string),
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      active: true,
      taken_today: new Array(getTimesForFrequency(formData.get('frequency') as string).length).fill(false),
      created_at: new Date().toISOString()
    };

    setReminders(prev => [newReminder, ...prev]);
    setIsAddingReminder(false);
    
    toast({
      title: "Reminder Added",
      description: `Medication reminder for ${newReminder.medication_name} has been set.`,
    });
  };

  const getTimesForFrequency = (frequency: string): string[] => {
    const timeMap = {
      'once_daily': ['09:00'],
      'twice_daily': ['08:00', '20:00'],
      'three_times_daily': ['08:00', '14:00', '20:00'],
      'four_times_daily': ['08:00', '12:00', '16:00', '20:00'],
      'as_needed': ['09:00'],
    };
    return timeMap[frequency as keyof typeof timeMap] || ['09:00'];
  };

  const markAsTaken = (reminderId: string, timeIndex: number) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? {
              ...reminder,
              taken_today: reminder.taken_today.map((taken, index) => 
                index === timeIndex ? true : taken
              )
            }
          : reminder
      )
    );
    
    toast({
      title: "Medication Taken",
      description: "Marked as taken for today.",
    });
  };

  const markAsSkipped = (reminderId: string, timeIndex: number) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? {
              ...reminder,
              taken_today: reminder.taken_today.map((taken, index) => 
                index === timeIndex ? false : taken
              )
            }
          : reminder
      )
    );
    
    toast({
      title: "Medication Skipped",
      description: "Marked as skipped for today.",
      variant: "destructive",
    });
  };

  const toggleReminder = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, active: !reminder.active }
          : reminder
      )
    );
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    toast({
      title: "Reminder Deleted",
      description: "Medication reminder has been removed.",
    });
  };

  const activeReminders = reminders.filter(r => r.active);
  const inactiveReminders = reminders.filter(r => !r.active);

  const getTodaysSchedule = () => {
    const schedule: { reminder: MedicationReminder; time: string; timeIndex: number; taken: boolean }[] = [];
    
    activeReminders.forEach(reminder => {
      reminder.times.forEach((time, index) => {
        schedule.push({
          reminder,
          time,
          timeIndex: index,
          taken: reminder.taken_today[index]
        });
      });
    });
    
    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const todaysSchedule = getTodaysSchedule();
  const upcomingDoses = todaysSchedule.filter(item => !item.taken);
  const completedDoses = todaysSchedule.filter(item => item.taken);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-6 px-4 border-b border-border">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">Medication Reminders</h1>
              
              <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Medication Reminder</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddReminder(formData);
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="medication_name">Medication Name</Label>
                      <Input id="medication_name" name="medication_name" placeholder="e.g., Metformin" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input id="dosage" name="dosage" placeholder="e.g., 500mg" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select name="frequency" required>
                        <SelectTrigger>
                          <SelectValue placeholder="How often?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once_daily">Once Daily</SelectItem>
                          <SelectItem value="twice_daily">Twice Daily</SelectItem>
                          <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                          <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                          <SelectItem value="as_needed">As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input id="start_date" name="start_date" type="date" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="end_date">End Date (Optional)</Label>
                      <Input id="end_date" name="end_date" type="date" />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" name="notes" placeholder="Special instructions..." />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        <Bell className="h-4 w-4 mr-2" />
                        Add Reminder
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddingReminder(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-muted-foreground">Never miss your medications again</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">
                Today's Schedule ({upcomingDoses.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active Reminders ({activeReminders.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({inactiveReminders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{completedDoses.length}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{upcomingDoses.length}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{todaysSchedule.length}</div>
                      <div className="text-sm text-muted-foreground">Total Doses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {todaysSchedule.length > 0 ? Math.round((completedDoses.length / todaysSchedule.length) * 100) : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Adherence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Medication Schedule */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Today's Medication Schedule</h2>
                
                {todaysSchedule.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-16">
                      <Pill className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Medications Today</h3>
                      <p className="text-muted-foreground mb-6">You don't have any medications scheduled for today.</p>
                      <Button onClick={() => setIsAddingReminder(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  todaysSchedule.map((item, index) => (
                    <Card key={`${item.reminder.id}-${item.timeIndex}`} className={`${item.taken ? 'opacity-75 bg-green-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              item.taken ? 'bg-green-100' : 'bg-primary/10'
                            }`}>
                              {item.taken ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              ) : (
                                <Pill className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold">{item.reminder.medication_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.reminder.dosage} • {item.time}
                              </p>
                              {item.reminder.notes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.reminder.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.taken ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Taken
                              </Badge>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => markAsTaken(item.reminder.id, item.timeIndex)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Take
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => markAsSkipped(item.reminder.id, item.timeIndex)}
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Skip
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              {activeReminders.map((reminder) => (
                <Card key={reminder.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Pill className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{reminder.medication_name}</h3>
                            <p className="text-sm text-muted-foreground">{reminder.dosage}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{reminder.frequency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            <span>•</span>
                            <span>{reminder.times.join(', ')}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Started {new Date(reminder.start_date).toLocaleDateString()}</span>
                            {reminder.end_date && (
                              <>
                                <span>•</span>
                                <span>Ends {new Date(reminder.end_date).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          
                          {reminder.notes && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Notes:</span>
                              <span>{reminder.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={reminder.active}
                            onCheckedChange={() => toggleReminder(reminder.id)}
                          />
                          <span className="text-sm">Active</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="inactive" className="space-y-4">
              {inactiveReminders.map((reminder) => (
                <Card key={reminder.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Pill className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{reminder.medication_name}</h3>
                            <p className="text-sm text-muted-foreground">{reminder.dosage}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{reminder.frequency.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{reminder.times.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={reminder.active}
                            onCheckedChange={() => toggleReminder(reminder.id)}
                          />
                          <span className="text-sm">Activate</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
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