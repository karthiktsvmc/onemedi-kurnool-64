import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { DataTable } from '@/admin/components/shared/DataTable';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { StatCard } from '@/admin/components/shared/StatCard';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Download, 
  Eye, 
  FileText, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Upload
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

interface Prescription {
  id: string;
  user_id: string;
  order_id?: string;
  patient_name: string;
  file_url: string;
  file_type: string;
  verification_status: string;
  verified_by?: string;
  verified_at?: string;
  admin_notes?: string;
  prescription_date?: string;
  doctor_name?: string;
  hospital_name?: string;
  diagnosis?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export const PrescriptionManagement: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  // Statistics
  const totalPrescriptions = prescriptions.length;
  const pendingPrescriptions = prescriptions.filter(p => p.verification_status === 'pending').length;
  const approvedPrescriptions = prescriptions.filter(p => p.verification_status === 'approved').length;
  const rejectedPrescriptions = prescriptions.filter(p => p.verification_status === 'rejected').length;

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions((data as any) || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prescriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const updatePrescriptionStatus = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const updateData: any = {
        verification_status: status,
        verified_at: new Date().toISOString()
      };
      
      if (notes !== undefined) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('prescriptions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Prescription has been ${status}`,
      });
      
      await fetchPrescriptions();
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to update prescription status",
        variant: "destructive",
      });
    }
  };

  const handleAddNotes = async () => {
    if (!selectedPrescription) return;

    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ admin_notes: adminNotes } as any)
        .eq('id', selectedPrescription.id);

      if (error) throw error;
      
      toast({
        title: "Notes Updated",
        description: "Admin notes have been added successfully",
      });
      
      setNoteDialogOpen(false);
      setAdminNotes('');
      await fetchPrescriptions();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (prescription: Prescription) => {
    window.open(prescription.file_url, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = !searchTerm || 
      prescription.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prescription.verification_status === statusFilter;

    const matchesDate = !dateRange.from || 
      (new Date(prescription.created_at) >= dateRange.from && 
       (!dateRange.to || new Date(prescription.created_at) <= dateRange.to));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const columns = [
    {
      key: 'patient_name',
      label: 'Patient',
      render: (prescription: Prescription) => (
        <div>
          <p className="font-medium">{prescription.patient_name}</p>
          <p className="text-sm text-muted-foreground">
            {prescription.profiles?.full_name || 'N/A'} ({prescription.profiles?.email || 'N/A'})
          </p>
        </div>
      )
    },
    {
      key: 'doctor_info',
      label: 'Doctor & Hospital',
      render: (prescription: Prescription) => (
        <div className="space-y-1">
          <p className="text-sm">{prescription.doctor_name || 'Not specified'}</p>
          <p className="text-xs text-muted-foreground">{prescription.hospital_name || 'Not specified'}</p>
        </div>
      )
    },
    {
      key: 'prescription_date',
      label: 'Prescription Date',
      render: (prescription: Prescription) => 
        prescription.prescription_date ? format(new Date(prescription.prescription_date), 'PP') : 'Not specified'
    },
    {
      key: 'verification_status',
      label: 'Status',
      render: (prescription: Prescription) => getStatusBadge(prescription.verification_status)
    },
    {
      key: 'created_at',
      label: 'Uploaded',
      render: (prescription: Prescription) => format(new Date(prescription.created_at), 'PP')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (prescription: Prescription) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedPrescription(prescription);
              setViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadFile(prescription)}
          >
            <Download className="h-4 w-4" />
          </Button>
          {prescription.verification_status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updatePrescriptionStatus(prescription.id, 'approved')}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updatePrescriptionStatus(prescription.id, 'rejected')}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedPrescription(prescription);
              setAdminNotes(prescription.admin_notes || '');
              setNoteDialogOpen(true);
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescription Management"
        description="Review and manage prescription uploads from users"
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Prescriptions"
          value={totalPrescriptions}
          icon={Upload}
        />
        <StatCard
          title="Pending Review"
          value={pendingPrescriptions}
          icon={Clock}
        />
        <StatCard
          title="Approved"
          value={approvedPrescriptions}
          icon={CheckCircle}
        />
        <StatCard
          title="Rejected"
          value={rejectedPrescriptions}
          icon={XCircle}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search patient, doctor, user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <DataTable
        title="Prescriptions"
        data={filteredPrescriptions}
        columns={columns}
        loading={loading}
      />

      {/* View Prescription Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>View Prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Patient:</strong> {selectedPrescription.patient_name}</p>
                  <p><strong>Doctor:</strong> {selectedPrescription.doctor_name || 'Not specified'}</p>
                  <p><strong>Hospital:</strong> {selectedPrescription.hospital_name || 'Not specified'}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> {getStatusBadge(selectedPrescription.verification_status)}</p>
                  <p><strong>Date:</strong> {selectedPrescription.prescription_date ? format(new Date(selectedPrescription.prescription_date), 'PP') : 'Not specified'}</p>
                  <p><strong>Uploaded:</strong> {format(new Date(selectedPrescription.created_at), 'PP')}</p>
                </div>
              </div>
              
              {selectedPrescription.diagnosis && (
                <p><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</p>
              )}
              
              {selectedPrescription.notes && (
                <p><strong>Patient Notes:</strong> {selectedPrescription.notes}</p>
              )}
              
              {selectedPrescription.admin_notes && (
                <p><strong>Admin Notes:</strong> {selectedPrescription.admin_notes}</p>
              )}

              {selectedPrescription.file_type.includes('image') ? (
                <img 
                  src={selectedPrescription.file_url} 
                  alt="Prescription" 
                  className="w-full max-h-96 object-contain rounded-lg border"
                />
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">PDF Document</p>
                  <p className="text-muted-foreground mb-4">Click below to view or download</p>
                  <Button onClick={() => downloadFile(selectedPrescription)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Notes Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin_notes">Notes</Label>
              <Textarea
                id="admin_notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about this prescription..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNotes}>
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};