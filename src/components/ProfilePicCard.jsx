'use client';

import React, { useState } from 'react';
import { UserCircleIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-toastify';

export default function ProfilePictureCard({ user }) {
  const { uploadAvatar, loading } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile_image || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first.');
      return;
    }

    const result = await uploadAvatar(selectedFile);
    if (result.success) {
      toast.success('Profile picture updated successfully!');
      setSelectedFile(null);
    } else {
      toast.error(result.error || 'Failed to upload profile picture.');
    }
  };

  return (
    <div 
      className="p-8 rounded-3xl border shadow-sm space-y-6"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-bold font-theme-heading">Profile Picture</h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Update your profile avatar image.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 shadow-inner flex items-center justify-center shrink-0" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--bg-primary)' }}>
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
          ) : (
            <UserCircleIcon className="w-16 h-16 opacity-40" style={{ color: 'var(--accent)' }} />
          )}
        </div>

        <div className="space-y-3 w-full flex-grow">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:cursor-pointer transition-all"
            style={{ color: 'var(--text-main)' }}
          />

          {selectedFile && (
            <button
              type="button"
              disabled={loading}
              onClick={handleUpload}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              <span>{loading ? 'Uploading...' : 'Save Avatar'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}