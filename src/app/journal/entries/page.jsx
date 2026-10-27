'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfirmModal from '@/components/ConfirmModal';
import JournalCalendar from '@/components/JournalCalendar';
import { useJournalStore } from '@/store/useJournalStore';
import { BookOpenIcon, PlusIcon, CalendarIcon, StarIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function JournalEntriesPage() {
  const { entries, fetchEntries, deleteEntry, loading } = useJournalStore();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const openDeleteModal = (e, entry) => {
    e.preventDefault();
    e.stopPropagation();
    setEntryToDelete(entry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    setIsDeleting(true);
    const result = await deleteEntry(entryToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success('Journal entry deleted successfully.');
      setDeleteModalOpen(false);
      setEntryToDelete(null);
    } else {
      toast.error(result.error || 'Failed to delete journal entry.');
    }
  };

  const getExcerpt = (jsonString) => {
    if (!jsonString) return 'No content recorded...';
    try {
      const blocks = JSON.parse(jsonString);
      if (Array.isArray(blocks) && blocks.length > 0) {
        const firstText = blocks.find((b) => b.type === 'paragraph' || b.type === 'header');
        return firstText?.data?.text || 'Rich text entry recorded...';
      }
    } catch (e) {
      return jsonString.substring(0, 100) + '...';
    }
    return 'Journal entry recorded...';
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full space-y-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
              <BookOpenIcon className="h-3.5 w-3.5" />
              <span>Archives & History</span>
            </div>
            <h1 className="text-3xl font-bold font-theme-heading tracking-tight">My Journal Entries</h1>
            <p className="text-sm opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
              Explore your past reflections, daily highlights, and category ratings.
            </p>
          </div>

          <Link
            href="/journal/new"
            className="px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:scale-105 shrink-0"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Write New Entry</span>
          </Link>
        </div>

        {/* Calendar View */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-theme-heading">Writing Calendar</h2>
          <JournalCalendar entries={entries} />
        </section>

        {/* Entries Grid Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-theme-heading">All Entries List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && entries.length === 0 ? (
              <p className="text-sm opacity-60 col-span-full py-12 text-center">Loading your entries...</p>
            ) : entries.length === 0 ? (
              <div className="col-span-full text-center py-16 space-y-4 border rounded-3xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                <BookOpenIcon className="h-12 w-12 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
                <h3 className="text-lg font-bold font-theme-heading">No journal entries yet</h3>
                <p className="text-xs opacity-75 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                  Start your journaling journey today by recording your first daily milestone and reflection.
                </p>
                <Link
                  href="/journal/new"
                  className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 mt-2"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  Create First Entry
                </Link>
              </div>
            ) : (
              entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/entries/${entry.id}`}
                  className="p-6 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between space-y-6 group relative"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs opacity-60">
                      <div className="flex items-center gap-1.5 font-mono">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>{new Date(entry.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <button
                        onClick={(e) => openDeleteModal(e, entry)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold font-theme-heading group-hover:opacity-90 transition-opacity line-clamp-1 pr-6" style={{ color: 'var(--text-main)' }}>
                      {entry.title}
                    </h3>

                    <p className="text-xs opacity-75 line-clamp-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {getExcerpt(entry.highlights)}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold">
                        {entry.category_sections?.length > 0 
                          ? (entry.category_sections.reduce((acc, curr) => acc + (curr.rating_score || 0), 0) / entry.category_sections.length).toFixed(1)
                          : 'No ratings'}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform" style={{ color: 'var(--accent)' }}>
                      <span>Read</span>
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Journal Entry"
        message={`Are you sure you want to delete "${entryToDelete?.title || 'this entry'}"? This action cannot be undone.`}
        confirmText="Delete Entry"
        cancelText="Cancel"
        loading={isDeleting}
      />

      <Footer />
    </div>
  );
}