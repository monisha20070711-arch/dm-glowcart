import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { User as UserIcon, Lock, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    await updateProfile(name, phone);
    setUpdatingProfile(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setUpdatingPassword(true);
      const res = await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (res.data.success) {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update password';
      showToast(msg, 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your personal account details and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* User Badge Card */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-rose-100 p-6 shadow-sm text-center space-y-4 h-fit">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-glow-600 to-rose-400 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            <span className="inline-block mt-2 bg-rose-50 text-glow-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {user.role} Account
            </span>
          </div>
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Verified & Active
          </div>
        </div>

        {/* Profile Update & Password Forms */}
        <div className="md:col-span-8 space-y-6">
          {/* Edit Profile */}
          <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Personal Information
            </h3>

            <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-400 rounded-xl p-3 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="bg-glow-600 hover:bg-glow-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-glow"
              >
                {updatingProfile ? 'Saving...' : 'Update Details'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Change Password
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password (Min 6 characters)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-glow-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                {updatingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
