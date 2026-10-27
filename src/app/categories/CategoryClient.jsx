'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useJournalStore } from '@/store/useJournalStore';
import { TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function CategoriesClient() {
  const { categories, fetchCategories, createCategory, loading } = useJournalStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name.');
      return;
    }

    setSubmitting(true);
    const result = await createCategory({ name: newCategoryName.trim() });
    setSubmitting(false);

    if (result.success) {
      toast.success(`Category "${newCategoryName}" created successfully!`);
      setNewCategoryName('');
    } else {
      toast.error(result.error || 'Failed to create category.');
    }
  }

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full space-y-10">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                <TagIcon className="h-3.5 w-3.5" />
                <span>Pillars & Tags</span>
              </div>
              <h1 className="text-3xl font-bold font-theme-heading tracking-tight">Journal Categories</h1>
              <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
                Organize your reflections with default system categories or create custom tags.
              </p>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Mindfulness, Coding..."
                className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none shadow-inner w-full md:w-64"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)'
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shrink-0 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <PlusIcon className="h-4 w-4" />
                <span>{submitting ? 'Adding...' : 'Add'}</span>
              </button>
            </form>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && categories.length === 0 ? (
              <p className="text-sm opacity-60">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm opacity-60">No categories found.</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-6 rounded-2xl border shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)' }}>
                      <TagIcon className="h-5 w-5" />
                    </div>
                    <span 
                      className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border"
                      style={{
                        backgroundColor: cat.is_default ? 'var(--bg-primary)' : 'transparent',
                        borderColor: 'var(--border-color)',
                        color: cat.is_default ? 'var(--text-main)' : 'var(--accent)'
                      }}
                    >
                      {cat.is_default ? 'System Default' : 'Custom Tag'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-theme-heading">{cat.name}</h3>
                    <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--text-muted)' }}>
                      {cat.is_default ? 'Standard journaling reflection pillar.' : 'User-created custom reflection category.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}