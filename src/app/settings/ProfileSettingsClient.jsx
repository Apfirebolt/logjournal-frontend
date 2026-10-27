'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import ProfilePictureCard from '@/components/ProfilePicCard';
import UserDetailsCard from '@/components/UserDetailsCard';
import PasswordChangeCard from '@/components/PasswordChangeCard';
import { useAuthStore } from '@/store/useAuthStore';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function ProfileSettingsClient() {
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
          
          {/* Header */}
          <div className="border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
              <Cog6ToothIcon className="h-3.5 w-3.5" />
              <span>Account Settings</span>
            </div>
            <h1 className="text-3xl font-bold font-theme-heading tracking-tight">Profile & Security</h1>
            <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage your personal preferences, avatar, and password credentials.
            </p>
          </div>

          {/* Modular Components */}
          <div className="space-y-8">
            <ProfilePictureCard user={user} />
            <UserDetailsCard user={user} />
            <PasswordChangeCard />
          </div>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}