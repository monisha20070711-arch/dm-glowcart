import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.data);
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!user) {
      showToast('Please log in to save items to your wishlist', 'info');
      return false;
    }
    try {
      const res = await API.post('/wishlist', { productId });
      if (res.data.success) {
        setWishlist(res.data.data);
        showToast('Saved to wishlist!', 'success');
        return true;
      }
    } catch (error) {
      showToast('Failed to add to wishlist', 'error');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const res = await API.delete(`/wishlist/${productId}`);
      if (res.data.success) {
        setWishlist(res.data.data);
        showToast('Removed from wishlist', 'info');
      }
    } catch (error) {
      showToast('Failed to remove from wishlist', 'error');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
