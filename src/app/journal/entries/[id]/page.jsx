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
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentEntry, fetchEntryById, loading } = useJournalStore();
  const entryId = params?.id;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  useEffect(() => {
    if (entryId) {
      fetchEntryById(entryId);
    }
  }, [entryId, fetchEntryById]);

  // Helper to check if Editor.js JSON data has actual content
  const hasContent = (input) => {
    if (!input) return false;
    try {
      const blocks = typeof input === 'string' ? JSON.parse(input) : input;
      if (!Array.isArray(blocks) || blocks.length === 0) return false;
      
      return blocks.some(block => {
        if (block.type === 'paragraph' || block.type === 'header' || block.type === 'quote' || block.type === 'marker') {
          return block.data?.text && block.data.text.trim().length > 0;
        }
        if (block.type === 'list') {
          return block.data?.items && block.data.items.length > 0;
        }
        if (block.type === 'code') {
          return block.data?.code && block.data.code.trim().length > 0;
        }
        if (block.type === 'table') {
          return block.data?.content && block.data.content.length > 0;
        }
        return true;
      });
    } catch (e) {
      return typeof input === 'string' && input.trim().length > 0 && input.trim() !== '[]';
    }
  };

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
              level === 1 ? 'text-3xl sm:text-4xl font-extrabold tracking-tight mt-8 mb-4' :
              level === 2 ? 'text-2xl sm:text-3xl font-bold tracking-tight mt-6 mb-3' :
              'text-xl font-semibold mt-5 mb-2';
            
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
                className="text-lg sm:text-xl leading-relaxed mb-6 font-theme-body opacity-95"
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
                <ListTag className={`${listStyleClass} space-y-3 text-lg sm:text-xl opacity-95`} style={{ color: 'var(--text-main)' }}>
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
                className="pl-6 py-3 my-8 border-l-4 italic text-xl sm:text-2xl font-theme-heading space-y-2"
                style={{ 
                  borderColor: 'var(--accent)',
                  color: 'var(--text-main)'
                }}
              >
                <p>"{block.data.text}"</p>
                {block.data.caption && (
                  <footer className="not-italic opacity-60 font-mono tracking-wider uppercase">
                    — {block.data.caption}
                  </footer>
                )}
              </blockquote>
            );

          case 'code': {
            const codeText = block.data.code;
            if (!codeText) return null;

            return (
              <div key={index} className="my-8 rounded-2xl border overflow-hidden shadow-lg font-mono" style={{ backgroundColor: '#0D1117', borderColor: 'var(--border-color)' }}>
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
                <table className="w-full text-left border-collapse text-base font-theme-body">
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
                className="text-lg sm:text-xl mb-4 opacity-95 font-theme-body"
                dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} 
              />
            );
        }
      });
    } catch (e) {
      return <p className="text-lg sm:text-xl leading-relaxed opacity-95 font-theme-body">{String(input)}</p>;
    }
  };

  if (loading && !currentEntry) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p className="text-sm font-bold animate-pulse opacity-60">Loading story...</p>
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
          <main className="flex-grow flex flex-col items-center justify-center space-y-4 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold font-theme-heading">Story Not Found</h2>
            <p className="text-sm opacity-75 max-w-sm">The journal entry you are looking for does not exist or has been removed.</p>
            <Link
              href="/journal/entries"
              className="px-6 py-3 rounded-2xl text-xs font-semibold shadow-lg transition-all hover:scale-105"
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

        {/* Structured Container matching edit/create pages */}
        <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-10">
          
          {/* Navigation & Edit Action Bar */}
          <div 
            className="flex items-center justify-between border-b pb-6" 
            style={{ borderColor: 'var(--border-color)' }}
            data-aos="fade-down"
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold border transition-all hover:opacity-80 cursor-pointer"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              <ArrowLeftIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>Back to Entries</span>
            </button>

            <Link
              href={`/journal/entries/${entryId}/edit`}
              className="px-5 py-2.5 rounded-2xl font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              <PencilSquareIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>Edit Journal Entry</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6 border-b pb-8" style={{ borderColor: 'var(--border-color)' }} data-aos="fade-up">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-theme-heading tracking-tight leading-tight" style={{ color: 'var(--text-main)' }}>
              {currentEntry.title}
            </h1>

            {/* Author / Date Bar */}
            <div className="flex items-center justify-between opacity-80">
              <div className="flex items-center gap-3">
                <div>
                  <p className="opacity-65">{new Date(entryDate || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <ClockIcon className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                <span>3 min read</span>
              </div>
            </div>
          </header>

          {/* Continuous Story Content Flow */}
          <article className="space-y-8" data-aos="fade-up" data-aos-delay="100">
            
            {/* Highlights Card Container */}
            {hasContent(currentEntry.highlights) && (
              <div 
                className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                  <SparklesIcon className="h-3.5 w-3.5" />
                  <span>Highlights of {new Date(entryDate || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="prose prose-lg max-w-none pt-1">
                  {renderEditorBlocks(currentEntry.highlights)}
                </div>
              </div>
            )}

            {/* Gratitude Card Container */}
            {hasContent(currentEntry.gratitude) && (
              <div 
                className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                  <StarIcon className="h-3.5 w-3.5" />
                  <span>I'd like to express gratitude for</span>
                </div>
                <div className="prose prose-lg max-w-none pt-1">
                  {renderEditorBlocks(currentEntry.gratitude)}
                </div>
              </div>
            )}

            {/* Reflection Card Container */}
            {hasContent(currentEntry.better_day_thoughts) && (
              <div 
                className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                  <BookOpenIcon className="h-3.5 w-3.5" />
                  <span>How I can have a better day</span>
                </div>
                <div className="prose prose-lg max-w-none pt-1">
                  {renderEditorBlocks(currentEntry.better_day_thoughts)}
                </div>
              </div>
            )}

            {/* Daily Habits & Tasks Checklist */}
            {currentEntry.habits && currentEntry.habits.length > 0 && (
              <div 
                className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '1px solid var(--border-color)' }}>
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  <span>Daily Habits & Tasks</span>
                </div>
                
                <div className="space-y-2.5 pt-1">
                  {currentEntry.habits.map((habit, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-2xl border flex items-center gap-3.5 transition-colors" 
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                    >
                      <input 
                        type="checkbox" 
                        checked={habit.is_completed} 
                        disabled 
                        className="w-4 h-4 rounded accent-[var(--accent)] cursor-default" 
                      />
                      <span className={`text-base font-medium ${habit.is_completed ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-main)' }}>
                        {habit.task_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Category & Pillar Sections (Only show if section has content or rating) */}
            {currentEntry.category_sections && currentEntry.category_sections.length > 0 && (
              (() => {
                const validSections = currentEntry.category_sections.filter(
                  sec => hasContent(sec.content) || (sec.rating_score !== null && sec.rating_score !== undefined)
                );

                if (validSections.length === 0) return null;

                return (
                  <div className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-2xl font-bold font-theme-heading">Category & Pillar Insights</h3>
                    
                    <div className="space-y-6">
                      {validSections.map((section, idx) => (
                        <div 
                          key={section.id || idx}
                          className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5"
                          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex items-center gap-2.5">
                              <TagIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                              <h4 className="text-lg font-bold font-theme-heading uppercase tracking-wider">{section.category_name || 'Pillar'}</h4>
                            </div>

                            {section.rating_score !== null && section.rating_score !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="font-bold uppercase tracking-wider opacity-60">Section Rating:</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon 
                                      key={star}
                                      className={`h-4 w-4 ${section.rating_score >= star ? 'text-amber-400 fill-amber-400' : 'opacity-20'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {hasContent(section.content) && (
                            <div className="prose prose-lg max-w-none pt-1">
                              {renderEditorBlocks(section.content)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}

          </article>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}