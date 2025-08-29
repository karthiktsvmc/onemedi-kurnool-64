import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';

export interface CartItem {
  id: string;
  user_id: string;
  item_type: 'medicine' | 'lab_test' | 'scan' | 'consultation' | 'homecare' | 'insurance' | 'diabetes_product';
  item_id: string;
  vendor_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  prescription_required: boolean;
  // Additional fields for display
  item_name?: string;
  item_image?: string;
  item_description?: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCartItems((data || []) as CartItem[]);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(
        cartItem => cartItem.item_type === item.item_type && cartItem.item_id === item.item_id
      );

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + item.quantity;
        const newTotalPrice = newQuantity * item.unit_price;

        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: newQuantity,
            total_price: newTotalPrice,
          })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            ...item,
          });

        if (error) throw error;
      }

      await fetchCartItems();
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCartItem = async (itemId: string, updates: Partial<CartItem>) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update(updates)
        .eq('id', itemId);

      if (error) throw error;

      await fetchCartItems();
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await fetchCartItems();
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
      return false;
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.total_price, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    refetch: fetchCartItems,
  };
}