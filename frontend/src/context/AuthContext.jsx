import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data);
        showToast(`Welcome back, ${res.data.data.name}!`, 'success');
        return { success: true, user: res.data.data };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await API.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data);
        showToast('Account created successfully! Welcome to DM-GLOWCART.', 'success');
        return { success: true, user: res.data.data };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (name, phone) => {
    try {
      const res = await API.put('/auth/profile', { name, phone });
      if (res.data.success) {
        setUser((prev) => ({ ...prev, ...res.data.data }));
        showToast('Profile updated successfully', 'success');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const isAdmin = user && user.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
