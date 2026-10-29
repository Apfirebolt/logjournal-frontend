'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useJournalStore } from '@/store/useJournalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  BookOpenIcon, 
  PlusIcon, 
  CalendarIcon, 
  TagIcon, 
  StarIcon, 
  ArrowRightIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function DashboardPage() {
  const { entries, categories, tags, fetchEntries, fetchCategories, fetchTags, loading } = useJournalStore();
  const { user } = useAuthStore();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    fetchEntries();
    fetchCategories();
    fetchTags();
  }, [fetchEntries, fetchCategories, fetchTags]);

  // Compute Statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    
    // Current month entries count
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const currentMonthEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.journal_date || entry.created_at);
      return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth;
    }).length;

    // Total unique custom tags used across all entries
    const allTags = new Set();
    entries.forEach((entry) => {
      if (Array.isArray(entry.tags)) {
        entry.tags.forEach((t) => allTags.add(typeof t === 'string' ? t : t.name));
      }
    });

    // Total categories available
    const totalCategories = categories.length;

    // Average rating across all entries
    let totalScore = 0;
    let ratingCount = 0;
    entries.forEach((entry) => {
      if (Array.isArray(entry.category_sections)) {
        entry.category_sections.forEach((sec) => {
          if (sec.rating_score !== null && sec.rating_score !== undefined) {
            totalScore += sec.rating_score;
            ratingCount++;
          }
        });
      }
    });
    const avgRating = ratingCount > 0 ? (totalScore / ratingCount).toFixed(1) : '0.0';

    return {
      totalEntries,
      currentMonthEntries,
      totalTagsCount: tags.length > 0 ? tags.length : allTags.size,
      totalCategories,
      avgRating,
    };
  }, [entries, categories, tags]);

  // Recent 3 entries
  const recentEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.journal_date || a.created_at);
      const dateB = new Date(b.journal_date || b.created_at);
      return dateB - dateA;
    }).slice(0, 3);
  }, [entries]);

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
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full space-y-12">
          
          {/* Dashboard Welcome Header */}
          <div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8" 
            style={{ borderColor: 'var(--border-color)' }}
            data-aos="fade-down"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold mb-3 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                <SparklesIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-theme-heading tracking-tight">Welcome Back, {user?.username || 'User'}</h1>
              <p className="text-sm sm:text-base opacity-80 mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Here is a summary of your journaling habits, experiences, and tags.
              </p>
            </div>

            <Link
              href="/journal/new"
              className="px-6 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Write Today's Entry</span>
            </Link>
          </div>

          {/* Stats Grid Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up">
            
            {/* Total Entries */}
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3 transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between">
                <span className=" font-bold uppercase tracking-wider opacity-60 font-theme-heading">Total Entries</span>
                <div className="p-2.5 rounded-xl border shadow-2xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                  <BookOpenIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-theme-heading">{stats.totalEntries}</span>
                <span className=" opacity-60">all time</span>
              </div>
            </div>

            {/* Current Month Entries */}
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3 transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between">
                <span className=" font-bold uppercase tracking-wider opacity-60 font-theme-heading">This Month</span>
                <div className="p-2.5 rounded-xl border shadow-2xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                  <CalendarIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-theme-heading">{stats.currentMonthEntries}</span>
                <span className=" opacity-60">entries recorded</span>
              </div>
            </div>

            {/* Tags & Categories */}
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3 transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between">
                <span className=" font-bold uppercase tracking-wider opacity-60 font-theme-heading">Tags & Categories</span>
                <div className="p-2.5 rounded-xl border shadow-2xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                  <TagIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <div>
                  <span className="text-2xl font-extrabold font-theme-heading">{stats.totalTagsCount}</span>
                  <span className=" opacity-60 ml-1">tags</span>
                </div>
                <span className="text-xl opacity-30">/</span>
                <div>
                  <span className="text-2xl font-extrabold font-theme-heading">{stats.totalCategories}</span>
                  <span className=" opacity-60 ml-1">sections</span>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3 transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between">
                <span className=" font-bold uppercase tracking-wider opacity-60 font-theme-heading">Average Rating</span>
                <div className="p-2.5 rounded-xl border shadow-2xs" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                  <StarIcon className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-theme-heading">{stats.avgRating}</span>
                <span className=" opacity-60">out of 5.0</span>
              </div>
            </div>

          </section>

          {/* Quick Overview Sections (Tags & Categories Breakdown) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-aos="fade-up">
            
            {/* Custom Categories / Pillars */}
            <div 
              className="p-7 rounded-3xl border shadow-sm space-y-5"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5">
                  <ChartBarIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-xl font-bold font-theme-heading">Available Categories</h2>
                </div>
                <span className=" font-mono opacity-70">{categories.length} total</span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {categories.length === 0 ? (
                  <p className="text-sm opacity-60 italic">No categories found.</p>
                ) : (
                  categories.map((cat) => (
                    <div 
                      key={cat.id}
                      className="px-4 py-2 rounded-xl  font-bold border flex items-center gap-2 shadow-2xs"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                      <span>{cat.name}</span>
                      {cat.is_default === 1 && (
                        <span className="text-[10px] font-mono opacity-50 px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border-color)' }}>Default</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Custom Tags */}
            <div 
              className="p-7 rounded-3xl border shadow-sm space-y-5"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5">
                  <TagIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-xl font-bold font-theme-heading">Custom Tags</h2>
                </div>
                <span className=" font-mono opacity-70">{tags.length} total</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {tags.length === 0 ? (
                  <p className="text-sm opacity-60 italic">No tags created yet. Add tags when writing your entries.</p>
                ) : (
                  tags.map((t) => (
                    <span 
                      key={t.id}
                      className="px-3.5 py-1.5 rounded-xl  font-bold font-mono border shadow-2xs"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                    >
                      #{t.name}
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Recent Entries Section */}
          <section className="space-y-6" data-aos="fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold font-theme-heading">Recent Journal Entries</h2>
              <Link
                href="/journal/entries"
                className=" sm:text-sm font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ color: 'var(--accent)' }}
              >
                <span>View All Entries</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading && entries.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-sm font-semibold animate-pulse opacity-60">Loading recent entries...</p>
                </div>
              ) : recentEntries.length === 0 ? (
                <div className="col-span-full text-center py-16 px-6 space-y-3 border rounded-3xl shadow-sm" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                  <BookOpenIcon className="h-10 w-10 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-lg font-bold font-theme-heading">No entries recorded yet</h3>
                  <p className="text-sm opacity-75">Start writing to see your recent reflections here.</p>
                  <Link
                    href="/journal/new"
                    className="inline-block px-5 py-2.5 rounded-xl  font-semibold shadow-md transition-all hover:scale-105 mt-2"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                  >
                    Create First Entry
                  </Link>
                </div>
              ) : (
                recentEntries.map((entry) => {
                  const displayDate = entry.journal_date || entry.created_at;
                  
                  return (
                    <Link
                      key={entry.id}
                      href={`/journal/entries/${entry.id}`}
                      className="p-6 rounded-3xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-4 group"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono  opacity-70">
                          <CalendarIcon className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                          <span>{new Date(displayDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <h3 className="text-lg font-bold font-theme-heading group-hover:opacity-95 transition-opacity line-clamp-1" style={{ color: 'var(--text-main)' }}>
                          {entry.title}
                        </h3>

                        {/* Tags Pill */}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 2).map((tag, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-mono border"
                                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                              >
                                #{typeof tag === 'string' ? tag : tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="opacity-80 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {getExcerpt(entry.highlights)}
                        </p>
                      </div>

                      <div className="pt-3 border-t flex items-center justify-between font-semibold" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="opacity-60">Read entry</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--accent)' }} />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}