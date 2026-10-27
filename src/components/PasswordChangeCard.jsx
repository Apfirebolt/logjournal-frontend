'use client';

import React, { useState } from 'react';
import { LockClosedIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-toastify';

export default function PasswordChangeCard() {
  const { changePassword, loading } = useAuthStore();
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    const result = await changePassword(passwords);
    if (result.success) {
      toast.success('Password changed successfully!');
      setPasswords({ current_password: '', new_password: '' });
    } else {
      toast.error(result.error || 'Failed to change password.');
    }
  };

  return (
    <div 
      className="p-8 rounded-3xl border shadow-sm space-y-6"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <LockClosedIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-bold font-theme-heading">Security & Password</h2>
        </div>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Update your account password securely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80 font-theme-heading">Current Password</label>
            <input
              type="password"
              name="current_password"
              value={passwords.current_password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none shadow-inner"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider opacity-80 font-theme-heading">New Password</label>
            <input
              type="password"
              name="new_password"
              value={passwords.new_password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none shadow-inner"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              required
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
            <KeyIcon className="h-4 w-4" />
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}