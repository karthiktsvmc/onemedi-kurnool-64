import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

export interface Prescription {
  id: string;
  user_id: string;
  family_member_id?: string;
  file_url: string;
  file_type: string;
  prescription_date?: string;
  doctor_name?: string;
  hospital_name?: string;
  diagnosis?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  family_member?: {
    name: string;
    relationship: string;
  };
}

export interface UploadPrescriptionData {
  file: File;
  family_member_id?: string;
  prescription_date?: string;
  doctor_name?: string;
  hospital_name?: string;
  diagnosis?: string;
  notes?: string;
}

export const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPrescriptions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          family_member:family_members(name, relationship)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prescriptions';
      setError(errorMessage);
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadPrescription = async (prescriptionData: UploadPrescriptionData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload prescriptions.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload file to Supabase Storage
      const fileExt = prescriptionData.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, prescriptionData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      // Save prescription record
      const { data, error } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user.id,
          family_member_id: prescriptionData.family_member_id,
          file_url: urlData.publicUrl,
          file_type: fileExt || 'pdf',
          prescription_date: prescriptionData.prescription_date,
          doctor_name: prescriptionData.doctor_name,
          hospital_name: prescriptionData.hospital_name,
          diagnosis: prescriptionData.diagnosis,
          notes: prescriptionData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Prescription Uploaded",
        description: "Your prescription has been uploaded successfully.",
      });

      await fetchPrescriptions();
      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload prescription';
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error uploading prescription:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePrescription = async (id: string, updates: Partial<Prescription>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('prescriptions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Prescription Updated",
        description: "Prescription details have been updated successfully.",
      });

      await fetchPrescriptions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update prescription';
      setError(errorMessage);
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error updating prescription:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePrescription = async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      // Get prescription to delete file
      const { data: prescription } = await supabase
        .from('prescriptions')
        .select('file_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (prescription?.file_url) {
        // Extract file path from URL
        const filePath = prescription.file_url.split('/').slice(-2).join('/');
        await supabase.storage
          .from('prescriptions')
          .remove([filePath]);
      }

      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Prescription Deleted",
        description: "Prescription has been removed successfully.",
      });

      await fetchPrescriptions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete prescription';
      setError(errorMessage);
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error deleting prescription:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  return {
    prescriptions,
    loading,
    error,
    fetchPrescriptions,
    uploadPrescription,
    updatePrescription,
    deletePrescription,
  };
};