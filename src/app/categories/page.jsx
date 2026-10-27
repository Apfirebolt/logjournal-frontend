import React from 'react';
import CategoriesClient from './CategoryClient';

export const metadata = {
  title: 'Journal Categories | Log Journal',
  description: 'Manage your standard reflection pillars and custom tags.',
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}