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
  CheckCircleIcon,
  ClockIcon
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

  // Helper to safely render Editor.js JSON blocks into Medium-style typography
  const renderEditorBlocks = (input) => {
    if (!input) return null;
    
    try {
      const blocks = typeof input === 'string' ? JSON.parse(input) : input;
      if (!Array.isArray(blocks) || blocks.length === 0) return null;

      return blocks.map((block, index) => {
        switch (block.type) {
          case 'header': {
            const level = block.data.level || 2;
            const sizeClasses = 
              level === 1 ? 'text-3xl sm:text-4xl font-extrabold tracking-tight mt-10 mb-4' :
              level === 2 ? 'text-2xl sm:text-3xl font-bold tracking-tight mt-8 mb-3' :
              'text-xl font-semibold mt-6 mb-2.5';
            
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
                className="text-base sm:text-lg leading-relaxed mb-6 font-theme-body opacity-95"
                style={{ color: 'var(--text-main)' }}
                dangerouslySetInnerHTML={{ __html: block.data.text }} 
              />
            );

          case 'list': {
            const isOrdered = block.data.style === 'ordered';
            const ListTag = isOrdered ? 'ol' : 'ul';
            const listStyleClass = isOrdered ? 'list-decimal' : 'list-disc';
            
            return (
              <div key={index} className="my-6 pl-6">
                <ListTag className={`${listStyleClass} space-y-3 text-base sm:text-lg opacity-95`} style={{ color: 'var(--text-main)' }}>
                  {block.data.items.map((item, i) => {
                    const itemContent = typeof item === 'string' ? item : item.content;
                    return (
                      <li 
                        key={i} 
                        className="leading-relaxed pl-2 marker:text-[var(--accent)] font-theme-body"
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
                className="pl-6 py-2 my-8 border-l-4 italic text-lg sm:text-xl font-theme-heading space-y-2"
                style={{ 
                  borderColor: 'var(--accent)',
                  color: 'var(--text-main)'
                }}
              >
                <p>"{block.data.text}"</p>
                {block.data.caption && (
                  <footer className="text-xs not-italic opacity-60 font-mono tracking-wider uppercase">
                    — {block.data.caption}
                  </footer>
                )}
              </blockquote>
            );

          case 'code': {
            const codeText = block.data.code;
            if (!codeText) return null;

            return (
              <div key={index} className="my-8 rounded-2xl border overflow-hidden shadow-lg font-mono text-xs sm:text-sm" style={{ backgroundColor: '#0D1117', borderColor: 'var(--border-color)' }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between opacity-60 text-[10px] uppercase tracking-widest" style={{ borderColor: 'var(--border-color)', backgroundColor: '#161B22', color: '#8B949E' }}>
                  <span>Code Snippet</span>
                </div>
                <pre className="p-5 overflow-x-auto text-[#C9D1D9]">
                  <code>{codeText}</code>
                </pre>
              </div>
            );
          }

          case 'table': {
            const content = block.data.content;
            if (!content || content.length === 0) return null;

            return (
              <div key={index} className="my-8 overflow-x-auto rounded-2xl border shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-left border-collapse text-sm font-theme-body">
                  <tbody>
                    {content.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-5 py-3.5 border-r last:border-r-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case 'delimiter':
            return (
              <div key={index} className="flex items-center justify-center my-10">
                <div className="w-16 h-0.5 rounded-full opacity-40" style={{ backgroundColor: 'var(--accent)' }} />
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
                className="text-base sm:text-lg mb-4 opacity-95 font-theme-body"
                dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} 
              />
            );
        }
      });
    } catch (e) {
      return <p className="text-base sm:text-lg leading-relaxed opacity-95 font-theme-body">{String(input)}</p>;
    }
  };

  if (loading && !currentEntry) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p className="text-sm opacity-60">Loading story...</p>
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
            <h2 className="text-2xl font-bold font-theme-heading">Story Not Found</h2>
            <p className="text-sm opacity-70">The journal entry you are looking for does not exist or has been removed.</p>
            <Link
              href="/journal/entries"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              Back to Archives
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

        {/* Medium-style narrow reading container */}
        <main className="flex-grow max-w-2xl mx-auto px-6 py-16 w-full space-y-12">
          
          {/* Navigation & Edit Action */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold transition-opacity opacity-75 hover:opacity-100 cursor-pointer"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Stories</span>
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
              <span>Edit Story</span>
            </Link>
          </div>

          {/* Article Header (Medium Style) */}
          <header className="space-y-6 border-b pb-8" style={{ borderColor: 'var(--border-color)' }}>
            <h1 className="text-3xl sm:text-5xl font-bold font-theme-heading tracking-tight leading-tight" style={{ color: 'var(--text-main)' }}>
              {currentEntry.title}
            </h1>

            {/* Author / Date Bar */}
            <div className="flex items-center justify-between text-xs opacity-70 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-theme-heading" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
                  LJ
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Personal Journal</p>
                  <p className="opacity-60">{new Date(entryDate || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Continuous Story Content Flow */}
          <article className="space-y-10">
            
            {/* Highlights */}
            {currentEntry.highlights && (
              <section className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--accent)' }}>
                  <SparklesIcon className="h-4 w-4" />
                  <span>Highlights</span>
                </div>
                <div className="prose prose-lg max-w-none">
                  {renderEditorBlocks(currentEntry.highlights)}
                </div>
              </section>
            )}

            {/* Gratitude */}
            {currentEntry.gratitude && (
              <section className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--accent)' }}>
                  <StarIcon className="h-4 w-4" />
                  <span>Gratitude</span>
                </div>
                <div className="prose prose-lg max-w-none">
                  {renderEditorBlocks(currentEntry.gratitude)}
                </div>
              </section>
            )}

            {/* Reflection & Improvements */}
            {currentEntry.better_day_thoughts && (
              <section className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--accent)' }}>
                  <BookOpenIcon className="h-4 w-4" />
                  <span>Reflection & Improvements</span>
                </div>
                <div className="prose prose-lg max-w-none">
                  {renderEditorBlocks(currentEntry.better_day_thoughts)}
                </div>
              </section>
            )}

            {/* Daily Habits & Tasks Checklist */}
            {currentEntry.habits && currentEntry.habits.length > 0 && (
              <section className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--accent)' }}>
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Daily Habits & Tasks</span>
                </div>
                <div className="space-y-2 pt-2">
                  {currentEntry.habits.map((habit, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl border flex items-center gap-3 transition-colors" 
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                    >
                      <input 
                        type="checkbox" 
                        checked={habit.is_completed} 
                        disabled 
                        className="w-4 h-4 rounded accent-[var(--accent)] cursor-default" 
                      />
                      <span className={`text-sm font-medium ${habit.is_completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-main)' }}>
                        {habit.task_name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Category & Pillar Sections */}
            {currentEntry.category_sections && currentEntry.category_sections.length > 0 && (
              <div className="space-y-10 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-xl font-bold font-theme-heading">Category & Pillar Insights</h3>
                <div className="space-y-10">
                  {currentEntry.category_sections.map((section, idx) => (
                    <section key={section.id || idx} className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                          <h4 className="text-base font-bold font-theme-heading uppercase tracking-wider">{section.category_name || 'Pillar'}</h4>
                        </div>

                        {section.rating_score !== null && section.rating_score !== undefined && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="opacity-60 uppercase tracking-widest font-mono">Rating:</span>
                            <div className="flex items-center gap-1 font-bold">
                              <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                              <span>{section.rating_score} / 5</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="prose prose-lg max-w-none pt-2">
                        {renderEditorBlocks(section.content)}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}

          </article>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}