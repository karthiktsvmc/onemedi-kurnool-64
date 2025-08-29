import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';

export interface WishlistItem {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  created_at: string;
  family_member_id?: string;
  family_member?: {
    name: string;
    relationship: string;
  };
}

export interface AddToWishlistData {
  item_type: string;
  item_id: string;
  family_member_id?: string;
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          user_id,
          item_type,
          item_id,
          created_at,
          family_member_id,
          family_member:family_members(name, relationship)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wishlist items';
      setError(errorMessage);
      console.error('Error fetching wishlist items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (itemData: AddToWishlistData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to wishlist.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if item already exists in wishlist
      const { data: existingItem } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', itemData.item_type)
        .eq('item_id', itemData.item_id)
        .eq('family_member_id', itemData.family_member_id || null)
        .maybeSingle();

      if (existingItem) {
        toast({
          title: "Already in Wishlist",
          description: "This item is already in your wishlist.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          ...itemData,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist.",
      });

      await fetchWishlistItems();
      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to wishlist';
      setError(errorMessage);
      toast({
        title: "Failed to Add to Wishlist",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error adding to wishlist:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });

      await fetchWishlistItems();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from wishlist';
      setError(errorMessage);
      toast({
        title: "Failed to Remove",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error removing from wishlist:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (wishlistItem: WishlistItem): Promise<boolean> => {
    if (!user) return false;

    try {
      // Add to cart logic would go here
      // For now, just remove from wishlist
      const success = await removeFromWishlist(wishlistItem.id);
      
      if (success) {
        toast({
          title: "Moved to Cart",
          description: "Item has been moved to your cart.",
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move to cart';
      toast({
        title: "Failed to Move to Cart",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error moving to cart:', err);
      return false;
    }
  };

  const isInWishlist = (itemType: string, itemId: string, familyMemberId?: string): boolean => {
    return wishlistItems.some(item => 
      item.item_type === itemType && 
      item.item_id === itemId && 
      item.family_member_id === (familyMemberId || null)
    );
  };

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    }
  }, [user]);

  return {
    wishlistItems,
    loading,
    error,
    fetchWishlistItems,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
  };
};