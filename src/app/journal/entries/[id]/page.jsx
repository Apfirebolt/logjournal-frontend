'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useJournalStore } from '@/store/useJournalStore';
import { 
  BookOpenIcon, 
  ArrowLeftIcon, 
  CalendarIcon, 
  StarIcon, 
  SparklesIcon, 
  TagIcon, 
  PencilSquareIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentEntry, fetchEntryById, loading } = useJournalStore();
  const entryId = params?.id;

  useEffect(() => {
    if (entryId) {
      fetchEntryById(entryId);
    }
  }, [entryId, fetchEntryById]);

  // Helper to safely render Editor.js JSON blocks (handles both stringified JSON and arrays) into styled JSX
  const renderEditorBlocks = (input) => {
    if (!input) return <p className="text-sm opacity-60 italic">No content provided.</p>;
    
    try {
      const blocks = typeof input === 'string' ? JSON.parse(input) : input;
      if (!Array.isArray(blocks)) {
        return <p className="text-sm sm:text-base leading-relaxed opacity-90 font-theme-body" style={{ color: 'var(--text-main)' }}>{typeof input === 'string' ? input : JSON.stringify(input)}</p>;
      }

      if (blocks.length === 0) {
        return <p className="text-sm opacity-60 italic">No content recorded in this section.</p>;
      }

      return blocks.map((block, index) => {
        switch (block.type) {
          case 'header': {
            const level = block.data.level || 2;
            const sizeClasses = 
              level === 1 ? 'text-2xl sm:text-3xl font-extrabold tracking-tight mt-6 mb-3' :
              level === 2 ? 'text-xl sm:text-2xl font-bold tracking-tight mt-5 mb-2.5' :
              'text-lg font-semibold mt-4 mb-2';
            
            return React.createElement(
              `h${level}`,
              {
                key: index,
                className: `${sizeClasses} font-theme-heading`,
                style: { color: 'var(--text-main)' }
              },
              block.data.text
            );
          }

          case 'paragraph':
            return (
              <p 
                key={index} 
                className="text-sm sm:text-base leading-relaxed mb-4 opacity-90 font-theme-body"
                style={{ color: 'var(--text-main)' }}
                dangerouslySetInnerHTML={{ __html: block.data.text }} 
              />
            );

          case 'list': {
            const isOrdered = block.data.style === 'ordered';
            const ListTag = isOrdered ? 'ol' : 'ul';
            const listStyleClass = isOrdered ? 'list-decimal' : 'list-disc';
            
            return (
              <div key={index} className="my-4 pl-4 sm:pl-6">
                <ListTag className={`${listStyleClass} space-y-2 text-sm sm:text-base opacity-90`} style={{ color: 'var(--text-main)' }}>
                  {block.data.items.map((item, i) => {
                    const itemContent = typeof item === 'string' ? item : item.content;
                    return (
                      <li 
                        key={i} 
                        className="leading-relaxed pl-1 marker:text-[var(--accent)] font-theme-body"
                        dangerouslySetInnerHTML={{ __html: itemContent }} 
                      />
                    );
                  })}
                </ListTag>
              </div>
            );
          }

          case 'quote':
            return (
              <blockquote 
                key={index} 
                className="p-5 my-6 rounded-2xl border-l-4 italic text-sm sm:text-base shadow-xs space-y-1"
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  borderColor: 'var(--accent)',
                  color: 'var(--text-main)'
                }}
              >
                <p className="font-theme-body">"{block.data.text}"</p>
                {block.data.caption && (
                  <footer className="text-xs not-italic opacity-60 font-mono pt-1">
                    — {block.data.caption}
                  </footer>
                )}
              </blockquote>
            );

          case 'delimiter':
            return (
              <div key={index} className="flex items-center justify-center my-8">
                <div className="w-24 h-1 rounded-full opacity-30" style={{ backgroundColor: 'var(--accent)' }} />
              </div>
            );

          case 'marker':
            return (
              <mark 
                key={index} 
                className="px-1.5 py-0.5 rounded-md font-medium"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );

          default:
            return (
              <p 
                key={index} 
                className="text-sm sm:text-base mb-3 opacity-90 font-theme-body"
                dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} 
              />
            );
        }
      });
    } catch (e) {
      return <p className="text-sm sm:text-base leading-relaxed opacity-90 font-theme-body">{String(input)}</p>;
    }
  };

  if (loading && !currentEntry) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p className="text-sm opacity-60">Loading entry details...</p>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (!currentEntry) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
          <Header />
          <main className="flex-grow flex flex-col items-center justify-center space-y-4 px-6">
            <BookOpenIcon className="h-12 w-12 opacity-40" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold font-theme-heading">Entry Not Found</h2>
            <p className="text-sm opacity-70">The journal entry you are looking for does not exist or has been removed.</p>
            <Link
              href="/journal/entries"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              Back to All Entries
            </Link>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  const entryDate = currentEntry.journal_date || currentEntry.created_at;

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <Header />

        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
          
          {/* Back Link, Edit Button & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-xs font-semibold transition-opacity opacity-75 hover:opacity-100 cursor-pointer"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back</span>
              </button>

              <Link
                href={`/journal/entries/${entryId}/edit`}
                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border-color)', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)'
                }}
              >
                <PencilSquareIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <span>Edit Entry</span>
              </Link>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs opacity-60 font-mono">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{new Date(entryDate || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <h1 className="text-3xl sm:text-4xl font-bold font-theme-heading tracking-tight" style={{ color: 'var(--text-main)' }}>
              {currentEntry.title}
            </h1>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* Highlights */}
            {currentEntry.highlights && (
              <div 
                className="p-8 rounded-3xl border shadow-sm space-y-3"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                  <SparklesIcon className="h-4 w-4" />
                  <span>Highlights</span>
                </h3>
                <div className="leading-relaxed">
                  {renderEditorBlocks(currentEntry.highlights)}
                </div>
              </div>
            )}

            {/* Gratitude */}
            {currentEntry.gratitude && (
              <div 
                className="p-8 rounded-3xl border shadow-sm space-y-3"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                  <StarIcon className="h-4 w-4" />
                  <span>Gratitude</span>
                </h3>
                <div className="leading-relaxed">
                  {renderEditorBlocks(currentEntry.gratitude)}
                </div>
              </div>
            )}

            {/* Better Day Thoughts */}
            {currentEntry.better_day_thoughts && (
              <div 
                className="p-8 rounded-3xl border shadow-sm space-y-3"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                  <BookOpenIcon className="h-4 w-4" />
                  <span>Reflection & Improvements</span>
                </h3>
                <div className="leading-relaxed">
                  {renderEditorBlocks(currentEntry.better_day_thoughts)}
                </div>
              </div>
            )}

            {/* Daily Habits & Tasks Checklist */}
            {currentEntry.habits && currentEntry.habits.length > 0 && (
              <div 
                className="p-8 rounded-3xl border shadow-sm space-y-4"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Daily Habits & Tasks</span>
                </h3>
                <div className="space-y-2">
                  {currentEntry.habits.map((habit, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl border flex items-center gap-3" 
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      <input 
                        type="checkbox" 
                        checked={habit.is_completed} 
                        disabled 
                        className="w-4 h-4 rounded accent-[var(--accent)] cursor-default" 
                      />
                      <span className={`text-xs font-medium ${habit.is_completed ? 'line-through opacity-50' : ''}`}>
                        {habit.task_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Category & Pillar Sections (Rich Content + Rating) */}
            {currentEntry.category_sections && currentEntry.category_sections.length > 0 && (
              <div className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-lg font-bold font-theme-heading">Category & Pillar Sections</h3>
                <div className="space-y-6">
                  {currentEntry.category_sections.map((section, idx) => (
                    <div 
                      key={section.id || idx}
                      className="p-8 rounded-3xl border shadow-sm space-y-4"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                          <h3 className="text-sm font-bold font-theme-heading uppercase tracking-wider">{section.category_name || 'Category'}</h3>
                        </div>

                        {section.rating_score !== null && section.rating_score !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Rating:</span>
                            <div className="flex items-center gap-1">
                              <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold">{section.rating_score} / 5</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="leading-relaxed">
                        {renderEditorBlocks(section.content)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}