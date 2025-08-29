import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  chronic_conditions?: string[];
  allergies?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateFamilyMemberData {
  name: string;
  relationship: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  chronic_conditions?: string[];
  allergies?: string[];
}

export const useFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFamilyMembers = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch family members';
      setError(errorMessage);
      console.error('Error fetching family members:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFamilyMember = async (memberData: CreateFamilyMemberData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add family members.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          ...memberData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Family Member Added",
        description: `${memberData.name} has been added to your family.`,
      });

      await fetchFamilyMembers();
      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add family member';
      setError(errorMessage);
      toast({
        title: "Failed to Add Family Member",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error creating family member:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateFamilyMember = async (id: string, memberData: Partial<CreateFamilyMemberData>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('family_members')
        .update(memberData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Family Member Updated",
        description: "Family member details have been updated successfully.",
      });

      await fetchFamilyMembers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update family member';
      setError(errorMessage);
      toast({
        title: "Failed to Update Family Member",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error updating family member:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFamilyMember = async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Family Member Removed",
        description: "Family member has been removed from your list.",
      });

      await fetchFamilyMembers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove family member';
      setError(errorMessage);
      toast({
        title: "Failed to Remove Family Member",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error deleting family member:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  return {
    familyMembers,
    loading,
    error,
    fetchFamilyMembers,
    createFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
  };
};