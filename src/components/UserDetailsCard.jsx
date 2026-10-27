'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-toastify';

export default function UserDetailsCard({ user }) {
  const { updateProfile, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success('Profile details updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update profile.');
    }
  };

  return (
    <div 
      className="p-8 rounded-3xl border shadow-sm space-y-6"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-bold font-theme-heading">Personal Information</h2>
        </div>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your account display name and names.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80 font-theme-heading">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none shadow-inner"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80 font-theme-heading">Email (Read-only)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border text-sm opacity-60 cursor-not-allowed shadow-inner"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80 font-theme-heading">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none shadow-inner"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80 font-theme-heading">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none shadow-inner"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            <CheckIcon className="h-4 w-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}