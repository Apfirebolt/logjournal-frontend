'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import ConfirmModal from '@/components/ConfirmModal';
import JournalCalendar from '@/components/JournalCalendar';
import { useJournalStore } from '@/store/useJournalStore';
import { 
  BookOpenIcon, 
  PlusIcon, 
  CalendarIcon, 
  StarIcon, 
  ArrowRightIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CheckCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function JournalEntriesPage() {
  const { entries, fetchEntries, deleteEntry, loading } = useJournalStore();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
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
      return jsonString.substring(0, 120) + '...';
    }
    return 'Journal entry recorded...';
  };

  // Filter and Sort Entries
  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((entry) => 
        entry.title?.toLowerCase().includes(query) || 
        entry.highlights?.toLowerCase().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.journal_date || a.created_at);
      const dateB = new Date(b.journal_date || b.created_at);

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      
      if (sortBy === 'highest') {
        const avgA = a.category_sections?.length > 0 
          ? a.category_sections.reduce((acc, curr) => acc + (curr.rating_score || 0), 0) / a.category_sections.length 
          : 0;
        const avgB = b.category_sections?.length > 0 
          ? b.category_sections.reduce((acc, curr) => acc + (curr.rating_score || 0), 0) / b.category_sections.length 
          : 0;
        return avgB - avgA;
      }
      return 0;
    });

    return result;
  }, [entries, searchQuery, sortBy]);

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full space-y-12">
          
          {/* Page Header */}
          <div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8" 
            style={{ borderColor: 'var(--border-color)' }}
            data-aos="fade-down"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                <BookOpenIcon className="h-4 w-4" />
                <span>Journal History</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-theme-heading tracking-tight">My Journal Entries</h1>
              <p className="text-sm sm:text-base opacity-80 mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Explore your past experiences, daily highlights, and category ratings.
              </p>
            </div>

            <Link
              href="/journal/new"
              className="px-6 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Write New Entry</span>
            </Link>
          </div>

          {/* Calendar View Section */}
          <section className="space-y-4" data-aos="fade-up">
            <h2 className="text-xl sm:text-2xl font-bold font-theme-heading">Writing Calendar</h2>
            <JournalCalendar entries={entries} />
          </section>

          {/* Search and Sort Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4" data-aos="fade-up">
            <div className="relative w-full sm:w-96">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" style={{ color: 'var(--text-main)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries by title or content..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm focus:outline-none shadow-inner font-theme-body"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <FunnelIcon className="h-4 w-4 opacity-60" />
              <span className="text-sm font-semibold opacity-80">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none cursor-pointer"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                <option value="newest">Newest Date</option>
                <option value="oldest">Oldest Date</option>
                <option value="highest">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Entries Grid Section */}
          <section className="space-y-6" data-aos="fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold font-theme-heading">
                Entries ({filteredAndSortedEntries.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading && entries.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-base font-semibold animate-pulse opacity-60">Loading your entries...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="col-span-full text-center py-20 px-6 space-y-4 border rounded-3xl shadow-sm" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border shadow-inner" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                    <BookOpenIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold font-theme-heading">No journal entries yet</h3>
                  <p className="text-sm opacity-75 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Start your journaling journey today by recording your first daily milestone and reflection.
                  </p>
                  <Link
                    href="/journal/new"
                    className="inline-block px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all hover:scale-105 mt-2"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                  >
                    Create First Entry
                  </Link>
                </div>
              ) : filteredAndSortedEntries.length === 0 ? (
                <div className="col-span-full text-center py-16 px-6 space-y-3 border rounded-3xl shadow-sm" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                  <MagnifyingGlassIcon className="h-10 w-10 mx-auto opacity-30" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-lg font-bold font-theme-heading">No matching entries found</h3>
                  <p className="text-sm opacity-75">Try adjusting your search query or clear the filter.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all mt-2 cursor-pointer"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredAndSortedEntries.map((entry) => {
                  const displayDate = entry.journal_date || entry.created_at;
                  
                  // Compute average rating
                  const avgRating = entry.category_sections?.length > 0 
                    ? (entry.category_sections.reduce((acc, curr) => acc + (curr.rating_score || 0), 0) / entry.category_sections.length).toFixed(1)
                    : null;

                  // Habit completion stats
                  const habits = entry.habits || [];
                  const completedHabits = habits.filter((h) => h.is_completed).length;

                  return (
                    <Link
                      key={entry.id}
                      href={`/journal/entries/${entry.id}`}
                      className="p-6 sm:p-7 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-6 group relative"
                      style={{
                        backgroundColor: 'var(--card-bg)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs opacity-75">
                          <div className="flex items-center gap-2 font-mono">
                            <CalendarIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                            <span>{new Date(displayDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>

                          <button
                            onClick={(e) => openDeleteModal(e, entry)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete Entry"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <h3 className="text-xl font-bold font-theme-heading group-hover:opacity-95 transition-opacity line-clamp-1 pr-6" style={{ color: 'var(--text-main)' }}>
                          {entry.title}
                        </h3>

                        <p className="text-sm opacity-80 line-clamp-3 leading-relaxed font-theme-body" style={{ color: 'var(--text-muted)' }}>
                          {getExcerpt(entry.highlights)}
                        </p>

                        {/* Category Tags Pills */}
                        {entry.category_sections?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {entry.category_sections.map((sec, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 shadow-2xs"
                                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                              >
                                <TagIcon className="h-3.5 w-3.5" />
                                <span>{sec.category_name || 'Category'}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t flex items-center justify-between text-sm" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-4">
                          {avgRating && (
                            <div className="flex items-center gap-1.5 font-semibold">
                              <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                              <span>{avgRating}</span>
                            </div>
                          )}

                          {habits.length > 0 && (
                            <div className="flex items-center gap-1.5 opacity-80 font-mono text-xs">
                              <CheckCircleIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                              <span>{completedHabits}/{habits.length} habits</span>
                            </div>
                          )}
                        </div>

                        <span className="flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform" style={{ color: 'var(--accent)' }}>
                          <span>Read</span>
                          <ArrowRightIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })
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
    </AuthGuard>
  );
}