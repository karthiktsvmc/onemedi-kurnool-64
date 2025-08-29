import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'home' | 'work' | 'other';
  is_default: boolean;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressData {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'home' | 'work' | 'other';
  is_default?: boolean;
  latitude?: number;
  longitude?: number;
}

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAddresses = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses((data || []) as Address[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch addresses';
      setError(errorMessage);
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (addressData: CreateAddressData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add an address.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // If this is set as default, unset all other defaults first
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          ...addressData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Address Added",
        description: "Your address has been saved successfully.",
      });

      await fetchAddresses();
      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create address';
      setError(errorMessage);
      toast({
        title: "Failed to Add Address",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error creating address:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: string, addressData: Partial<CreateAddressData>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      // If this is set as default, unset all other defaults first
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', id);
      }

      const { error } = await supabase
        .from('addresses')
        .update(addressData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });

      await fetchAddresses();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update address';
      setError(errorMessage);
      toast({
        title: "Failed to Update Address",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error updating address:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Address Deleted",
        description: "Your address has been removed.",
      });

      await fetchAddresses();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete address';
      setError(errorMessage);
      toast({
        title: "Failed to Delete Address",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error deleting address:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Unset all defaults first
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Default Address Updated",
        description: "Your default address has been changed.",
      });

      await fetchAddresses();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set default address';
      toast({
        title: "Failed to Update Default",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error setting default address:', err);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};