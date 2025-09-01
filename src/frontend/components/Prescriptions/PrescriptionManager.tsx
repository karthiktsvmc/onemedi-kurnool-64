import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Download, Edit, Eye, FileText, Plus, Trash2, Upload } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { usePrescriptions, Prescription } from '@/shared/hooks/usePrescriptions';
import { useFamilyMembers } from '@/shared/hooks/useFamilyMembers';
import { PrescriptionUploadWidget } from './PrescriptionUploadWidget';

export const PrescriptionManager: React.FC = () => {
  const { prescriptions, loading, deletePrescription, updatePrescription } = usePrescriptions();
  const { familyMembers } = useFamilyMembers();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    patient_name: '',
    family_member_id: '',
    prescription_date: null as Date | null,
    doctor_name: '',
    hospital_name: '',
    diagnosis: '',
    notes: ''
  });

  const openEditDialog = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setEditForm({
      patient_name: prescription.patient_name,
      family_member_id: prescription.family_member_id || '',
      prescription_date: prescription.prescription_date ? new Date(prescription.prescription_date) : null,
      doctor_name: prescription.doctor_name || '',
      hospital_name: prescription.hospital_name || '',
      diagnosis: prescription.diagnosis || '',
      notes: prescription.notes || ''
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPrescription) return;

    const updates = {
      ...editForm,
      prescription_date: editForm.prescription_date?.toISOString().split('T')[0],
      family_member_id: editForm.family_member_id || null
    };

    const success = await updatePrescription(selectedPrescription.id, updates);
    if (success) {
      setEditDialogOpen(false);
      setSelectedPrescription(null);
    }
  };

  const handleDelete = async (prescription: Prescription) => {
    if (confirm('Are you sure you want to delete this prescription?')) {
      await deletePrescription(prescription.id);
    }
  };

  const downloadFile = (prescription: Prescription) => {
    window.open(prescription.file_url, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Prescriptions</h2>
          <p className="text-muted-foreground">
            Manage your prescription uploads and track verification status
          </p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionUploadWidget
              onUploadComplete={() => setUploadDialogOpen(false)}
              className="border-none"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Prescriptions Yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first prescription to get started
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Prescription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{prescription.patient_name}</h3>
                      {getStatusBadge(prescription.verification_status || 'pending')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p><strong>Doctor:</strong> {prescription.doctor_name || 'Not specified'}</p>
                        <p><strong>Hospital:</strong> {prescription.hospital_name || 'Not specified'}</p>
                      </div>
                      <div>
                        <p><strong>Date:</strong> {prescription.prescription_date ? format(new Date(prescription.prescription_date), 'PP') : 'Not specified'}</p>
                        <p><strong>Uploaded:</strong> {format(new Date(prescription.created_at), 'PP')}</p>
                      </div>
                    </div>
                    
                    {prescription.diagnosis && (
                      <p className="text-sm"><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                    )}
                    
                    {prescription.notes && (
                      <p className="text-sm"><strong>Notes:</strong> {prescription.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(prescription)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(prescription)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prescription Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                value={editForm.patient_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, patient_name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="family_member">Family Member</Label>
              <Select 
                value={editForm.family_member_id} 
                onValueChange={(value) => setEditForm(prev => ({ ...prev, family_member_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select family member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Self</SelectItem>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.relationship})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Prescription Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editForm.prescription_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editForm.prescription_date ? format(editForm.prescription_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editForm.prescription_date || undefined}
                    onSelect={(date) => setEditForm(prev => ({ ...prev, prescription_date: date || null }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="doctor_name">Doctor Name</Label>
              <Input
                id="doctor_name"
                value={editForm.doctor_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, doctor_name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="hospital_name">Hospital/Clinic Name</Label>
              <Input
                id="hospital_name"
                value={editForm.hospital_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, hospital_name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                value={editForm.diagnosis}
                onChange={(e) => setEditForm(prev => ({ ...prev, diagnosis: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>View Prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              {selectedPrescription.file_type.startsWith('image') ? (
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
    </div>
  );
};