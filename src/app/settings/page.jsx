import React from 'react';
import ProfileSettingsClient from './ProfileSettingsClient';

export const metadata = {
  title: 'Profile Settings | Log Journal',
  description: 'Manage your profile details, avatar, and security settings.',
};

export default function ProfileSettingsPage() {
  return <ProfileSettingsClient />;
}