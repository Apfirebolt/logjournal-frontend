import React from 'react';
import CategoriesClient from './CategoryClient';

export const metadata = {
  title: 'Journal Categories | Softgenie Journal',
  description: 'Manage your journal entries through custom categories and tags.',
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}