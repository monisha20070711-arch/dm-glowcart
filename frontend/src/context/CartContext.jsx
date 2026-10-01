import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('Please log in to add items to your cart', 'info');
      return false;
    }
    try {
      const res = await API.post('/cart', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.data);
        showToast('Item added to cart!', 'success');
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not add item to cart';
      showToast(msg, 'error');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      const res = await API.put('/cart/update', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not update quantity';
      showToast(msg, 'error');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const res = await API.delete(`/cart/item/${productId}`);
      if (res.data.success) {
        setCart(res.data.data);
        showToast('Item removed from cart', 'info');
      }
    } catch (error) {
      showToast('Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await API.delete('/cart/clear');
      setCart({ items: [] });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const cartCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const cartSubtotal = cart.items
    ? cart.items.reduce((sum, item) => {
        const p = item.product;
        return sum + (p ? p.price * item.quantity : 0);
      }, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
